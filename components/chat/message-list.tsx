'use client';

import React, { useEffect, useRef } from 'react';
import { DecryptedMessage } from '@/types/crypto';
import { useAuth } from '@/contexts/auth-context';
import { Check, CheckCheck, Lock, AlertCircle } from 'lucide-react';

interface MessageListProps {
  messages: DecryptedMessage[];
  loading: boolean;
  conversationType: 'direct' | 'group';
}

function formatMessageTime(dateString: string): string {
  try {
    const d = new Date(dateString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

function formatMessageDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) return 'Today';

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';

    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: d.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
    });
  } catch {
    return '';
  }
}

// Deterministic pastel color generator for sender names in group chats
function getSenderColor(userId: string): string {
  const colors = [
    '#00897B',
    '#1E88E5',
    '#8E24AA',
    '#D81B60',
    '#F4511E',
    '#43A047',
    '#3949AB',
    '#00ACC1',
  ];
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export function MessageList({
  messages,
  loading,
  conversationType,
}: MessageListProps) {
  const { user } = useAuth();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Group messages by date
  let lastDate = '';

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-4 space-y-3 chat-wallpaper-light dark:chat-wallpaper-dark">
      {/* Security Banner */}
      <div className="flex justify-center mb-4">
        <div className="max-w-md bg-[#ffeecd]/85 dark:bg-[#182229]/90 border border-[#e1d5bc] dark:border-[#2a3942] rounded-xl px-3.5 py-2 text-center shadow-xs">
          <p className="text-[11px] text-[#54656f] dark:text-[#8696a0] leading-relaxed flex items-center justify-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[#00A884] shrink-0" />
            <span>
              Messages are end-to-end encrypted. No one outside this chat, not even OpenChat, can read them.
            </span>
          </p>
        </div>
      </div>

      {!loading && messages.length === 0 && (
        <div className="py-12 text-center text-xs text-[#8696a0]">
          No messages here yet. Send a message to start encrypted conversation.
        </div>
      )}

      {messages.map((msg) => {
        const isMe = msg.senderId === user?.id;
        const msgDate = formatMessageDate(msg.createdAt);
        const showDateSeparator = msgDate !== lastDate;
        if (showDateSeparator) {
          lastDate = msgDate;
        }

        return (
          <React.Fragment key={msg.id}>
            {showDateSeparator && (
              <div className="flex justify-center my-2">
                <span className="px-3 py-1 rounded-lg bg-white/80 dark:bg-[#182229]/90 border border-[#e9edef] dark:border-[#2a3942] text-[11px] font-medium text-[#54656f] dark:text-[#8696a0] shadow-xs">
                  {msgDate}
                </span>
              </div>
            )}

            <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`relative max-w-[85%] sm:max-w-[70%] rounded-2xl px-3.5 py-2 shadow-xs transition-colors ${
                  isMe
                    ? 'bg-[#d9fdd3] dark:bg-[#005c4b] text-[#111b21] dark:text-[#e9edef] rounded-tr-xs'
                    : 'bg-white dark:bg-[#202c33] text-[#111b21] dark:text-[#e9edef] rounded-tl-xs'
                }`}
              >
                {/* Sender Name for group chats if incoming */}
                {!isMe && conversationType === 'group' && (
                  <p
                    className="text-[11px] font-semibold mb-0.5 truncate"
                    style={{ color: getSenderColor(msg.senderId) }}
                  >
                    {msg.senderProfile?.display_name || 'Member'}
                  </p>
                )}

                {/* Message Body */}
                {msg.decryptionError ? (
                  <div className="space-y-1 py-0.5">
                    <p className="text-sm whitespace-pre-wrap break-words leading-relaxed select-text opacity-70">
                      {msg.plaintext}
                    </p>
                    <div className="flex items-center gap-1.5 text-[11px] text-red-500 dark:text-red-400">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{msg.decryptionError}</span>
                    </div>
                  </div>
                ) : msg.isDecrypted ? (
                  <p className="text-sm whitespace-pre-wrap break-words leading-relaxed select-text">
                    {msg.plaintext}
                  </p>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 py-0.5">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{msg.plaintext}</span>
                  </div>
                )}

                {/* Message Meta (Timestamp & Status Ticks) */}
                <div className="flex items-center justify-end gap-1 mt-1 -mb-0.5 text-[10px] text-[#667781] dark:text-[#8696a0]/80 float-right ml-3 select-none">
                  <span>{formatMessageTime(msg.createdAt)}</span>

                  {isMe && (
                    <span>
                      {msg.status === 'seen' ? (
                        <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb] stroke-[2.5]" />
                      ) : msg.status === 'delivered' ? (
                        <CheckCheck className="w-3.5 h-3.5 text-[#8696a0] stroke-[2]" />
                      ) : (
                        <Check className="w-3.5 h-3.5 text-[#8696a0] stroke-[2]" />
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </React.Fragment>
        );
      })}

      <div ref={bottomRef} />
    </div>
  );
}
