import { query } from '../config/db.js';

const migration = `
  -- Real Match History System
  CREATE TABLE IF NOT EXISTS public.match_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    placement INTEGER NOT NULL CHECK (placement >= 1 AND placement <= 8),
    champions JSONB DEFAULT '[]',
    lp_change INTEGER DEFAULT 0,
    duration INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_match_history_user_id ON public.match_history(user_id);
`;

async function run() {
  try {
    await query(migration);
    console.log('✅ Migração match_history concluída com sucesso!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Erro na migração:', err);
    process.exit(1);
  }
}

run();
