import { ApiError } from '../errors.js';

function parseDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new ApiError(422, 'cookedOn must use valid YYYY-MM-DD format.', 'VALIDATION_ERROR', { field: 'cookedOn' });
  }
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
    throw new ApiError(422, 'cookedOn must use valid YYYY-MM-DD format.', 'VALIDATION_ERROR', { field: 'cookedOn' });
  }
  return date;
}

function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

/** Returns the consecutive streak ending on `anchorDate`, not necessarily today. */
export function calculateConsecutiveStreak(cookingDates, anchorDate) {
  const anchor = parseDate(anchorDate);
  const dateSet = new Set(cookingDates.map((date) => isoDate(parseDate(date))));
  let current = anchor;
  let streakDays = 0;
  while (dateSet.has(isoDate(current))) {
    streakDays += 1;
    current = new Date(current.getTime() - 86_400_000);
  }
  return streakDays;
}

/** Current streak is anchored to today; yesterday is allowed as the latest activity. */
export function calculateCurrentStreak(cookingDates, today = new Date()) {
  const todayIso = isoDate(today);
  const yesterdayIso = isoDate(new Date(today.getTime() - 86_400_000));
  const dateSet = new Set(cookingDates.map((date) => isoDate(parseDate(date))));
  const anchor = dateSet.has(todayIso) ? todayIso : dateSet.has(yesterdayIso) ? yesterdayIso : todayIso;
  return calculateConsecutiveStreak([...dateSet], anchor);
}
