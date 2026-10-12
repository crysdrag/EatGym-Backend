import { Router } from 'express';
import { pool } from '../db/pool.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Middleware: allow authenticated user or fallback for demo
router.use((req, res, next) => {
  requireAuth(req, res, (err) => {
    if (err) {
      // If no valid auth header, continue with undefined user
      return next();
    }
    next();
  });
});

// Helper to get active user ID or default user
async function getUserId(req) {
  if (req.user && req.user.id) {
    return req.user.id;
  }
  const defaultUser = await pool.query('SELECT id FROM users ORDER BY created_at ASC LIMIT 1');
  return defaultUser.rows[0]?.id || null;
}

// -------------------------------------------------------------
// GET /api/nutrition-logs?date=YYYY-MM-DD
// -------------------------------------------------------------
router.get('/nutrition-logs', async (req, res, next) => {
  try {
    const userId = await getUserId(req);
    const dateStr = req.query.date || new Date().toISOString().split('T')[0];

    const result = await pool.query(
      `
      SELECT id, log_date, meal_type, food_name, serving_size, serving_unit,
             calories, protein, carbs, fat, created_at
      FROM nutrition_logs
      WHERE (user_id = $1 OR user_id IS NULL) AND log_date = $2
      ORDER BY created_at ASC
      `,
      [userId, dateStr]
    );

    const meals = {
      breakfast: { items: [], totalCalories: 0 },
      lunch: { items: [], totalCalories: 0 },
      dinner: { items: [], totalCalories: 0 },
      snack: { items: [], totalCalories: 0 },
    };

    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    for (const row of result.rows) {
      const type = (row.meal_type || 'breakfast').toLowerCase();
      const cal = Number(row.calories) || 0;
      const pro = Number(row.protein) || 0;
      const carb = Number(row.carbs) || 0;
      const fat = Number(row.fat) || 0;

      const item = {
        id: row.id,
        foodName: row.food_name,
        servingSize: Number(row.serving_size) || 1,
        servingUnit: row.serving_unit || 'phần',
        calories: cal,
        protein: pro,
        carbs: carb,
        fat: fat,
      };

      if (!meals[type]) {
        meals[type] = { items: [], totalCalories: 0 };
      }
      meals[type].items.push(item);
      meals[type].totalCalories += cal;

      totalCalories += cal;
      totalProtein += pro;
      totalCarbs += carb;
      totalFat += fat;
    }

    res.json({
      date: dateStr,
      meals,
      summary: {
        totalCalories: Math.round(totalCalories),
        totalProtein: Math.round(totalProtein),
        totalCarbs: Math.round(totalCarbs),
        totalFat: Math.round(totalFat),
      },
    });
  } catch (error) {
    next(error);
  }
});

// -------------------------------------------------------------
// GET /api/nutrition-logs/summary
// -------------------------------------------------------------
router.get('/nutrition-logs/summary', async (req, res, next) => {
  try {
    const userId = await getUserId(req);
    const { from, to } = req.query;

    let query = `
      SELECT DATE(log_date) as date,
             SUM(calories) as total_calories,
             SUM(protein) as total_protein,
             SUM(carbs) as total_carbs,
             SUM(fat) as total_fat
      FROM nutrition_logs
      WHERE (user_id = $1 OR user_id IS NULL)
    `;
    const params = [userId];

    if (from) {
      params.push(from);
      query += ` AND log_date >= $${params.length}`;
    }
    if (to) {
      params.push(to);
      query += ` AND log_date <= $${params.length}`;
    }

    query += ' GROUP BY DATE(log_date) ORDER BY date ASC';

    const result = await pool.query(query, params);
    res.json({
      summary: result.rows.map((r) => ({
        date: r.date,
        totalCalories: Math.round(Number(r.total_calories) || 0),
        totalProtein: Math.round(Number(r.total_protein) || 0),
        totalCarbs: Math.round(Number(r.total_carbs) || 0),
        totalFat: Math.round(Number(r.total_fat) || 0),
      })),
    });
  } catch (error) {
    next(error);
  }
});

// -------------------------------------------------------------
// POST /api/nutrition-logs
// -------------------------------------------------------------
router.post('/nutrition-logs', async (req, res, next) => {
  try {
    const userId = await getUserId(req);
    const {
      logDate,
      mealType = 'breakfast',
      foodName,
      servingSize = 1,
      servingUnit = 'phần',
      calories = 0,
      protein = 0,
      carbs = 0,
      fat = 0,
    } = req.body;

    if (!foodName || !foodName.trim()) {
      return res.status(400).json({ error: 'foodName is required' });
    }

    const dateVal = logDate || new Date().toISOString().split('T')[0];

    const result = await pool.query(
      `
      INSERT INTO nutrition_logs (
        user_id, log_date, meal_type, food_name, serving_size, serving_unit,
        calories, protein, carbs, fat
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
      `,
      [
        userId,
        dateVal,
        mealType.toLowerCase(),
        foodName.trim(),
        Number(servingSize) || 1,
        servingUnit,
        Number(calories) || 0,
        Number(protein) || 0,
        Number(carbs) || 0,
        Number(fat) || 0,
      ]
    );

    res.status(201).json({ log: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// -------------------------------------------------------------
// DELETE /api/nutrition-logs/:id
// -------------------------------------------------------------
router.delete('/nutrition-logs/:id', async (req, res, next) => {
  try {
    const userId = await getUserId(req);
    const { id } = req.params;

    await pool.query(
      'DELETE FROM nutrition_logs WHERE id = $1 AND (user_id = $2 OR user_id IS NULL)',
      [id, userId]
    );

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;
