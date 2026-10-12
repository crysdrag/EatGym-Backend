const { pool } = require('./src/db/pool.js');

// Recipe generation templates by ingredient classification
function createRecipesForIngredient(ing, currentCount) {
  const needed = 3 - currentCount;
  if (needed <= 0) return [];

  const name = ing.name;
  const cat = ing.category || 'other';
  const kcal100 = Number(ing.kcal_per_100g) || 120;
  const pro100 = Number(ing.protein_g) || 10;
  const carb100 = Number(ing.carbs_g) || 10;
  const fat100 = Number(ing.fat_g) || 2;
  const icon = ing.icon || '🍲';

  const recipes = [];

  // Helper to determine fitness tags
  function getTags(title, kcal, protein, time, isVegan) {
    const tags = ['Tất cả'];
    if (protein >= 20) tags.push('Tăng cơ');
    if (fat100 <= 10 && kcal <= 450) tags.push('Giảm mỡ');
    if (kcal <= 360) tags.push('Ít calo');
    if (isVegan) tags.push('Ăn chay');
    if (time <= 15) tags.push('Dưới 15 phút');
    return tags;
  }

  // 1. CARB / BAKERY / NOODLE / SWEET
  if (cat === 'carb' || name.toLowerCase().includes('bánh') || name.toLowerCase().includes('khoai') || name.toLowerCase().includes('bún') || name.toLowerCase().includes('phở') || name.toLowerCase().includes('mì')) {
    recipes.push({
      title: `${icon} ${name} hấp nóng ăn kèm ức gà & xà lách`,
      desc: `Bữa ăn cân bằng năng lượng với ${name.toLowerCase()} bổ sung tinh bột sạch và ức gà giàu đạm.`,
      kcal: Math.round(kcal100 + 160),
      protein: Math.round(pro100 + 26),
      carbs: Math.round(carb100 + 5),
      fat: Math.round(fat100 + 3),
      time: 12,
      instructions: `1. Làm nóng hoặc sơ chế ${name.toLowerCase()} trong 5 phút. 2. Áp chảo nhẹ 120g ức gà với chút tiêu và muối hồng trong 5 phút. 3. Bày ra đĩa cùng xà lách tươi và thưởng thức.`,
      tags: getTags(name, kcal100 + 160, pro100 + 26, 12, false),
      ingredients: [
        { name: name, amount: 100, unit: 'g' },
        { name: 'Ức gà phi lê', amount: 120, unit: 'g' },
        { name: 'Rau xà lách', amount: 50, unit: 'g' }
      ]
    });

    recipes.push({
      title: `${icon} ${name} xào rau củ sốt tiêu đen Eat Clean`,
      desc: `Món ăn lành mạnh ít calo, kết hợp ${name.toLowerCase()} cùng các loại rau củ giòn ngọt.`,
      kcal: Math.round(kcal100 + 90),
      protein: Math.round(pro100 + 6),
      carbs: Math.round(carb100 + 15),
      fat: Math.round(fat100 + 2),
      time: 15,
      instructions: `1. Cắt nhỏ ${name.toLowerCase()} và các loại rau củ. 2. Phi thơm tỏi với 1 thìa dầu ô liu, đảo đều rau củ trong 6 phút. 3. Cho ${name.toLowerCase()} vào đảo nhẹ tay 4 phút, nêm tiêu đen và dọn ra đĩa.`,
      tags: getTags(name, kcal100 + 90, pro100 + 6, 15, true),
      ingredients: [
        { name: name, amount: 100, unit: 'g' },
        { name: 'Ớt chuông đỏ', amount: 60, unit: 'g' },
        { name: 'Hành tây', amount: 40, unit: 'g' }
      ]
    });

    recipes.push({
      title: `${icon} Bữa phụ phục hồi: ${name} kèm sữa hạt ít đường`,
      desc: `Bữa phụ tiện lợi nạp nhanh năng lượng trước hoặc sau buổi tập thể thao.`,
      kcal: Math.round(kcal100 + 70),
      protein: Math.round(pro100 + 5),
      carbs: Math.round(carb100 + 8),
      fat: Math.round(fat100 + 2),
      time: 5,
      instructions: `1. Chuẩn bị ${name.toLowerCase()} sạch sẽ, làm ấm nhẹ trong lò vi sóng hoặc nồi hấp 3 phút. 2. Rót 180ml sữa hạt không đường ra ly. 3. Dùng kèm trực tiếp để bổ sung năng lượng tức thì.`,
      tags: getTags(name, kcal100 + 70, pro100 + 5, 5, true),
      ingredients: [
        { name: name, amount: 100, unit: 'g' },
        { name: 'Sữa hạt dinh dưỡng', amount: 180, unit: 'ml' }
      ]
    });
  }
  // 2. PROTEIN / SEAFOOD / MEAT / POULTRY
  else if (cat === 'protein' || pro100 >= 12 || name.toLowerCase().includes('thịt') || name.toLowerCase().includes('bò') || name.toLowerCase().includes('cá') || name.toLowerCase().includes('tôm') || name.toLowerCase().includes('mực') || name.toLowerCase().includes('bạch tuộc') || name.toLowerCase().includes('heo')) {
    recipes.push({
      title: `${icon} ${name} áp chảo tỏi ớt & bông cải xanh`,
      desc: `Món tăng cơ kinh điển với ${name.toLowerCase()} giàu đạm sinh học hấp thụ nhanh.`,
      kcal: Math.round(kcal100 * 1.5 + 40),
      protein: Math.round(pro100 * 1.5 + 4),
      carbs: Math.round(carb100 + 6),
      fat: Math.round(fat100 * 1.5 + 3),
      time: 15,
      instructions: `1. Sơ chế ${name.toLowerCase()} ướp muối tiêu 5 phút. 2. Áp chảo vàng đều hai mặt với tỏi băm trong 6 phút. 3. Luộc nhanh bông cải xanh 3 phút, xếp đĩa và thưởng thức.`,
      tags: getTags(name, kcal100 * 1.5 + 40, pro100 * 1.5 + 4, 15, false),
      ingredients: [
        { name: name, amount: 150, unit: 'g' },
        { name: 'Bông cải xanh (Súp lơ)', amount: 100, unit: 'g' },
        { name: 'Tỏi băm', amount: 10, unit: 'g' }
      ]
    });

    recipes.push({
      title: `${icon} ${name} hấp sả gừng thanh nhiệt Eat Clean`,
      desc: `Phương pháp chế biến giữ trọn vị ngọt tự nhiên và vi chất của ${name.toLowerCase()}.`,
      kcal: Math.round(kcal100 * 1.3),
      protein: Math.round(pro100 * 1.3),
      carbs: Math.round(carb100 + 2),
      fat: Math.round(fat100 * 1.3),
      time: 12,
      instructions: `1. Rửa sạch ${name.toLowerCase()}, đập dập sả và thái lát gừng tươi. 2. Xếp vào xửng hấp cách thủy cùng gừng sả trong 8 phút. 3. Chấm kèm sốt muối tiêu chanh hoặc nước tương gừng.`,
      tags: getTags(name, kcal100 * 1.3, pro100 * 1.3, 12, false),
      ingredients: [
        { name: name, amount: 150, unit: 'g' },
        { name: 'Sả tươi', amount: 20, unit: 'g' },
        { name: 'Gừng tươi', amount: 10, unit: 'g' }
      ]
    });

    recipes.push({
      title: `${icon} Salad ${name.toLowerCase()} trộn sốt giấm táo dầu ô liu`,
      desc: `Món salad tươi mát giàu protein giúp siết mỡ hiệu quả cho gymer.`,
      kcal: Math.round(kcal100 * 1.2 + 80),
      protein: Math.round(pro100 * 1.2 + 2),
      carbs: Math.round(carb100 + 8),
      fat: Math.round(fat100 * 1.2 + 5),
      time: 10,
      instructions: `1. Luộc hoặc áp chảo chín ${name.toLowerCase()}, để nguội bớt. 2. Rửa sạch xà lách, dưa chuột và cà chua bi cắt đôi. 3. Trộn đều cùng 1 thìa dầu ô liu và giấm táo, rắc chút tiêu xay.`,
      tags: getTags(name, kcal100 * 1.2 + 80, pro100 * 1.2 + 2, 10, false),
      ingredients: [
        { name: name, amount: 120, unit: 'g' },
        { name: 'Rau xà lách', amount: 80, unit: 'g' },
        { name: 'Cà chua bi', amount: 40, unit: 'g' },
        { name: 'Dầu ô liu nguyên chất', amount: 5, unit: 'ml' }
      ]
    });
  }
  // 3. VEGETABLE / FRUIT / MUSHROOM / VEGAN
  else if (cat === 'veg' || cat === 'fruit' || cat === 'vitamin' || name.toLowerCase().includes('rau') || name.toLowerCase().includes('nấm') || name.toLowerCase().includes('cà') || name.toLowerCase().includes('quả') || name.toLowerCase().includes('trái')) {
    recipes.push({
      title: `${icon} ${name} xào tỏi dầu ô liu thanh đạm`,
      desc: `Món ăn bổ sung dồi dào chất xơ, vitamin và khoáng chất chống oxy hóa từ ${name.toLowerCase()}.`,
      kcal: Math.round(kcal100 + 50),
      protein: Math.round(pro100 + 2),
      carbs: Math.round(carb100 + 4),
      fat: Math.round(fat100 + 4),
      time: 10,
      instructions: `1. Rửa sạch ${name.toLowerCase()}, để ráo nước. 2. Phi thơm tỏi cùng một lượng nhỏ dầu ô liu trong 2 phút. 3. Cho ${name.toLowerCase()} vào xào lửa lớn trong 5 phút, nêm chút hạt nêm nấm.`,
      tags: getTags(name, kcal100 + 50, pro100 + 2, 10, true),
      ingredients: [
        { name: name, amount: 150, unit: 'g' },
        { name: 'Tỏi băm', amount: 10, unit: 'g' },
        { name: 'Dầu ô liu nguyên chất', amount: 5, unit: 'ml' }
      ]
    });

    recipes.push({
      title: `${icon} Canh súp ${name.toLowerCase()} đậu hũ non hạt sen`,
      desc: `Món canh thanh mát hỗ trợ tiêu hóa và phục hồi cơ bắp lành mạnh.`,
      kcal: Math.round(kcal100 + 110),
      protein: Math.round(pro100 + 12),
      carbs: Math.round(carb100 + 10),
      fat: Math.round(fat100 + 4),
      time: 15,
      instructions: `1. Đun sôi 500ml nước dùng rau củ quả. 2. Thả đậu hũ non cắt quân cờ và ${name.toLowerCase()} vào nấu sôi 6 phút. 3. Nêm chút muối hồng và hành ngò, tắt bếp thưởng thức nóng.`,
      tags: getTags(name, kcal100 + 110, pro100 + 12, 15, true),
      ingredients: [
        { name: name, amount: 100, unit: 'g' },
        { name: 'Đậu phụ (Đậu hũ)', amount: 100, unit: 'g' },
        { name: 'Hành hoa (Hành lá)', amount: 10, unit: 'g' }
      ]
    });

    recipes.push({
      title: `${icon} Salad tươi ${name.toLowerCase()} ức gà xé sốt mè rang`,
      desc: `Sự kết hợp hoàn hảo giữa chất xơ tự nhiên từ ${name.toLowerCase()} và đạm từ ức gà.`,
      kcal: Math.round(kcal100 + 180),
      protein: Math.round(pro100 + 25),
      carbs: Math.round(carb100 + 6),
      fat: Math.round(fat100 + 5),
      time: 12,
      instructions: `1. Sơ chế sạch ${name.toLowerCase()} thái miếng vừa ăn. 2. Luộc chín 100g ức gà, xé sợi nhỏ. 3. Trộn đều tất cả với 1 thìa sốt mè rang ít ngọt.`,
      tags: getTags(name, kcal100 + 180, pro100 + 25, 12, false),
      ingredients: [
        { name: name, amount: 120, unit: 'g' },
        { name: 'Ức gà phi lê', amount: 100, unit: 'g' },
        { name: 'Sốt mè rang', amount: 15, unit: 'g' }
      ]
    });
  }
  // 4. FAT / NUTS / SEEDS / OILS / CONDIMENTS / OTHER
  else {
    recipes.push({
      title: `${icon} Salad ức gà trộn sốt ${name.toLowerCase()} dinh dưỡng`,
      desc: `Bổ sung chất béo tốt và dưỡng chất từ ${name.toLowerCase()} vào thực đơn thể hình.`,
      kcal: Math.round(kcal100 * 0.4 + 190),
      protein: Math.round(pro100 * 0.4 + 28),
      carbs: Math.round(carb100 * 0.4 + 6),
      fat: Math.round(fat100 * 0.4 + 5),
      time: 12,
      instructions: `1. Áp chảo chín vàng 120g ức gà, thái lát. 2. Rửa sạch các loại rau xà lách và cà chua bi. 3. Kết hợp ${name.toLowerCase()} làm sốt dressing thơm ngon trộn đều cùng món salad.`,
      tags: getTags(name, kcal100 * 0.4 + 190, pro100 * 0.4 + 28, 12, false),
      ingredients: [
        { name: name, amount: 30, unit: 'g' },
        { name: 'Ức gà phi lê', amount: 120, unit: 'g' },
        { name: 'Rau xà lách', amount: 80, unit: 'g' }
      ]
    });

    recipes.push({
      title: `${icon} Bánh mì đen kẹp trứng ốp & ${name.toLowerCase()}`,
      desc: `Bữa sáng nhanh gọn tràn đầy sinh lực cho ngày tập luyện hiệu quả.`,
      kcal: Math.round(kcal100 * 0.3 + 220),
      protein: Math.round(pro100 * 0.3 + 15),
      carbs: Math.round(carb100 * 0.3 + 26),
      fat: Math.round(fat100 * 0.3 + 8),
      time: 10,
      instructions: `1. Áp chảo 1 lát bánh mì nguyên cám giòn thơm. 2. Ốp la 1 quả trứng gà lòng đào. 3. Kẹp trứng và ${name.toLowerCase()} vào giữa lát bánh mì, rắc chút tiêu đen.`,
      tags: getTags(name, kcal100 * 0.3 + 220, pro100 * 0.3 + 15, 10, false),
      ingredients: [
        { name: name, amount: 25, unit: 'g' },
        { name: 'Bánh mì đen nguyên cám', amount: 60, unit: 'g' },
        { name: 'Trứng gà', amount: 50, unit: 'g' }
      ]
    });

    recipes.push({
      title: `${icon} Yến mạch ngâm qua đêm (Overnight Oats) cùng ${name.toLowerCase()}`,
      desc: `Món ăn lành mạnh cung cấp năng lượng bền bỉ cả ngày.`,
      kcal: Math.round(kcal100 * 0.3 + 210),
      protein: Math.round(pro100 * 0.3 + 12),
      carbs: Math.round(carb100 * 0.3 + 32),
      fat: Math.round(fat100 * 0.3 + 6),
      time: 5,
      instructions: `1. Cho 40g yến mạch vào lọ thủy tinh. 2. Rót 120ml sữa hạt không đường và thêm ${name.toLowerCase()}. 3. Khuấy đều và để trong ngăn mát tủ lạnh ít nhất 2 giờ trước khi dùng.`,
      tags: getTags(name, kcal100 * 0.3 + 210, pro100 * 0.3 + 12, 5, true),
      ingredients: [
        { name: name, amount: 25, unit: 'g' },
        { name: 'Yến mạch cán dẹt', amount: 40, unit: 'g' },
        { name: 'Sữa tươi không đường', amount: 120, unit: 'ml' }
      ]
    });
  }

  // Return only the number of recipes needed (minimum 3 total for the ingredient)
  return recipes.slice(0, Math.max(needed, 3));
}

async function main() {
  const ingRes = await pool.query('SELECT id, name, category, kcal_per_100g, protein_g, carbs_g, fat_g, icon FROM ingredients ORDER BY name');
  console.log(`Checking ${ingRes.rows.length} ingredients...`);

  let addedRecipesCount = 0;
  let addedLinksCount = 0;

  for (const ing of ingRes.rows) {
    const matched = await pool.query(
      'SELECT DISTINCT r.id FROM recipes r JOIN recipe_ingredients ri ON r.id = ri.recipe_id WHERE ri.ingredient_name ILIKE $1 OR r.title ILIKE $1',
      ['%' + ing.name + '%']
    );

    const currentCount = matched.rows.length;
    if (currentCount < 3) {
      const generated = createRecipesForIngredient(ing, currentCount);

      for (const rec of generated) {
        // Insert recipe
        const insertRec = await pool.query(
          `
          INSERT INTO recipes (title, description, kcal, protein_g, carbs_g, fat_g, cooking_time_min, servings, difficulty, tags, instructions, icon)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
          RETURNING id
          `,
          [
            rec.title,
            rec.desc,
            rec.kcal,
            rec.protein,
            rec.carbs,
            rec.fat,
            rec.time,
            1,
            'Dễ',
            rec.tags,
            rec.instructions,
            ing.icon || '🍲'
          ]
        );
        const recipeId = insertRec.rows[0].id;
        addedRecipesCount++;

        // Insert ingredients
        for (const item of rec.ingredients) {
          await pool.query(
            `
            INSERT INTO recipe_ingredients (recipe_id, ingredient_name, amount, unit)
            VALUES ($1, $2, $3, $4)
            `,
            [recipeId, item.name, item.amount, item.unit]
          );
          addedLinksCount++;
        }
      }
    }
  }

  console.log(`\n=== ENRICHMENT SUMMARY ===`);
  console.log(`Added ${addedRecipesCount} new recipes!`);
  console.log(`Added ${addedLinksCount} ingredient links!`);

  // Verification step
  let failCount = 0;
  for (const ing of ingRes.rows) {
    const check = await pool.query(
      'SELECT DISTINCT r.id FROM recipes r JOIN recipe_ingredients ri ON r.id = ri.recipe_id WHERE ri.ingredient_name ILIKE $1 OR r.title ILIKE $1',
      ['%' + ing.name + '%']
    );
    if (check.rows.length < 3) {
      console.log(`FAIL: Ingredient "${ing.name}" still has only ${check.rows.length} recipes!`);
      failCount++;
    }
  }

  if (failCount === 0) {
    console.log(`\nSUCCESS! 100% of all ${ingRes.rows.length} ingredients now have AT LEAST 3 proposed recipes!`);
  } else {
    console.log(`\nWarning: ${failCount} ingredients still need attention.`);
  }

  await pool.end();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
