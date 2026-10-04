"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Send,
  Users,
  ShieldCheck,
  Search,
  Check,
  CheckCheck,
  Smile,
  Paperclip,
  Mic,
  MoreVertical,
  Phone,
  Video,
  ArrowLeft,
  Sparkles,
  Lock,
} from "lucide-react";
import { GoogleIcon } from "@/components/icons/google-icon";

interface Message {
  id: string;
  sender: string;
  text: string;
  time: string;
  isSelf: boolean;
  status?: "sent" | "delivered" | "read";
}

interface Contact {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isOnline: boolean;
  lastSeen?: string;
  isGroup?: boolean;
  memberCount?: number;
  unreadCount?: number;
  messages: Message[];
}

const INITIAL_CONTACTS: Contact[] = [
  {
    id: "sarah",
    name: "Sarah Chen",
    email: "sarah.chen@gmail.com",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face",
    isOnline: true,
    unreadCount: 1,
    messages: [
      {
        id: "s1",
        sender: "Sarah Chen",
        text: "Hey! Did you see OpenChat? No phone numbers needed at all, just 1-click Google sign in! 🎉",
        time: "10:40 AM",
        isSelf: false,
      },
      {
        id: "s2",
        sender: "You",
        text: "Yes! Finally a WhatsApp alternative where I don't have to give my personal SIM number to everyone.",
        time: "10:41 AM",
        isSelf: true,
        status: "read",
      },
      {
        id: "s3",
        sender: "Sarah Chen",
        text: "And the real-time presence and double blue checkmarks feel so familiar and fast ⚡",
        time: "10:42 AM",
        isSelf: false,
      },
    ],
  },
  {
    id: "alex",
    name: "Alex Rivera",
    email: "alex.rivera@gmail.com",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop&crop=face",
    isOnline: false,
    lastSeen: "12m ago",
    unreadCount: 0,
    messages: [
      {
        id: "a1",
        sender: "Alex Rivera",
        text: "Just sent you the project briefing. Let me know what you think when you get a chance.",
        time: "10:15 AM",
        isSelf: false,
      },
      {
        id: "a2",
        sender: "You",
        text: "Got it! Reviewing right now on my laptop. Love that I don't have to keep my phone connected.",
        time: "10:18 AM",
        isSelf: true,
        status: "read",
      },
    ],
  },
  {
    id: "weekend-crew",
    name: "Weekend Squad",
    email: "3 members",
    avatar: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100&h=100&fit=crop",
    isOnline: true,
    isGroup: true,
    memberCount: 3,
    unreadCount: 0,
    messages: [
      {
        id: "g1",
        sender: "Elena",
        text: "Hey everyone! Who's in for hiking this Saturday morning? 🌄",
        time: "09:30 AM",
        isSelf: false,
      },
      {
        id: "g2",
        sender: "Marcus",
        text: "Count me in! Weather forecast looks super clear.",
        time: "09:32 AM",
        isSelf: false,
      },
      {
        id: "g3",
        sender: "You",
        text: "I'm in too! Should we meet at the trail head at 8am?",
        time: "09:35 AM",
        isSelf: true,
        status: "read",
      },
    ],
  },
  {
    id: "david",
    name: "Dr. David Kim",
    email: "david.kim@gmail.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    isOnline: true,
    unreadCount: 0,
    messages: [
      {
        id: "d1",
        sender: "Dr. David Kim",
        text: "The E2EE cryptography keys generate right on device. Very solid architecture.",
        time: "Yesterday",
        isSelf: false,
      },
      {
        id: "d2",
        sender: "You",
        text: "Thanks David! Zero plain-text stored on the server.",
        time: "Yesterday",
        isSelf: true,
        status: "read",
      },
    ],
  },
];

export function LiveChatSandbox({
  onTriggerAuth,
}: {
  onTriggerAuth?: () => void;
}) {
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [activeContactId, setActiveContactId] = useState("sarah");
  const [filterType, setFilterType] = useState<"all" | "direct" | "groups">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [mobileView, setMobileView] = useState<"list" | "chat">("chat");

  // Internal scroll container ref (NEVER scrolls the window)
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  const activeContact = contacts.find((c) => c.id === activeContactId) || contacts[0];

  const scrollToBottom = (smooth = true) => {
    if (messagesContainerRef.current) {
      if (smooth) {
        messagesContainerRef.current.scrollTo({
          top: messagesContainerRef.current.scrollHeight,
          behavior: "smooth",
        });
      } else {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }
    }
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      // On initial mount, quietly scroll only within the container with zero smooth scroll effect on window
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }
      return;
    }
    scrollToBottom(true);
  }, [activeContact.messages, isTyping]);

  const handleSelectContact = (id: string) => {
    setActiveContactId(id);
    setMobileView("chat");
    // Clear unread count for this contact
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c))
    );
    // Instant scroll to bottom of the selected chat without window jump
    setTimeout(() => {
      scrollToBottom(false);
    }, 50);
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    const currentTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const newMsg: Message = {
      id: Date.now().toString(),
      sender: "You",
      text: text.trim(),
      time: currentTime,
      isSelf: true,
      status: "sent",
    };

    // Append outgoing message
    setContacts((prev) =>
      prev.map((c) => {
        if (c.id === activeContactId) {
          return {
            ...c,
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      })
    );

    if (!textToSend) {
      setInputValue("");
    }

    // After 400ms simulate message marked as read (double blue check)
    setTimeout(() => {
      setContacts((prev) =>
        prev.map((c) => {
          if (c.id === activeContactId) {
            return {
              ...c,
              messages: c.messages.map((m) =>
                m.id === newMsg.id ? { ...m, status: "read" } : m
              ),
            };
          }
          return c;
        })
      );
    }, 400);

    // Simulate contact typing and replying after 1.1s
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const replyResponses: Record<string, string[]> = {
          sarah: [
            "Exactly! You can find any friend just with their Google email address.",
            "Yes! The typing indicators and instant presence make it feel so alive.",
            "Try signing in with Google to invite your friends to real chats!",
          ],
          alex: [
            "Sounds great! Web-native messaging is so much more convenient than phone apps.",
            "I'm keeping this open on my second monitor all day.",
          ],
          "weekend-crew": [
            "Elena: Perfect, 8 AM at the entrance works!",
            "Marcus: Bringing trail mix for everyone!",
          ],
          david: [
            "Web Crypto API with AES-GCM + ECDH is the modern standard for web E2EE.",
            "Completely private direct messaging with GoogleAuth simplicity.",
          ],
        };

        const replies = replyResponses[activeContactId] || [
          "Awesome! Everything syncs instantly with zero delay.",
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];

        const replyMsg: Message = {
          id: (Date.now() + 1).toString(),
          sender: activeContact.isGroup ? "Elena" : activeContact.name,
          text: randomReply,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isSelf: false,
        };

        setContacts((prev) =>
          prev.map((c) => {
            if (c.id === activeContactId) {
              return {
                ...c,
                messages: [...c.messages, replyMsg],
              };
            }
            return c;
          })
        );
      }, 1100);
    }, 500);
  };

  const samplePrompts = [
    "👋 Hey! Testing the real-time chat",
    "⚡ Is this really phone-number free?",
    "🔒 Are our conversations encrypted?",
  ];

  const filteredContacts = contacts.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterType === "direct") return matchesSearch && !c.isGroup;
    if (filterType === "groups") return matchesSearch && c.isGroup;
    return matchesSearch;
  });

  return (
    <div className="w-full max-w-5xl mx-auto" id="demo-preview">
      {/* Outer frame with subtle ambient glow and sleek radius */}
      <div className="relative rounded-[22px] p-[1px] bg-gradient-to-b from-[#00A884]/40 via-[#F1E8EB] dark:via-[#222D34] to-[#66CCF2]/40 shadow-[0_20px_60px_-20px_rgba(0,168,132,0.15),0_10px_30px_-10px_rgba(102,204,242,0.1)]">
        <div className="bg-[#FFFFFF] dark:bg-[#111B21] rounded-[21px] overflow-hidden border border-[#F1E8EB] dark:border-[#222D34]">
          {/* Top Window Chrome */}
          <div className="px-5 py-3 border-b border-[#F1E8EB] dark:border-[#222D34] bg-[#F0F2F5]/80 dark:bg-[#182229]/90 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#E64E25]/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-[#66CCF2]/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-[#00A884]/80 inline-block" />
              <div className="h-4 w-[1px] bg-[#E2E8F0] dark:bg-[#222D34] mx-2" />
              <span className="text-xs font-mono text-[#54656F] dark:text-[#8696A0] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                openchat://messenger.web/direct
              </span>
            </div>

            {/* Quick Status Badge with proper a11y */}
            <div
              role="button"
              tabIndex={0}
              onClick={onTriggerAuth}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onTriggerAuth?.();
                }
              }}
              aria-label="Google authentication status: Verified with Google. Click to sign in."
              className="flex items-center gap-2 px-3 py-1 bg-white dark:bg-[#202C33] border border-[#F1E8EB] dark:border-[#222D34] rounded-[10px] cursor-pointer hover:border-[#00A884] transition-colors shadow-xs"
            >
              <GoogleIcon className="w-3.5 h-3.5" />
              <span className="text-xs text-[#111B21] dark:text-[#E9EDEF] font-medium hidden sm:inline">
                Verified with Google
              </span>
              <span className="text-xs text-[#00A884] font-semibold">Free Access</span>
            </div>
          </div>

          {/* Main WhatsApp-Style Dual Pane */}
          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[520px] max-h-[580px]">
            {/* Left Sidebar: Conversations & Contacts List */}
            <div
              className={`md:col-span-5 lg:col-span-4 border-r border-[#F1E8EB] dark:border-[#222D34] bg-[#FFFFFF] dark:bg-[#111B21] flex flex-col justify-between ${
                mobileView === "chat" ? "hidden md:flex" : "flex"
              }`}
            >
              <div>
                {/* User Header */}
                <div className="p-3.5 border-b border-[#F1E8EB] dark:border-[#222D34] bg-[#F0F2F5]/60 dark:bg-[#182229]/60 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="relative">
                      <img
                        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face"
                        alt="Your avatar preview"
                        className="w-9 h-9 rounded-full object-cover ring-1 ring-[#F1E8EB] dark:ring-[#222D34]"
                      />
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#111B21]" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[#111B21] dark:text-[#E9EDEF] flex items-center gap-1.5">
                        <span>You</span>
                        <GoogleIcon className="w-3 h-3" />
                      </div>
                      <p className="text-[11px] text-[#54656F] dark:text-[#8696A0]">you@gmail.com</p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#00A884] bg-[#00A884]/10 dark:bg-[#00A884]/20 px-2 py-0.5 rounded-full font-medium">
                    Online
                  </span>
                </div>

                {/* Search Bar */}
                <div className="p-3 border-b border-[#F1E8EB] dark:border-[#222D34]">
                  <div className="relative flex items-center">
                    <Search className="w-4 h-4 text-[#54656F] dark:text-[#8696A0] absolute left-3 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Search contacts or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      aria-label="Search contacts by name or email"
                      className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#F0F2F5] dark:bg-[#202C33] text-[#111B21] dark:text-[#E9EDEF] placeholder-[#54656F] dark:placeholder-[#8696A0] rounded-[8px] border-none focus:outline-none focus:ring-1 focus:ring-[#00A884]"
                    />
                  </div>

                  {/* Filter Pills */}
                  <div role="tablist" aria-label="Conversation filters" className="flex items-center gap-1.5 mt-2.5">
                    {[
                      { id: "all", label: "All Chats" },
                      { id: "direct", label: "Direct (1-on-1)" },
                      { id: "groups", label: "Groups" },
                    ].map((f) => (
                      <button
                        key={f.id}
                        role="tab"
                        aria-selected={filterType === f.id}
                        aria-label={`Filter by ${f.label}`}
                        onClick={() => setFilterType(f.id as any)}
                        className={`text-[11px] px-2.5 py-1 rounded-full font-medium transition-all cursor-pointer ${
                          filterType === f.id
                            ? "bg-[#00A884] text-white"
                            : "bg-[#F0F2F5] dark:bg-[#202C33] text-[#54656F] dark:text-[#8696A0] hover:text-[#111B21] dark:hover:text-white"
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Contacts List */}
                <div
                  role="list"
                  aria-label="Recent chats"
                  className="overflow-y-auto max-h-[360px] divide-y divide-[#F1E8EB]/50 dark:divide-[#222D34]/50"
                >
                  {filteredContacts.map((contact) => {
                    const isSelected = contact.id === activeContactId;
                    const lastMessage = contact.messages[contact.messages.length - 1];
                    return (
                      <div
                        key={contact.id}
                        role="button"
                        tabIndex={0}
                        aria-label={`Select chat with ${contact.name}${contact.unreadCount ? `, ${contact.unreadCount} unread message` : ""}`}
                        onClick={() => handleSelectContact(contact.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleSelectContact(contact.id);
                          }
                        }}
                        className={`p-3 flex items-center gap-3 cursor-pointer transition-colors outline-none focus-visible:bg-[#F0F2F5] dark:focus-visible:bg-[#202C33] ${
                          isSelected
                            ? "bg-[#F0F2F5] dark:bg-[#202C33]"
                            : "hover:bg-[#FAF9FA] dark:hover:bg-[#182229]"
                        }`}
                      >
                        <div className="relative flex-shrink-0">
                          <img
                            src={contact.avatar}
                            alt=""
                            className="w-11 h-11 rounded-full object-cover"
                          />
                          {contact.isOnline && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-[#111B21]" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-xs font-semibold text-[#111B21] dark:text-[#E9EDEF] truncate">
                              {contact.name}
                            </span>
                            <span className="text-[10px] text-[#54656F] dark:text-[#8696A0] flex-shrink-0">
                              {lastMessage ? lastMessage.time : ""}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <p className="text-xs text-[#54656F] dark:text-[#8696A0] truncate pr-2">
                              {lastMessage ? (
                                <>
                                  {lastMessage.isSelf && (
                                    <span className="inline-block mr-1 text-[#00A884]">
                                      ✓✓
                                    </span>
                                  )}
                                  {lastMessage.text}
                                </>
                              ) : (
                                "No messages yet"
                              )}
                            </p>

                            {contact.unreadCount ? (
                              <span className="w-4 h-4 rounded-full bg-[#00A884] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                                {contact.unreadCount}
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom hint */}
              <div className="p-3 border-t border-[#F1E8EB] dark:border-[#222D34] bg-[#FAF9FA] dark:bg-[#182229]/60 text-center">
                <span className="text-[11px] text-[#54656F] dark:text-[#8696A0] flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#00A884]" />
                  Search any user by Google email
                </span>
              </div>
            </div>

            {/* Right Pane: Active Conversation */}
            <div
              className={`md:col-span-7 lg:col-span-8 flex flex-col justify-between bg-[#EFEAE2]/35 dark:bg-[#0B141A] relative ${
                mobileView === "list" ? "hidden md:flex" : "flex"
              }`}
            >
              {/* WhatsApp Subtle Chat Background Texture overlay */}
              <div className="absolute inset-0 opacity-[0.035] dark:opacity-[0.05] pointer-events-none bg-[radial-gradient(#111B21_1px,transparent_1px)] [background-size:16px_16px]" />

              {/* Conversation Header */}
              <div className="relative z-10 px-4 py-3 border-b border-[#F1E8EB] dark:border-[#222D34] bg-[#F0F2F5] dark:bg-[#202C33] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Mobile Back Button */}
                  <button
                    onClick={() => setMobileView("list")}
                    aria-label="Back to contacts list"
                    className="md:hidden p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[#54656F] dark:text-[#8696A0] cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>

                  <div className="relative flex-shrink-0">
                    <img
                      src={activeContact.avatar}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    {activeContact.isOnline && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#202C33]" />
                    )}
                  </div>

                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-[#111B21] dark:text-[#E9EDEF]">
                      {activeContact.name}
                    </h4>
                    <p className="text-[11px] text-[#54656F] dark:text-[#8696A0] flex items-center gap-1.5">
                      {isTyping ? (
                        <span className="text-[#00A884] font-medium animate-pulse">
                          typing...
                        </span>
                      ) : activeContact.isOnline ? (
                        <span className="text-[#00A884] font-medium">Online</span>
                      ) : (
                        <span>last seen {activeContact.lastSeen}</span>
                      )}
                      <span>•</span>
                      <span className="font-mono text-[10px] truncate max-w-[130px] sm:max-w-none">
                        {activeContact.email}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Header Action Mockups with a11y */}
                <div className="flex items-center gap-2 text-[#54656F] dark:text-[#8696A0]">
                  <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] bg-white/70 dark:bg-[#111B21]/50 border border-[#F1E8EB] dark:border-[#222D34] text-[11px] text-[#00A884]">
                    <Lock className="w-3 h-3" />
                    <span>E2EE Active</span>
                  </div>
                  <button
                    aria-label="Search conversation history"
                    className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                  <button
                    aria-label="More chat options"
                    className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Messages Feed (Only this container scrolls; never the window) */}
              <div
                ref={messagesContainerRef}
                role="log"
                aria-label={`Chat history with ${activeContact.name}`}
                className="relative z-10 flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 max-h-[380px]"
              >
                {/* E2EE Info Pill */}
                <div className="text-center my-2">
                  <div className="inline-flex items-center gap-1.5 text-[11px] text-[#54656F] dark:text-[#8696A0] bg-[#FFEECD] dark:bg-[#182229] border border-[#F1E8EB] dark:border-[#222D34] px-3.5 py-1.5 rounded-[8px] max-w-md shadow-xs leading-tight">
                    <Lock className="w-3 h-3 text-[#E64E25] flex-shrink-0" />
                    <span>
                      Messages are end-to-end encrypted with local keys. No SIM card or phone number required.
                    </span>
                  </div>
                </div>

                <div className="text-center my-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#54656F] dark:text-[#8696A0] bg-white/80 dark:bg-[#182229]/80 px-2.5 py-1 rounded-[6px] shadow-2xs border border-[#F1E8EB] dark:border-[#222D34]">
                    Today
                  </span>
                </div>

                {/* Message Bubbles */}
                <AnimatePresence initial={false}>
                  {activeContact.messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className={`flex ${msg.isSelf ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`relative max-w-[85%] sm:max-w-[75%] rounded-[12px] px-3.5 py-2 text-xs shadow-xs leading-relaxed ${
                          msg.isSelf
                            ? "bg-[#D9FDD3] dark:bg-[#005C4B] text-[#111B21] dark:text-[#E9EDEF] rounded-tr-[2px]"
                            : "bg-[#FFFFFF] dark:bg-[#202C33] text-[#111B21] dark:text-[#E9EDEF] rounded-tl-[2px]"
                        }`}
                      >
                        {/* Group Sender Name */}
                        {activeContact.isGroup && !msg.isSelf && (
                          <div className="text-[11px] font-semibold text-[#00A884] dark:text-[#66CCF2] mb-0.5">
                            {msg.sender}
                          </div>
                        )}

                        <p className="pr-12 text-xs sm:text-[13px]">{msg.text}</p>

                        <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-[#54656F] dark:text-[#8696A0]">
                          <span>{msg.time}</span>
                          {msg.isSelf && (
                            <span className="text-[#53BDEB] dark:text-[#53BDEB]">
                              {msg.status === "read" ? "✓✓" : "✓"}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Typing Indicator Bubble */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-[#FFFFFF] dark:bg-[#202C33] rounded-[12px] rounded-tl-[2px] px-3.5 py-2.5 shadow-xs flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00A884] animate-bounce" />
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-[#00A884] animate-bounce"
                        style={{ animationDelay: "0.15s" }}
                      />
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-[#00A884] animate-bounce"
                        style={{ animationDelay: "0.3s" }}
                      />
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Quick Prompts Bar */}
              <div className="relative z-10 px-4 py-1.5 bg-[#F0F2F5]/80 dark:bg-[#182229]/80 border-t border-[#F1E8EB] dark:border-[#222D34] flex items-center gap-2 overflow-x-auto">
                <span className="text-[10px] font-medium text-[#54656F] dark:text-[#8696A0] whitespace-nowrap flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#00A884]" /> Try quick reply:
                </span>
                {samplePrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSendMessage(prompt)}
                    aria-label={`Send suggested reply: ${prompt}`}
                    className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded-full bg-white dark:bg-[#202C33] hover:bg-[#FAF9FA] dark:hover:bg-[#2A3942] border border-[#F1E8EB] dark:border-[#222D34] text-[#111B21] dark:text-[#E9EDEF] transition-colors cursor-pointer shadow-2xs"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Bottom Message Input Bar */}
              <div className="relative z-10 p-3 bg-[#F0F2F5] dark:bg-[#202C33] border-t border-[#F1E8EB] dark:border-[#222D34] flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Insert emoji"
                  className="p-2 text-[#54656F] dark:text-[#8696A0] hover:text-[#111B21] dark:hover:text-white transition-colors cursor-pointer"
                  title="Emoji"
                >
                  <Smile className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  aria-label="Attach file or media"
                  className="p-2 text-[#54656F] dark:text-[#8696A0] hover:text-[#111B21] dark:hover:text-white transition-colors cursor-pointer"
                  title="Attach file"
                >
                  <Paperclip className="w-5 h-5" />
                </button>

                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder={`Type a message to ${activeContact.name}...`}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    aria-label={`Type a message to ${activeContact.name}`}
                    className="w-full py-2 px-3.5 text-xs sm:text-sm bg-white dark:bg-[#2A3942] text-[#111B21] dark:text-[#E9EDEF] placeholder-[#54656F] dark:placeholder-[#8696A0] rounded-[8px] border-none focus:outline-none focus:ring-1 focus:ring-[#00A884]"
                  />
                </div>

                {inputValue.trim() ? (
                  <button
                    onClick={() => handleSendMessage()}
                    aria-label="Send message"
                    className="p-2.5 rounded-full bg-[#00A884] hover:bg-[#008f6f] text-white shadow-sm transition-all cursor-pointer"
                    title="Send Message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    aria-label="Record voice note"
                    className="p-2.5 rounded-full text-[#54656F] dark:text-[#8696A0] hover:text-[#111B21] dark:hover:text-white transition-colors cursor-pointer"
                    title="Voice note"
                  >
                    <Mic className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
