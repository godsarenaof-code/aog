-- Real Match History System

CREATE TABLE IF NOT EXISTS public.match_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  placement INTEGER NOT NULL CHECK (placement >= 1 AND placement <= 8),
  champions JSONB DEFAULT '[]', -- Array of champion names/IDs used
  lp_change INTEGER DEFAULT 0,
  duration INTEGER DEFAULT 0, -- in seconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast user history lookup
CREATE INDEX IF NOT EXISTS idx_match_history_user_id ON public.match_history(user_id);

-- Ensure we have champions and traits data visibility (though they already exist in types)
-- This migration script is focused on the History system.
