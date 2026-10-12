const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://eatgym:change-me@localhost:5432/eatgym'
});

async function main() {
  const tagsToCheck = ['Tất cả', 'Tăng cơ', 'Giảm mỡ', 'Ít calo', 'Ăn chay', 'Dưới 15 phút'];
  for (const t of tagsToCheck) {
    let q, params;
    if (t === 'Tất cả') {
      q = 'SELECT count(*) FROM recipes';
      params = [];
    } else {
      q = 'SELECT count(*) FROM recipes WHERE $1 = ANY(tags)';
      params = [t];
    }
    const res = await pool.query(q, params);
    console.log(`Tag "${t}": ${res.rows[0].count} recipes`);
  }
  await pool.end();
}

main().catch(console.error);
