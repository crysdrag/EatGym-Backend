import { Router } from 'express';
import { pool } from '../db/pool.js';

const router = Router();

// -------------------------------------------------------------
// GET /api/ingredients - Lấy toàn bộ danh sách nguyên liệu
// -------------------------------------------------------------
router.get('/ingredients', async (req, res, next) => {
  try {
    const { category, q } = req.query;
    let query = `
      SELECT id, name, category, kcal_per_100g, protein_g, carbs_g, fat_g, icon, default_unit
      FROM ingredients
      WHERE 1=1
    `;
    const params = [];

    if (category && typeof category === 'string' && category.trim()) {
      params.push(category.trim());
      query += ` AND category = $${params.length}`;
    }

    if (q && typeof q === 'string' && q.trim()) {
      params.push(`%${q.trim()}%`);
      query += ` AND name ILIKE $${params.length}`;
    }

    query += ' ORDER BY category, name ASC';

    const result = await pool.query(query, params);
    res.json({
      ingredients: result.rows.map((row) => ({
        id: row.id,
        name: row.name,
        category: row.category,
        kcalPer100g: Number(row.kcal_per_100g),
        protein: Number(row.protein_g),
        carbs: Number(row.carbs_g),
        fat: Number(row.fat_g),
        icon: row.icon || '🥗',
        unit: row.default_unit || 'g'
      }))
    });
  } catch (error) {
    next(error);
  }
});

// -------------------------------------------------------------
// GET /api/recipes - Tìm kiếm và lọc công thức món ăn
// -------------------------------------------------------------
router.get('/recipes', async (req, res, next) => {
  try {
    const search = typeof req.query.q === 'string' ? req.query.q.trim() : '';
    const tag = typeof req.query.tag === 'string' ? req.query.tag.trim() : '';

    let query = `
      SELECT r.id, r.title, r.icon, r.description, r.kcal, r.protein_g, r.carbs_g, r.fat_g,
             r.cooking_time_min, r.servings, r.difficulty, r.tags, r.instructions,
             COALESCE(
               json_agg(
                 json_build_object(
                   'name', ri.ingredient_name,
                   'amount', ri.amount,
                   'unit', ri.unit,
                   'notes', ri.notes
                 )
               ) FILTER (WHERE ri.id IS NOT NULL), '[]'
             ) AS ingredients
      FROM recipes r
      LEFT JOIN recipe_ingredients ri ON r.id = ri.recipe_id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      params.push(`%${search}%`);
      query += ` AND (r.title ILIKE $${params.length} OR ri.ingredient_name ILIKE $${params.length})`;
    }

    if (tag && tag !== 'Tất cả') {
      params.push(tag);
      query += ` AND $${params.length} = ANY(r.tags)`;
    }

    query += `
      GROUP BY r.id
      ORDER BY r.title ASC
    `;

    const result = await pool.query(query, params);
    res.json({
      recipes: result.rows.map((row) => ({
        id: row.id,
        title: row.title,
        icon: row.icon || '🍲',
        description: row.description,
        kcal: Number(row.kcal),
        protein: Number(row.protein_g),
        carbs: Number(row.carbs_g),
        fat: Number(row.fat_g),
        time: row.cooking_time_min,
        servings: row.servings,
        difficulty: row.difficulty,
        tags: row.tags || [],
        instructions: row.instructions,
        ingredients: row.ingredients
      }))
    });
  } catch (error) {
    next(error);
  }
});

// -------------------------------------------------------------
// POST /api/recipes/suggest - Đề xuất món theo nguyên liệu sẵn có
// -------------------------------------------------------------
router.post('/recipes/suggest', async (req, res, next) => {
  try {
    const { ingredients = [], maxTime } = req.body;
    const maxCookingTime = maxTime !== undefined ? Number(maxTime) : (req.query.maxTime ? Number(req.query.maxTime) : null);

    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      // Nếu không truyền nguyên liệu, trả về top món tăng cơ (ưu tiên <= maxCookingTime nếu có)
      let defaultSql = `
        SELECT id, title, icon, description, kcal, protein_g, carbs_g, fat_g, cooking_time_min, tags, instructions
        FROM recipes
        WHERE 1=1
      `;
      const defaultParams = [];
      if (maxCookingTime && Number.isFinite(maxCookingTime)) {
        defaultParams.push(maxCookingTime);
        defaultSql += ` AND cooking_time_min <= $${defaultParams.length}`;
      }
      defaultSql += ` ORDER BY protein_g DESC LIMIT 6`;

      const defaultRes = await pool.query(defaultSql, defaultParams);
      return res.json({
        recipes: defaultRes.rows.map((r) => ({
          id: r.id,
          title: r.title,
          icon: r.icon || '🍲',
          description: r.description,
          kcal: Number(r.kcal),
          protein: Number(r.protein_g),
          carbs: Number(r.carbs_g),
          fat: Number(r.fat_g),
          time: r.cooking_time_min,
          tags: r.tags || [],
          instructions: r.instructions,
          matchingCount: 0
        }))
      });
    }

    const patterns = ingredients.map((name) => `%${name.trim()}%`);
    const params = [patterns];
    let timeCondition = '';
    if (maxCookingTime && Number.isFinite(maxCookingTime)) {
      params.push(maxCookingTime);
      timeCondition = ` AND r.cooking_time_min <= $${params.length}`;
    }

    const result = await pool.query(
      `
      SELECT r.id, r.title, r.icon, r.description, r.kcal, r.protein_g, r.carbs_g, r.fat_g,
             r.cooking_time_min, r.tags, r.instructions,
             COUNT(ri.id) AS matching_count,
             ARRAY_AGG(ri.ingredient_name) AS matched_ingredients
      FROM recipes r
      JOIN recipe_ingredients ri ON r.id = ri.recipe_id
      WHERE (ri.ingredient_name ILIKE ANY($1::text[]) OR r.title ILIKE ANY($1::text[]))
            ${timeCondition}
      GROUP BY r.id
      ORDER BY matching_count DESC, r.cooking_time_min ASC, r.kcal ASC
      LIMIT 12
      `,
      params
    );

    if (result.rows.length === 0) {
      return res.json({ recipes: [] });
    }

    res.json({
      recipes: result.rows.map((row) => ({
        id: row.id,
        title: row.title,
        icon: row.icon || '🍲',
        description: row.description,
        kcal: Number(row.kcal),
        protein: Number(row.protein_g),
        carbs: Number(row.carbs_g),
        fat: Number(row.fat_g),
        time: row.cooking_time_min,
        tags: row.tags || [],
        instructions: row.instructions,
        matchingCount: Number(row.matching_count),
        matchedIngredients: row.matched_ingredients
      }))
    });
  } catch (error) {
    next(error);
  }
});

export default router;
