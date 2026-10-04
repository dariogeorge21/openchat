'use client';

import React, { useState, useRef, useEffect } from 'react';
import { UIConversation } from '@/types/chat';
import { useMessages } from '@/hooks/use-messages';
import { useTyping } from '@/hooks/use-typing';
import { MessageList } from './message-list';
import { MessageInput } from './message-input';
import { ClearChatModal } from './clear-chat-modal';
import {
  ArrowLeft,
  ShieldCheck,
  MoreVertical,
  Users,
  User,
  Info,
  Trash2,
} from 'lucide-react';

interface ChatAreaProps {
  conversation: UIConversation;
  onBack?: () => void;
  onOpenDetails?: () => void;
  presenceText?: string;
  isPeerOnline?: boolean;
  onClearChat?: (convId: string) => Promise<void>;
}

export function ChatArea({
  conversation,
  onBack,
  onOpenDetails,
  presenceText,
  isPeerOnline,
  onClearChat,
}: ChatAreaProps) {
  const { messages, loading, sendMessage, clearMessages } = useMessages({
    conversationId: conversation.id,
    conversationType: conversation.type,
    otherParticipant: conversation.otherParticipant,
    keyVersion: conversation.current_key_version,
  });

  const { typingText, sendTyping } = useTyping(conversation.id);
  const [showSecurityTooltip, setShowSecurityTooltip] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [clearModalOpen, setClearModalOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside or Escape
  useEffect(() => {
    if (!menuOpen) return;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

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
          {/* 3-dots Menu Button */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-[#54656f] dark:text-[#aebac1] hover:text-[#111b21] dark:hover:text-[#e9edef] transition-colors cursor-pointer"
              title="More options"
              aria-label="More options"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {menuOpen && (
              <div
                className="absolute right-0 top-full mt-1.5 w-48 py-1.5 bg-white dark:bg-[#233138] border border-[#e9edef] dark:border-[#2a3942] rounded-xl shadow-xl z-50 animate-in fade-in-50 zoom-in-95 text-xs font-normal"
              >
                {onOpenDetails && (
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenDetails();
                    }}
                    className="w-full px-4 py-2.5 text-left flex items-center gap-2.5 text-[#111b21] dark:text-[#d1d7db] hover:bg-[#f5f6f6] dark:hover:bg-[#182229] transition-colors cursor-pointer"
                  >
                    {conversation.type === 'group' ? (
                      <>
                        <Users className="w-4 h-4 text-[#8696a0]" />
                        <span>Group info</span>
                      </>
                    ) : (
                      <>
                        <User className="w-4 h-4 text-[#8696a0]" />
                        <span>Contact info</span>
                      </>
                    )}
                  </button>
                )}

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setClearModalOpen(true);
                  }}
                  className="w-full px-4 py-2.5 text-left flex items-center gap-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                  <span>Clear chat</span>
                </button>
              </div>
            )}
          </div>
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

      {/* Clear Chat Confirmation Modal */}
      <ClearChatModal
        open={clearModalOpen}
        onOpenChange={setClearModalOpen}
        conversationName={title}
        isClearing={isClearing}
        onConfirm={async () => {
          try {
            setIsClearing(true);
            clearMessages();
            if (onClearChat) {
              await onClearChat(conversation.id);
            }
          } catch (err) {
            console.error('Failed to clear chat:', err);
          } finally {
            setIsClearing(false);
          }
        }}
      />
    </div>
  );
}
