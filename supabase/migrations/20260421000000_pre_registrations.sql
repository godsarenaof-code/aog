CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS pre_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  referral_source TEXT
);

-- Enable RLS
ALTER TABLE pre_registrations ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (so anyone can register)
CREATE POLICY "Allow public insert on pre_registrations" 
ON pre_registrations FOR INSERT 
TO public 
WITH CHECK (true);
