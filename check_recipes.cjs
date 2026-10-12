const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://eatgym:change-me@localhost:5432/eatgym' });

async function check() {
  const oneStep = await pool.query(
    "SELECT id, title, cooking_time_min, instructions FROM recipes WHERE instructions NOT LIKE '%1.%' AND instructions NOT LIKE '%Bước%' LIMIT 20"
  );
  console.log('Sample 1-step recipes: count =', oneStep.rows.length);
  oneStep.rows.forEach(r => console.log(`- ${r.title} (${r.cooking_time_min}p) => ${r.instructions}`));
  await pool.end();
}

check();
