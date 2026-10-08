import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateAge,
  calculateBmr,
  calculateNutritionBaseline,
  calculateTdee
} from '../../src/nutrition/calculator.js';

test('calculates male BMR with Mifflin-St Jeor', () => {
  assert.equal(calculateBmr({ sex: 'male', weightKg: 80, heightCm: 180, age: 30 }), 1780);
});

test('calculates female BMR with Mifflin-St Jeor', () => {
  assert.equal(calculateBmr({ sex: 'female', weightKg: 60, heightCm: 165, age: 30 }), 1320.25);
});

test('calculates TDEE by activity multiplier', () => {
  assert.equal(calculateTdee(1780, 'moderate'), 2759);
  assert.equal(calculateTdee(1320.25, 'sedentary'), 1584.3);
});

test('returns a complete BMR/TDEE baseline', () => {
  assert.deepEqual(
    calculateNutritionBaseline({
      sex: 'male',
      weightKg: 80,
      heightCm: 180,
      age: 30,
      activityLevel: 'moderate'
    }),
    { bmrKcal: 1780, tdeeKcal: 2759, activityMultiplier: 1.55 }
  );
});

test('derives completed age from the date of birth', () => {
  assert.equal(calculateAge('2000-09-26', new Date('2026-09-25T00:00:00.000Z')), 25);
  assert.equal(calculateAge('2000-09-25', new Date('2026-09-25T00:00:00.000Z')), 26);
});

test('rejects an unsupported activity level', () => {
  assert.throws(() => calculateTdee(1700, 'extreme'), { code: 'VALIDATION_ERROR' });
});
