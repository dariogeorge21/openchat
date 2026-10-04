'use client';

import React, { useState, useRef, useEffect } from 'react';
import { UIConversation } from '@/types/chat';
import { useAuth } from '@/contexts/auth-context';
import { ThemeToggle } from '@/components/theme-toggle';
import { ClearChatModal } from './clear-chat-modal';
import {
  MessageSquarePlus,
  Users,
  Search,
  Check,
  CheckCheck,
  ShieldCheck,
  Filter,
  MoreVertical,
  Trash2,
  Archive,
  ArchiveRestore,
  ArrowLeft,
  ChevronDown,
} from 'lucide-react';

interface SidebarProps {
  conversations: UIConversation[];
  activeConversation: UIConversation | null;
  onSelectConversation: (conv: UIConversation) => void;
  onOpenNewChat: () => void;
  onOpenNewGroup: () => void;
  onOpenProfile: () => void;
  presenceMap: Record<string, { isOnline: boolean; lastSeen: string }>;
  onClearChat?: (convId: string) => Promise<void>;
  onArchiveChat?: (convId: string, archive?: boolean) => Promise<void>;
}

function formatConversationTime(dateString: string): string {
  try {
    const d = new Date(dateString);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    return d.toLocaleDateString(undefined, { month: 'numeric', day: 'numeric', year: '2-digit' });
  } catch {
    return '';
  }
}

export function Sidebar({
  conversations,
  activeConversation,
  onSelectConversation,
  onOpenNewChat,
  onOpenNewGroup,
  onOpenProfile,
  presenceMap,
  onClearChat,
  onArchiveChat,
}: SidebarProps) {
  const { user, profile } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'groups' | 'archived'>('all');
  const [openMenuConvId, setOpenMenuConvId] = useState<string | null>(null);
  const [confirmClearConv, setConfirmClearConv] = useState<UIConversation | null>(null);
  const [isClearing, setIsClearing] = useState(false);
  const sidebarMenuRef = useRef<HTMLDivElement>(null);

  const archivedCount = conversations.filter((c) => Boolean(c.is_archived)).length;

  useEffect(() => {
    if (archivedCount === 0 && filterType === 'archived') {
      setFilterType('all');
    }
  }, [archivedCount, filterType]);

  useEffect(() => {
    if (!openMenuConvId) return;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      if (sidebarMenuRef.current && !sidebarMenuRef.current.contains(e.target as Node)) {
        setOpenMenuConvId(null);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenMenuConvId(null);
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
  }, [openMenuConvId]);

  const filteredConversations = conversations.filter((c) => {
    // Filter by archived status
    if (filterType === 'archived') {
      if (!c.is_archived) return false;
    } else {
      if (c.is_archived) return false;
      if (filterType === 'unread' && c.unreadCount <= 0) return false;
      if (filterType === 'groups' && c.type !== 'group') return false;
    }

    // Filter by search query
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const title =
      c.type === 'direct'
        ? c.otherParticipant?.display_name?.toLowerCase() || ''
        : c.name?.toLowerCase() || '';

    const lastMsg = c.lastDecryptedMessage?.plaintext?.toLowerCase() || '';
    return title.includes(q) || lastMsg.includes(q);
  });

  return (
    <aside className="w-full md:w-[380px] lg:w-[420px] h-full flex flex-col bg-white dark:bg-[#111b21] border-r border-[#e9edef] dark:border-[#222d34] select-none">
      {/* Top Header */}
      <header className="h-16 px-4 bg-[#f0f2f5] dark:bg-[#202c33] flex items-center justify-between z-10 shrink-0">
        {/* User profile avatar trigger */}
        <button
          onClick={onOpenProfile}
          className="flex items-center gap-2.5 p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer group"
          title="Profile & E2EE Settings"
        >
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-[#dfe5e7] dark:bg-[#374248] flex items-center justify-center border border-[#00A884]">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.display_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm font-bold text-[#8696a0]">
                {profile?.display_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </span>
            )}
          </div>
          <div className="hidden sm:block text-left min-w-0 max-w-[120px]">
            <p className="text-xs font-semibold text-[#111b21] dark:text-[#e9edef] truncate">
              {profile?.display_name || 'My Account'}
            </p>
            <p className="text-[10px] text-[#00A884] flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>E2EE Active</span>
            </p>
          </div>
        </button>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 text-[#54656f] dark:text-[#aebac1]">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* New Group */}
          <button
            onClick={onOpenNewGroup}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 hover:text-[#111b21] dark:hover:text-[#e9edef] transition-colors cursor-pointer"
            title="New Group"
          >
            <Users className="w-5 h-5" />
          </button>

          {/* New Direct Chat */}
          <button
            onClick={onOpenNewChat}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 hover:text-[#111b21] dark:hover:text-[#e9edef] transition-colors cursor-pointer"
            title="New Chat"
          >
            <MessageSquarePlus className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Search Bar & Filter Tabs */}
      <div className="p-2.5 space-y-2 border-b border-[#e9edef] dark:border-[#222d34] bg-white dark:bg-[#111b21] shrink-0">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8696a0]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search or start new chat"
            className="w-full h-9 pl-10 pr-4 text-xs rounded-lg bg-[#f0f2f5] dark:bg-[#202c33] border border-transparent focus:border-[#00A884] focus:outline-hidden text-[#111b21] dark:text-[#e9edef] placeholder-[#8696a0] transition-colors"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 pt-0.5">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${filterType === 'all'
              ? 'bg-[#00A884]/15 dark:bg-[#00A884]/20 text-[#00A884]'
              : 'bg-[#f0f2f5] dark:bg-[#202c33] text-[#54656f] dark:text-[#8696a0] hover:text-[#111b21] dark:hover:text-[#e9edef]'
              }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterType('unread')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${filterType === 'unread'
              ? 'bg-[#00A884]/15 dark:bg-[#00A884]/20 text-[#00A884]'
              : 'bg-[#f0f2f5] dark:bg-[#202c33] text-[#54656f] dark:text-[#8696a0] hover:text-[#111b21] dark:hover:text-[#e9edef]'
              }`}
          >
            Unread
          </button>
          <button
            onClick={() => setFilterType('groups')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${filterType === 'groups'
              ? 'bg-[#00A884]/15 dark:bg-[#00A884]/20 text-[#00A884]'
              : 'bg-[#f0f2f5] dark:bg-[#202c33] text-[#54656f] dark:text-[#8696a0] hover:text-[#111b21] dark:hover:text-[#e9edef]'
              }`}
          >
            Groups
          </button>
        </div>

        {/* Archived Chats Option (Show only if a chat is archived - else do not show) */}
        {archivedCount > 0 && (
          <button
            type="button"
            onClick={() => setFilterType(filterType === 'archived' ? 'all' : 'archived')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer mt-1 ${filterType === 'archived'
              ? 'bg-[#00A884]/15 dark:bg-[#00A884]/20 text-[#00A884]'
              : 'bg-[#f0f2f5] dark:bg-[#202c33] text-[#111b21] dark:text-[#e9edef] hover:bg-[#e9edef] dark:hover:bg-[#2a3942]'
              }`}
          >
            <div className="flex items-center gap-2.5">
              <Archive className="w-4 h-4 text-[#00A884]" />
              <span>Archived</span>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#00A884] text-white">
              {archivedCount}
            </span>
          </button>
        )}
      </div>

      {/* Archived View Header Banner */}
      {filterType === 'archived' && (
        <div className="flex items-center justify-between px-4 py-2 bg-[#f0f2f5] dark:bg-[#202c33] border-b border-[#e9edef] dark:border-[#222d34] shrink-0">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className="flex items-center gap-1.5 text-xs text-[#00A884] font-medium hover:underline cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to all chats</span>
          </button>
          <span className="text-xs text-[#667781] dark:text-[#8696a0]">
            {filteredConversations.length} archived
          </span>
        </div>
      )}

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#e9edef]/60 dark:divide-[#222d34]/60">
        {filteredConversations.length === 0 ? (
          <div className="py-16 px-4 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#f0f2f5] dark:bg-[#202c33] flex items-center justify-center mx-auto text-[#8696a0]">
              <Filter className="w-6 h-6" />
            </div>
            <p className="text-xs text-[#8696a0]">
              {searchQuery ? 'No chats match your search.' : 'No conversations yet. Tap + to start chatting!'}
            </p>
          </div>
        ) : (
          filteredConversations.map((conv, index) => {
            const isActive = activeConversation?.id === conv.id;
            const title =
              conv.type === 'direct'
                ? conv.otherParticipant?.display_name || 'Direct Chat'
                : conv.name || 'Group Chat';

            const avatar =
              conv.type === 'direct'
                ? conv.otherParticipant?.avatar_url
                : conv.avatar_url;

            const isPeerOnline =
              conv.type === 'direct' &&
              conv.otherParticipant &&
              presenceMap[conv.otherParticipant.id]?.isOnline;

            const lastMessage = conv.lastDecryptedMessage;
            const isLastMessageFromMe = lastMessage?.senderId === user?.id;

            return (
              <div
                key={conv.id}
                onClick={() => onSelectConversation(conv)}
                className={`group relative flex items-center gap-3.5 px-4 py-3 cursor-pointer transition-colors ${isActive
                  ? 'bg-[#f0f2f5] dark:bg-[#2a3942]'
                  : 'hover:bg-[#f5f6f6] dark:hover:bg-[#202c33]/70'
                  }`}
              >
                {/* Avatar with Presence Indicator */}
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-[#dfe5e7] dark:bg-[#374248] flex items-center justify-center shrink-0">
                  {avatar ? (
                    <img src={avatar} alt={title} className="w-full h-full object-cover" />
                  ) : conv.type === 'group' ? (
                    <Users className="w-6 h-6 text-[#8696a0]" />
                  ) : (
                    <span className="text-base font-bold text-[#8696a0]">
                      {title.charAt(0)}
                    </span>
                  )}
                  {isPeerOnline && (
                    <span className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full bg-[#00A884] border-2 border-white dark:border-[#111b21]" />
                  )}
                </div>

                {/* Conversation Meta & Snippet */}
                <div className="flex-1 min-w-0 pr-1">
                  <h3 className="text-sm font-medium text-[#111b21] dark:text-[#e9edef] truncate">
                    {title}
                  </h3>

                  <div className="flex items-center gap-2 text-xs text-[#667781] dark:text-[#8696a0] truncate mt-1">
                    {/* Delivery Status Tick on latest message */}
                    {isLastMessageFromMe && lastMessage && (
                      <span>
                        {lastMessage.status === 'seen' ? (
                          <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb] stroke-[2.5]" />
                        ) : lastMessage.status === 'delivered' ? (
                          <CheckCheck className="w-3.5 h-3.5 text-[#8696a0] stroke-[2]" />
                        ) : (
                          <Check className="w-3.5 h-3.5 text-[#8696a0] stroke-[2]" />
                        )}
                      </span>
                    )}

                    <span className="truncate">
                      {lastMessage
                        ? lastMessage.plaintext
                        : 'Encrypted channel established'}
                    </span>
                  </div>
                </div>

                {/* Top Right: Downward facing arrow on top, 2px gap, time below that */}
                <div
                  className="flex flex-col items-end shrink-0 ml-2 relative select-none"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Downward facing arrow (visible on hover or when open) */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuConvId(openMenuConvId === conv.id ? null : conv.id);
                      }}
                      className={`w-5 h-4 flex items-center justify-center rounded text-[#54656f] dark:text-[#8696a0] hover:text-[#111b21] dark:hover:text-[#e9edef] hover:bg-black/5 dark:hover:bg-white/10 transition-opacity cursor-pointer ${openMenuConvId === conv.id
                        ? 'opacity-100'
                        : 'opacity-0 group-hover:opacity-100'
                        }`}
                      title="Chat options"
                      aria-label="Chat options"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>

                    {openMenuConvId === conv.id && (
                      <div
                        ref={sidebarMenuRef}
                        className={`absolute right-0 ${index >= filteredConversations.length - 2 && filteredConversations.length > 2
                          ? 'bottom-full mb-1'
                          : 'top-full mt-1'
                          } w-44 py-1 bg-white dark:bg-[#233138] border border-[#e9edef] dark:border-[#2a3942] rounded-xl shadow-2xl z-50 animate-in fade-in-50 zoom-in-95 text-xs font-normal`}
                      >
                        {onArchiveChat && (
                          <button
                            type="button"
                            onClick={async (e) => {
                              e.stopPropagation();
                              setOpenMenuConvId(null);
                              await onArchiveChat(conv.id, !conv.is_archived);
                            }}
                            className="w-full px-3.5 py-2 text-left flex items-center gap-2 text-[#111b21] dark:text-[#d1d7db] hover:bg-[#f5f6f6] dark:hover:bg-[#182229] transition-colors cursor-pointer"
                          >
                            {conv.is_archived ? (
                              <>
                                <ArchiveRestore className="w-3.5 h-3.5 text-[#00A884]" />
                                <span>Unarchive chat</span>
                              </>
                            ) : (
                              <>
                                <Archive className="w-3.5 h-3.5 text-[#8696a0]" />
                                <span>Archive chat</span>
                              </>
                            )}
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuConvId(null);
                            setConfirmClearConv(conv);
                          }}
                          className="w-full px-3.5 py-2 text-left flex items-center gap-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-500" />
                          <span>Clear chat</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* 2px gap between arrow and time */}
                  <div className="h-[24px]" />

                  {/* Time below arrow */}
                  <span className="text-[11px] text-[#667781] dark:text-[#8696a0] leading-none shrink-0">
                    {formatConversationTime(conv.last_message_at)}
                  </span>

                  {/* Unread Pill Badge */}
                  {conv.unreadCount > 0 && !isActive && (
                    <span className="px-1.5 py-0.5 rounded-full bg-[#00A884] text-white text-[10px] font-bold shrink-0 mt-1">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Clear Chat Confirmation Modal */}
      <ClearChatModal
        open={!!confirmClearConv}
        onOpenChange={(open) => {
          if (!open) setConfirmClearConv(null);
        }}
        conversationName={
          confirmClearConv
            ? confirmClearConv.type === 'direct'
              ? confirmClearConv.otherParticipant?.display_name || 'Direct Chat'
              : confirmClearConv.name || 'Group Chat'
            : undefined
        }
        isClearing={isClearing}
        onConfirm={async () => {
          if (!confirmClearConv) return;
          try {
            setIsClearing(true);
            if (onClearChat) {
              await onClearChat(confirmClearConv.id);
            }
          } catch (err) {
            console.error('Failed to clear chat from sidebar:', err);
          } finally {
            setIsClearing(false);
            setConfirmClearConv(null);
          }
        }}
      />
    </aside>
  );
}
