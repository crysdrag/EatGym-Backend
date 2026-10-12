require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

function getCategoryAndIcon(name, rawCat) {
  const n = name.toLowerCase();
  const c = rawCat.toLowerCase();

  if (c.includes('thịt') || c.includes('thủy sản') || c.includes('trứng')) {
    if (n.includes('gà') || n.includes('vịt')) return { cat: 'protein', icon: '🍗' };
    if (n.includes('bò') || n.includes('bê') || n.includes('dê') || n.includes('heo') || n.includes('lợn') || n.includes('thịt')) return { cat: 'protein', icon: '🥩' };
    if (n.includes('cá') || n.includes('lươn')) return { cat: 'protein', icon: '🐟' };
    if (n.includes('tôm') || n.includes('tép')) return { cat: 'protein', icon: '🦐' };
    if (n.includes('mực') || n.includes('bạch tuộc')) return { cat: 'protein', icon: '🦑' };
    if (n.includes('cua') || n.includes('ghẹ')) return { cat: 'protein', icon: '🦀' };
    if (n.includes('nghêu') || n.includes('ngao') || n.includes('sò') || n.includes('hến') || n.includes('ốc')) return { cat: 'protein', icon: '🐚' };
    if (n.includes('trứng')) return { cat: 'protein', icon: '🥚' };
    return { cat: 'protein', icon: '🥩' };
  }

  if (c.includes('ngũ cốc') || c.includes('khoai củ')) {
    if (n.includes('khoai') || n.includes('sắn') || n.includes('từ')) return { cat: 'carb', icon: '🥔' };
    if (n.includes('cơm') || n.includes('gạo')) return { cat: 'carb', icon: '🍚' };
    if (n.includes('bánh mì')) return { cat: 'carb', icon: '🥖' };
    if (n.includes('bún') || n.includes('phở') || n.includes('miến') || n.includes('mì')) return { cat: 'carb', icon: '🍜' };
    if (n.includes('bắp') || n.includes('ngô')) return { cat: 'carb', icon: '🌽' };
    return { cat: 'carb', icon: '🌾' };
  }

  if (c.includes('sữa')) {
    return { cat: 'dairy', icon: '🥛' };
  }

  if (c.includes('hạt, quả')) {
    if (n.includes('đậu phụ') || n.includes('đậu phụ') || n.includes('đậu')) return { cat: 'protein', icon: '🫘' };
    return { cat: 'fat', icon: '🥜' };
  }

  if (c.includes('gia vị') || c.includes('nước chấm')) {
    return { cat: 'condiment', icon: '🧂' };
  }

  if (c.includes('nước giải khát')) {
    return { cat: 'condiment', icon: '🥤' };
  }

  if (c.includes('đồ ngọt')) {
    return { cat: 'carb', icon: '🍬' };
  }

  if (c.includes('đồ hộp')) {
    if (n.includes('thịt') || n.includes('cá')) return { cat: 'protein', icon: '🥫' };
    return { cat: 'carb', icon: '🥫' };
  }

  return { cat: 'carb', icon: '🥗' };
}

async function run() {
  console.log('=== STARTING FAO & CSV INGREDIENT/RECIPE SYNC ===');

  // Fetch current ingredients
  const currentRes = await pool.query('SELECT name FROM ingredients');
  const currentIngNames = new Set(currentRes.rows.map(r => r.name.toLowerCase().trim()));

  const csvItems = JSON.parse(fs.readFileSync('C:/Users/Ning/.gemini/antigravity/brain/0225a86f-5c80-435d-9c6b-8b842c028fa9/scratch/csv_items.json', 'utf8'));

  let addedIngCount = 0;
  let skippedIngCount = 0;

  for (const item of csvItems) {
    const norm = item.name.toLowerCase().trim();
    if (currentIngNames.has(norm)) {
      skippedIngCount++;
      continue;
    }

    const { cat, icon } = getCategoryAndIcon(item.name, item.raw_category);
    const unit = item.name.toLowerCase().includes('trứng') ? 'quả' : (cat === 'condiment' && item.name.toLowerCase().includes('nước') ? 'ml' : 'g');

    await pool.query(`
      INSERT INTO ingredients (name, category, kcal_per_100g, protein_g, carbs_g, fat_g, icon, default_unit)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (name) DO NOTHING
    `, [item.name, cat, item.kcal, item.protein, item.carbs, item.fat, icon, unit]);

    currentIngNames.add(norm);
    addedIngCount++;
  }

  console.log(`[Ingredients] Skipped duplicates: ${skippedIngCount}, Newly added from CSV: ${addedIngCount}`);

  // Now enrich recipes from Nutrihome (dishes like Món mặn, Món sợi, Canh, Cơm phần)
  const currentRecRes = await pool.query('SELECT title FROM recipes');
  const currentRecTitles = new Set(currentRecRes.rows.map(r => r.title.toLowerCase().trim()));

  const nutriData = JSON.parse(fs.readFileSync('C:/Users/Ning/.gemini/antigravity/brain/0225a86f-5c80-435d-9c6b-8b842c028fa9/scratch/parsed_nutrihome.json', 'utf8'));

  let addedRecCount = 0;
  let skippedRecCount = 0;

  const validDishesCats = new Set(['Món mặn', 'Món sợi', 'Canh', 'Cơm phần', 'Cháo', 'Món trứng', 'Xôi']);

  for (const item of nutriData.items) {
    if (!validDishesCats.has(item.category)) continue;

    const normTitle = item.name.toLowerCase().trim();
    if (currentRecTitles.has(normTitle)) {
      skippedRecCount++;
      continue;
    }

    const tags = ['Việt Nam', item.category];
    if (item.protein >= 25) tags.push('High Protein');
    if (item.calo <= 350) tags.push('Giảm mỡ');
    if (item.calo >= 500) tags.push('Tăng cơ');

    const desc = `${item.name} (${item.unit}) - Dữ liệu dinh dưỡng chuẩn Viện Dinh Dưỡng / Nutrihome: ${item.calo} kcal, ${item.protein}g protein, ${item.carb}g carb, ${item.fat}g fat.`;

    const insRes = await pool.query(`
      INSERT INTO recipes (title, description, kcal, protein_g, carbs_g, fat_g, cooking_time_min, servings, difficulty, tags, instructions)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      ON CONFLICT (title) DO NOTHING
      RETURNING id
    `, [
      item.name,
      desc,
      item.calo,
      item.protein,
      item.carb,
      item.fat,
      20,
      1,
      'Dễ',
      tags,
      `Chuẩn bị các nguyên liệu tươi theo định lượng khẩu phần ${item.unit}. Chế biến theo phương pháp truyền thống giữ trọn vẹn dinh dưỡng.`
    ]);

    if (insRes.rows.length > 0) {
      currentRecTitles.add(normTitle);
      addedRecCount++;
    } else {
      skippedRecCount++;
    }
  }

  console.log(`[Recipes] Skipped duplicates: ${skippedRecCount}, Newly added from Nutrihome: ${addedRecCount}`);

  const totalIng = await pool.query('SELECT COUNT(*) FROM ingredients');
  const totalRec = await pool.query('SELECT COUNT(*) FROM recipes');

  console.log(`=== FINISHED SYNC ===`);
  console.log(`TOTAL INGREDIENTS IN DB: ${totalIng.rows[0].count}`);
  console.log(`TOTAL RECIPES IN DB: ${totalRec.rows[0].count}`);

  await pool.end();
}

run().catch(err => {
  console.error('Error during sync:', err);
  process.exit(1);
});
