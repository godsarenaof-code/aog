-- Policies for items to allow inserts/updates during the secret portal workflow
CREATE POLICY "Public insert on items" ON items FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Public update on items" ON items FOR UPDATE TO public USING (true);
CREATE POLICY "Public delete on items" ON items FOR DELETE TO public USING (true);

-- Policies for traits (Origins/Classes)
CREATE POLICY "Public insert on traits" ON traits FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Public update on traits" ON traits FOR UPDATE TO public USING (true);
CREATE POLICY "Public delete on traits" ON traits FOR DELETE TO public USING (true);
