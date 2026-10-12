const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://eatgym:change-me@localhost:5432/eatgym'
});

async function main() {
  const all = await pool.query("SELECT id, title, kcal, protein_g, carbs_g, fat_g, cooking_time_min, tags FROM recipes");
  console.log('Total recipes in DB:', all.rows.length);

  let under15 = 0;
  let under400kcal = 0;
  let under300kcal = 0;
  let highProtein25 = 0;
  let highProtein20 = 0;
  let vegetarianKeywords = 0;

  for (const r of all.rows) {
    const k = parseFloat(r.kcal);
    const p = parseFloat(r.protein_g);
    const t = r.cooking_time_min;
    const title = r.title.toLowerCase();

    if (t <= 15) under15++;
    if (k <= 400) under400kcal++;
    if (k <= 300) under300kcal++;
    if (p >= 25) highProtein25++;
    if (p >= 20) highProtein20++;

    if (title.includes('chay') || title.includes('đậu') || title.includes('nấm') || title.includes('rau') || title.includes('salad') || title.includes('sinh tố') || title.includes('yến mạch') || title.includes('khoai') || title.includes('bắp')) {
      vegetarianKeywords++;
    }
  }

  console.log({
    under15MinCount: under15,
    under400KcalCount: under400kcal,
    under300KcalCount: under300kcal,
    proteinAbove25gCount: highProtein25,
    proteinAbove20gCount: highProtein20,
    potentialVegetarian: vegetarianKeywords
  });

  await pool.end();
}

main().catch(console.error);
