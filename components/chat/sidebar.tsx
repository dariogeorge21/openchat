'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { UIConversation } from '@/types/chat';
import { Profile } from '@/types/database';
import { useAuth } from '@/contexts/auth-context';
import { createClient } from '@/lib/supabase/client';
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
  Sparkles,
  Clock,
  Loader2,
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
  onSelectUserForChat?: (user: Profile) => Promise<void>;
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

function formatJoinedDate(dateString?: string): string {
  try {
    if (!dateString) return 'Joined recently';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return 'Joined recently';
    const now = new Date();
    const diffMs = Math.max(0, now.getTime() - d.getTime());
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return 'Joined just now';
    if (diffMinutes < 60) return `Joined ${diffMinutes}m ago`;
    if (diffHours < 24 && d.toDateString() === now.toDateString()) {
      return `Joined today at ${d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
    }
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) {
      return `Joined yesterday at ${d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
    }
    if (diffDays < 7) {
      return `Joined ${diffDays}d ago`;
    }
    return `Joined ${d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    })}`;
  } catch {
    return 'Joined recently';
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
  onSelectUserForChat,
}: SidebarProps) {
  const { user, profile } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'groups' | 'archived'>('all');
  const [openMenuConvId, setOpenMenuConvId] = useState<string | null>(null);
  const [confirmClearConv, setConfirmClearConv] = useState<UIConversation | null>(null);
  const [isClearing, setIsClearing] = useState(false);
  const sidebarMenuRef = useRef<HTMLDivElement>(null);

  // Available new users state
  const [availableProfiles, setAvailableProfiles] = useState<Profile[]>([]);
  const [startingChatUserId, setStartingChatUserId] = useState<string | null>(null);

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

  // Set of all user IDs the current user has already chatted with in direct conversations
  const chattedUserIds = useMemo(() => {
    const ids = new Set<string>();
    conversations.forEach((conv) => {
      if (conv.type === 'direct') {
        if (conv.otherParticipant?.id) {
          ids.add(conv.otherParticipant.id);
        }
        if (conv.members) {
          conv.members.forEach((m) => {
            if (m.user_id && m.user_id !== user?.id) {
              ids.add(m.user_id);
            }
          });
        }
      }
    });
    return ids;
  }, [conversations, user?.id]);

  // Fetch all registered profiles and listen for newly joined users via realtime
  useEffect(() => {
    if (!user) return;
    let isMounted = true;
    const supabase = createClient();

    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, email, display_name, username, avatar_url, about, last_seen, is_online, created_at, updated_at')
          .neq('id', user.id)
          .order('created_at', { ascending: false })
          .limit(50);

        if (!error && data && isMounted) {
          setAvailableProfiles(data as Profile[]);
        }
      } catch (err) {
        console.error('Error fetching available users:', err);
      }
    };

    fetchUsers();

    // Realtime listener for newly registered users
    const channel = supabase
      .channel('public:profiles:sidebar_new_users')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'profiles' },
        (payload) => {
          const newProfile = payload.new as Profile;
          if (newProfile && newProfile.id !== user.id) {
            setAvailableProfiles((prev) => {
              if (prev.some((p) => p.id === newProfile.id)) return prev;
              return [newProfile, ...prev];
            });
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  // Filter out users already chatted with, sorted in the order of most recently joined
  const availableUsers = useMemo(() => {
    return availableProfiles
      .filter((prof) => !chattedUserIds.has(prof.id) && prof.id !== user?.id)
      .sort((a, b) => {
        const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return timeB - timeA;
      });
  }, [availableProfiles, chattedUserIds, user?.id]);

  // If user is searching via search bar, filter available users matching query as well
  const filteredAvailableUsers = useMemo(() => {
    if (!searchQuery.trim()) return availableUsers;
    const q = searchQuery.toLowerCase();
    return availableUsers.filter(
      (u) =>
        (u.display_name && u.display_name.toLowerCase().includes(q)) ||
        (u.username && u.username.toLowerCase().includes(q)) ||
        (u.email && u.email.toLowerCase().includes(q))
    );
  }, [availableUsers, searchQuery]);

  const handleStartChatWithNewUser = async (targetUser: Profile) => {
    if (startingChatUserId) return;
    try {
      setStartingChatUserId(targetUser.id);
      if (onSelectUserForChat) {
        await onSelectUserForChat(targetUser);
      }
    } catch (err) {
      console.error('Failed to start chat with user:', err);
    } finally {
      setStartingChatUserId(null);
    }
  };

  // Filter conversation list based on active pill and search query
  const filteredConversations = useMemo(() => {
    return conversations.filter((conv) => {
      if (filterType === 'archived') {
        if (!conv.is_archived) return false;
      } else {
        if (conv.is_archived) return false;
      }

      if (filterType === 'unread') {
        if (conv.unreadCount === 0) return false;
      } else if (filterType === 'groups') {
        if (conv.type !== 'group') return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const title =
          conv.type === 'direct'
            ? conv.otherParticipant?.display_name || ''
            : conv.name || '';
        const snippet = conv.lastDecryptedMessage?.plaintext || '';
        return (
          title.toLowerCase().includes(query) ||
          snippet.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [conversations, filterType, searchQuery]);

  return (
    <aside className="w-full md:w-[380px] lg:w-[420px] h-full flex flex-col border-r border-[#e9edef] dark:border-[#222d34] bg-white dark:bg-[#111b21] select-none shrink-0">
      {/* Top Header / Profile Bar */}
      <div className="h-16 px-4 bg-[#f0f2f5] dark:bg-[#202c33] flex items-center justify-between shrink-0">
        {/* User Profile Info Clickable */}
        <div
          onClick={onOpenProfile}
          className="flex items-center gap-3 cursor-pointer hover:opacity-85 transition-opacity"
          title="Edit Profile"
        >
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-[#dfe5e7] dark:bg-[#374248] flex items-center justify-center">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.display_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-base font-bold text-[#54656f] dark:text-[#aebac1]">
                {(profile?.display_name || user?.email || 'U').charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-[#111b21] dark:text-[#e9edef] leading-tight max-w-[140px] truncate">
              {profile?.display_name || user?.email?.split('@')[0] || 'My Profile'}
            </span>
            <span className="text-[11px] text-[#00A884] font-medium flex items-center gap-1">
          
            </span>
          </div>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-1 text-[#54656f] dark:text-[#aebac1]">
          <ThemeToggle />

          <button
            onClick={onOpenNewGroup}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
            title="New Group"
            aria-label="New Group"
          >
            <Users className="w-5 h-5" />
          </button>

          <button
            onClick={onOpenNewChat}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
            title="New Chat"
            aria-label="New Chat"
          >
            <MessageSquarePlus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-3 bg-white dark:bg-[#111b21] border-b border-[#e9edef] dark:border-[#222d34] flex flex-col gap-2 shrink-0">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-[#54656f] dark:text-[#8696a0] absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search or start new chat"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-10 pr-4 text-xs rounded-lg bg-[#f0f2f5] dark:bg-[#202c33] text-[#111b21] dark:text-[#e9edef] placeholder-[#54656f] dark:placeholder-[#8696a0] border-none focus:outline-hidden focus:ring-1 focus:ring-[#00A884] transition-all"
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

      {/* Main Scrollable Content: Recent Chats followed by Available New Users */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#e9edef]/60 dark:divide-[#222d34]/60">
        {/* 1. Conversations List */}
        {filteredConversations.length === 0 ? (
          filteredAvailableUsers.length > 0 && filterType === 'all' && !searchQuery ? (
            <div className="py-4 px-4 text-center">
              <p className="text-xs text-[#8696a0]">
                No conversations yet. Choose a user below to start chatting:
              </p>
            </div>
          ) : (
            <div className="py-12 px-4 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#f0f2f5] dark:bg-[#202c33] flex items-center justify-center mx-auto text-[#8696a0]">
                <Filter className="w-6 h-6" />
              </div>
              <p className="text-xs text-[#8696a0]">
                {searchQuery ? 'No chats match your search.' : 'No active conversations yet.'}
              </p>
            </div>
          )
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

        {/* 2. Available New Users to Chat With (Sorted by most recently joined) */}
        {/* Only shown if available users exist (> 0) on the all chats view */}
        {filterType === 'all' && filteredAvailableUsers.length > 0 && (
          <div className="pt-2">
            {/* Sticky Section Header */}
            <div className="px-4 py-2 bg-[#f0f2f5]/90 dark:bg-[#182229]/90 border-y border-[#e9edef] dark:border-[#222d34] flex items-center justify-between sticky top-0 z-10 backdrop-blur-xs select-none">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#00A884]" />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#54656f] dark:text-[#8696a0]">
                  New Users to Chat With
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#00A884]/15 text-[#00A884] font-semibold">
                {filteredAvailableUsers.length} available
              </span>
            </div>

            {/* Available Users List: Name, Pic, Joined_at */}
            <div className="divide-y divide-[#e9edef]/50 dark:divide-[#222d34]/50">
              {filteredAvailableUsers.map((targetUser) => {
                const isSelected = startingChatUserId === targetUser.id;
                const isOnline = presenceMap[targetUser.id]?.isOnline || targetUser.is_online;
                const title =
                  targetUser.display_name ||
                  targetUser.username ||
                  targetUser.email?.split('@')[0] ||
                  'User';

                return (
                  <div
                    key={targetUser.id}
                    role="button"
                    tabIndex={0}
                    aria-label={`Start chat with ${title}`}
                    onClick={() => handleStartChatWithNewUser(targetUser)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleStartChatWithNewUser(targetUser);
                      }
                    }}
                    className="group flex items-center gap-3.5 px-4 py-3 hover:bg-[#f5f6f6] dark:hover:bg-[#202c33]/70 transition-colors cursor-pointer outline-none focus-visible:bg-[#f5f6f6] dark:focus-visible:bg-[#202c33]"
                  >
                    {/* Pic with Online Indicator */}
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-[#dfe5e7] dark:bg-[#374248] flex items-center justify-center shrink-0">
                      {targetUser.avatar_url ? (
                        <img
                          src={targetUser.avatar_url}
                          alt={title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-base font-bold text-[#8696a0]">
                          {title.charAt(0).toUpperCase()}
                        </span>
                      )}
                      {isOnline && (
                        <span className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full bg-[#00A884] border-2 border-white dark:border-[#111b21]" />
                      )}
                    </div>

                    {/* Name & Joined_at */}
                    <div className="flex-1 min-w-0 pr-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-[#111b21] dark:text-[#e9edef] truncate">
                          {title}
                        </h4>
                        {isSelected ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-[#00A884] shrink-0" />
                        ) : (
                          <span className="text-[10px] font-medium text-[#00A884] bg-[#00A884]/10 dark:bg-[#00A884]/20 px-2 py-0.5 rounded-full shrink-0 group-hover:bg-[#00A884] group-hover:text-white transition-colors flex items-center gap-1">
                            <MessageSquarePlus className="w-3 h-3" />
                            <span>Chat</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-[#667781] dark:text-[#8696a0] truncate mt-0.5">
                        <Clock className="w-3 h-3 shrink-0 opacity-70" />
                        <span className="truncate">{formatJoinedDate(targetUser.created_at)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
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
