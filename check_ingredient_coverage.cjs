const { pool } = require('./src/db/pool.js');

async function run() {
  const res = await pool.query('SELECT id, name, category, kcal_per_100g, protein_g, carbs_g, fat_g, icon FROM ingredients ORDER BY name');
  console.log('Total ingredients:', res.rows.length);

  const zero = [];
  const oneTwo = [];
  const threePlus = [];

  for (const r of res.rows) {
    const matched = await pool.query(
      'SELECT DISTINCT r.id FROM recipes r JOIN recipe_ingredients ri ON r.id = ri.recipe_id WHERE ri.ingredient_name ILIKE $1 OR r.title ILIKE $1',
      ['%' + r.name + '%']
    );
    const count = matched.rows.length;
    if (count === 0) zero.push({ name: r.name, category: r.category, count });
    else if (count < 3) oneTwo.push({ name: r.name, category: r.category, count });
    else threePlus.push({ name: r.name, category: r.category, count });
  }

  console.log(`Coverage statistics:`);
  console.log(`- Zero recipes: ${zero.length}`);
  console.log(`- 1-2 recipes: ${oneTwo.length}`);
  console.log(`- >= 3 recipes: ${threePlus.length}`);

  console.log('\nSample Zero recipes:', zero.slice(0, 10));
  console.log('\nSample 1-2 recipes:', oneTwo.slice(0, 10));
  await pool.end();
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});
