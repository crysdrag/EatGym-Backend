import { ApiError } from '../errors.js';

const round = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

export function convertIngredientWeight({ inputWeightG, inputState, rawToCookedFactor, servings = 1 }) {
  if (typeof inputWeightG !== 'number' || !Number.isFinite(inputWeightG) || inputWeightG <= 0) {
    throw new ApiError(422, 'inputWeightG must be greater than zero.', 'VALIDATION_ERROR', { field: 'inputWeightG' });
  }
  if (inputState !== 'raw' && inputState !== 'cooked') {
    throw new ApiError(422, 'inputState must be "raw" or "cooked".', 'VALIDATION_ERROR', { field: 'inputState' });
  }
  if (typeof rawToCookedFactor !== 'number' || !Number.isFinite(rawToCookedFactor) || rawToCookedFactor <= 0 || rawToCookedFactor > 5) {
    throw new ApiError(422, 'rawToCookedFactor must be greater than 0 and no more than 5.', 'VALIDATION_ERROR', { field: 'rawToCookedFactor' });
  }
  if (!Number.isInteger(servings) || servings < 1 || servings > 100) {
    throw new ApiError(422, 'servings must be a whole number between 1 and 100.', 'VALIDATION_ERROR', { field: 'servings' });
  }

  const rawWeightG = inputState === 'raw' ? inputWeightG : inputWeightG / rawToCookedFactor;
  const cookedWeightG = inputState === 'cooked' ? inputWeightG : inputWeightG * rawToCookedFactor;
  return {
    rawWeightG: round(rawWeightG),
    cookedWeightG: round(cookedWeightG),
    rawWeightPerServingG: round(rawWeightG / servings),
    cookedWeightPerServingG: round(cookedWeightG / servings),
    servings,
    rawToCookedFactor
  };
}
