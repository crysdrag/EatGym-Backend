require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  const hash = await bcrypt.hash('12345678', 10);
  await pool.query('UPDATE users SET password_hash = $1 WHERE email = $2', [hash, 'demo@eatgym.com']);
  const res = await pool.query('SELECT email FROM users WHERE email = $1', ['demo@eatgym.com']);
  console.log('Updated user password:', res.rows);
  await pool.end();
}

run().catch(console.error);
