const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://eatgym:change-me@localhost:5432/eatgym' });

async function checkSampleCategories() {
  const { rows } = await pool.query("SELECT id, title, instructions FROM recipes LIMIT 50");
  rows.forEach((r, i) => {
    console.log(`${i + 1}. [${r.title}] => ${r.instructions.substring(0, 60)}...`);
  });
  await pool.end();
}

checkSampleCategories();
