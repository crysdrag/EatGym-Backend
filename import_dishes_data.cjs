require('dotenv').config();
const fs = require('fs');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://eatgym:change-me@localhost:5432/eatgym'
});

const missingIngredients = [
  { name: 'Bắp ngọt tươi (Ngô)', category: 'carb', kcal: 86.0, protein: 3.2, carbs: 19.0, fat: 1.2, icon: '🌽', unit: 'g' },
  { name: 'Tiêu đen Phú Quốc xay', category: 'condiment', kcal: 251.0, protein: 10.4, carbs: 64.0, fat: 3.3, icon: '🧂', unit: 'g' },
  { name: 'Khoai lang mật hấp', category: 'carb', kcal: 103.0, protein: 1.6, carbs: 24.0, fat: 0.2, icon: '🍠', unit: 'g' },
  { name: 'Nước mắm truyền thống 40 độ đạm', category: 'condiment', kcal: 45.0, protein: 10.0, carbs: 1.0, fat: 0.0, icon: '🍶', unit: 'ml' },
  { name: 'Cơm gạo lứt', category: 'carb', kcal: 111.0, protein: 2.6, carbs: 23.0, fat: 0.9, icon: '🍚', unit: 'g' },
  { name: 'Tỏi băm tươi', category: 'condiment', kcal: 149.0, protein: 6.4, carbs: 33.0, fat: 0.5, icon: '🧄', unit: 'g' },
  { name: 'Gừng tươi băm', category: 'condiment', kcal: 80.0, protein: 1.8, carbs: 18.0, fat: 0.8, icon: '🫚', unit: 'g' },
  { name: 'Măng tây tươi', category: 'vegetable', kcal: 20.0, protein: 2.2, carbs: 3.9, fat: 0.1, icon: '🌱', unit: 'g' },
  { name: 'Nước tương đậu nành thanh vị', category: 'condiment', kcal: 53.0, protein: 8.0, carbs: 5.0, fat: 0.1, icon: '🥢', unit: 'ml' },
  { name: 'Cà rốt tươi', category: 'vegetable', kcal: 41.0, protein: 0.9, carbs: 10.0, fat: 0.2, icon: '🥕', unit: 'g' },
  { name: 'Nước cốt chanh tươi', category: 'fruit', kcal: 25.0, protein: 0.4, carbs: 8.0, fat: 0.1, icon: '🍋', unit: 'ml' },
  { name: 'Mật ong hoa rừng', category: 'carb', kcal: 304.0, protein: 0.3, carbs: 82.0, fat: 0.0, icon: '🍯', unit: 'ml' },
  { name: 'Trứng gà tươi', category: 'protein', kcal: 143.0, protein: 13.0, carbs: 0.7, fat: 9.5, icon: '🥚', unit: 'quả' },
  { name: 'Đậu cove tươi', category: 'vegetable', kcal: 31.0, protein: 1.8, carbs: 7.0, fat: 0.2, icon: '🫘', unit: 'g' },
  { name: 'Sả cây đập dập', category: 'condiment', kcal: 99.0, protein: 1.8, carbs: 25.0, fat: 0.5, icon: '🌿', unit: 'g' },
  { name: 'Đậu hũ chiên non', category: 'protein', kcal: 150.0, protein: 12.0, carbs: 3.0, fat: 10.0, icon: '🧈', unit: 'g' },
  { name: 'Ngò gai (Mùi tàu)', category: 'vegetable', kcal: 23.0, protein: 2.1, carbs: 4.2, fat: 0.5, icon: '🌿', unit: 'g' },
  { name: 'Bạch tuộc tươi', category: 'protein', kcal: 82.0, protein: 14.9, carbs: 2.2, fat: 1.0, icon: '🐙', unit: 'g' },
  { name: 'Rau muống non', category: 'vegetable', kcal: 19.0, protein: 2.6, carbs: 2.1, fat: 0.2, icon: '🥬', unit: 'g' },
  { name: 'Trứng cút tươi', category: 'protein', kcal: 158.0, protein: 13.0, carbs: 0.4, fat: 11.0, icon: '🥚', unit: 'quả' },
  { name: 'Bánh mì baguette giòn', category: 'carb', kcal: 265.0, protein: 9.0, carbs: 50.0, fat: 3.2, icon: '🥖', unit: 'g' },
  { name: 'Súp lơ trắng', category: 'vegetable', kcal: 25.0, protein: 1.9, carbs: 5.0, fat: 0.3, icon: '🥦', unit: 'g' },
  { name: 'Mì Ý nguyên cám Spaghetti', category: 'carb', kcal: 350.0, protein: 13.0, carbs: 71.0, fat: 1.5, icon: '🍝', unit: 'g' },
  { name: 'Giấm táo hữu cơ', category: 'condiment', kcal: 22.0, protein: 0.0, carbs: 0.9, fat: 0.0, icon: '🍏', unit: 'ml' },
  { name: 'Cơm trắng dẻo', category: 'carb', kcal: 130.0, protein: 2.7, carbs: 28.0, fat: 0.3, icon: '🍚', unit: 'g' },
  { name: 'Rau ngót tươi', category: 'vegetable', kcal: 35.0, protein: 5.3, carbs: 3.4, fat: 0.4, icon: '🌿', unit: 'g' },
  { name: 'Cánh gà tươi', category: 'protein', kcal: 203.0, protein: 20.0, carbs: 0.0, fat: 13.5, icon: '🍗', unit: 'g' },
  { name: 'Xoài cát chín', category: 'fruit', kcal: 60.0, protein: 0.8, carbs: 15.0, fat: 0.4, icon: '🥭', unit: 'g' },
  { name: 'Cá chép tươi', category: 'protein', kcal: 96.0, protein: 16.0, carbs: 0.0, fat: 3.6, icon: '🐟', unit: 'g' },
  { name: 'Sườn non heo nạc', category: 'protein', kcal: 210.0, protein: 18.0, carbs: 0.0, fat: 15.0, icon: '🥩', unit: 'g' },
  { name: 'Cá bống tươi', category: 'protein', kcal: 70.0, protein: 15.8, carbs: 0.0, fat: 0.8, icon: '🐟', unit: 'g' },
  { name: 'Ngó sen tươi', category: 'vegetable', kcal: 74.0, protein: 2.6, carbs: 17.0, fat: 0.1, icon: '🪷', unit: 'g' },
  { name: 'Hoa chuối thái mỏng', category: 'vegetable', kcal: 51.0, protein: 1.6, carbs: 10.0, fat: 0.6, icon: '🌺', unit: 'g' },
];

function determineTags(dish) {
  const tags = ['Tất cả'];
  if (dish.protein >= 25) tags.push('Tăng cơ');
  if (dish.kcal <= 450 && dish.fat <= 12) tags.push('Giảm mỡ');
  if (dish.kcal <= 400) tags.push('Ít calo');
  if (dish.cook_time_minutes <= 15) tags.push('Dưới 15 phút');

  const nameLower = dish.name.toLowerCase();
  const meatKeywords = ['bò', 'gà', 'heo', 'cá', 'tôm', 'mực', 'cua', 'bạch tuộc', 'sườn', 'lươn', 'vịt', 'thịt', 'trứng', 'hải sản', 'chả lụa'];
  const hasMeat = meatKeywords.some(kw => nameLower.includes(kw));
  if (nameLower.includes('chay') || !hasMeat) {
    tags.push('Ăn chay');
  }

  return tags;
}

function extractIcon(name) {
  const emojiMatch = name.match(/^[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u);
  return emojiMatch ? emojiMatch[0] : '🍲';
}

function parseIngredientsList(raw) {
  const items = [];
  const lines = raw.split('\n');
  for (const line of lines) {
    const trimmed = line.replace(/^[•\-\*]\s*/, '').trim();
    if (!trimmed) continue;
    const colonIdx = trimmed.indexOf(':');
    if (colonIdx === -1) continue;

    const name = trimmed.substring(0, colonIdx).trim();
    const rest = trimmed.substring(colonIdx + 1).trim();

    const match = rest.match(/^([\d\.]+)\s*([a-zA-ZÀ-ỹ%]+)?/);
    if (match) {
      const amount = parseFloat(match[1]);
      const unit = (match[2] || 'g').trim();
      items.push({ name, amount, unit });
    }
  }
  return items;
}

async function run() {
  console.log('--- BẮT ĐẦU NHẬP DỮ LIỆU MÓN ĂN & NGUYÊN LIỆU MỚI ---');

  // 1. Chèn nguyên liệu còn thiếu
  console.log('1. Đang bổ sung 33 nguyên liệu mới vào bảng ingredients...');
  for (const ing of missingIngredients) {
    await pool.query(`
      INSERT INTO ingredients (name, category, kcal_per_100g, protein_g, carbs_g, fat_g, icon, default_unit)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (name) DO UPDATE SET
        category = EXCLUDED.category,
        kcal_per_100g = EXCLUDED.kcal_per_100g,
        protein_g = EXCLUDED.protein_g,
        carbs_g = EXCLUDED.carbs_g,
        fat_g = EXCLUDED.fat_g,
        icon = EXCLUDED.icon,
        default_unit = EXCLUDED.default_unit
    `, [ing.name, ing.category, ing.kcal, ing.protein, ing.carbs, ing.fat, ing.icon, ing.unit]);
  }
  console.log('✓ Đã cập nhật xong bảng ingredients.');

  // 2. Tạo bản đồ tra cứu nguyên liệu (name -> id)
  const allIngRes = await pool.query('SELECT id, name, default_unit FROM ingredients');
  const ingMap = new Map();
  for (const row of allIngRes.rows) {
    ingMap.set(row.name.trim().toLowerCase(), row);
  }
  console.log(`✓ Tổng số nguyên liệu hiện có trong CSDL: ${allIngRes.rows.length}`);

  // 3. Đọc dữ liệu từ file JSON
  const jsonPath = 'c:/Users/Ning/Downloads/monan/dishes_data.json';
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  console.log(`✓ Đã đọc ${data.length} món ăn từ ${jsonPath}`);

  // 4. Kiểm tra món nào đã có trong DB
  const existingRecipesRes = await pool.query('SELECT id, title FROM recipes');
  const existingTitles = new Set(existingRecipesRes.rows.map(r => r.title.trim().toLowerCase()));
  console.log(`✓ Số món ăn hiện có trong CSDL trước khi nhập: ${existingTitles.size}`);

  let insertedRecipes = 0;
  let insertedIngredients = 0;
  let skippedRecipes = 0;

  const client = await pool.connect();

  try {
    console.log('2. Đang tiến hành thêm các món ăn mới vào CSDL...');
    
    // Xử lý theo từng batch 100 món để tối ưu tốc độ
    const BATCH_SIZE = 100;
    for (let i = 0; i < data.length; i += BATCH_SIZE) {
      const batch = data.slice(i, i + BATCH_SIZE);
      await client.query('BEGIN');

      for (const dish of batch) {
        const title = dish.name.trim();
        if (existingTitles.has(title.toLowerCase())) {
          skippedRecipes++;
          continue;
        }

        const icon = extractIcon(title);
        const cleanTitle = title.replace(/^[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\s]+/u, '').trim();
        const description = `Món ${cleanTitle} thơm ngon, chuẩn dinh dưỡng thể hình với ${dish.kcal} kcal và ${dish.protein}g đạm.`;
        const difficulty = dish.cook_time_minutes <= 20 ? 'Dễ' : (dish.cook_time_minutes <= 35 ? 'Trung bình' : 'Nâng cao');
        const tags = determineTags(dish);
        const instructions = dish.steps.trim();

        const recipeRes = await client.query(`
          INSERT INTO recipes (
            title, icon, description, kcal, protein_g, carbs_g, fat_g,
            cooking_time_min, servings, difficulty, tags, instructions
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
          ON CONFLICT (title) DO NOTHING
          RETURNING id
        `, [
          title, icon, description, dish.kcal, dish.protein, dish.carbs, dish.fat,
          dish.cook_time_minutes, 1, difficulty, tags, instructions
        ]);

        if (recipeRes.rows.length === 0) {
          skippedRecipes++;
          continue;
        }

        const recipeId = recipeRes.rows[0].id;
        existingTitles.add(title.toLowerCase());
        insertedRecipes++;

        // Parse và chèn nguyên liệu của món
        const parsedIngs = parseIngredientsList(dish.ingredients);
        for (const ingItem of parsedIngs) {
          const matched = ingMap.get(ingItem.name.trim().toLowerCase());
          const ingredientId = matched ? matched.id : null;

          await client.query(`
            INSERT INTO recipe_ingredients (
              recipe_id, ingredient_id, ingredient_name, amount, unit
            ) VALUES ($1, $2, $3, $4, $5)
          `, [
            recipeId,
            ingredientId,
            ingItem.name.trim(),
            ingItem.amount,
            ingItem.unit
          ]);
          insertedIngredients++;
        }
      }

      await client.query('COMMIT');
      const progress = Math.min(i + BATCH_SIZE, data.length);
      process.stdout.write(`\rĐã xử lý: ${progress}/${data.length} món (Đã thêm: ${insertedRecipes})`);
    }

    console.log('\n\n--- KẾT QUẢ NHẬP DỮ LIỆU ---');
    console.log(`- Món ăn mới được thêm thành công: ${insertedRecipes}`);
    console.log(`- Liên kết nguyên liệu (recipe_ingredients) được tạo: ${insertedIngredients}`);
    console.log(`- Món ăn đã tồn tại (bỏ qua): ${skippedRecipes}`);

    const totalCountRes = await pool.query('SELECT count(*) FROM recipes');
    console.log(`=> TỔNG SỐ MÓN ĂN HIỆN CÓ TRONG CSDL: ${totalCountRes.rows[0].count}`);

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Lỗi trong quá trình nhập:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

run().catch(console.error);
