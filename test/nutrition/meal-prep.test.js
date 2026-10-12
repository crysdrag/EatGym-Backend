import test from 'node:test';
import assert from 'node:assert/strict';
import { convertIngredientWeight } from '../../src/nutrition/meal-prep.js';

test('converts raw meal-prep weight to cooked total and per serving', () => {
  assert.deepEqual(
    convertIngredientWeight({ inputWeightG: 1000, inputState: 'raw', rawToCookedFactor: 0.75, servings: 5 }),
    {
      rawWeightG: 1000,
      cookedWeightG: 750,
      rawWeightPerServingG: 200,
      cookedWeightPerServingG: 150,
      servings: 5,
      rawToCookedFactor: 0.75
    }
  );
});

test('converts cooked meal-prep weight back to raw input', () => {
  const result = convertIngredientWeight({ inputWeightG: 750, inputState: 'cooked', rawToCookedFactor: 0.75, servings: 5 });
  assert.equal(result.rawWeightG, 1000);
  assert.equal(result.cookedWeightPerServingG, 150);
});

test('rejects a non-positive yield factor', () => {
  assert.throws(
    () => convertIngredientWeight({ inputWeightG: 100, inputState: 'raw', rawToCookedFactor: 0 }),
    { code: 'VALIDATION_ERROR' }
  );
});
