require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function compare() {
  const currentRes = await pool.query('SELECT name FROM ingredients');
  const currentNames = new Set(currentRes.rows.map(r => r.name.toLowerCase().trim()));

  const csvItems = JSON.parse(fs.readFileSync('C:/Users/Ning/.gemini/antigravity/brain/0225a86f-5c80-435d-9c6b-8b842c028fa9/scratch/csv_items.json', 'utf8'));

  let dupCount = 0;
  let newCount = 0;
  const newItems = [];

  for (const item of csvItems) {
    const norm = item.name.toLowerCase().trim();
    if (currentNames.has(norm)) {
      dupCount++;
    } else {
      newCount++;
      newItems.push(item);
    }
  }

  console.log(`Current in DB: ${currentNames.size}`);
  console.log(`In CSV: ${csvItems.length}`);
  console.log(`Duplicates to skip: ${dupCount}`);
  console.log(`New to add: ${newCount}`);
  console.log('Sample new items:', newItems.slice(0, 15).map(i => i.name));

  await pool.end();
}

compare().catch(console.error);
