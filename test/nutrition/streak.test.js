import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateConsecutiveStreak, calculateCurrentStreak } from '../../src/nutrition/streak.js';

test('calculates a streak ending on a selected cooking date', () => {
  assert.equal(calculateConsecutiveStreak(['2026-10-05', '2026-10-04', '2026-10-03', '2026-10-01'], '2026-10-05'), 3);
});

test('a current streak may continue from yesterday but not from an older day', () => {
  assert.equal(calculateCurrentStreak(['2026-10-07', '2026-10-06'], new Date('2026-10-08T00:00:00Z')), 2);
  assert.equal(calculateCurrentStreak(['2026-10-06'], new Date('2026-10-08T00:00:00Z')), 0);
});

test('rejects an invalid cooking date', () => {
  assert.throws(() => calculateConsecutiveStreak([], '2026-02-30'), { code: 'VALIDATION_ERROR' });
});
