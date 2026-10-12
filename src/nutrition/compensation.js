import { ApiError } from '../errors.js';

const round = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

/**
 * Creates proportional, capped allocations for an energy excess. `capacity`
 * is the largest amount each future meal can safely absorb. The function is
 * deterministic and works in cents of kcal to avoid rounding drift.
 */
export function allocateCompensation(requestedKcal, targets) {
  if (!Number.isFinite(requestedKcal) || requestedKcal <= 0) {
    throw new ApiError(422, 'requestedKcal must be greater than zero.', 'VALIDATION_ERROR', { field: 'requestedKcal' });
  }
  if (!Array.isArray(targets) || targets.length === 0) {
    throw new ApiError(422, 'At least one future meal target is required.', 'NO_FUTURE_TARGETS');
  }

  const remaining = targets.map((target) => ({
    ...target,
    plannedKcal: Number(target.plannedKcal),
    capacity: Math.max(0, Number(target.capacity))
  }));
  if (remaining.some((target) => !Number.isFinite(target.plannedKcal) || !Number.isFinite(target.capacity))) {
    throw new Error('Targets must contain finite plannedKcal and capacity values.');
  }

  const requestedCents = Math.round(requestedKcal * 100);
  const capacityCents = remaining.map((target) => Math.floor(target.capacity * 100));
  const totalCapacity = capacityCents.reduce((sum, capacity) => sum + capacity, 0);
  const amountToAllocate = Math.min(requestedCents, totalCapacity);
  const weights = remaining.map((target, index) => target.plannedKcal > 0 ? target.plannedKcal : capacityCents[index]);
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  const allocationCents = remaining.map(() => 0);

  if (amountToAllocate > 0 && totalWeight > 0) {
    let allocated = 0;
    const rankedRemainders = [];
    for (let index = 0; index < remaining.length; index += 1) {
      const ideal = (amountToAllocate * weights[index]) / totalWeight;
      allocationCents[index] = Math.min(capacityCents[index], Math.floor(ideal));
      allocated += allocationCents[index];
      rankedRemainders.push({ index, remainder: ideal - Math.floor(ideal) });
    }

    // Largest-remainder distribution, with extra passes for targets capped by
    // their available capacity.
    rankedRemainders.sort((a, b) => b.remainder - a.remainder || a.index - b.index);
    while (allocated < amountToAllocate) {
      let progressed = false;
      for (const { index } of rankedRemainders) {
        if (allocated === amountToAllocate) break;
        if (allocationCents[index] < capacityCents[index]) {
          allocationCents[index] += 1;
          allocated += 1;
          progressed = true;
        }
      }
      if (!progressed) break;
    }
  }

  const allocatedKcal = round(allocationCents.reduce((sum, value) => sum + value, 0) / 100);
  return {
    requestedKcal: round(requestedKcal),
    allocatedKcal,
    unallocatedKcal: round(requestedKcal - allocatedKcal),
    allocations: remaining
      .map((target, index) => ({ ...target, compensationKcal: round(allocationCents[index] / 100) }))
      .filter((target) => target.compensationKcal > 0)
  };
}
