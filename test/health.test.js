import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { pool } from '../src/db/pool.js';

test('Daily health metrics schema & upsert integration test', async () => {
  // 1. Ensure table exists
  const tableCheck = await pool.query(`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_name = 'daily_health_metrics'
    );
  `);
  assert.equal(tableCheck.rows[0].exists, true);

  // 2. Fetch or create a test user
  let userRes = await pool.query("SELECT id FROM users WHERE email = 'demo@eatgym.com'");
  let userId;
  if (userRes.rowCount === 0) {
    const newUser = await pool.query(`
      INSERT INTO users (email, password_hash, full_name)
      VALUES ('health_test@eatgym.com', 'hash', 'Health Test User')
      RETURNING id
    `);
    userId = newUser.rows[0].id;
  } else {
    userId = userRes.rows[0].id;
  }

  const testDate = '2026-10-16';

  // 3. Insert daily metric (Nothing X: 2656 steps, 2 kcal, 89 bpm)
  const insertQuery = `
    INSERT INTO daily_health_metrics (
      user_id, log_date, steps, calories_burned, heart_rate_avg, source, updated_at
    ) VALUES ($1, $2, $3, $4, $5, $6, NOW())
    ON CONFLICT (user_id, log_date)
    DO UPDATE SET
      steps = EXCLUDED.steps,
      calories_burned = EXCLUDED.calories_burned,
      heart_rate_avg = EXCLUDED.heart_rate_avg,
      source = EXCLUDED.source,
      updated_at = NOW()
    RETURNING *;
  `;

  const res1 = await pool.query(insertQuery, [userId, testDate, 2656, 2.0, 89, 'Nothing X']);
  assert.equal(res1.rowCount, 1);
  assert.equal(Number(res1.rows[0].steps), 2656);
  assert.equal(Number(res1.rows[0].calories_burned), 2.0);
  assert.equal(res1.rows[0].heart_rate_avg, 89);
  assert.equal(res1.rows[0].source, 'Nothing X');

  // 4. Test Upsert on same date (e.g. later in the day steps increased to 3500, calories to 150)
  const res2 = await pool.query(insertQuery, [userId, testDate, 3500, 150.0, 92, 'Nothing X']);
  assert.equal(res2.rowCount, 1);
  assert.equal(Number(res2.rows[0].steps), 3500);
  assert.equal(Number(res2.rows[0].calories_burned), 150.0);
  assert.equal(res2.rows[0].id, res1.rows[0].id); // Must update the SAME row

  // 5. Query daily metrics by user
  const listRes = await pool.query(
    'SELECT * FROM daily_health_metrics WHERE user_id = $1 AND log_date = $2',
    [userId, testDate]
  );
  assert.equal(listRes.rowCount, 1);
});

after(async () => {
  await pool.end();
});
