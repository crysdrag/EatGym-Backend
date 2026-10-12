const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://eatgym:change-me@localhost:5432/eatgym' });

async function analyzeAll() {
  const { rows } = await pool.query(
    `SELECT r.id, r.title, r.cooking_time_min, r.kcal, r.protein_g, r.carbs_g, r.fat_g, r.instructions,
            COALESCE(array_to_json(ARRAY_AGG(ri.ingredient_name)), '[]') as ingredients
     FROM recipes r
     LEFT JOIN recipe_ingredients ri ON r.id = ri.recipe_id
     GROUP BY r.id, r.title, r.cooking_time_min, r.kcal, r.protein_g, r.carbs_g, r.fat_g, r.instructions`
  );

  console.log(`Total recipes loaded: ${rows.length}`);
  
  // Categorize by dish types
  const types = {};
  rows.forEach(r => {
    let t = 'Khác';
    const title = r.title.toLowerCase();
    if (title.includes('canh') || title.includes('soup') || title.includes('súp')) t = 'Canh/Soup';
    else if (title.includes('cháo')) t = 'Cháo';
    else if (title.includes('cơm') || title.includes('xôi')) t = 'Cơm/Xôi';
    else if (title.includes('bún') || title.includes('phở') || title.includes('hủ tiếu') || title.includes('mì') || title.includes('miến')) t = 'Bún/Phở/Mì';
    else if (title.includes('xào')) t = 'Xào';
    else if (title.includes('áp chảo') || title.includes('bít tết') || title.includes('steak')) t = 'Áp chảo';
    else if (title.includes('hấp')) t = 'Hấp';
    else if (title.includes('luộc')) t = 'Luộc';
    else if (title.includes('nướng')) t = 'Nướng';
    else if (title.includes('kho') || title.includes('rim') || title.includes('om') || title.includes('sốt cà') || title.includes('dồn thịt')) t = 'Kho/Rim/Om';
    else if (title.includes('salad') || title.includes('gỏi') || title.includes('trộn')) t = 'Salad/Gỏi';
    else if (title.includes('sinh tố') || title.includes('smoothie') || title.includes('nước ép') || title.includes('sữa')) t = 'Đồ uống/Phụ';
    else if (title.includes('bánh') || title.includes('wrap')) t = 'Bánh/Wrap';
    types[t] = (types[t] || 0) + 1;
  });

  console.log('Dish categories count:', types);
  await pool.end();
}

analyzeAll();
