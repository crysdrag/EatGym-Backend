const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://eatgym:change-me@localhost:5432/eatgym'
});

function detectIcon(rawTitle) {
  const t = rawTitle.toLowerCase();
  if (t.includes('gà')) return '🍗';
  if (t.includes('bò') || t.includes('steak') || t.includes('thăn bò')) return '🥩';
  if (t.includes('heo') || t.includes('lợn') || t.includes('sườn') || t.includes('giò') || t.includes('thịt kho') || t.includes('dồn thịt') || t.includes('nhồi thịt') || t.includes('thịt nạc') || t.includes('thịt băm')) return '🍖';
  if (t.includes('cá') || t.includes('salmon') || t.includes('ngừ')) return '🐟';
  if (t.includes('tôm') || t.includes('hải sản') || t.includes('mực') || t.includes('cua')) return '🦐';
  if (t.includes('trứng') || t.includes('ốp la')) return '🍳';
  if (t.includes('phở') || t.includes('bún') || t.includes('mì') || t.includes('miến') || t.includes('hủ tíu') || t.includes('bánh canh') || t.includes('spaghetti')) return '🍜';
  if (t.includes('canh') || t.includes('súp') || t.includes('soup') || t.includes('lẩu')) return '🍲';
  if (t.includes('cháo') || t.includes('yến mạch') || t.includes('oats')) return '🥣';
  if (t.includes('cơm') || t.includes('gạo lứt')) return '🍚';
  if (t.includes('xôi')) return '🍙';
  if (t.includes('salad') || t.includes('gỏi') || t.includes('nộm') || t.includes('rau')) return '🥗';
  if (t.includes('nấm')) return '🍄';
  if (t.includes('đậu hũ') || t.includes('đậu hủ') || t.includes('tàu hũ') || t.includes('chay')) return '🌱';
  if (t.includes('bánh mì') || t.includes('sandwich') || t.includes('wrap') || t.includes('toast')) return '🥪';
  if (t.includes('khoai') || t.includes('bắp') || t.includes('ngô')) return '🍠';
  if (t.includes('sinh tố') || t.includes('smoothie') || t.includes('nước ép')) return '🥤';
  if (t.includes('bột chiên') || t.includes('bánh')) return '🥞';
  return '🍽️';
}

function cleanTitle(title) {
  return title.replace(/^[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\s]+/u, '').trim();
}

async function main() {
  const all = await pool.query('SELECT id, title, kcal, protein_g, carbs_g, fat_g, cooking_time_min, tags FROM recipes');
  console.log(`Re-evaluating strict criteria for ${all.rows.length} recipes...`);

  for (const row of all.rows) {
    const clean = cleanTitle(row.title);
    const icon = detectIcon(clean);
    const titleWithEmoji = `${icon} ${clean}`;

    const kcal = parseFloat(row.kcal);
    const protein = parseFloat(row.protein_g);
    const fat = parseFloat(row.fat_g);
    let time = row.cooking_time_min;

    const lower = clean.toLowerCase();
    if (time > 15 && (
      lower.includes('salad') || lower.includes('nộm') || lower.includes('gỏi') ||
      lower.includes('trứng') || lower.includes('cháo') || lower.includes('soup') ||
      lower.includes('sinh tố') || lower.includes('wrap') || lower.includes('sandwich') ||
      lower.includes('luộc') || lower.includes('canh rau') || lower.includes('áp chảo') ||
      lower.includes('xào') || lower.includes('đậu hũ chiên') || lower.includes('nấm rơm kho') ||
      lower.includes('bột chiên') || lower.includes('bánh hỏi') || lower.includes('tôm sốt cà') ||
      lower.includes('đậu hủ sốt') || lower.includes('nấm')
    )) {
      time = 15;
    }

    const tagSet = new Set(['Tất cả']);

    // Tăng cơ: Protein >= 20g OR high protein density meals
    if (protein >= 20 || lower.includes('ức gà') || lower.includes('bò') || lower.includes('bít tết') || lower.includes('whey') || lower.includes('cá hồi')) {
      tagSet.add('Tăng cơ');
    }

    // Giảm mỡ: Clean macros (kcal <= 460 and fat <= 16g and protein >= 10g)
    if (kcal <= 460 && fat <= 16 && protein >= 10) {
      tagSet.add('Giảm mỡ');
    }

    // Ít calo: Low calorie meals (kcal <= 360)
    if (kcal <= 360) {
      tagSet.add('Ít calo');
    }

    // Ăn chay: Strictly NO meat, poultry, seafood!
    const containsMeatOrFish = lower.includes('bò') || lower.includes('gà') || lower.includes('heo') ||
      lower.includes('lợn') || lower.includes('cá') || lower.includes('tôm') || lower.includes('thịt') ||
      lower.includes('sườn') || lower.includes('cua') || lower.includes('mực') || lower.includes('hải sản') ||
      lower.includes('chả cá') || lower.includes('chả lụa') || lower.includes('bì') || lower.includes('lòng') ||
      lower.includes('vịt') || lower.includes('ếch') || lower.includes('ốc') || lower.includes('ngao') ||
      lower.includes('hàu') || lower.includes('ba chỉ');

    if (!containsMeatOrFish || lower.includes('chay')) {
      if (lower.includes('chay') || lower.includes('đậu') || lower.includes('nấm') || lower.includes('rau') ||
          lower.includes('bông cải') || lower.includes('salad') || lower.includes('cơm trắng') ||
          lower.includes('bánh hỏi') || lower.includes('xôi') || lower.includes('yến mạch') ||
          lower.includes('khoai') || lower.includes('bắp') || lower.includes('sinh tố')) {
        tagSet.add('Ăn chay');
      }
    }

    // Dưới 15 phút: Cooking time <= 15m
    if (time <= 15) {
      tagSet.add('Dưới 15 phút');
    }

    const tagsArray = Array.from(tagSet);

    await pool.query(`
      UPDATE recipes
      SET title = $1, icon = $2, cooking_time_min = $3, tags = $4, updated_at = NOW()
      WHERE id = $5
    `, [titleWithEmoji, icon, time, tagsArray, row.id]);
  }

  console.log('--- RE-EVALUATION RESULT ---');
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
