import { Conversation, Profile, ConversationMember, MessageStatus } from './database';
import { DecryptedMessage } from './crypto';

export interface UIConversation extends Conversation {
  otherParticipant?: Profile; // For direct conversations
  members?: (ConversationMember & { profile: Profile })[];
  lastDecryptedMessage?: DecryptedMessage | null;
  unreadCount: number;
}

export interface UserPresence {
  userId: string;
  isOnline: boolean;
  lastSeen: string;
}

export interface TypingState {
  [conversationId: string]: {
    [userId: string]: {
      displayName: string;
      timestamp: number;
    };
  };
}

export interface RealtimeTypingPayload {
  conversationId: string;
  userId: string;
  displayName: string;
  isTyping: boolean;
}
