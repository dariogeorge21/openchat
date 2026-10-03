'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { UIConversation } from '@/types/chat';
import { Profile } from '@/types/database';
import { useAuth } from '@/contexts/auth-context';
import { useUserSearch } from '@/hooks/use-user-search';
import {
  Users,
  ShieldCheck,
  UserPlus,
  UserMinus,
  Crown,
  LogOut,
  Key,
  Loader2,
  Lock,
  Search,
} from 'lucide-react';

interface GroupDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conversation: UIConversation | null;
  onAddMember: (groupId: string, userId: string) => Promise<void>;
  onRemoveMember: (groupId: string, userId: string) => Promise<void>;
  onLeaveGroup: (groupId: string) => Promise<void>;
  onUpdateRole: (groupId: string, userId: string, role: 'admin' | 'member') => Promise<void>;
}

export function GroupDetailsModal({
  open,
  onOpenChange,
  conversation,
  onAddMember,
  onRemoveMember,
  onLeaveGroup,
  onUpdateRole,
}: GroupDetailsModalProps) {
  const { user } = useAuth();
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [processingUser, setProcessingUser] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const { query, setQuery, results, loading: searchLoading } = useUserSearch();

  if (!conversation || conversation.type !== 'group') return null;

  const currentMember = conversation.members?.find((m) => m.user_id === user?.id);
  const isCurrentAdmin = currentMember?.role === 'admin';
  const existingMemberIds = new Set(conversation.members?.map((m) => m.user_id) || []);

  const handleAdd = async (prof: Profile) => {
    try {
      setProcessingUser(prof.id);
      setActionError(null);
      await onAddMember(conversation.id, prof.id);
      setIsAddingMember(false);
      setQuery('');
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : 'Failed to add member');
    } finally {
      setProcessingUser(null);
    }
  };

  const handleRemove = async (memberUserId: string) => {
    if (!window.confirm('Remove member? A new group encryption key will be automatically generated and rotated for all remaining members.')) {
      return;
    }
    try {
      setProcessingUser(memberUserId);
      setActionError(null);
      await onRemoveMember(conversation.id, memberUserId);
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : 'Failed to remove member');
    } finally {
      setProcessingUser(null);
    }
  };

  const handleLeave = async () => {
    if (!window.confirm('Are you sure you want to leave this group?')) return;
    try {
      await onLeaveGroup(conversation.id);
      onOpenChange(false);
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : 'Failed to leave group');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[480px] bg-white dark:bg-[#202c33] border border-[#e9edef] dark:border-[#2a3942] rounded-2xl p-6 text-[#111b21] dark:text-[#e9edef] shadow-2xl">
        <DialogHeader className="space-y-1 text-left">
          <DialogTitle className="text-lg font-semibold tracking-tight text-[#111b21] dark:text-[#e9edef] flex items-center gap-2">
            <Users className="w-5 h-5 text-[#00A884]" />
            <span>Group Info &bull; {conversation.name}</span>
          </DialogTitle>
        </DialogHeader>

        {actionError && (
          <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs">
            {actionError}
          </div>
        )}

        {/* Cryptographic Key Status Card */}
        <div className="p-3.5 rounded-xl bg-[#f0f2f5] dark:bg-[#111b21] border border-[#e9edef] dark:border-[#222d34] space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[#111b21] dark:text-[#e9edef] flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-[#66CCF2]" />
              <span>E2EE Key Generation: v{conversation.current_key_version}</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#00A884]/10 text-[#00A884] text-[10px] font-semibold uppercase tracking-wider">
              Forward Secure
            </span>
          </div>
          <p className="text-[11px] text-[#667781] dark:text-[#8696a0] leading-relaxed">
            Messages are encrypted using AES-256-GCM. When an admin removes a member, the group key is automatically rotated to prevent the departed member from reading future messages.
          </p>
        </div>

        {/* Members Header */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#667781] dark:text-[#8696a0]">
            {conversation.members?.length || 0} Members
          </span>

          {isCurrentAdmin && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsAddingMember(!isAddingMember)}
              className="h-8 rounded-lg text-xs gap-1.5 text-[#00A884] border-[#00A884]/40 hover:bg-[#00A884]/10"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{isAddingMember ? 'Close Add' : 'Add Member'}</span>
            </Button>
          )}
        </div>

        {/* Add Member Search Dropdown */}
        {isAddingMember && (
          <div className="p-3 rounded-xl bg-[#f0f2f5] dark:bg-[#111b21] space-y-2 border border-[#e9edef] dark:border-[#2a3942] animate-in fade-in-50">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8696a0]" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search user to add..."
                className="w-full h-8 pl-8 pr-3 text-xs rounded-lg bg-white dark:bg-[#202c33] border border-transparent focus:border-[#00A884] focus:outline-hidden text-[#111b21] dark:text-[#e9edef] placeholder-[#8696a0]"
              />
            </div>

            <div className="max-h-[140px] overflow-y-auto space-y-1">
              {searchLoading ? (
                <div className="py-4 text-center text-xs text-[#8696a0]">Searching...</div>
              ) : (
                results
                  .filter((r) => !existingMemberIds.has(r.id))
                  .map((prof) => (
                    <button
                      key={prof.id}
                      onClick={() => handleAdd(prof)}
                      disabled={processingUser === prof.id}
                      className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white dark:hover:bg-[#202c33] text-left transition-colors cursor-pointer text-xs"
                    >
                      <span className="font-medium truncate">{prof.display_name}</span>
                      {processingUser === prof.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#00A884]" />
                      ) : (
                        <span className="text-[11px] text-[#00A884] font-medium">+ Add</span>
                      )}
                    </button>
                  ))
              )}
            </div>
          </div>
        )}

        {/* Member List */}
        <div className="max-h-[220px] overflow-y-auto space-y-1.5 pr-1">
          {conversation.members?.map((m) => {
            const isMe = m.user_id === user?.id;
            const isTargetAdmin = m.role === 'admin';
            return (
              <div
                key={m.id}
                className="flex items-center justify-between p-2 rounded-xl hover:bg-[#f0f2f5] dark:hover:bg-[#111b21] transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-[#dfe5e7] dark:bg-[#374248] shrink-0">
                    {m.profile?.avatar_url ? (
                      <img
                        src={m.profile.avatar_url}
                        alt={m.profile.display_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs font-bold text-[#8696a0]">
                        {m.profile?.display_name?.charAt(0) || 'U'}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-[#111b21] dark:text-[#e9edef] truncate">
                      {m.profile?.display_name || 'Member'} {isMe && '(You)'}
                    </p>
                    <p className="text-[10px] text-[#667781] dark:text-[#8696a0] truncate">
                      {m.profile?.username ? `@${m.profile.username}` : 'Member'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {isTargetAdmin && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#00A884]/15 text-[#00A884] text-[10px] font-semibold">
                      <Crown className="w-3 h-3" />
                      <span>Admin</span>
                    </span>
                  )}

                  {isCurrentAdmin && !isMe && (
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          onUpdateRole(
                            conversation.id,
                            m.user_id,
                            isTargetAdmin ? 'member' : 'admin'
                          )
                        }
                        className="h-7 text-[10px] px-2 text-[#8696a0] hover:text-[#111b21] dark:hover:text-[#e9edef]"
                        title={isTargetAdmin ? 'Dismiss as admin' : 'Make group admin'}
                      >
                        {isTargetAdmin ? 'Demote' : 'Promote'}
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemove(m.user_id)}
                        disabled={processingUser === m.user_id}
                        className="h-7 w-7 p-0 text-red-500 hover:bg-red-500/10 rounded-lg"
                        title="Remove member and rotate encryption key"
                      >
                        {processingUser === m.user_id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <UserMinus className="w-3.5 h-3.5" />
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Leave Group */}
        <div className="pt-3 border-t border-[#e9edef] dark:border-[#2a3942] flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLeave}
            className="text-red-500 hover:text-red-600 hover:bg-red-500/10 text-xs gap-1.5 rounded-lg"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Leave Group</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-lg text-xs"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
