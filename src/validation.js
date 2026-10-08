import { ApiError } from './errors.js';
import { ACTIVITY_MULTIPLIERS, FITNESS_GOALS } from './nutrition/calculator.js';

function fail(field, message) {
  throw new ApiError(422, message, 'VALIDATION_ERROR', { field });
}

function object(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new ApiError(422, 'Request body must be a JSON object.', 'VALIDATION_ERROR');
  }
  return value;
}

export function validateRegistration(body) {
  const input = object(body);
  const email = typeof input.email === 'string' ? input.email.trim().toLowerCase() : '';
  const fullName = typeof input.fullName === 'string' ? input.fullName.trim() : '';
  const password = input.password;

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    fail('email', 'email must be a valid email address.');
  }
  if (fullName.length < 2 || fullName.length > 120) {
    fail('fullName', 'fullName must contain between 2 and 120 characters.');
  }
  if (typeof password !== 'string' || password.length < 8 || password.length > 128) {
    fail('password', 'password must contain between 8 and 128 characters.');
  }

  return { email, fullName, password };
}

export function validateLogin(body) {
  const input = object(body);
  const email = typeof input.email === 'string' ? input.email.trim().toLowerCase() : '';
  if (!email || typeof input.password !== 'string') {
    throw new ApiError(401, 'Invalid email or password.', 'INVALID_CREDENTIALS');
  }
  return { email, password: input.password };
}

function requiredNumber(value, field, min, max) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max) {
    fail(field, `${field} must be a number between ${min} and ${max}.`);
  }
  return value;
}

function validateNutritionFields(input) {
  if (input.sex !== 'male' && input.sex !== 'female') {
    fail('sex', 'sex must be either "male" or "female".');
  }
  if (!Object.hasOwn(ACTIVITY_MULTIPLIERS, input.activityLevel)) {
    fail('activityLevel', `activityLevel must be one of: ${Object.keys(ACTIVITY_MULTIPLIERS).join(', ')}.`);
  }
  const goal = input.fitnessGoal ?? 'maintenance';
  if (!FITNESS_GOALS.includes(goal)) {
    fail('fitnessGoal', `fitnessGoal must be one of: ${FITNESS_GOALS.join(', ')}.`);
  }

  return {
    sex: input.sex,
    heightCm: requiredNumber(input.heightCm, 'heightCm', 50, 300),
    weightKg: requiredNumber(input.weightKg, 'weightKg', 10, 500),
    activityLevel: input.activityLevel,
    fitnessGoal: goal
  };
}

export function validateProfile(body) {
  const input = object(body);
  if (typeof input.dateOfBirth !== 'string') {
    fail('dateOfBirth', 'dateOfBirth must use YYYY-MM-DD format.');
  }
  return { ...validateNutritionFields(input), dateOfBirth: input.dateOfBirth };
}

export function validateCalculation(body) {
  const input = object(body);
  const nutritionFields = validateNutritionFields(input);
  if (typeof input.age !== 'number' || !Number.isInteger(input.age) || input.age < 13 || input.age > 120) {
    fail('age', 'age must be a whole number between 13 and 120.');
  }
  return { ...nutritionFields, age: input.age };
}
