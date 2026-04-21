import { query } from '../config/db.js';

async function checkData() {
  try {
    const champs = await query('SELECT count(*) FROM champions');
    const traits = await query('SELECT count(*) FROM traits');
    console.log('--- DB DATA STATUS ---');
    console.log('Champions:', champs.rows[0].count);
    console.log('Traits:', traits.rows[0].count);
    
    if (parseInt(champs.rows[0].count) > 0) {
      const sample = await query('SELECT id, name, tier FROM champions LIMIT 5');
      console.log('Sample Champions:', sample.rows);
    }
  } catch (err) {
    console.error('Error checking data:', err);
  }
  process.exit(0);
}

checkData();
