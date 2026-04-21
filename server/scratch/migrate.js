import pool from '../src/config/db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..', '..');

const migrations = [
  'supabase/migrations/20260421000012_titles_system.sql',
  'supabase/migrations/20260421000013_clans_system.sql'
];

async function runMigrations() {
  console.log('🚀 Iniciando sincronização do banco de dados...');
  
  for (const m of migrations) {
    const filePath = path.join(rootDir, m);
    console.log(`📖 Lendo: ${m}`);
    const sql = fs.readFileSync(filePath, 'utf8');
    
    try {
      await pool.query(sql);
      console.log(`✅ Sucesso: ${m}`);
    } catch (err) {
      console.error(`❌ Erro em ${m}:`, err.message);
    }
  }
  
  console.log('🏁 Sincronização concluída.');
  process.exit(0);
}

runMigrations();
