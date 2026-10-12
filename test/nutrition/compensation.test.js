import test from 'node:test';
import assert from 'node:assert/strict';
import { allocateCompensation } from '../../src/nutrition/compensation.js';

test('allocates an excess proportionally across future meal targets', () => {
  const result = allocateCompensation(300, [
    { id: 'breakfast', plannedKcal: 600, capacity: 600 },
    { id: 'lunch', plannedKcal: 900, capacity: 900 }
  ]);
  assert.equal(result.allocatedKcal, 300);
  assert.equal(result.unallocatedKcal, 0);
  assert.deepEqual(result.allocations.map(({ id, compensationKcal }) => ({ id, compensationKcal })), [
    { id: 'breakfast', compensationKcal: 120 },
    { id: 'lunch', compensationKcal: 180 }
  ]);
});

test('never reduces a meal below its available capacity floor', () => {
  const result = allocateCompensation(400, [
    { id: 'breakfast', plannedKcal: 400, capacity: 100 },
    { id: 'lunch', plannedKcal: 500, capacity: 50 }
  ]);
  assert.equal(result.allocatedKcal, 150);
  assert.equal(result.unallocatedKcal, 250);
  assert.deepEqual(result.allocations.map(({ id, compensationKcal }) => ({ id, compensationKcal })), [
    { id: 'breakfast', compensationKcal: 100 },
    { id: 'lunch', compensationKcal: 50 }
  ]);
});

test('rejects an empty set of future meal targets', () => {
  assert.throws(() => allocateCompensation(100, []), { code: 'NO_FUTURE_TARGETS' });
});
