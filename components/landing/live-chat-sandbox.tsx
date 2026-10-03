"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  Users,
  Sparkles,
  ShieldCheck,
  Hash,
  Smile,
  Circle,
  ExternalLink,
} from "lucide-react";
import { GoogleIcon } from "@/components/icons/google-icon";

interface Message {
  id: string;
  user: string;
  email: string;
  avatar: string;
  text: string;
  time: string;
  accent?: "blue" | "orange" | "neutral";
  isSelf?: boolean;
}

const INITIAL_MESSAGES: Record<string, Message[]> = {
  "general-lounge": [
    {
      id: "1",
      user: "Maya Chen",
      email: "maya.chen@gmail.com",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face",
      text: "Just signed in with Google in literally 1 second. No email verification links to click, no captcha!",
      time: "19:12",
      accent: "blue",
    },
    {
      id: "2",
      user: "Marcus Brody",
      email: "marcus.b@gmail.com",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop&crop=face",
      text: "The geometry of this UI is so airy. Love the Josefin Sans headers with clean Inter body text.",
      time: "19:13",
      accent: "orange",
    },
    {
      id: "3",
      user: "Sora Takahashi",
      email: "sora.t@gmail.com",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      text: "Can everyone see real-time updates? Latency feels sub-30ms globally right now.",
      time: "19:14",
      accent: "blue",
    },
  ],
  "ai-builders": [
    {
      id: "b1",
      user: "Elena Rostova",
      email: "elena.r@gmail.com",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
      text: "Building an agentic assistant that hooks directly into openchat channels via Webhooks.",
      time: "19:08",
      accent: "blue",
    },
    {
      id: "b2",
      user: "Devon Vance",
      email: "devon.vance@gmail.com",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
      text: "Having zero friction Google auth makes multiplayer AI apps 10x easier to share with teams.",
      time: "19:10",
      accent: "orange",
    },
  ],
  "design-systems": [
    {
      id: "d1",
      user: "Camila Torres",
      email: "camila.t@gmail.com",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
      text: "Notice the button radius is strictly 10px and cards are 16px with #F1E8EB borders. Super cohesive.",
      time: "19:05",
      accent: "orange",
    },
  ],
};

const ROOMS = [
  { id: "general-lounge", name: "general-lounge", activeCount: 42 },
  { id: "ai-builders", name: "ai-builders", activeCount: 29 },
  { id: "design-systems", name: "design-systems", activeCount: 16 },
];

export function LiveChatSandbox({
  onTriggerAuth,
}: {
  onTriggerAuth?: () => void;
}) {
  const [activeRoom, setActiveRoom] = useState("general-lounge");
  const [messages, setMessages] = useState<Record<string, Message[]>>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeRoom]);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      user: "You (Google Verified)",
      email: "you.google@gmail.com",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face",
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      accent: "blue",
      isSelf: true,
    };

    setMessages((prev) => ({
      ...prev,
      [activeRoom]: [...(prev[activeRoom] || []), newMessage],
    }));

    if (!textToSend) {
      setInputValue("");
    }

    // Simulate friendly peer reply after 1.4 seconds
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const replyMessage: Message = {
          id: (Date.now() + 1).toString(),
          user: activeRoom === "general-lounge" ? "Maya Chen" : "Devon Vance",
          email: "peer@gmail.com",
          avatar:
            activeRoom === "general-lounge"
              ? "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face"
              : "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
          text: `Welcome! Love seeing more peers joining #${activeRoom} with GoogleAuth.`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          accent: "orange",
        };
        setMessages((prev) => ({
          ...prev,
          [activeRoom]: [...(prev[activeRoom] || []), replyMessage],
        }));
      }, 1200);
    }, 400);
  };

  const samplePrompts = [
    "👋 Hey from the landing page!",
    "⚡ Is this running in realtime?",
    "🎨 Loving the minimal design!",
  ];

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Outer framing with subtle floating glow */}
      <div className="relative rounded-[20px] p-[1px] bg-gradient-to-b from-[#66CCF2]/40 via-[#F1E8EB] to-[#E64E25]/30 shadow-[0_20px_50px_-20px_rgba(102,204,242,0.15),0_10px_25px_-10px_rgba(230,78,37,0.1)]">
        <div className="bg-white rounded-[19px] overflow-hidden border border-[#F1E8EB]">
          {/* Header Bar */}
          <div className="px-5 py-3.5 border-b border-[#F1E8EB] bg-[#FAF9FA] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-[#E64E25]/70" />
              <span className="inline-block w-3 h-3 rounded-full bg-[#66CCF2]/70" />
              <span className="inline-block w-3 h-3 rounded-full bg-[#171717]/20" />
              <div className="h-4 w-[1px] bg-[#F1E8EB] mx-2" />
              <span className="text-xs font-mono text-[#737373] tracking-wide flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                openchat://mesh.network/rooms
              </span>
            </div>

            {/* Room Selector */}
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-[10px] border border-[#F1E8EB]">
              {ROOMS.map((room) => {
                const isActive = activeRoom === room.id;
                return (
                  <button
                    key={room.id}
                    onClick={() => setActiveRoom(room.id)}
                    className={`px-3 py-1 text-xs font-medium rounded-[8px] transition-all flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? "bg-[#171717] text-white shadow-sm"
                        : "text-[#737373] hover:text-[#171717] hover:bg-[#FBF9FA]"
                    }`}
                  >
                    <Hash className="w-3 h-3 opacity-60" />
                    <span>{room.name}</span>
                    <span
                      className={`text-[10px] px-1 rounded-full ${
                        isActive ? "bg-white/20 text-white" : "bg-[#F1E8EB] text-[#737373]"
                      }`}
                    >
                      {room.activeCount}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Google Auth status pill */}
            <div
              onClick={onTriggerAuth}
              className="flex items-center gap-2 px-3 py-1 bg-white border border-[#F1E8EB] rounded-[10px] cursor-pointer hover:border-[#66CCF2] transition-colors"
            >
              <GoogleIcon className="w-3.5 h-3.5" />
              <span className="text-xs text-[#171717] font-medium">GoogleAuth Active</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>
          </div>

          {/* Chat Body & Active Users Sidebar */}
          <div className="grid grid-cols-1 md:grid-cols-4 min-h-[420px] max-h-[460px]">
            {/* Messages Area (3 cols) */}
            <div className="md:col-span-3 flex flex-col justify-between p-5 border-r border-[#F1E8EB] bg-white">
              {/* Message Feed */}
              <div className="overflow-y-auto space-y-4 pr-2 max-h-[310px]">
                <div className="text-center py-2">
                  <span className="text-[11px] text-[#737373] bg-[#FAF9FA] px-3 py-1 rounded-full border border-[#F1E8EB]">
                    Joined #{activeRoom} via Google Identity • End-to-end encrypted protocol
                  </span>
                </div>

                <AnimatePresence initial={false}>
                  {(messages[activeRoom] || []).map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className={`flex gap-3 items-start ${
                        msg.isSelf ? "flex-row-reverse" : ""
                      }`}
                    >
                      <img
                        src={msg.avatar}
                        alt={msg.user}
                        className="w-8 h-8 rounded-full object-cover border border-[#F1E8EB] mt-0.5 flex-shrink-0"
                      />
                      <div
                        className={`max-w-[80%] flex flex-col ${
                          msg.isSelf ? "items-end" : "items-start"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-[#171717]">
                            {msg.user}
                          </span>
                          <span className="text-[10px] text-[#737373]">{msg.time}</span>
                          {msg.isSelf && (
                            <Badge variant="blue" className="text-[9px] px-1.5 py-0 h-4">
                              You
                            </Badge>
                          )}
                        </div>
                        <div
                          className={`px-4 py-2.5 rounded-[14px] text-xs leading-relaxed ${
                            msg.isSelf
                              ? "bg-[#171717] text-white rounded-tr-[4px]"
                              : msg.accent === "blue"
                              ? "bg-[#66CCF2]/10 text-[#171717] border border-[#66CCF2]/30 rounded-tl-[4px]"
                              : "bg-[#E64E25]/10 text-[#171717] border border-[#E64E25]/25 rounded-tl-[4px]"
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-xs text-[#737373] italic pl-11"
                  >
                    <span className="flex gap-1 items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#66CCF2] animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E64E25] animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#171717] animate-bounce [animation-delay:0.4s]" />
                    </span>
                    <span>Peer is typing...</span>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Instant Prompt Chips & Input Box */}
              <div className="mt-4 pt-3 border-t border-[#F1E8EB] space-y-2">
                <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                  <span className="text-[11px] text-[#737373] flex-shrink-0 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#E64E25]" /> Try:
                  </span>
                  {samplePrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(prompt)}
                      className="px-2.5 py-1 rounded-[8px] bg-[#FAF9FA] hover:bg-[#66CCF2]/15 hover:border-[#66CCF2]/50 border border-[#F1E8EB] text-[#171717] text-[11px] whitespace-nowrap transition-colors cursor-pointer"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={`Message #${activeRoom}...`}
                    className="flex-1 h-11 px-4 text-xs rounded-[10px] border border-[#F1E8EB] bg-[#FAF9FA] text-[#171717] placeholder:text-[#737373] focus:outline-none focus:border-[#66CCF2] focus:bg-white transition-all"
                  />
                  <Button
                    type="submit"
                    variant="brand"
                    size="sm"
                    className="h-11 px-4 rounded-[10px] text-xs gap-1.5"
                  >
                    <span>Send</span>
                    <Send className="w-3.5 h-3.5" />
                  </Button>
                </form>
              </div>
            </div>

            {/* Online Peers Sidebar (1 col) */}
            <div className="hidden md:flex flex-col justify-between p-4 bg-[#FBF9FA]">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#F1E8EB]">
                  <span className="text-xs font-semibold text-[#171717] uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#66CCF2]" />
                    Online Peers
                  </span>
                  <Badge variant="blue" className="text-[10px] px-1.5 py-0">
                    Live
                  </Badge>
                </div>

                <div className="mt-3 space-y-2.5">
                  {[
                    {
                      name: "Maya Chen",
                      role: "Designer",
                      color: "border-[#66CCF2]",
                      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face",
                    },
                    {
                      name: "Devon Vance",
                      role: "Core Contributor",
                      color: "border-[#E64E25]",
                      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
                    },
                    {
                      name: "Sora Takahashi",
                      role: "Tokyo Node",
                      color: "border-[#66CCF2]",
                      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
                    },
                    {
                      name: "Elena Rostova",
                      role: "AI Dev",
                      color: "border-[#E64E25]",
                      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
                    },
                  ].map((peer, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2.5 p-2 rounded-[10px] bg-white border border-[#F1E8EB]/80 hover:border-[#66CCF2]/40 transition-colors"
                    >
                      <div className="relative">
                        <img
                          src={peer.avatar}
                          alt={peer.name}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-[#171717] truncate">
                          {peer.name}
                        </p>
                        <p className="text-[10px] text-[#737373] truncate">
                          {peer.role}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Protocol Spec Box */}
              <div className="mt-4 p-3 rounded-[12px] bg-white border border-[#F1E8EB] space-y-1.5 text-[11px] text-[#737373]">
                <div className="flex items-center justify-between text-[#171717] font-medium">
                  <span>Google Auth 2.0</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <p className="text-[10px] leading-tight">
                  Tokens never touch persistent disk. Instant verification over secure TLS.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
