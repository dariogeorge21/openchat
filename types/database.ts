export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ConversationType = 'direct' | 'group';
export type MemberRole = 'admin' | 'member';
export type MessageStatus = 'sent' | 'delivered' | 'seen';

export interface Profile {
  id: string;
  email: string | null;
  display_name: string;
  username: string | null;
  avatar_url: string | null;
  about: string | null;
  last_seen: string;
  is_online: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserPublicKey {
  user_id: string;
  public_key: JsonWebKey;
  key_fingerprint: string;
  algorithm: string;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  type: ConversationType;
  name: string | null;
  avatar_url: string | null;
  created_by: string | null;
  current_key_version: number;
  last_message_at: string;
  created_at: string;
  updated_at: string;
}

export interface ConversationMember {
  id: string;
  conversation_id: string;
  user_id: string;
  role: MemberRole;
  joined_at: string;
  last_read_at: string;
  last_read_message_id: string | null;
  is_archived?: boolean;
  profile?: Profile;
}

export interface GroupMemberKey {
  id: string;
  group_id: string;
  key_version: number;
  user_id: string;
  encrypted_key: string; // Base64 wrapped AES key
  iv: string;            // Base64 IV used for wrapping
  created_by: string | null;
  created_at: string;
}

export interface DBMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  ciphertext: string;    // Base64 AES-GCM ciphertext
  iv: string;            // Base64 12-byte IV
  key_version: number;
  algorithm: string;
  status: MessageStatus;
  created_at: string;
  updated_at: string;
}

export interface MessageReceipt {
  id: string;
  message_id: string;
  conversation_id: string;
  user_id: string;
  status: MessageStatus;
  updated_at: string;
}
