-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CHAMPIONS TABLE
CREATE TABLE IF NOT EXISTS champions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL, -- e.g., 'kael', 'm1ra'
  name TEXT NOT NULL,
  tier INTEGER CHECK (tier BETWEEN 1 AND 5),
  origins TEXT[] DEFAULT '{}',
  classes TEXT[] DEFAULT '{}',
  ability JSONB NOT NULL DEFAULT '{"name": "", "mana": 0, "effect": ""}',
  description TEXT,
  image_url TEXT, -- Portrait
  action_image_url TEXT, -- Full body / Cinematics
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. ITEMS TABLE
CREATE TABLE IF NOT EXISTS items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('base', 'combined', 'special', 'divine', 'rare')),
  description TEXT,
  icon TEXT,
  recipe TEXT[], -- Array of slugs
  stats JSONB DEFAULT '{}',
  divine_upgrade_slug TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. TRAITS TABLE (FOR DEFINITIONS)
CREATE TABLE IF NOT EXISTS traits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  type TEXT CHECK (type IN ('origin', 'class')),
  description TEXT,
  levels TEXT, -- e.g., '2 / 4 / 6'
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE champions ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE traits ENABLE ROW LEVEL SECURITY;

-- Policies: Anonymous read, Auth-only write (simulating admin)
CREATE POLICY "Public read on champions" ON champions FOR SELECT TO public USING (true);
CREATE POLICY "Public read on items" ON items FOR SELECT TO public USING (true);
CREATE POLICY "Public read on traits" ON traits FOR SELECT TO public USING (true);

-- For now, allowing all inserts for the Secret Portal workflow (not recommended for production, but okay for pre-alpha)
-- We will restrict this in the next iteration
CREATE POLICY "Public insert on champions" ON champions FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Public update on champions" ON champions FOR UPDATE TO public USING (true);

-- Function to handle updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_champions_updated_at BEFORE UPDATE ON champions FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
