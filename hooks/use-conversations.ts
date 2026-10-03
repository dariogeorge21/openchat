'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/auth-context';
import { UIConversation } from '@/types/chat';
import {
  Conversation,
  ConversationMember,
  Profile,
  DBMessage,
} from '@/types/database';
import {
  generateGroupKey,
  wrapGroupKeyForMember,
  derivePairwiseKey,
  decryptDirectMessage,
  decryptGroupMessage,
  unwrapGroupKey,
} from '@/lib/crypto/e2ee';
import { RealtimeChannel } from '@supabase/supabase-js';

export function useConversations() {
  const { user, keyPair } = useAuth();
  const [supabase] = useState(() => createClient());

  const [conversations, setConversations] = useState<UIConversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<UIConversation | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const channelRef = useRef<RealtimeChannel | null>(null);

  // Helper: decrypt the latest message for preview in sidebar
  const decryptLastMessage = useCallback(
    async (
      lastMsg: DBMessage,
      conv: Conversation,
      otherParticipant?: Profile
    ) => {
      if (!user || !keyPair) return null;

      try {
        if (conv.type === 'direct' && otherParticipant) {
          const { data: peerKeyRecord } = await supabase
            .from('user_keys')
            .select('public_key')
            .eq('user_id', otherParticipant.id)
            .maybeSingle();

          if (!peerKeyRecord?.public_key) return null;

          const pairwiseKey = await derivePairwiseKey(
            keyPair.privateKeyJwk,
            peerKeyRecord.public_key as JsonWebKey,
            otherParticipant.id
          );

          const plaintext = await decryptDirectMessage(
            lastMsg.ciphertext,
            lastMsg.iv,
            pairwiseKey
          );

          return {
            id: lastMsg.id,
            conversationId: lastMsg.conversation_id,
            senderId: lastMsg.sender_id,
            plaintext,
            isDecrypted: true,
            keyVersion: lastMsg.key_version,
            status: lastMsg.status,
            createdAt: lastMsg.created_at,
          };
        } else if (conv.type === 'group') {
          const { data: memberKeyRecord } = await supabase
            .from('group_member_keys')
            .select('*')
            .eq('group_id', conv.id)
            .eq('key_version', conv.current_key_version)
            .eq('user_id', user.id)
            .maybeSingle();

          if (!memberKeyRecord) return null;

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
            conv.id,
            conv.current_key_version
          );

          const plaintext = await decryptGroupMessage(
            lastMsg.ciphertext,
            lastMsg.iv,
            groupKey
          );

          return {
            id: lastMsg.id,
            conversationId: lastMsg.conversation_id,
            senderId: lastMsg.sender_id,
            plaintext,
            isDecrypted: true,
            keyVersion: lastMsg.key_version,
            status: lastMsg.status,
            createdAt: lastMsg.created_at,
          };
        }
      } catch (err) {
        return {
          id: lastMsg.id,
          conversationId: lastMsg.conversation_id,
          senderId: lastMsg.sender_id,
          plaintext: 'Encrypted message',
          isDecrypted: false,
          keyVersion: lastMsg.key_version,
          status: lastMsg.status,
          createdAt: lastMsg.created_at,
        };
      }
      return null;
    },
    [user, keyPair, supabase]
  );

  // Fetch all conversations for current user
  const fetchConversations = useCallback(async () => {
    if (!user) {
      setConversations([]);
      setLoading(false);
      return;
    }

    try {
      // 1. Get user's conversation memberships
      const { data: memberRows, error: memberErr } = await supabase
        .from('conversation_members')
        .select('conversation_id, role, last_read_at')
        .eq('user_id', user.id);

      if (memberErr || !memberRows || memberRows.length === 0) {
        setConversations([]);
        setLoading(false);
        return;
      }

      const convIds = memberRows.map((m) => m.conversation_id);

      // 2. Fetch conversation records
      const { data: convData, error: convErr } = await supabase
        .from('conversations')
        .select('*')
        .in('id', convIds)
        .order('last_message_at', { ascending: false });

      if (convErr || !convData) {
        setConversations([]);
        setLoading(false);
        return;
      }

      // 3. For each conversation, fetch all members with their profiles
      const { data: allMembersData } = await supabase
        .from('conversation_members')
        .select('*, profile:profiles(*)')
        .in('conversation_id', convIds);

      // 4. For each conversation, fetch the last message for preview
      const processed: UIConversation[] = await Promise.all(
        convData.map(async (conv: Conversation) => {
          const members = (allMembersData || []).filter(
            (m) => m.conversation_id === conv.id
          ) as (ConversationMember & { profile: Profile })[];

          let otherParticipant: Profile | undefined = undefined;
          if (conv.type === 'direct') {
            const other = members.find((m) => m.user_id !== user.id);
            otherParticipant = other?.profile;
          }

          // Fetch last message
          const { data: lastMessages } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false })
            .limit(1);

          let lastDecrypted = null;
          if (lastMessages && lastMessages.length > 0) {
            lastDecrypted = await decryptLastMessage(
              lastMessages[0] as DBMessage,
              conv,
              otherParticipant
            );
          }

          // Compute unread count
          const userMemberRecord = members.find((m) => m.user_id === user.id);
          let unreadCount = 0;
          if (userMemberRecord?.last_read_at) {
            const { count } = await supabase
              .from('messages')
              .select('*', { count: 'exact', head: true })
              .eq('conversation_id', conv.id)
              .neq('sender_id', user.id)
              .gt('created_at', userMemberRecord.last_read_at);

            unreadCount = count || 0;
          }

          return {
            ...conv,
            otherParticipant,
            members,
            lastDecryptedMessage: lastDecrypted,
            unreadCount,
          };
        })
      );

      setConversations(processed);

      // If active conversation exists, update its reference with latest metadata
      setActiveConversation((current) => {
        if (!current) return null;
        const updated = processed.find((p) => p.id === current.id);
        return updated || current;
      });
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
    } finally {
      setLoading(false);
    }
  }, [user, supabase, decryptLastMessage]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Realtime subscription for conversation updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('openchat:conversations_global')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'conversations' },
        () => {
          fetchConversations();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'conversation_members' },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [user, supabase, fetchConversations]);

  // Create or retrieve 1:1 direct conversation
  const createDirectConversation = useCallback(
    async (targetUserId: string): Promise<string> => {
      if (!user) throw new Error('Not authenticated');
      if (targetUserId === user.id) throw new Error('Cannot start conversation with yourself');

      // Check if conversation already exists between both users
      const { data: myMemberships } = await supabase
        .from('conversation_members')
        .select('conversation_id')
        .eq('user_id', user.id);

      if (myMemberships && myMemberships.length > 0) {
        const myConvIds = myMemberships.map((m) => m.conversation_id);
        const { data: peerMembership } = await supabase
          .from('conversation_members')
          .select('conversation_id, conversation:conversations(type)')
          .eq('user_id', targetUserId)
          .in('conversation_id', myConvIds);

        const existingDirect = peerMembership?.find(
          (m: unknown) => (m as { conversation?: { type: string } })?.conversation?.type === 'direct'
        );

        if (existingDirect) {
          await fetchConversations();
          return existingDirect.conversation_id;
        }
      }

      // Create new conversation
      const { data: newConv, error: convErr } = await supabase
        .from('conversations')
        .insert({
          type: 'direct',
          created_by: user.id,
          current_key_version: 1,
        })
        .select()
        .single();

      if (convErr || !newConv) throw convErr || new Error('Failed to create conversation');

      // Insert both participants
      const { error: memberErr } = await supabase
        .from('conversation_members')
        .insert([
          { conversation_id: newConv.id, user_id: user.id, role: 'admin' },
          { conversation_id: newConv.id, user_id: targetUserId, role: 'member' },
        ]);

      if (memberErr) throw memberErr;

      await fetchConversations();
      return newConv.id;
    },
    [user, supabase, fetchConversations]
  );

  // Create encrypted group conversation with group key envelope distribution
  const createGroupConversation = useCallback(
    async (
      name: string,
      memberUserIds: string[],
      avatarUrl?: string
    ): Promise<string> => {
      if (!user || !keyPair) throw new Error('Not authenticated or crypto not initialized');
      if (!name.trim()) throw new Error('Group name cannot be empty');

      // 1. Create conversation record
      const { data: newGroup, error: groupErr } = await supabase
        .from('conversations')
        .insert({
          type: 'group',
          name: name.trim(),
          avatar_url: avatarUrl || null,
          created_by: user.id,
          current_key_version: 1,
        })
        .select()
        .single();

      if (groupErr || !newGroup) throw groupErr || new Error('Failed to create group');

      // 2. Add members to conversation_members
      const allMembers = Array.from(new Set([user.id, ...memberUserIds]));
      const memberRecords = allMembers.map((userId) => ({
        conversation_id: newGroup.id,
        user_id: userId,
        role: userId === user.id ? ('admin' as const) : ('member' as const),
      }));

      const { error: membersErr } = await supabase
        .from('conversation_members')
        .insert(memberRecords);

      if (membersErr) throw membersErr;

      // 3. Generate symmetric AES-256 group key GK_1
      const groupKey = await generateGroupKey();

      // 4. Fetch public keys of all members to wrap group key
      const { data: publicKeys } = await supabase
        .from('user_keys')
        .select('user_id, public_key')
        .in('user_id', allMembers);

      const keyRecordsToInsert = [];

      for (const memberId of allMembers) {
        let pubJwk: JsonWebKey;
        if (memberId === user.id) {
          pubJwk = keyPair.publicKeyJwk;
        } else {
          const rec = publicKeys?.find((k) => k.user_id === memberId);
          if (!rec?.public_key) {
            console.warn(`Member ${memberId} has not published public key yet`);
            continue;
          }
          pubJwk = rec.public_key as JsonWebKey;
        }

        const wrapped = await wrapGroupKeyForMember(
          groupKey,
          pubJwk,
          keyPair.privateKeyJwk
        );

        keyRecordsToInsert.push({
          group_id: newGroup.id,
          key_version: 1,
          user_id: memberId,
          encrypted_key: wrapped.encryptedKey,
          iv: wrapped.iv,
          created_by: user.id,
        });
      }

      if (keyRecordsToInsert.length > 0) {
        const { error: keyErr } = await supabase
          .from('group_member_keys')
          .insert(keyRecordsToInsert);

        if (keyErr) console.error('Failed to distribute group key envelopes:', keyErr);
      }

      await fetchConversations();
      return newGroup.id;
    },
    [user, keyPair, supabase, fetchConversations]
  );

  // Add member to group and distribute current group key
  const addMemberToGroup = useCallback(
    async (groupId: string, newUserId: string): Promise<void> => {
      if (!user || !keyPair) throw new Error('Not authenticated');

      // 1. Insert member
      const { error: memberErr } = await supabase
        .from('conversation_members')
        .insert({
          conversation_id: groupId,
          user_id: newUserId,
          role: 'member',
        });

      if (memberErr) throw memberErr;

      // 2. Fetch group conversation to get current key version
      const { data: group } = await supabase
        .from('conversations')
        .select('current_key_version, created_by')
        .eq('id', groupId)
        .single();

      if (!group) return;

      // 3. Fetch admin's own group key envelope to unwrap and re-wrap for new user
      const { data: adminKeyRecord } = await supabase
        .from('group_member_keys')
        .select('*')
        .eq('group_id', groupId)
        .eq('key_version', group.current_key_version)
        .eq('user_id', user.id)
        .maybeSingle();

      if (adminKeyRecord) {
        const creatorId = adminKeyRecord.created_by || user.id;
        let creatorPublicJwk = keyPair.publicKeyJwk;

        if (creatorId !== user.id) {
          const { data: cKey } = await supabase
            .from('user_keys')
            .select('public_key')
            .eq('user_id', creatorId)
            .maybeSingle();
          if (cKey?.public_key) creatorPublicJwk = cKey.public_key as JsonWebKey;
        }

        const groupKey = await unwrapGroupKey(
          adminKeyRecord.encrypted_key,
          adminKeyRecord.iv,
          keyPair.privateKeyJwk,
          creatorPublicJwk,
          groupId,
          group.current_key_version
        );

        // Fetch new member's public key
        const { data: newMemberKey } = await supabase
          .from('user_keys')
          .select('public_key')
          .eq('user_id', newUserId)
          .maybeSingle();

        if (newMemberKey?.public_key) {
          const wrapped = await wrapGroupKeyForMember(
            groupKey,
            newMemberKey.public_key as JsonWebKey,
            keyPair.privateKeyJwk
          );

          await supabase.from('group_member_keys').insert({
            group_id: groupId,
            key_version: group.current_key_version,
            user_id: newUserId,
            encrypted_key: wrapped.encryptedKey,
            iv: wrapped.iv,
            created_by: user.id,
          });
        }
      }

      await fetchConversations();
    },
    [user, keyPair, supabase, fetchConversations]
  );

  // Remove member from group with Forward-Secure Key Rotation
  const removeMemberFromGroup = useCallback(
    async (groupId: string, memberUserId: string): Promise<void> => {
      if (!user || !keyPair) throw new Error('Not authenticated');

      // 1. Delete member from group
      const { error: deleteErr } = await supabase
        .from('conversation_members')
        .delete()
        .eq('conversation_id', groupId)
        .eq('user_id', memberUserId);

      if (deleteErr) throw deleteErr;

      // 2. Fetch remaining active members
      const { data: remainingMembers } = await supabase
        .from('conversation_members')
        .select('user_id')
        .eq('conversation_id', groupId);

      if (!remainingMembers || remainingMembers.length === 0) return;

      // 3. Fetch conversation to determine next key version
      const { data: group } = await supabase
        .from('conversations')
        .select('current_key_version')
        .eq('id', groupId)
        .single();

      const nextVersion = (group?.current_key_version || 1) + 1;

      // 4. Generate fresh 256-bit AES-GCM group key GK_(v+1)
      const newGroupKey = await generateGroupKey();

      // 5. Wrap new group key ONLY for remaining active members
      const remainingIds = remainingMembers.map((m) => m.user_id);
      const { data: publicKeys } = await supabase
        .from('user_keys')
        .select('user_id, public_key')
        .in('user_id', remainingIds);

      const keyEnvelopes = [];
      for (const mId of remainingIds) {
        let pubJwk: JsonWebKey;
        if (mId === user.id) {
          pubJwk = keyPair.publicKeyJwk;
        } else {
          const rec = publicKeys?.find((k) => k.user_id === mId);
          if (!rec?.public_key) continue;
          pubJwk = rec.public_key as JsonWebKey;
        }

        const wrapped = await wrapGroupKeyForMember(
          newGroupKey,
          pubJwk,
          keyPair.privateKeyJwk
        );

        keyEnvelopes.push({
          group_id: groupId,
          key_version: nextVersion,
          user_id: mId,
          encrypted_key: wrapped.encryptedKey,
          iv: wrapped.iv,
          created_by: user.id,
        });
      }

      if (keyEnvelopes.length > 0) {
        await supabase.from('group_member_keys').insert(keyEnvelopes);
      }

      // 6. Update conversation current_key_version to nextVersion
      await supabase
        .from('conversations')
        .update({ current_key_version: nextVersion })
        .eq('id', groupId);

      await fetchConversations();
    },
    [user, keyPair, supabase, fetchConversations]
  );

  // Leave group
  const leaveGroup = useCallback(
    async (groupId: string): Promise<void> => {
      if (!user) throw new Error('Not authenticated');

      await supabase
        .from('conversation_members')
        .delete()
        .eq('conversation_id', groupId)
        .eq('user_id', user.id);

      if (activeConversation?.id === groupId) {
        setActiveConversation(null);
      }

      await fetchConversations();
    },
    [user, activeConversation, supabase, fetchConversations]
  );

  // Update member role (promote/demote admin)
  const updateMemberRole = useCallback(
    async (groupId: string, memberUserId: string, newRole: 'admin' | 'member'): Promise<void> => {
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('conversation_members')
        .update({ role: newRole })
        .eq('conversation_id', groupId)
        .eq('user_id', memberUserId);

      if (error) throw error;
      await fetchConversations();
    },
    [user, supabase, fetchConversations]
  );

  return {
    conversations,
    activeConversation,
    setActiveConversation,
    loading,
    refreshConversations: fetchConversations,
    createDirectConversation,
    createGroupConversation,
    addMemberToGroup,
    removeMemberFromGroup,
    leaveGroup,
    updateMemberRole,
  };
}
