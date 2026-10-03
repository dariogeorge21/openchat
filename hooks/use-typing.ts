'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/auth-context';
import { RealtimeChannel } from '@supabase/supabase-js';

interface TypingUser {
  userId: string;
  displayName: string;
  timestamp: number;
}

export function useTyping(conversationId: string | null) {
  const { user, profile } = useAuth();
  const [supabase] = useState(() => createClient());
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const lastSentRef = useRef<number>(0);
  const stopTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!conversationId || !user) {
      setTypingUsers([]);
      return;
    }

    const channelName = `conversation:${conversationId}:typing`;
    const channel = supabase.channel(channelName);
    channelRef.current = channel;

    channel
      .on('broadcast', { event: 'typing' }, ({ payload }) => {
        if (!payload || payload.userId === user.id) return;

        const { userId, displayName, isTyping } = payload;

        setTypingUsers((prev) => {
          if (!isTyping) {
            return prev.filter((u) => u.userId !== userId);
          }
          const existing = prev.find((u) => u.userId === userId);
          if (existing) {
            return prev.map((u) =>
              u.userId === userId ? { ...u, timestamp: Date.now() } : u
            );
          }
          return [...prev, { userId, displayName, timestamp: Date.now() }];
        });
      })
      .subscribe();

    // Periodic sweep for stale typing indicators (older than 3.5s)
    const sweepInterval = setInterval(() => {
      const now = Date.now();
      setTypingUsers((prev) => prev.filter((u) => now - u.timestamp < 3500));
    }, 1000);

    return () => {
      clearInterval(sweepInterval);
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [conversationId, user, supabase]);

  const sendTyping = useCallback(() => {
    if (!channelRef.current || !user || !conversationId) return;

    const now = Date.now();
    // Throttle broadcast to at most once every 1500ms
    if (now - lastSentRef.current > 1500) {
      lastSentRef.current = now;
      const displayName =
        profile?.display_name || user.user_metadata?.full_name || 'Someone';

      channelRef.current.send({
        type: 'broadcast',
        event: 'typing',
        payload: {
          userId: user.id,
          displayName,
          isTyping: true,
        },
      });
    }

    // Reset auto-stop timeout
    if (stopTimeoutRef.current) {
      clearTimeout(stopTimeoutRef.current);
    }

    stopTimeoutRef.current = setTimeout(() => {
      if (channelRef.current && user) {
        channelRef.current.send({
          type: 'broadcast',
          event: 'typing',
          payload: {
            userId: user.id,
            displayName: profile?.display_name || '',
            isTyping: false,
          },
        });
      }
    }, 2500);
  }, [user, profile, conversationId]);

  const typingText = (() => {
    if (typingUsers.length === 0) return null;
    if (typingUsers.length === 1) return `${typingUsers[0].displayName} is typing...`;
    if (typingUsers.length === 2)
      return `${typingUsers[0].displayName} and ${typingUsers[1].displayName} are typing...`;
    return 'Multiple people are typing...';
  })();

  return { typingUsers, typingText, sendTyping };
}
