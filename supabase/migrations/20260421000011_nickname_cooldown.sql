-- Add last_nickname_change tracker to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS last_nickname_change TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Ensure users are aware of their essence in the main user table as well if needed
-- (Note: Essence is already in user_balances, we will join them in the backend)
