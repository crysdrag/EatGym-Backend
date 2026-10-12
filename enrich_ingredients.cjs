const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://eatgym:change-me@localhost:5432/eatgym'
});

function detectIngredientIcon(name) {
  const n = name.toLowerCase();
  if (n.includes('bánh mì') || n.includes('sandwich') || n.includes('wrap') || n.includes('bánh phở') || n.includes('bánh bao') || n.includes('bánh tráng')) return '🥖';
  if (n.includes('gà')) return '🍗';
  if (n.includes('bò')) return '🥩';
  if (n.includes('heo') || n.includes('lợn') || n.includes('sườn') || n.includes('thịt')) return '🍖';
  if (n.includes('tôm')) return '🦐';
  if (n.includes('mực') || n.includes('bạch tuộc')) return '🦑';
  if (n.includes('cua') || n.includes('ghẹ')) return '🦀';
  if (n.includes('cá hồi') || n.includes('cá thu') || n.includes('cá ngừ') || n.includes('cá chép') || n.includes('cá lóc') || n.includes('cá hú') || n.includes('cá nục') || n.includes('chả cá') || n.includes('cá basa') || n.includes('cá trắm') || n.includes('cá quả') || n.includes('cá rô') || n.startsWith('cá ')) return '🐟';
  if (n.includes('trứng')) return '🥚';
  if (n.includes('sữa chua') || n.includes('sữa')) return '🥛';
  if (n.includes('phô mai') || n.includes('cheese')) return '🧀';
  if (n.includes('bơ') && !n.includes('lạc') && !n.includes('đậu phộng')) return '🥑';
  if (n.includes('bơ đậu phộng') || n.includes('đậu phộng') || n.includes('lạc')) return '🥜';
  if (n.includes('hạt điều') || n.includes('hạnh nhân') || n.includes('hạt chia') || n.includes('hạt sen') || n.includes('hạt')) return '🌰';
  if (n.includes('gạo') || n.includes('cơm')) return '🍚';
  if (n.includes('yến mạch') || n.includes('oats')) return '🌾';
  if (n.includes('khoai lang') || n.includes('khoai')) return '🍠';
  if (n.includes('bắp') || n.includes('ngô')) return '🌽';
  if (n.includes('chuối')) return '🍌';
  if (n.includes('táo')) return '🍎';
  if (n.includes('cam') || n.includes('chanh')) return '🍊';
  if (n.includes('dưa hấu')) return '🍉';
  if (n.includes('nho')) return '🍇';
  if (n.includes('dâu')) return '🍓';
  if (n.includes('dứa') || n.includes('thơm')) return '🍍';
  if (n.includes('bông cải') || n.includes('súp lơ') || n.includes('broccoli')) return '🥦';
  if (n.includes('cà chua')) return '🍅';
  if (n.includes('cà rốt')) return '🥕';
  if (n.includes('dưa chuột') || n.includes('dưa leo')) return '🥒';
  if (n.includes('ớt chuông') || n.includes('ớt')) return '🌶️';
  if (n.includes('nấm')) return '🍄';
  if (n.includes('đậu phụ') || n.includes('đậu hũ') || n.includes('đậu hủ') || n.includes('tàu hũ')) return '🌱';
  if (n.includes('đậu xanh') || n.includes('đậu đen') || n.includes('đậu đỏ') || n.includes('đậu nành') || n.includes('đậu gà') || n.includes('đậu que') || n.includes('đậu')) return '🫘';
  if (n.includes('rau muống') || n.includes('rau ngót') || n.includes('rau cải') || n.includes('cải') || n.includes('xà lách') || n.includes('rau')) return '🥬';
  if (n.includes('hành') || n.includes('tỏi')) return '🧄';
  if (n.includes('dầu ô liu') || n.includes('dầu')) return '🫒';
  if (n.includes('nước mắm') || n.includes('nước tương') || n.includes('giấm') || n.includes('sốt')) return '🧂';
  return '🥗';
}

async function main() {
  const all = await pool.query("SELECT id, name, icon FROM ingredients");
  let updated = 0;
  for (const ing of all.rows) {
    const newIcon = detectIngredientIcon(ing.name);
    if (newIcon !== ing.icon) {
      await pool.query("UPDATE ingredients SET icon = $1 WHERE id = $2", [newIcon, ing.id]);
      updated++;
    }
  }
  console.log(`Updated icons for ${updated} ingredients.`);
  const sample = await pool.query("SELECT name, icon FROM ingredients ORDER BY name LIMIT 20");
  console.log('Sample ingredients with icons:', sample.rows);
  await pool.end();
}

main().catch(console.error);
