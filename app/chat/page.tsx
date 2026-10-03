'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { useConversations } from '@/hooks/use-conversations';
import { usePresence } from '@/hooks/use-presence';
import { Sidebar } from '@/components/chat/sidebar';
import { ChatArea } from '@/components/chat/chat-area';
import { EmptyState } from '@/components/chat/empty-state';
import { NewChatModal } from '@/components/chat/new-chat-modal';
import { NewGroupModal } from '@/components/chat/new-group-modal';
import { GroupDetailsModal } from '@/components/chat/group-details-modal';
import { ProfileModal } from '@/components/chat/profile-modal';
import { Loader2 } from 'lucide-react';
import { Profile } from '@/types/database';

export default function ChatDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, isCryptoReady } = useAuth();

  const {
    conversations,
    activeConversation,
    setActiveConversation,
    loading: convsLoading,
    createDirectConversation,
    createGroupConversation,
    addMemberToGroup,
    removeMemberFromGroup,
    leaveGroup,
    updateMemberRole,
  } = useConversations();

  const { presenceMap, getPresence } = usePresence();

  // Modal States
  const [newChatOpen, setNewChatOpen] = useState(false);
  const [newGroupOpen, setNewGroupOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [groupDetailsOpen, setGroupDetailsOpen] = useState(false);

  // Authentication guard
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [user, authLoading, router]);

  if (authLoading || (!user && typeof window !== 'undefined')) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#f0f2f5] dark:bg-[#111b21] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#00A884]" />
        <p className="text-xs text-[#667781] dark:text-[#8696a0]">
          Securing cryptographic session...
        </p>
      </div>
    );
  }

  const handleSelectUserForChat = async (targetProfile: Profile) => {
    try {
      const convId = await createDirectConversation(targetProfile.id);
      setActiveConversation((current) => {
        if (current?.id === convId) return current;
        const matched = conversations.find((c) => c.id === convId);
        return matched || current;
      });
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : (err as { message?: string })?.message ||
            (err as { details?: string })?.details ||
            JSON.stringify(err);
      console.error('Could not create direct conversation:', errorMsg, err);
      throw err;
    }
  };

  const handleCreateGroup = async (name: string, memberIds: string[]) => {
    try {
      const groupId = await createGroupConversation(name, memberIds);
      setActiveConversation((current) => {
        if (current?.id === groupId) return current;
        const matched = conversations.find((c) => c.id === groupId);
        return matched || current;
      });
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : (err as { message?: string })?.message ||
            (err as { details?: string })?.details ||
            JSON.stringify(err);
      console.error('Could not create group:', errorMsg, err);
      throw err;
    }
  };

  // Resolve peer presence for active conversation if direct
  const peerPresence =
    activeConversation?.type === 'direct' && activeConversation.otherParticipant
      ? getPresence(activeConversation.otherParticipant.id)
      : null;

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-[#f0f2f5] dark:bg-[#111b21] text-[#111b21] dark:text-[#e9edef]">
      {/* Sidebar: Visible on desktop, or on mobile when no conversation is active */}
      <div
        className={`h-full ${
          activeConversation ? 'hidden md:flex shrink-0' : 'flex w-full md:w-auto shrink-0'
        }`}
      >
        <Sidebar
          conversations={conversations}
          activeConversation={activeConversation}
          onSelectConversation={(conv) => setActiveConversation(conv)}
          onOpenNewChat={() => setNewChatOpen(true)}
          onOpenNewGroup={() => setNewGroupOpen(true)}
          onOpenProfile={() => setProfileOpen(true)}
          presenceMap={presenceMap}
        />
      </div>

      {/* Main Chat Area / Empty State */}
      <main
        className={`flex-1 h-full ${
          activeConversation ? 'flex' : 'hidden md:flex'
        }`}
      >
        {activeConversation ? (
          <ChatArea
            conversation={activeConversation}
            onBack={() => setActiveConversation(null)}
            onOpenDetails={() => {
              if (activeConversation.type === 'group') {
                setGroupDetailsOpen(true);
              } else {
                setProfileOpen(true);
              }
            }}
            presenceText={peerPresence?.statusText}
            isPeerOnline={peerPresence?.isOnline}
          />
        ) : (
          <EmptyState onStartChat={() => setNewChatOpen(true)} />
        )}
      </main>

      {/* Modals */}
      <NewChatModal
        open={newChatOpen}
        onOpenChange={setNewChatOpen}
        onSelectUser={handleSelectUserForChat}
      />

      <NewGroupModal
        open={newGroupOpen}
        onOpenChange={setNewGroupOpen}
        onCreateGroup={handleCreateGroup}
      />

      <GroupDetailsModal
        open={groupDetailsOpen}
        onOpenChange={setGroupDetailsOpen}
        conversation={activeConversation}
        onAddMember={addMemberToGroup}
        onRemoveMember={removeMemberFromGroup}
        onLeaveGroup={leaveGroup}
        onUpdateRole={updateMemberRole}
      />

      <ProfileModal open={profileOpen} onOpenChange={setProfileOpen} />
    </div>
  );
}
