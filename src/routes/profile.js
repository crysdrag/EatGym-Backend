import { Router } from 'express';
import { pool } from '../db/pool.js';
import { ApiError } from '../errors.js';
import { requireAuth } from '../middleware/auth.js';
import { calculateAge, calculateNutritionBaseline } from '../nutrition/calculator.js';
import { validateProfile } from '../validation.js';

const router = Router();
router.use(requireAuth);

function serializeProfile(row) {
  return {
    sex: row.sex,
    dateOfBirth: row.date_of_birth,
    age: calculateAge(row.date_of_birth),
    heightCm: Number(row.height_cm),
    weightKg: Number(row.weight_kg),
    activityLevel: row.activity_level,
    fitnessGoal: row.fitness_goal,
    bmrKcal: Number(row.bmr_kcal),
    tdeeKcal: Number(row.tdee_kcal),
    calculationVersion: row.calculation_version,
    updatedAt: row.updated_at
  };
}

router.get('/', async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT sex, date_of_birth, height_cm, weight_kg, activity_level, fitness_goal,
              bmr_kcal, tdee_kcal, calculation_version, updated_at
       FROM user_profiles WHERE user_id = $1`,
      [req.auth.userId]
    );
    if (!result.rows[0]) {
      throw new ApiError(404, 'A physical profile has not been created yet.', 'PROFILE_NOT_FOUND');
    }
    res.json({ profile: serializeProfile(result.rows[0]) });
  } catch (error) {
    next(error);
  }
});

router.put('/', async (req, res, next) => {
  try {
    const profile = validateProfile(req.body);
    const age = calculateAge(profile.dateOfBirth);
    const baseline = calculateNutritionBaseline({ ...profile, age });
    const result = await pool.query(
      `INSERT INTO user_profiles (
        user_id, sex, date_of_birth, height_cm, weight_kg, activity_level, fitness_goal, bmr_kcal, tdee_kcal
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (user_id) DO UPDATE SET
        sex = EXCLUDED.sex,
        date_of_birth = EXCLUDED.date_of_birth,
        height_cm = EXCLUDED.height_cm,
        weight_kg = EXCLUDED.weight_kg,
        activity_level = EXCLUDED.activity_level,
        fitness_goal = EXCLUDED.fitness_goal,
        bmr_kcal = EXCLUDED.bmr_kcal,
        tdee_kcal = EXCLUDED.tdee_kcal,
        calculation_version = 'mifflin-st-jeor-v1'
      RETURNING sex, date_of_birth, height_cm, weight_kg, activity_level, fitness_goal,
                bmr_kcal, tdee_kcal, calculation_version, updated_at`,
      [
        req.auth.userId,
        profile.sex,
        profile.dateOfBirth,
        profile.heightCm,
        profile.weightKg,
        profile.activityLevel,
        profile.fitnessGoal,
        baseline.bmrKcal,
        baseline.tdeeKcal
      ]
    );
    res.json({
      profile: serializeProfile(result.rows[0]),
      calculation: baseline
    });
  } catch (error) {
    next(error);
  }
});

export default router;
