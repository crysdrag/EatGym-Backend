import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { calculateNutritionBaseline } from '../nutrition/calculator.js';
import { validateCalculation } from '../validation.js';

const router = Router();
router.use(requireAuth);

// A non-persistent calculation preview. PUT /api/profile persists its result.
router.post('/calculate', (req, res, next) => {
  try {
    const input = validateCalculation(req.body);
    res.json({ calculation: calculateNutritionBaseline(input) });
  } catch (error) {
    next(error);
  }
});

export default router;
