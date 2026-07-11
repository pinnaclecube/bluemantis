-- Phase 5: test generation & push-back
-- Track which suggestion a run committed, so test generation can recover the
-- chosen suggestion's code. Idempotent — safe to run more than once.
--
-- Apply in Supabase (SQL editor) before deploying Phase 5.

ALTER TABLE runs ADD COLUMN IF NOT EXISTS committed_suggestion_id integer;
