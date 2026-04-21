-- 1. Create clans table
CREATE TABLE IF NOT EXISTS public.clans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  tag VARCHAR(4) UNIQUE NOT NULL,
  description TEXT,
  motto TEXT,
  leader_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  max_members INTEGER DEFAULT 20,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  icon_url TEXT
);

-- 2. Create clan_members table (Junction)
CREATE TABLE IF NOT EXISTS public.clan_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clan_id UUID REFERENCES public.clans(id) ON DELETE CASCADE,
  user_id UUID UNIQUE REFERENCES public.users(id) ON DELETE CASCADE, -- One user can only be in one clan
  role TEXT DEFAULT 'MEMBRO' CHECK (role IN ('LIDER', 'OFICIAL', 'MEMBRO')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Add index for performance
CREATE INDEX IF NOT EXISTS idx_clans_tag ON public.clans(tag);
CREATE INDEX IF NOT EXISTS idx_clan_members_user_id ON public.clan_members(user_id);
