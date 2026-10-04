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
  const [loading, setLoading] = useState<boolean>(false);
  const [sending, setSending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const activeKeyRef = useRef<CryptoKey | null>(null);
  const keyErrorRef = useRef<string | null>(null);
  const profilesCacheRef = useRef<Map<string, Profile>>(new Map());
  const keysCacheRef = useRef<Map<string, CryptoKey>>(new Map());
  const prevConversationIdRef = useRef<string | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);

  const otherParticipantId = otherParticipant?.id;
  const otherParticipantRef = useRef(otherParticipant);
  useEffect(() => {
    otherParticipantRef.current = otherParticipant;
  }, [otherParticipant]);

  const userRef = useRef(user);
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  const keyPairRef = useRef(keyPair);
  useEffect(() => {
    keyPairRef.current = keyPair;
  }, [keyPair]);

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
    const currentUser = userRef.current || user;
    const currentKeyPair = keyPairRef.current || keyPair;

    if (!currentUser) return null;
    if (!currentKeyPair) {
      keyErrorRef.current = 'Cryptographic keys are still initializing. Please wait a moment.';
      return null;
    }
    if (!conversationId) return null;

    // Check memory cache first
    const cacheKey =
      conversationType === 'direct'
        ? `direct:${conversationId}:${otherParticipantId || 'peer'}`
        : `group:${conversationId}:${keyVersion}`;

    if (keysCacheRef.current.has(cacheKey)) {
      const cached = keysCacheRef.current.get(cacheKey)!;
      activeKeyRef.current = cached;
      keyErrorRef.current = null;
      return cached;
    }

    try {
      if (conversationType === 'direct') {
        let peer = otherParticipantRef.current || otherParticipant;

        // Fallback: If otherParticipant is not populated yet, look up peer directly from conversation_members
        if (!peer) {
          const { data: memberRec } = await supabase
            .from('conversation_members')
            .select('user_id')
            .eq('conversation_id', conversationId)
            .neq('user_id', currentUser.id)
            .maybeSingle();

          if (memberRec?.user_id) {
            const { data: prof } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', memberRec.user_id)
              .maybeSingle();

            if (prof) peer = prof as Profile;
          }
        }

        if (!peer) {
          keyErrorRef.current = 'Could not identify recipient in this conversation.';
          return null;
        }

        // Fetch peer public key
        const { data: peerKeyRecord, error: keyErr } = await supabase
          .from('user_keys')
          .select('public_key')
          .eq('user_id', peer.id)
          .maybeSingle();

        if (keyErr || !peerKeyRecord?.public_key) {
          const peerName = peer.display_name || peer.username || 'Recipient';
          keyErrorRef.current = `${peerName} has not initialized or published their encryption key yet.`;
          console.warn('Peer has not published public key yet:', keyErr?.message);
          return null;
        }

        const pairwiseKey = await derivePairwiseKey(
          currentKeyPair.privateKeyJwk,
          peerKeyRecord.public_key as JsonWebKey,
          peer.id
        );

        keysCacheRef.current.set(cacheKey, pairwiseKey);
        activeKeyRef.current = pairwiseKey;
        keyErrorRef.current = null;
        return pairwiseKey;
      } else {
        // Group Conversation: Fetch group member key envelope
        const { data: memberKeyRecord } = await supabase
          .from('group_member_keys')
          .select('*')
          .eq('group_id', conversationId)
          .eq('key_version', keyVersion)
          .eq('user_id', currentUser.id)
          .maybeSingle();

        if (!memberKeyRecord) {
          keyErrorRef.current = 'No group encryption key found for your account in this group.';
          console.warn('No group key envelope found for user in this group');
          return null;
        }

        // Fetch creator's public key who encrypted this group key
        const creatorId = memberKeyRecord.created_by || currentUser.id;
        let creatorPublicJwk = currentKeyPair.publicKeyJwk;

        if (creatorId !== currentUser.id) {
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
          currentKeyPair.privateKeyJwk,
          creatorPublicJwk,
          conversationId,
          keyVersion
        );

        keysCacheRef.current.set(cacheKey, groupKey);
        activeKeyRef.current = groupKey;
        keyErrorRef.current = null;
        return groupKey;
      }
    } catch (err) {
      console.error('Failed to resolve active encryption key:', err);
      keyErrorRef.current = 'Failed to derive cryptographic shared secret.';
      return null;
    }
  }, [user?.id, !!keyPair, conversationId, conversationType, otherParticipantId, keyVersion, supabase]);

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
      prevConversationIdRef.current = null;
      return;
    }

    // Only clear messages if switching to a DIFFERENT conversation
    if (prevConversationIdRef.current !== conversationId) {
      setMessages([]);
      prevConversationIdRef.current = conversationId;
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
  }, [conversationId, user?.id, resolveActiveKey, supabase, decryptSingleMessage]);

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
  }, [conversationId, user?.id, supabase, decryptSingleMessage, resolveActiveKey]);

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
          throw new Error(
            keyErrorRef.current || 'Encryption key could not be established'
          );
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
        const errMsg = err instanceof Error ? err.message : 'Failed to send encrypted message';
        console.error('Failed to send encrypted message:', errMsg, err);
        // Mark message with error in UI
        setMessages((prev) =>
          prev.map((m) =>
            m.id === tempId ? { ...m, decryptionError: errMsg } : m
          )
        );
      } finally {
        setSending(false);
      }
    },
    [conversationId, user?.id, keyVersion, conversationType, resolveActiveKey, supabase]
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
