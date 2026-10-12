import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { pool } from '../src/db/pool.js';
import { calculateConsecutiveStreak, calculateCurrentStreak } from '../src/nutrition/streak.js';

test('Achievements DB & streak logic integration test', async () => {
  // Check default badges exist
  const badgesRes = await pool.query('SELECT * FROM badges ORDER BY required_streak_days ASC');
  assert.equal(badgesRes.rows.length >= 3, true);
  assert.equal(badgesRes.rows[0].code, 'COOKING_STARTER_3');
  assert.equal(badgesRes.rows[1].code, 'COOKING_WEEK_7');
  assert.equal(badgesRes.rows[2].code, 'COOKING_CHAMPION_30');

  // Verify streak calculation function
  const streak = calculateConsecutiveStreak(['2026-10-09', '2026-10-10', '2026-10-11'], '2026-10-11');
  assert.equal(streak, 3);
});

after(async () => {
  await pool.end();
});
