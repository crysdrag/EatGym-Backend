import { Router } from 'express';
import { pool } from '../db/pool.js';
import { ApiError } from '../errors.js';
import { requireAuth } from '../middleware/auth.js';
import { calculateConsecutiveStreak, calculateCurrentStreak } from '../nutrition/streak.js';

const router = Router();
router.use(requireAuth);

function inputObject(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new ApiError(422, 'Request body must be a JSON object.', 'VALIDATION_ERROR');
  }
  return body;
}

function dateString(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new ApiError(422, 'cookedOn must use valid YYYY-MM-DD format.', 'VALIDATION_ERROR', { field: 'cookedOn' });
  }
  // Reuse the domain parser for calendar validation.
  calculateConsecutiveStreak([], value);
  return value;
}

function serializeBadge(row) {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    description: row.description,
    requiredStreakDays: row.required_streak_days,
    points: row.points,
    awardedForStreakDays: row.awarded_for_streak_days === undefined ? undefined : row.awarded_for_streak_days,
    awardedAt: row.awarded_at === undefined ? undefined : row.awarded_at
  };
}

function sqlDateToIso(value) {
  return typeof value === 'string' ? value : value.toISOString().slice(0, 10);
}

async function datesForUser(client, userId) {
  const result = await client.query(
    'SELECT cooked_on FROM cooking_days WHERE user_id = $1 ORDER BY cooked_on DESC',
    [userId]
  );
  return result.rows.map((row) => sqlDateToIso(row.cooked_on));
}

function vietnamToday() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

async function awardEligibleBadges(client, userId, streakDays) {
  const result = await client.query(
    `INSERT INTO user_badges (user_id, badge_id, awarded_for_streak_days)
     SELECT $1, b.id, $2
     FROM badges b
     WHERE b.is_active = TRUE
       AND b.required_streak_days <= $2
     ON CONFLICT (user_id, badge_id) DO NOTHING
     RETURNING badge_id, awarded_for_streak_days, awarded_at`,
    [userId, streakDays]
  );
  if (result.rowCount === 0) return [];
  const badgeIds = result.rows.map((row) => row.badge_id);
  const badges = await client.query(
    `SELECT b.id, b.code, b.name, b.description, b.required_streak_days, b.points,
            ub.awarded_for_streak_days, ub.awarded_at
     FROM badges b JOIN user_badges ub ON ub.badge_id = b.id
     WHERE ub.user_id = $1 AND b.id = ANY($2::uuid[])
     ORDER BY b.required_streak_days`,
    [userId, badgeIds]
  );
  return badges.rows.map(serializeBadge);
}

router.post('/cooking-days', async (req, res, next) => {
  const client = await pool.connect();
  try {
    const input = inputObject(req.body);
    const cookedOn = dateString(input.cookedOn);
    const note = input.note ?? null;
    if (note !== null && (typeof note !== 'string' || note.length > 500)) {
      throw new ApiError(422, 'note must contain at most 500 characters.', 'VALIDATION_ERROR', { field: 'note' });
    }
    if (input.mealPrepBatchId !== undefined && typeof input.mealPrepBatchId !== 'string') {
      throw new ApiError(422, 'mealPrepBatchId must be a UUID string.', 'VALIDATION_ERROR', { field: 'mealPrepBatchId' });
    }

    await client.query('BEGIN');
    if (input.mealPrepBatchId) {
      const batch = await client.query(
        'SELECT id FROM meal_prep_batches WHERE id = $1 AND user_id = $2',
        [input.mealPrepBatchId, req.auth.userId]
      );
      if (!batch.rows[0]) throw new ApiError(404, 'Meal-prep batch not found.', 'BATCH_NOT_FOUND');
    }
    const result = await client.query(
      `INSERT INTO cooking_days (user_id, cooked_on, meal_prep_batch_id, note)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, cooked_on) DO UPDATE SET
         meal_prep_batch_id = COALESCE(EXCLUDED.meal_prep_batch_id, cooking_days.meal_prep_batch_id),
         note = COALESCE(EXCLUDED.note, cooking_days.note)
       RETURNING cooked_on, meal_prep_batch_id, note, created_at`,
      [req.auth.userId, cookedOn, input.mealPrepBatchId ?? null, note]
    );
    const dates = await datesForUser(client, req.auth.userId);
    const streakDays = calculateConsecutiveStreak(dates, cookedOn);
    const newlyAwardedBadges = await awardEligibleBadges(client, req.auth.userId, streakDays);
    await client.query('COMMIT');
    res.status(201).json({
      cookingDay: {
        cookedOn: sqlDateToIso(result.rows[0].cooked_on),
        mealPrepBatchId: result.rows[0].meal_prep_batch_id,
        note: result.rows[0].note,
        createdAt: result.rows[0].created_at
      },
      streak: { anchorDate: cookedOn, consecutiveDays: streakDays },
      newlyAwardedBadges
    });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
});

router.get('/streak', async (req, res, next) => {
  try {
    const dates = await datesForUser(pool, req.auth.userId);
    const today = vietnamToday();
    res.json({ streak: { consecutiveDays: calculateCurrentStreak(dates, new Date(`${today}T00:00:00Z`)), today } });
  } catch (error) {
    next(error);
  }
});

router.get('/badges', async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT b.id, b.code, b.name, b.description, b.required_streak_days, b.points,
              ub.awarded_for_streak_days, ub.awarded_at
       FROM user_badges ub
       JOIN badges b ON b.id = ub.badge_id
       WHERE ub.user_id = $1
       ORDER BY ub.awarded_at DESC`,
      [req.auth.userId]
    );
    res.json({ badges: result.rows.map(serializeBadge) });
  } catch (error) {
    next(error);
  }
});

export default router;
