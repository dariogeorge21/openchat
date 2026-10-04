-- ==============================================================================
-- Migration: Add Conversation Archiving Support
-- Timestamp: 20261004111500
-- Description: Adds is_archived column per user membership in conversation_members,
--              along with index and helper RPC function set_conversation_archived.
-- ==============================================================================

-- 1. Add is_archived column to conversation_members (defaults to false)
ALTER TABLE public.conversation_members
ADD COLUMN IF NOT EXISTS is_archived BOOLEAN NOT NULL DEFAULT false;

-- 2. Create index for fast retrieval and filtering of archived vs unarchived chats
CREATE INDEX IF NOT EXISTS idx_conversation_members_user_archived
ON public.conversation_members(user_id, is_archived);

-- 3. Atomic RPC function to archive / unarchive a conversation for the authenticated user
CREATE OR REPLACE FUNCTION public.set_conversation_archived(
  p_conversation_id UUID,
  p_archived BOOLEAN
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Ensure only the authenticated user's own membership row is updated
  UPDATE public.conversation_members
  SET is_archived = p_archived
  WHERE conversation_id = p_conversation_id
    AND user_id = auth.uid();
END;
$$;

-- 4. Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.set_conversation_archived(UUID, BOOLEAN) TO authenticated;
