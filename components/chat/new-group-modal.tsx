'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useUserSearch } from '@/hooks/use-user-search';
import { Profile } from '@/types/database';
import { Users, Search, Loader2, X, Check, Lock } from 'lucide-react';

interface NewGroupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateGroup: (name: string, memberIds: string[]) => Promise<void>;
}

export function NewGroupModal({
  open,
  onOpenChange,
  onCreateGroup,
}: NewGroupModalProps) {
  const [groupName, setGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<Profile[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { query, setQuery, results, loading } = useUserSearch();

  const toggleSelectUser = (profile: Profile) => {
    setSelectedUsers((prev) => {
      const exists = prev.some((u) => u.id === profile.id);
      if (exists) {
        return prev.filter((u) => u.id !== profile.id);
      }
      return [...prev, profile];
    });
  };

  const handleCreate = async () => {
    if (!groupName.trim()) {
      setError('Please enter a group name');
      return;
    }
    if (selectedUsers.length === 0) {
      setError('Please select at least one member');
      return;
    }

    try {
      setIsCreating(true);
      setError(null);
      await onCreateGroup(
        groupName.trim(),
        selectedUsers.map((u) => u.id)
      );
      setGroupName('');
      setSelectedUsers([]);
      onOpenChange(false);
    } catch (err: unknown) {
      console.error('Failed to create group:', err);
      setError(err instanceof Error ? err.message : 'Failed to create group');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[480px] bg-white dark:bg-[#202c33] border border-[#e9edef] dark:border-[#2a3942] rounded-2xl p-6 text-[#111b21] dark:text-[#e9edef] shadow-2xl">
        <DialogHeader className="space-y-1 text-left">
          <DialogTitle className="text-lg font-semibold tracking-tight text-[#111b21] dark:text-[#e9edef] flex items-center gap-2">
            <Users className="w-5 h-5 text-[#00A884]" />
            <span>Create Encrypted Group</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-[#667781] dark:text-[#8696a0]">
            A dedicated 256-bit AES-GCM group key will be generated locally and distributed in encrypted envelopes to each member.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs">
            {error}
          </div>
        )}

        {/* Group Name */}
        <div className="space-y-1.5 mt-2">
          <label className="text-xs font-medium text-[#111b21] dark:text-[#e9edef]">
            Group Subject
          </label>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="e.g. Project Phoenix"
            className="w-full h-10 px-3.5 text-xs rounded-xl bg-[#f0f2f5] dark:bg-[#111b21] border border-transparent focus:border-[#00A884] focus:outline-hidden text-[#111b21] dark:text-[#e9edef] placeholder-[#8696a0] transition-colors"
          />
        </div>

        {/* Selected Users Chips */}
        {selectedUsers.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1 max-h-[80px] overflow-y-auto">
            {selectedUsers.map((u) => (
              <span
                key={u.id}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00A884]/10 dark:bg-[#00A884]/20 text-[#00A884] text-xs font-medium border border-[#00A884]/30"
              >
                <span>{u.display_name}</span>
                <button
                  type="button"
                  onClick={() => toggleSelectUser(u)}
                  className="hover:text-red-500 transition-colors cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* User Search */}
        <div className="space-y-2 pt-1">
          <label className="text-xs font-medium text-[#111b21] dark:text-[#e9edef]">
            Add Members ({selectedUsers.length} selected)
          </label>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8696a0]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search contacts to add..."
              className="w-full h-9 pl-10 pr-4 text-xs rounded-xl bg-[#f0f2f5] dark:bg-[#111b21] border border-transparent focus:border-[#00A884] focus:outline-hidden text-[#111b21] dark:text-[#e9edef] placeholder-[#8696a0] transition-colors"
            />
          </div>
        </div>

        {/* User Selection List */}
        <div className="max-h-[200px] overflow-y-auto space-y-1 pr-1 border border-[#e9edef] dark:border-[#2a3942] rounded-xl p-1 bg-[#fafafa] dark:bg-[#111b21]/50">
          {loading ? (
            <div className="py-6 flex items-center justify-center gap-2 text-xs text-[#8696a0]">
              <Loader2 className="w-4 h-4 animate-spin text-[#00A884]" />
              <span>Searching...</span>
            </div>
          ) : results.length === 0 ? (
            <div className="py-6 text-center text-xs text-[#8696a0]">No users found.</div>
          ) : (
            results.map((prof) => {
              const isSelected = selectedUsers.some((u) => u.id === prof.id);
              return (
                <button
                  key={prof.id}
                  type="button"
                  onClick={() => toggleSelectUser(prof)}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#00A884]/15 dark:bg-[#00A884]/20'
                      : 'hover:bg-white dark:hover:bg-[#202c33]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-[#dfe5e7] dark:bg-[#374248] shrink-0">
                      {prof.avatar_url ? (
                        <img
                          src={prof.avatar_url}
                          alt={prof.display_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs font-bold text-[#8696a0]">
                          {prof.display_name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-[#111b21] dark:text-[#e9edef] truncate">
                        {prof.display_name}
                      </p>
                      <p className="text-[10px] text-[#667781] dark:text-[#8696a0] truncate">
                        {prof.username ? `@${prof.username}` : prof.about || 'Member'}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-[#00A884] border-[#00A884] text-white'
                        : 'border-[#8696a0]'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-[#e9edef] dark:border-[#2a3942] flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-[#8696a0]">
            <Lock className="w-3 h-3 text-[#00A884]" />
            <span>Group AES-256 Envelope</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isCreating}
              onClick={() => onOpenChange(false)}
              className="rounded-lg text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={isCreating || !groupName.trim() || selectedUsers.length === 0}
              onClick={handleCreate}
              className="bg-[#00A884] hover:bg-[#008f6f] text-white rounded-lg text-xs font-medium flex items-center gap-1.5"
            >
              {isCreating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{isCreating ? 'Encrypting & Creating...' : 'Create Group'}</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
