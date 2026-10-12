const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://eatgym:change-me@localhost:5432/eatgym'
});

async function main() {
  const res = await pool.query("SELECT id, title, kcal, protein_g, carbs_g, fat_g, cooking_time_min, tags FROM recipes ORDER BY id");
  console.log(`Loaded ${res.rows.length} recipes:`);
  for (let i = 0; i < Math.min(30, res.rows.length); i++) {
    const r = res.rows[i];
    console.log(`[${i+1}] ${r.title} | ${r.kcal} kcal | ${r.protein_g}g Pro | ${r.fat_g}g Fat | ${r.cooking_time_min}m | Tags: ${JSON.stringify(r.tags)}`);
  }
  await pool.end();
}

main().catch(console.error);
