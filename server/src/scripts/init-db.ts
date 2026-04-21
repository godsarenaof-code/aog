import { query } from '../config/db.js';

async function init() {
  console.log('⏳ Iniciando configuração completa do banco A.O.G...');
  
  const sql = `
    -- 1. Usuários e Autenticação
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

    -- 2. Skins e Catálogo
    CREATE TABLE IF NOT EXISTS public.skins (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      champion_id UUID REFERENCES public.champions(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      rarity TEXT NOT NULL CHECK (rarity IN ('Comum', 'Raro', 'Épico', 'Divino')),
      damage_bonus INTEGER DEFAULT 0,
      image_url TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- 3. Saldos e Inventário
    CREATE TABLE IF NOT EXISTS public.user_balances (
      user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
      gold INTEGER DEFAULT 1500,
      essence INTEGER DEFAULT 0,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS public.user_skins (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
      skin_id UUID REFERENCES public.skins(id) ON DELETE CASCADE,
      count INTEGER DEFAULT 1,
      is_equipped BOOLEAN DEFAULT false,
      acquired_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, skin_id)
    );

    -- 4. Triggers
    CREATE OR REPLACE FUNCTION public.handle_new_user_setup()
    RETURNS TRIGGER AS $$
    BEGIN
      INSERT INTO public.user_balances (user_id, gold, essence)
      VALUES (new.id, 1500, 0)
      ON CONFLICT (user_id) DO NOTHING;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;

    DROP TRIGGER IF EXISTS on_user_created_setup ON public.users;
    CREATE TRIGGER on_user_created_setup
      AFTER INSERT ON public.users
      FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user_setup();

    -- 5. Seeding Skins (Exemplos)
    INSERT INTO public.skins (champion_id, name, rarity, damage_bonus)
    SELECT id, 'Kael do Vazio', 'Raro', 10 FROM public.champions WHERE name ILIKE '%Kael%' LIMIT 1
    ON CONFLICT DO NOTHING;

    INSERT INTO public.skins (champion_id, name, rarity, damage_bonus)
    SELECT id, 'Kael Soberano', 'Épico', 18 FROM public.champions WHERE name ILIKE '%Kael%' LIMIT 1
    ON CONFLICT DO NOTHING;

    INSERT INTO public.skins (champion_id, name, rarity, damage_bonus)
    SELECT id, 'M1-RA Estelar', 'Divino', 30 FROM public.champions WHERE name ILIKE '%M1-RA%' OR name ILIKE '%MIRA%' LIMIT 1
    ON CONFLICT DO NOTHING;
  `;

  try {
    await query(sql);
    console.log('✅ Banco de dados A.O.G totalmente configurado e povoado!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Erro na configuração do banco:', err);
    process.exit(1);
  }
}

init();
