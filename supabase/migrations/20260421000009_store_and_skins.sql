-- System for Store, Skins and Rerolling

-- 1. Table for Skin catalog
CREATE TABLE IF NOT EXISTS public.skins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  champion_id UUID REFERENCES public.champions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  rarity TEXT NOT NULL CHECK (rarity IN ('Comum', 'Raro', 'Épico', 'Divino')),
  damage_bonus INTEGER DEFAULT 0, -- Percentage bonus (e.g. 5 = 5%)
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Table for User Balances (Dual Currency)
CREATE TABLE IF NOT EXISTS public.user_balances (
  user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  gold INTEGER DEFAULT 1000 CHECK (gold >= 0),
  essence INTEGER DEFAULT 0 CHECK (essence >= 0),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Table for User Skins (Inventory)
CREATE TABLE IF NOT EXISTS public.user_skins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  skin_id UUID REFERENCES public.skins(id) ON DELETE CASCADE,
  count INTEGER DEFAULT 1,
  is_equipped BOOLEAN DEFAULT false,
  acquired_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, skin_id)
);

-- 4. Trigger to automatically create balance for new users
CREATE OR REPLACE FUNCTION public.handle_new_user_balance()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_balances (user_id, gold, essence)
  VALUES (new.id, 1000, 0);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_user_created_initial_balance
  AFTER INSERT ON public.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user_balance();

-- 5. Seed some initial skins (Dummy Data)
-- Note: These IDs will be updated if needed, but for now we define the structure.
