'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useUserSearch } from '@/hooks/use-user-search';
import { Profile } from '@/types/database';
import { Search, Loader2, User, ShieldCheck } from 'lucide-react';

interface NewChatModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectUser: (user: Profile) => Promise<void>;
}

export function NewChatModal({
  open,
  onOpenChange,
  onSelectUser,
}: NewChatModalProps) {
  const { query, setQuery, results, loading } = useUserSearch();
  const [startingChatWith, setStartingChatWith] = React.useState<string | null>(null);

  const handleSelect = async (profile: Profile) => {
    try {
      setStartingChatWith(profile.id);
      await onSelectUser(profile);
      onOpenChange(false);
    } catch (err) {
      console.error('Failed to initiate conversation:', err);
    } finally {
      setStartingChatWith(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[460px] bg-white dark:bg-[#202c33] border border-[#e9edef] dark:border-[#2a3942] rounded-2xl p-6 text-[#111b21] dark:text-[#e9edef] shadow-2xl">
        <DialogHeader className="space-y-1 text-left">
          <DialogTitle className="text-lg font-semibold tracking-tight text-[#111b21] dark:text-[#e9edef] flex items-center gap-2">
            <span>New Direct Chat</span>
            <ShieldCheck className="w-4 h-4 text-[#00A884]" />
          </DialogTitle>
          <DialogDescription className="text-xs text-[#667781] dark:text-[#8696a0]">
            Search for registered users to begin an end-to-end encrypted direct message session.
          </DialogDescription>
        </DialogHeader>

        {/* Search input */}
        <div className="relative mt-2">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8696a0]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or username..."
            className="w-full h-10 pl-10 pr-4 text-xs rounded-xl bg-[#f0f2f5] dark:bg-[#111b21] border border-transparent focus:border-[#00A884] focus:outline-hidden text-[#111b21] dark:text-[#e9edef] placeholder-[#8696a0] transition-colors"
            autoFocus
          />
        </div>

        {/* Results List */}
        <div className="mt-3 max-h-[320px] overflow-y-auto space-y-1 pr-1">
          {loading ? (
            <div className="py-8 flex flex-col items-center justify-center gap-2 text-xs text-[#8696a0]">
              <Loader2 className="w-5 h-5 animate-spin text-[#00A884]" />
              <span>Finding users...</span>
            </div>
          ) : results.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#8696a0]">
              {query.trim() ? 'No users found matching your search.' : 'No other users registered yet.'}
            </div>
          ) : (
            results.map((prof) => {
              const isSelected = startingChatWith === prof.id;
              return (
                <button
                  key={prof.id}
                  disabled={isSelected}
                  onClick={() => handleSelect(prof)}
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#f0f2f5] dark:hover:bg-[#111b21] text-left transition-colors cursor-pointer disabled:opacity-60 group"
                >
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-[#dfe5e7] dark:bg-[#374248] flex items-center justify-center shrink-0">
                    {prof.avatar_url ? (
                      <img
                        src={prof.avatar_url}
                        alt={prof.display_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5 text-[#8696a0]" />
                    )}
                    {prof.is_online && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#00A884] border-2 border-white dark:border-[#202c33]" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#111b21] dark:text-[#e9edef] truncate">
                      {prof.display_name}
                    </p>
                    <p className="text-[11px] text-[#667781] dark:text-[#8696a0] truncate">
                      {prof.username ? `@${prof.username}` : prof.about || 'Available'}
                    </p>
                  </div>

                  {isSelected && (
                    <Loader2 className="w-4 h-4 animate-spin text-[#00A884] shrink-0" />
                  )}
                </button>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
