import { Router } from 'express';
import { pool } from '../db/pool.js';
import { ApiError } from '../errors.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

function vietnamToday() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function validateDate(dateStr, fieldName = 'logDate') {
  if (!dateStr || typeof dateStr !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    throw new ApiError(422, `${fieldName} must be a valid date in YYYY-MM-DD format.`, 'VALIDATION_ERROR', { field: fieldName });
  }
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    throw new ApiError(422, `${fieldName} is an invalid calendar date.`, 'VALIDATION_ERROR', { field: fieldName });
  }
  return dateStr;
}

function serializeRow(row) {
  return {
    id: row.id,
    userId: row.user_id,
    logDate: typeof row.log_date === 'string' ? row.log_date : row.log_date.toISOString().slice(0, 10),
    steps: parseInt(row.steps, 10) || 0,
    caloriesBurned: parseFloat(row.calories_burned) || 0,
    heartRateAvg: row.heart_rate_avg ? parseInt(row.heart_rate_avg, 10) : null,
    activeMinutes: parseInt(row.active_minutes, 10) || 0,
    source: row.source,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// POST /api/health/daily - Upsert daily metrics for a specific date (0h - 24h)
router.post('/daily', async (req, res, next) => {
  try {
    const body = req.body || {};
    const logDate = body.logDate ? validateDate(body.logDate, 'logDate') : vietnamToday();

    const rawSteps = body.steps ?? 0;
    const steps = Number(rawSteps);
    if (!Number.isInteger(steps) || steps < 0) {
      throw new ApiError(422, 'steps must be a non-negative integer.', 'VALIDATION_ERROR', { field: 'steps' });
    }

    const rawCalories = body.caloriesBurned ?? 0;
    const caloriesBurned = Number(rawCalories);
    if (!Number.isFinite(caloriesBurned) || caloriesBurned < 0) {
      throw new ApiError(422, 'caloriesBurned must be a non-negative number.', 'VALIDATION_ERROR', { field: 'caloriesBurned' });
    }

    let heartRateAvg = null;
    if (body.heartRateAvg !== undefined && body.heartRateAvg !== null) {
      const hr = Number(body.heartRateAvg);
      if (!Number.isInteger(hr) || hr < 30 || hr > 250) {
        throw new ApiError(422, 'heartRateAvg must be an integer between 30 and 250 bpm.', 'VALIDATION_ERROR', { field: 'heartRateAvg' });
      }
      heartRateAvg = hr;
    }

    let activeMinutes = 0;
    if (body.activeMinutes !== undefined && body.activeMinutes !== null) {
      const am = Number(body.activeMinutes);
      if (!Number.isInteger(am) || am < 0 || am > 1440) {
        throw new ApiError(422, 'activeMinutes must be an integer between 0 and 1440.', 'VALIDATION_ERROR', { field: 'activeMinutes' });
      }
      activeMinutes = am;
    }

    const source = (typeof body.source === 'string' && body.source.trim().length > 0)
      ? body.source.trim().slice(0, 64)
      : 'Nothing X';

    const userId = req.auth.userId;

    const query = `
      INSERT INTO daily_health_metrics (
        user_id, log_date, steps, calories_burned, heart_rate_avg, active_minutes, source, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      ON CONFLICT (user_id, log_date)
      DO UPDATE SET
        steps = EXCLUDED.steps,
        calories_burned = EXCLUDED.calories_burned,
        heart_rate_avg = COALESCE(EXCLUDED.heart_rate_avg, daily_health_metrics.heart_rate_avg),
        active_minutes = COALESCE(EXCLUDED.active_minutes, daily_health_metrics.active_minutes),
        source = EXCLUDED.source,
        updated_at = NOW()
      RETURNING id, user_id, log_date, steps, calories_burned, heart_rate_avg, active_minutes, source, created_at, updated_at;
    `;

    const result = await pool.query(query, [
      userId,
      logDate,
      steps,
      caloriesBurned,
      heartRateAvg,
      activeMinutes,
      source,
    ]);

    const row = result.rows[0];
    res.status(200).json({
      success: true,
      message: `Đã lưu chỉ số sức khỏe ngày ${logDate} thành công.`,
      metric: serializeRow(row),
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/health/daily - Get daily metrics history for user
router.get('/daily', async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 30, 1), 365);
    const startDate = req.query.startDate ? validateDate(req.query.startDate, 'startDate') : null;
    const endDate = req.query.endDate ? validateDate(req.query.endDate, 'endDate') : null;

    let query = 'SELECT * FROM daily_health_metrics WHERE user_id = $1';
    const params = [userId];

    if (startDate) {
      params.push(startDate);
      query += ` AND log_date >= $${params.length}`;
    }
    if (endDate) {
      params.push(endDate);
      query += ` AND log_date <= $${params.length}`;
    }

    query += ' ORDER BY log_date DESC';
    params.push(limit);
    query += ` LIMIT $${params.length}`;

    const result = await pool.query(query, params);
    res.json({
      success: true,
      count: result.rows.length,
      metrics: result.rows.map(serializeRow),
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/health/daily/:date - Get metric for a specific day
router.get('/daily/:date', async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const logDate = validateDate(req.params.date, 'date');

    const result = await pool.query(
      'SELECT * FROM daily_health_metrics WHERE user_id = $1 AND log_date = $2',
      [userId, logDate]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `Chưa có dữ liệu sức khỏe cho ngày ${logDate}.`,
        },
      });
    }

    res.json({
      success: true,
      metric: serializeRow(result.rows[0]),
    });
  } catch (error) {
    next(error);
  }
});

export default router;
