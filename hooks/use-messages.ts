'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/auth-context';
import { DecryptedMessage } from '@/types/crypto';
import { DBMessage, ConversationType, Profile } from '@/types/database';
import {
  derivePairwiseKey,
  encryptDirectMessage,
  decryptDirectMessage,
  encryptGroupMessage,
  decryptGroupMessage,
  unwrapGroupKey,
} from '@/lib/crypto/e2ee';
import { RealtimeChannel } from '@supabase/supabase-js';

interface UseMessagesProps {
  conversationId: string | null;
  conversationType: ConversationType;
  otherParticipant?: Profile | null;
  keyVersion?: number;
}

export function useMessages({
  conversationId,
  conversationType,
  otherParticipant,
  keyVersion = 1,
}: UseMessagesProps) {
  const { user, keyPair } = useAuth();
  const [supabase] = useState(() => createClient());

  const [messages, setMessages] = useState<DecryptedMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sending, setSending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const activeKeyRef = useRef<CryptoKey | null>(null);
  const profilesCacheRef = useRef<Map<string, Profile>>(new Map());
  const channelRef = useRef<RealtimeChannel | null>(null);

  // Helper to fetch and cache profile for sender details
  const getSenderProfile = useCallback(
    async (senderId: string): Promise<Profile | null> => {
      if (profilesCacheRef.current.has(senderId)) {
        return profilesCacheRef.current.get(senderId)!;
      }
      try {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', senderId)
          .maybeSingle();

        if (data) {
          profilesCacheRef.current.set(senderId, data as Profile);
          return data as Profile;
        }
      } catch (err) {
        console.warn('Could not fetch sender profile:', err);
      }
      return null;
    },
    [supabase]
  );

  // Initialize active encryption key (Pairwise ECDH for Direct, or Unwrapped Group Key)
  const resolveActiveKey = useCallback(async (): Promise<CryptoKey | null> => {
    if (!user || !keyPair || !conversationId) return null;

    try {
      if (conversationType === 'direct') {
        if (!otherParticipant) return null;

        // Fetch peer public key
        const { data: peerKeyRecord } = await supabase
          .from('user_keys')
          .select('public_key')
          .eq('user_id', otherParticipant.id)
          .maybeSingle();

        if (!peerKeyRecord?.public_key) {
          console.warn('Peer has not published public key yet');
          return null;
        }

        const pairwiseKey = await derivePairwiseKey(
          keyPair.privateKeyJwk,
          peerKeyRecord.public_key as JsonWebKey,
          otherParticipant.id
        );

        activeKeyRef.current = pairwiseKey;
        return pairwiseKey;
      } else {
        // Group Conversation: Fetch group member key envelope
        const { data: memberKeyRecord } = await supabase
          .from('group_member_keys')
          .select('*')
          .eq('group_id', conversationId)
          .eq('key_version', keyVersion)
          .eq('user_id', user.id)
          .maybeSingle();

        if (!memberKeyRecord) {
          console.warn('No group key envelope found for user in this group');
          return null;
        }

        // Fetch creator's public key who encrypted this group key
        const creatorId = memberKeyRecord.created_by || user.id;
        let creatorPublicJwk = keyPair.publicKeyJwk;

        if (creatorId !== user.id) {
          const { data: creatorKeyRecord } = await supabase
            .from('user_keys')
            .select('public_key')
            .eq('user_id', creatorId)
            .maybeSingle();

          if (creatorKeyRecord?.public_key) {
            creatorPublicJwk = creatorKeyRecord.public_key as JsonWebKey;
          }
        }

        const groupKey = await unwrapGroupKey(
          memberKeyRecord.encrypted_key,
          memberKeyRecord.iv,
          keyPair.privateKeyJwk,
          creatorPublicJwk,
          conversationId,
          keyVersion
        );

        activeKeyRef.current = groupKey;
        return groupKey;
      }
    } catch (err) {
      console.error('Failed to resolve active encryption key:', err);
      return null;
    }
  }, [user, keyPair, conversationId, conversationType, otherParticipant, keyVersion, supabase]);

  // Decrypt a raw database message record
  const decryptSingleMessage = useCallback(
    async (dbMsg: DBMessage, key: CryptoKey): Promise<DecryptedMessage> => {
      let plaintext = '';
      let isDecrypted = true;
      let decryptionError: string | undefined;

      try {
        if (conversationType === 'direct') {
          plaintext = await decryptDirectMessage(dbMsg.ciphertext, dbMsg.iv, key);
        } else {
          plaintext = await decryptGroupMessage(dbMsg.ciphertext, dbMsg.iv, key);
        }
      } catch (err: unknown) {
        isDecrypted = false;
        plaintext = '🔒 Unable to decrypt this message.';
        decryptionError = err instanceof Error ? err.message : 'Decryption error';
      }

      const senderProf = await getSenderProfile(dbMsg.sender_id);

      return {
        id: dbMsg.id,
        conversationId: dbMsg.conversation_id,
        senderId: dbMsg.sender_id,
        plaintext,
        isDecrypted,
        decryptionError,
        keyVersion: dbMsg.key_version,
        status: dbMsg.status,
        createdAt: dbMsg.created_at,
        senderProfile: senderProf
          ? {
              id: senderProf.id,
              display_name: senderProf.display_name,
              avatar_url: senderProf.avatar_url,
            }
          : undefined,
      };
    },
    [conversationType, getSenderProfile]
  );

  // Fetch initial message history
  const loadMessages = useCallback(async () => {
    if (!conversationId || !user) {
      setMessages([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const cryptoKey = await resolveActiveKey();

      const { data: dbMessages, error: fetchErr } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })
        .limit(100);

      if (fetchErr) {
        throw fetchErr;
      }

      if (!cryptoKey || !dbMessages || dbMessages.length === 0) {
        setMessages([]);
        setLoading(false);
        return;
      }

      // Decrypt all messages client-side in parallel
      const decryptedList = await Promise.all(
        dbMessages.map((msg) => decryptSingleMessage(msg as DBMessage, cryptoKey))
      );

      setMessages(decryptedList);

      // Mark unread messages sent by others as 'seen'
      const unreadFromOthers = dbMessages.filter(
        (m) => m.sender_id !== user.id && m.status !== 'seen'
      );

      if (unreadFromOthers.length > 0) {
        const unreadIds = unreadFromOthers.map((m) => m.id);
        await supabase
          .from('messages')
          .update({ status: 'seen' })
          .in('id', unreadIds);
      }
    } catch (err: unknown) {
      console.error('Error loading messages:', err);
      setError(err instanceof Error ? err.message : 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [conversationId, user, resolveActiveKey, supabase, decryptSingleMessage]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  // Realtime subscription for incoming messages and status updates
  useEffect(() => {
    if (!conversationId || !user) return;

    const channelName = `messages:${conversationId}`;
    const channel = supabase.channel(channelName);
    channelRef.current = channel;

    channel
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload) => {
          const newDbMsg = payload.new as DBMessage;

          // Check if already in state (e.g. from optimistic send)
          setMessages((prev) => {
            const exists = prev.some(
              (m) => m.id === newDbMsg.id || (m.id.startsWith('temp-') && m.senderId === newDbMsg.sender_id && m.createdAt === newDbMsg.created_at)
            );
            if (exists) {
              return prev.map((m) =>
                m.id.startsWith('temp-') && m.senderId === newDbMsg.sender_id
                  ? { ...m, id: newDbMsg.id, status: newDbMsg.status }
                  : m
              );
            }
            return prev;
          });

          // Decrypt if incoming from peer
          let key = activeKeyRef.current;
          if (!key) {
            key = await resolveActiveKey();
          }

          if (key) {
            const decrypted = await decryptSingleMessage(newDbMsg, key);

            setMessages((prev) => {
              // Avoid duplicate insertion
              if (prev.some((m) => m.id === decrypted.id)) {
                return prev;
              }
              // Replace optimistic temp message if matching
              const filtered = prev.filter(
                (m) => !(m.id.startsWith('temp-') && m.senderId === decrypted.senderId)
              );
              return [...filtered, decrypted];
            });

            // Mark as seen immediately since conversation is open
            if (newDbMsg.sender_id !== user.id) {
              await supabase
                .from('messages')
                .update({ status: 'seen' })
                .eq('id', newDbMsg.id);
            }
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const updated = payload.new as DBMessage;
          setMessages((prev) =>
            prev.map((m) => (m.id === updated.id ? { ...m, status: updated.status } : m))
          );
        }
      )
      .subscribe();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [conversationId, user, supabase, decryptSingleMessage, resolveActiveKey]);

  // Send message with client-side E2EE encryption
  const sendMessage = useCallback(
    async (plaintext: string) => {
      if (!plaintext.trim() || !conversationId || !user) return;

      const trimmedText = plaintext.trim();
      setSending(true);

      // 1. Optimistic UI update
      const tempId = `temp-${Date.now()}`;
      const optimisticMsg: DecryptedMessage = {
        id: tempId,
        conversationId,
        senderId: user.id,
        plaintext: trimmedText,
        isDecrypted: true,
        keyVersion,
        status: 'sent',
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, optimisticMsg]);

      try {
        let key = activeKeyRef.current;
        if (!key) {
          key = await resolveActiveKey();
        }

        if (!key) {
          throw new Error('Encryption key could not be established');
        }

        // 2. Encrypt plaintext locally before sending to Supabase
        let encryptedPayload;
        if (conversationType === 'direct') {
          encryptedPayload = await encryptDirectMessage(trimmedText, key);
        } else {
          encryptedPayload = await encryptGroupMessage(trimmedText, key, keyVersion);
        }

        // 3. Persist only ciphertext & IV to PostgreSQL
        const { data: inserted, error: insertErr } = await supabase
          .from('messages')
          .insert({
            conversation_id: conversationId,
            sender_id: user.id,
            ciphertext: encryptedPayload.ciphertext,
            iv: encryptedPayload.iv,
            key_version: encryptedPayload.keyVersion || keyVersion,
            algorithm: encryptedPayload.algorithm,
            status: 'sent',
          })
          .select()
          .single();

        if (insertErr) throw insertErr;

        // 4. Update temporary ID with real database ID
        if (inserted) {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === tempId ? { ...m, id: inserted.id, status: inserted.status } : m
            )
          );
        }
      } catch (err: unknown) {
        console.error('Failed to send encrypted message:', err);
        // Mark message with error in UI
        setMessages((prev) =>
          prev.map((m) =>
            m.id === tempId ? { ...m, decryptionError: 'Failed to send' } : m
          )
        );
      } finally {
        setSending(false);
      }
    },
    [conversationId, user, keyVersion, conversationType, resolveActiveKey, supabase]
  );

  return {
    messages,
    loading,
    sending,
    error,
    sendMessage,
    reloadMessages: loadMessages,
  };
}
