import { query } from '../config/db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function init() {
  console.log('⏳ Iniciando configuração das tabelas de autenticação...');
  
  const sql = `
    CREATE TABLE IF NOT EXISTS public.users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      nickname TEXT UNIQUE NOT NULL,
      rank TEXT DEFAULT 'Mortal',
      mmr INTEGER DEFAULT 1000,
      avatar TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      last_login TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
    CREATE INDEX IF NOT EXISTS idx_users_nickname ON public.users(nickname);
  `;

  try {
    await query(sql);
    console.log('✅ Tabelas criadas/verificadas com sucesso!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Erro ao configurar o banco de dados:', err);
    process.exit(1);
  }
}

init();
