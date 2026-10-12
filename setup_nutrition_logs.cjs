const { pool } = require('./src/db/pool.js');

async function setupNutritionLogs() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS nutrition_logs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      log_date DATE NOT NULL,
      meal_type VARCHAR(32) NOT NULL,
      food_name VARCHAR(255) NOT NULL,
      serving_size NUMERIC(8, 2) NOT NULL DEFAULT 1,
      serving_unit VARCHAR(64) NOT NULL DEFAULT 'phần',
      calories NUMERIC(8, 2) NOT NULL DEFAULT 0,
      protein NUMERIC(8, 2) NOT NULL DEFAULT 0,
      carbs NUMERIC(8, 2) NOT NULL DEFAULT 0,
      fat NUMERIC(8, 2) NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_nutrition_logs_user_date ON nutrition_logs (user_id, log_date);
  `);
  console.log('nutrition_logs table created successfully!');
  await pool.end();
}

setupNutritionLogs().catch(err => {
  console.error('Error creating table:', err);
  process.exit(1);
});
