const { Pool } = require('pg');
const { buildDetailedSteps, cleanTitle } = require('./step_builder.cjs');

const pool = new Pool({ connectionString: 'postgresql://eatgym:change-me@localhost:5432/eatgym' });

async function updateAllRecipes() {
  console.log('Fetching all recipes with ingredients...');
  const { rows } = await pool.query(`
    SELECT r.id, r.title, r.cooking_time_min,
           COALESCE(ARRAY_AGG(ri.ingredient_name) FILTER (WHERE ri.ingredient_name IS NOT NULL), '{}') as ingredients
    FROM recipes r
    LEFT JOIN recipe_ingredients ri ON r.id = ri.recipe_id
    GROUP BY r.id, r.title, r.cooking_time_min
  `);

  console.log(`Updating ${rows.length} recipes to full 5-step detailed instructions...`);

  let count = 0;
  for (const r of rows) {
    const detailedInstructions = buildDetailedSteps(r.title, r.ingredients, r.cooking_time_min);
    
    // Calculate total minutes from the 5 steps
    const matches = detailedInstructions.match(/(\d+)\s*phút/g) || [];
    let totalMinutes = 0;
    matches.forEach(m => {
      const num = parseInt(m);
      if (!isNaN(num)) totalMinutes += num;
    });
    if (totalMinutes < 10) totalMinutes = r.cooking_time_min || 15;

    await pool.query(
      `UPDATE recipes 
       SET instructions = $1, cooking_time_min = $2, updated_at = NOW()
       WHERE id = $3`,
      [detailedInstructions, totalMinutes, r.id]
    );

    count++;
    if (count % 100 === 0 || count === rows.length) {
      console.log(`Progress: ${count} / ${rows.length} recipes updated.`);
    }
  }

  console.log('Verifying results in database...');
  const verify = await pool.query(`
    SELECT title, cooking_time_min, instructions
    FROM recipes
    WHERE title ILIKE '%Đậu hủ dồn thịt%' OR title ILIKE '%Cháo sườn%' OR title ILIKE '%Canh bắp cải%'
  `);
  verify.rows.forEach(r => {
    console.log(`\n=== ${r.title} (${r.cooking_time_min} phút) ===`);
    console.log(r.instructions);
  });

  // Verify step count distribution
  const allUpdated = await pool.query('SELECT instructions FROM recipes');
  let stepCounts = {};
  allUpdated.rows.forEach(r => {
    const steps = (r.instructions || '').split('\n').filter(s => s.trim().startsWith('Bước'));
    const c = steps.length;
    stepCounts[c] = (stepCounts[c] || 0) + 1;
  });
  console.log('\nStep counts distribution after update:', stepCounts);

  await pool.end();
}

updateAllRecipes().catch(err => {
  console.error('Update failed:', err);
  process.exit(1);
});
