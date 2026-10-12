const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://eatgym:change-me@localhost:5432/eatgym' });

async function inspect() {
  const schema = await pool.query(
    "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'recipes'"
  );
  console.log('Columns:', schema.rows.map(r => `${r.column_name} (${r.data_type})`));
  
  const sample = await pool.query(
    "SELECT r.id, r.title, r.cooking_time_min, r.instructions, " +
    "ARRAY_AGG(ri.ingredient_name) as ingredients " +
    "FROM recipes r " +
    "LEFT JOIN recipe_ingredients ri ON r.id = ri.recipe_id " +
    "GROUP BY r.id, r.title, r.cooking_time_min, r.instructions " +
    "LIMIT 10"
  );
  console.log('Sample recipes with ingredients:');
  sample.rows.forEach(r => {
    console.log(`- ${r.title} (${r.cooking_time_min}p) [${(r.ingredients||[]).filter(Boolean).join(', ')}]:`);
    console.log(`  Instructions: ${r.instructions}`);
  });

  await pool.end();
}

inspect();
