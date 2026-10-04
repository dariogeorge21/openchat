'use client';

import React, { useState } from 'react';
import { UIConversation } from '@/types/chat';
import { useMessages } from '@/hooks/use-messages';
import { useTyping } from '@/hooks/use-typing';
import { MessageList } from './message-list';
import { MessageInput } from './message-input';
import {
  ArrowLeft,
  ShieldCheck,
  MoreVertical,
  Users,
  User,
  Info,
} from 'lucide-react';

interface ChatAreaProps {
  conversation: UIConversation;
  onBack?: () => void;
  onOpenDetails?: () => void;
  presenceText?: string;
  isPeerOnline?: boolean;
}

export function ChatArea({
  conversation,
  onBack,
  onOpenDetails,
  presenceText,
  isPeerOnline,
}: ChatAreaProps) {
  const { messages, loading, sendMessage } = useMessages({
    conversationId: conversation.id,
    conversationType: conversation.type,
    otherParticipant: conversation.otherParticipant,
    keyVersion: conversation.current_key_version,
  });

  const { typingText, sendTyping } = useTyping(conversation.id);
  const [showSecurityTooltip, setShowSecurityTooltip] = useState(false);

  const title =
    conversation.type === 'direct'
      ? conversation.otherParticipant?.display_name || 'Direct Chat'
      : conversation.name || 'Group Chat';

  const avatar =
    conversation.type === 'direct'
      ? conversation.otherParticipant?.avatar_url
      : conversation.avatar_url;

  const subtitle = (() => {
    if (typingText) return <span className="text-[#00A884] font-medium animate-pulse">{typingText}</span>;
    if (conversation.type === 'direct') {
      return (
        <span className={isPeerOnline ? 'text-[#00A884] font-medium' : 'text-[#667781] dark:text-[#8696a0]'}>
          {presenceText || 'Offline'}
        </span>
      );
    }
    const memberCount = conversation.members?.length || 0;
    return (
      <span className="text-[#667781] dark:text-[#8696a0]">
        {memberCount} {memberCount === 1 ? 'member' : 'members'}
      </span>
    );
  })();

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f0f2f5] dark:bg-[#111b21] overflow-hidden">
      {/* Top Header */}
      <header className="h-16 px-4 bg-[#f0f2f5] dark:bg-[#202c33] border-b border-[#e9edef] dark:border-[#222d34] flex items-center justify-between z-10">
        <div className="flex items-center gap-3 min-w-0">
          {/* Back button on mobile */}
          {onBack && (
            <button
              onClick={onBack}
              className="md:hidden p-1.5 -ml-1 rounded-full text-[#54656f] dark:text-[#8696a0] hover:text-[#111b21] dark:hover:text-[#e9edef] hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
              title="Back to conversation list"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          {/* Avatar */}
          <div
            onClick={onOpenDetails}
            className="relative w-10 h-10 rounded-full overflow-hidden bg-[#dfe5e7] dark:bg-[#374248] flex items-center justify-center shrink-0 cursor-pointer"
          >
            {avatar ? (
              <img src={avatar} alt={title} className="w-full h-full object-cover" />
            ) : conversation.type === 'group' ? (
              <Users className="w-5 h-5 text-[#8696a0]" />
            ) : (
              <User className="w-5 h-5 text-[#8696a0]" />
            )}
            {conversation.type === 'direct' && isPeerOnline && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#00A884] border-2 border-[#f0f2f5] dark:border-[#202c33]" />
            )}
          </div>

          {/* Title & Status */}
          <div onClick={onOpenDetails} className="min-w-0 cursor-pointer">
            <h2 className="text-sm font-semibold text-[#111b21] dark:text-[#e9edef] truncate">
              {title}
            </h2>
            <p className="text-xs truncate">{subtitle}</p>
          </div>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-1.5 text-[#54656f] dark:text-[#8696a0]">
          {/* E2EE Lock Badge */}
          {/* <div className="relative">
            <button
              onClick={() => setShowSecurityTooltip(!showSecurityTooltip)}
              className="flex items-center gap-1 text-[11px] font-medium bg-white/70 dark:bg-[#111b21]/70 px-2.5 py-1 rounded-full border border-[#e9edef] dark:border-[#2a3942] text-[#00A884] hover:bg-white dark:hover:bg-[#111b21] transition-colors cursor-pointer"
              title="End-to-End Encrypted Session"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">E2EE Active</span>
            </button>

            {showSecurityTooltip && (
              <div className="absolute right-0 top-10 w-64 p-3 bg-white dark:bg-[#202c33] border border-[#e9edef] dark:border-[#2a3942] rounded-xl shadow-xl text-xs space-y-1.5 z-30 animate-in fade-in-50">
                <p className="font-semibold text-[#111b21] dark:text-[#e9edef]">
                  Zero-Knowledge Security
                </p>
                <p className="text-[#667781] dark:text-[#8696a0] leading-relaxed">
                  Messages in this chat are encrypted using your browser&apos;s Web Crypto API primitives (ECDH P-256 + AES-GCM). Neither OpenChat nor Supabase can read your conversation.
                </p>
              </div>
            )}
          </div> */}

          {/* Info Details Trigger */}
          {/* {onOpenDetails && (
            <button
              onClick={onOpenDetails}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-[#54656f] dark:text-[#aebac1] hover:text-[#111b21] dark:hover:text-[#e9edef] transition-colors cursor-pointer"
              title="Chat Details"
            >
              {conversation.type === 'group' ? (
                <Info className="w-5 h-5" />
              ) : (
                <MoreVertical className="w-5 h-5" />
              )}
            </button>
          )} */}
        </div>
      </header>

      {/* Message Stream */}
      <MessageList
        messages={messages}
        loading={loading}
        conversationType={conversation.type}
      />

      {/* Message Composer */}
      <MessageInput onSendMessage={sendMessage} onTyping={sendTyping} />
    </div>
  );
}
