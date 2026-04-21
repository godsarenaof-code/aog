-- 1. Create titles catalog table
CREATE TABLE IF NOT EXISTS public.titles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  category TEXT DEFAULT 'Geral', -- 'Rank', 'Especial', 'Combat'
  color TEXT DEFAULT 'white',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create user_titles junction table
CREATE TABLE IF NOT EXISTS public.user_titles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title_id UUID REFERENCES public.titles(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, title_id)
);

-- 3. Add selected_title_id to users
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS selected_title_id UUID REFERENCES public.titles(id) ON DELETE SET NULL;

-- 4. Seed initial titles
INSERT INTO public.titles (name, category, color) VALUES 
('Fundador', 'Especial', '#00cfba'),
('O Imortal', 'Rank', '#f97316'),
('Protocolo Alpha', 'Especial', '#8b5cf6'),
('Mestre de Armas', 'Combat', '#ef4444'),
('Invocador Arcano', 'Combat', '#3b82f6')
ON CONFLICT (name) DO NOTHING;
