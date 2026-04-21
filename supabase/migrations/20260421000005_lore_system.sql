-- Create Lore Chapters table
CREATE TABLE IF NOT EXISTS lore_chapters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE lore_chapters ENABLE ROW LEVEL SECURITY;

-- Policies for public reading
CREATE POLICY "Allow public read access on lore_chapters" 
ON lore_chapters FOR SELECT 
TO public 
USING (true);

-- Policies for anon/authenticated write (for admin during development)
CREATE POLICY "Allow anon insert on lore_chapters" 
ON lore_chapters FOR INSERT 
TO public 
WITH CHECK (true);

CREATE POLICY "Allow anon update on lore_chapters" 
ON lore_chapters FOR UPDATE 
TO public 
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow anon delete on lore_chapters" 
ON lore_chapters FOR DELETE 
TO public 
USING (true);
