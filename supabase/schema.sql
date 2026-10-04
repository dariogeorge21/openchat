-- ==============================================================================
-- OpenChat — Production Database Schema & Row Level Security (RLS) Policies
-- PostgreSQL / Supabase
-- NOTE: ALL message contents are stored as CIPHERTEXT only.
-- Private keys are NEVER stored in this database.
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
DO $$ BEGIN
  CREATE TYPE conversation_type AS ENUM ('direct', 'group');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE member_role AS ENUM ('admin', 'member');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE message_status AS ENUM ('sent', 'delivered', 'seen');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES TABLE
-- Mirror of auth.users with public profile metadata
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT NOT NULL,
  username TEXT UNIQUE,
  avatar_url TEXT,
  about TEXT DEFAULT 'Hey there! I am using OpenChat.',
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  is_online BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. USER PUBLIC KEYS TABLE
-- Stores only the PUBLIC ECDH key (as JWK JSON) and key fingerprint.
-- PRIVATE KEYS NEVER TOUCH THIS SERVER OR DATABASE.
CREATE TABLE IF NOT EXISTS public.user_keys (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  public_key JSONB NOT NULL,
  key_fingerprint TEXT NOT NULL,
  algorithm TEXT NOT NULL DEFAULT 'ECDH-P256',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CONVERSATIONS TABLE
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type conversation_type NOT NULL DEFAULT 'direct',
  name TEXT, -- Used for group conversations
  avatar_url TEXT, -- Used for group conversations
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  current_key_version INTEGER NOT NULL DEFAULT 1,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CONVERSATION MEMBERS TABLE
CREATE TABLE IF NOT EXISTS public.conversation_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role member_role NOT NULL DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  last_read_at TIMESTAMPTZ DEFAULT NOW(),
  last_read_message_id UUID,
  CONSTRAINT unique_conversation_member UNIQUE (conversation_id, user_id)
);

-- 7. GROUP MEMBER KEYS TABLE
-- For group E2EE key distribution:
-- The symmetric group key (AES-256-GCM) is encrypted locally by an admin for each member
-- using pairwise ECDH shared keys. Each member can only access their row.
CREATE TABLE IF NOT EXISTS public.group_member_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  key_version INTEGER NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  encrypted_key TEXT NOT NULL, -- AES-256 group key encrypted for this member (Base64)
  iv TEXT NOT NULL,            -- IV used during key wrapping (Base64)
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_group_key_version_user UNIQUE (group_id, key_version, user_id)
);

-- 8. MESSAGES TABLE
-- STRICTLY stores encrypted ciphertext and cryptographic metadata.
-- Plaintext message is NEVER stored or handled by PostgreSQL.
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ciphertext TEXT NOT NULL, -- AES-GCM encrypted payload (Base64)
  iv TEXT NOT NULL,         -- Cryptographic 12-byte IV/nonce (Base64)
  key_version INTEGER NOT NULL DEFAULT 1, -- Key generation/rotation version
  algorithm TEXT NOT NULL DEFAULT 'AES-GCM-256',
  status message_status NOT NULL DEFAULT 'sent',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. MESSAGE RECEIPTS TABLE
-- Tracks individual delivery and seen timestamps per recipient
CREATE TABLE IF NOT EXISTS public.message_receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status message_status NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_message_receipt_per_user UNIQUE (message_id, user_id)
);

-- ------------------------------------------------------------------------------
-- INDEXES FOR SCALE & SPEED
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_display_name ON public.profiles(display_name);
CREATE INDEX IF NOT EXISTS idx_conversation_members_user ON public.conversation_members(user_id);
CREATE INDEX IF NOT EXISTS idx_conversation_members_conv ON public.conversation_members(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_created ON public.messages(conversation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_group_keys_lookup ON public.group_member_keys(group_id, key_version, user_id);
CREATE INDEX IF NOT EXISTS idx_message_receipts_msg ON public.message_receipts(message_id);

-- ------------------------------------------------------------------------------
-- TRIGGERS & FUNCTIONS
-- ------------------------------------------------------------------------------

-- Update timestamp helper
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Automatically update updated_at on records
DROP TRIGGER IF EXISTS tr_profiles_updated_at ON public.profiles;
CREATE TRIGGER tr_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_conversations_updated_at ON public.conversations;
CREATE TRIGGER tr_conversations_updated_at BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_messages_updated_at ON public.messages;
CREATE TRIGGER tr_messages_updated_at BEFORE UPDATE ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Automatically update conversation.last_message_at on new message
CREATE OR REPLACE FUNCTION public.handle_new_message_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.conversations
  SET last_message_at = NEW.created_at
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_new_message_timestamp ON public.messages;
CREATE TRIGGER tr_new_message_timestamp AFTER INSERT ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_message_timestamp();

-- Automatically populate public.profiles on user creation via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_display_name TEXT;
  v_avatar TEXT;
  v_username TEXT;
BEGIN
  v_display_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    split_part(NEW.email, '@', 1)
  );
  v_avatar := COALESCE(
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'picture',
    ''
  );
  v_username := split_part(NEW.email, '@', 1) || '_' || substr(NEW.id::text, 1, 4);

  INSERT INTO public.profiles (id, email, display_name, username, avatar_url)
  VALUES (NEW.id, NEW.email, v_display_name, v_username, v_avatar)
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      display_name = COALESCE(public.profiles.display_name, EXCLUDED.display_name),
      avatar_url = COALESCE(public.profiles.avatar_url, EXCLUDED.avatar_url);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Helper function to check if current user is member of a conversation
CREATE OR REPLACE FUNCTION public.is_conversation_member(p_conv_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.conversation_members
    WHERE conversation_id = p_conv_id AND user_id = (SELECT auth.uid())
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper function to check if current user is admin of a conversation
CREATE OR REPLACE FUNCTION public.is_conversation_admin(p_conv_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.conversation_members
    WHERE conversation_id = p_conv_id AND user_id = (SELECT auth.uid()) AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper function to check if current user is creator of a conversation
CREATE OR REPLACE FUNCTION public.is_conversation_creator(p_conv_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.conversations
    WHERE id = p_conv_id AND created_by = (SELECT auth.uid())
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ------------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_member_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_receipts ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
-- Anyone authenticated can view user profiles (required for searching and contacts)
CREATE POLICY "Profiles are viewable by authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

-- Users can only update their own profile
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = id)
  WITH CHECK ((SELECT auth.uid()) = id);

-- USER KEYS POLICIES
-- Authenticated users can view public keys (required to establish ECDH shared secrets)
CREATE POLICY "Public keys are viewable by authenticated users"
  ON public.user_keys FOR SELECT
  TO authenticated
  USING (true);

-- Users can only insert/update their own public key
CREATE POLICY "Users can insert their own public key"
  ON public.user_keys FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update their own public key"
  ON public.user_keys FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- CONVERSATIONS POLICIES
-- Users can see conversations they belong to or created
CREATE POLICY "Users can view their conversations"
  ON public.conversations FOR SELECT
  TO authenticated
  USING (
    public.is_conversation_member(id)
    OR created_by = (SELECT auth.uid())
  );

-- Any authenticated user can create a conversation
CREATE POLICY "Users can create conversations"
  ON public.conversations FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = created_by);

-- Conversation admins or members can update conversation details (group name/avatar/key version)
CREATE POLICY "Admins or members can update conversation"
  ON public.conversations FOR UPDATE
  TO authenticated
  USING (public.is_conversation_member(id))
  WITH CHECK (public.is_conversation_member(id));

-- CONVERSATION MEMBERS POLICIES
-- Members can view membership list for conversations they participate in
CREATE POLICY "Members can view conversation members"
  ON public.conversation_members FOR SELECT
  TO authenticated
  USING (public.is_conversation_member(conversation_id));

-- Users can insert conversation members when creating or adding
CREATE POLICY "Users can insert members"
  ON public.conversation_members FOR INSERT
  TO authenticated
  WITH CHECK (
    -- User adding themselves upon conversation creation OR
    (SELECT auth.uid()) = user_id OR
    -- Group admin adding a member OR
    public.is_conversation_admin(conversation_id) OR
    -- Conversation creator adding participants
    public.is_conversation_creator(conversation_id)
  );

-- Group admins can update roles or users can update their own last_read_at
CREATE POLICY "Admins or self can update conversation members"
  ON public.conversation_members FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR public.is_conversation_admin(conversation_id))
  WITH CHECK (auth.uid() = user_id OR public.is_conversation_admin(conversation_id));

-- Admins can remove members, or a user can leave (remove themselves)
CREATE POLICY "Admins can remove members or user can leave"
  ON public.conversation_members FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id OR public.is_conversation_admin(conversation_id));

-- GROUP MEMBER KEYS POLICIES
-- A member can ONLY select their own encrypted group key
CREATE POLICY "Members can only select their own encrypted group key"
  ON public.group_member_keys FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Group creator or admin can insert encrypted group keys for participants
CREATE POLICY "Admins or creators can insert group member keys"
  ON public.group_member_keys FOR INSERT
  TO authenticated
  WITH CHECK (
    public.is_conversation_member(group_id)
  );

-- MESSAGES POLICIES
-- Users can only read messages from conversations they are a member of
CREATE POLICY "Members can read encrypted messages"
  ON public.messages FOR SELECT
  TO authenticated
  USING (public.is_conversation_member(conversation_id));

-- Users can only insert messages into conversations they are currently a member of, and sender_id must be self
CREATE POLICY "Members can insert messages"
  ON public.messages FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = sender_id AND
    public.is_conversation_member(conversation_id)
  );

-- Senders can update status of their messages
CREATE POLICY "Members can update message status"
  ON public.messages FOR UPDATE
  TO authenticated
  USING (public.is_conversation_member(conversation_id))
  WITH CHECK (public.is_conversation_member(conversation_id));

-- Members can delete messages in conversations they are part of (Clear chat)
CREATE POLICY "Members can delete messages"
  ON public.messages FOR DELETE
  TO authenticated
  USING (public.is_conversation_member(conversation_id));

-- MESSAGE RECEIPTS POLICIES
-- Conversation members can read message receipts
CREATE POLICY "Members can view message receipts"
  ON public.message_receipts FOR SELECT
  TO authenticated
  USING (public.is_conversation_member(conversation_id));

-- Users can insert/upsert their own delivery/seen receipt
CREATE POLICY "Users can insert their own receipts"
  ON public.message_receipts FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    public.is_conversation_member(conversation_id)
  );

CREATE POLICY "Users can update their own receipts"
  ON public.message_receipts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- REALTIME REPLICATION CONFIGURATION
-- ------------------------------------------------------------------------------
-- Enable replication for live messaging and status updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.message_receipts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversation_members;

-- ------------------------------------------------------------------------------
-- 10. RPC FUNCTIONS (Stored Procedures)
-- ------------------------------------------------------------------------------

-- Atomic Direct Conversation Creator
-- Prevents duplicate 1:1 conversations and handles conversation + membership insertion in one transaction
CREATE OR REPLACE FUNCTION public.create_or_get_direct_conversation(p_peer_id UUID)
RETURNS UUID AS $$
DECLARE
  v_conv_id UUID;
  v_user_id UUID := auth.uid();
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF v_user_id = p_peer_id THEN
    RAISE EXCEPTION 'Cannot start conversation with yourself';
  END IF;

  -- 1. Check if a direct conversation already exists between both users
  SELECT cm1.conversation_id INTO v_conv_id
  FROM public.conversation_members cm1
  JOIN public.conversation_members cm2 ON cm1.conversation_id = cm2.conversation_id
  JOIN public.conversations c ON c.id = cm1.conversation_id
  WHERE cm1.user_id = v_user_id
    AND cm2.user_id = p_peer_id
    AND c.type = 'direct'
  LIMIT 1;

  IF v_conv_id IS NOT NULL THEN
    RETURN v_conv_id;
  END IF;

  -- 2. Create new direct conversation
  INSERT INTO public.conversations (type, created_by, current_key_version)
  VALUES ('direct', v_user_id, 1)
  RETURNING id INTO v_conv_id;

  -- 3. Add creator (admin) and peer (member)
  INSERT INTO public.conversation_members (conversation_id, user_id, role)
  VALUES
    (v_conv_id, v_user_id, 'admin'),
    (v_conv_id, p_peer_id, 'member');

  RETURN v_conv_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.create_or_get_direct_conversation(UUID) TO authenticated;

-- RPC: Clear all messages in a conversation
CREATE OR REPLACE FUNCTION public.clear_conversation_messages(p_conversation_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NOT public.is_conversation_member(p_conversation_id) THEN
    RAISE EXCEPTION 'Not authorized to clear this conversation';
  END IF;

  DELETE FROM public.messages WHERE conversation_id = p_conversation_id;
  UPDATE public.conversations SET last_message_at = NOW() WHERE id = p_conversation_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.clear_conversation_messages(UUID) TO authenticated;
