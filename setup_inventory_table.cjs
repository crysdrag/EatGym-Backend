const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://eatgym:change-me@localhost:5432/eatgym'
});

async function main() {
  console.log('1. Creating user_inventory table...');
  await pool.query(`
    CREATE TABLE IF NOT EXISTS user_inventory (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      name VARCHAR(160) NOT NULL,
      quantity NUMERIC(10, 2) NOT NULL DEFAULT 100,
      unit VARCHAR(32) NOT NULL DEFAULT 'g',
      calories NUMERIC(8, 2) NOT NULL DEFAULT 0,
      protein NUMERIC(8, 2) NOT NULL DEFAULT 0,
      carbs NUMERIC(8, 2) NOT NULL DEFAULT 0,
      fat NUMERIC(8, 2) NOT NULL DEFAULT 0,
      category VARCHAR(60) NOT NULL DEFAULT 'other',
      icon VARCHAR(16) DEFAULT '🥗',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  console.log('2. Adding icon column to recipes...');
  await pool.query(`
    ALTER TABLE recipes ADD COLUMN IF NOT EXISTS icon VARCHAR(16) DEFAULT '🍲';
  `);

  console.log('Done database schema setup.');
  await pool.end();
}

main().catch(console.error);
