require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function linkRecipes() {
  console.log('Linking recipes with ingredients...');

  const recipes = await pool.query(`
    SELECT r.id, r.title 
    FROM recipes r
    LEFT JOIN recipe_ingredients ri ON r.id = ri.recipe_id
    WHERE ri.id IS NULL
  `);

  const ingredients = await pool.query('SELECT id, name FROM ingredients');

  let linkCount = 0;

  for (const r of recipes.rows) {
    const titleLower = r.title.toLowerCase();

    for (const ing of ingredients.rows) {
      const ingNameLower = ing.name.toLowerCase();

      // Check keyword matching (e.g. "bò", "gà", "cá", "tôm", "mực", "trứng", "bún", "phở", "cơm", "khoai", "nấm", "đậu")
      const keywords = ingNameLower.split(/[\s,()]+/).filter(w => w.length >= 2);
      
      // If the ingredient name is contained in recipe title, or core keyword matches
      if (titleLower.includes(ingNameLower) || (keywords.length >= 2 && keywords.every(kw => titleLower.includes(kw)))) {
        await pool.query(`
          INSERT INTO recipe_ingredients (recipe_id, ingredient_id, ingredient_name, amount, unit)
          VALUES ($1, $2, $3, $4, $5)
        `, [r.id, ing.id, ing.name, 100, 'g']);
        linkCount++;
      }
    }
  }

  const finalLinks = await pool.query('SELECT COUNT(*) FROM recipe_ingredients');
  console.log(`Created ${linkCount} new recipe-ingredient links! Total links in DB: ${finalLinks.rows[0].count}`);
  await pool.end();
}

linkRecipes().catch(console.error);
