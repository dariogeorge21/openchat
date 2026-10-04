"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  Users,
  CheckCheck,
  ShieldCheck,
  Search,
  Sparkles,
  ArrowRight,
  Lock,
  Smile,
  Zap,
} from "lucide-react";
import Link from "next/link";

interface DirectChatShowcaseProps {
  onStartChat: () => void;
}

export function DirectChatShowcase({ onStartChat }: DirectChatShowcaseProps) {
  const [activeTab, setActiveTab] = useState<"direct" | "groups" | "receipts">("direct");

  return (
    <section id="chat-experience" className="py-24 bg-[#FAF9FA] dark:bg-[#0E161B] border-b border-[#F1E8EB] dark:border-[#222D34] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#00A884] font-semibold bg-[#00A884]/10 dark:bg-[#00A884]/20 px-3.5 py-1 rounded-full border border-[#00A884]/25">
              Personal Messaging
            </span>
            <h2 className="mt-4 font-[family-name:var(--font-josefin)] font-light text-4xl sm:text-5xl text-[#171717] dark:text-white tracking-tight">
              Designed for <span className="font-normal text-[#00A884]">real people</span>, not bloated servers
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#737373] dark:text-[#8696A0] max-w-xl">
              No endless channel lists, bot pings, or public server noise. OpenChat brings you
              focused 1-on-1 direct messaging and close group circles.
            </p>
          </div>

          {/* Interactive Mode Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[
              { id: "direct", label: "1-on-1 Direct Chats" },
              { id: "groups", label: "Group Circles" },
              { id: "receipts", label: "Read Receipts & Presence" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-[10px] text-xs font-medium border transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-[#171717] dark:bg-white text-white dark:text-[#111B21] border-[#171717] dark:border-white shadow-xs"
                    : "bg-white dark:bg-[#182229] text-[#737373] dark:text-[#8696A0] border-[#F1E8EB] dark:border-[#222D34] hover:text-[#171717] dark:hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Card 1: 1-on-1 Direct Messaging */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className={`rounded-[20px] p-7 border transition-all duration-300 flex flex-col justify-between ${
              activeTab === "direct"
                ? "bg-white dark:bg-[#182229] border-[#00A884] shadow-[0_12px_32px_-8px_rgba(0,168,132,0.15)] ring-1 ring-[#00A884]/30"
                : "bg-white dark:bg-[#182229] border-[#F1E8EB] dark:border-[#222D34] shadow-xs hover:border-[#00A884]/40"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-[12px] bg-[#00A884]/10 dark:bg-[#00A884]/20 flex items-center justify-center text-[#00A884]">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-mono uppercase bg-[#FAF9FA] dark:bg-[#202C33] text-[#00A884] px-2.5 py-1 rounded-full border border-[#F1E8EB] dark:border-[#222D34] font-medium">
                  Private 1-on-1
                </span>
              </div>

              <h3 className="text-xl font-semibold text-[#171717] dark:text-[#E9EDEF] mb-2 tracking-tight">
                Direct Conversations
              </h3>
              <p className="text-xs sm:text-sm text-[#737373] dark:text-[#8696A0] leading-relaxed mb-6">
                Connect with any friend, client, or teammate simply by typing their Google email.
                No phone number exchange needed, protecting your mobile privacy forever.
              </p>

              {/* Realistic Visual Mini Chat Mockup */}
              <div className="rounded-[14px] bg-[#F0F2F5]/70 dark:bg-[#202C33]/70 p-3.5 border border-[#F1E8EB] dark:border-[#222D34] space-y-2 mb-6">
                <div className="flex items-center gap-2 pb-2 border-b border-[#F1E8EB] dark:border-[#222D34]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-semibold text-[#111B21] dark:text-[#E9EDEF]">Sarah Chen</span>
                  <span className="text-[10px] text-[#54656F] dark:text-[#8696A0] ml-auto">Online</span>
                </div>
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-[#182229] rounded-[8px] px-2.5 py-1 text-[11px] text-[#111B21] dark:text-[#E9EDEF] shadow-2xs">
                    Sent you the notes! Did it come through?
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-[#D9FDD3] dark:bg-[#005C4B] rounded-[8px] px-2.5 py-1 text-[11px] text-[#111B21] dark:text-[#E9EDEF] shadow-2xs flex items-center gap-1">
                    <span>Yes, instant sync!</span>
                    <span className="text-[#00A884] font-bold">✓✓</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#F1E8EB] dark:border-[#222D34] flex items-center justify-between text-xs text-[#737373] dark:text-[#8696A0]">
              <span className="flex items-center gap-1 font-medium text-[#00A884]">
                <ShieldCheck className="w-4 h-4" /> Zero SIM lock-in
              </span>
              <span className="font-mono text-[11px]">DMs</span>
            </div>
          </motion.div>

          {/* Card 2: Group Circles */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className={`rounded-[20px] p-7 border transition-all duration-300 flex flex-col justify-between ${
              activeTab === "groups"
                ? "bg-white dark:bg-[#182229] border-[#66CCF2] shadow-[0_12px_32px_-8px_rgba(102,204,242,0.15)] ring-1 ring-[#66CCF2]/30"
                : "bg-white dark:bg-[#182229] border-[#F1E8EB] dark:border-[#222D34] shadow-xs hover:border-[#66CCF2]/40"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-[12px] bg-[#66CCF2]/10 dark:bg-[#66CCF2]/20 flex items-center justify-center text-[#0284c7]">
                  <Users className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-mono uppercase bg-[#FAF9FA] dark:bg-[#202C33] text-[#0284c7] px-2.5 py-1 rounded-full border border-[#F1E8EB] dark:border-[#222D34] font-medium">
                  Group Circles
                </span>
              </div>

              <h3 className="text-xl font-semibold text-[#171717] dark:text-[#E9EDEF] mb-2 tracking-tight">
                Family, Friends &amp; Teams
              </h3>
              <p className="text-xs sm:text-sm text-[#737373] dark:text-[#8696A0] leading-relaxed mb-6">
                Create private group chats for study circles, holiday trips, or project squads.
                Invite participants by email in one step without asking for phone numbers.
              </p>

              {/* Group Mockup */}
              <div className="rounded-[14px] bg-[#F0F2F5]/70 dark:bg-[#202C33]/70 p-3.5 border border-[#F1E8EB] dark:border-[#222D34] space-y-2 mb-6">
                <div className="flex items-center justify-between pb-2 border-b border-[#F1E8EB] dark:border-[#222D34]">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-[#111B21] dark:text-[#E9EDEF]">Weekend Trip</span>
                    <span className="text-[10px] text-[#54656F] dark:text-[#8696A0]">• 4 members</span>
                  </div>
                  <div className="flex -space-x-1.5 overflow-hidden">
                    <div className="w-5 h-5 rounded-full bg-[#66CCF2] ring-1 ring-white text-[9px] flex items-center justify-center text-white font-bold">M</div>
                    <div className="w-5 h-5 rounded-full bg-[#E64E25] ring-1 ring-white text-[9px] flex items-center justify-center text-white font-bold">S</div>
                    <div className="w-5 h-5 rounded-full bg-[#00A884] ring-1 ring-white text-[9px] flex items-center justify-center text-white font-bold">E</div>
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-[#182229] rounded-[8px] px-2.5 py-1 text-[11px] shadow-2xs">
                    <span className="text-[10px] font-bold text-[#E64E25] block">Elena</span>
                    Tickets are booked for 7 PM! 🎟️
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#F1E8EB] dark:border-[#222D34] flex items-center justify-between text-xs text-[#737373] dark:text-[#8696A0]">
              <span className="flex items-center gap-1 font-medium text-[#0284c7]">
                <Users className="w-4 h-4" /> Multi-user sync
              </span>
              <span className="font-mono text-[11px]">Unlimited Members</span>
            </div>
          </motion.div>

          {/* Card 3: Live Receipts & Presence */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className={`rounded-[20px] p-7 border transition-all duration-300 flex flex-col justify-between ${
              activeTab === "receipts"
                ? "bg-white dark:bg-[#182229] border-[#E64E25] shadow-[0_12px_32px_-8px_rgba(230,78,37,0.15)] ring-1 ring-[#E64E25]/30"
                : "bg-white dark:bg-[#182229] border-[#F1E8EB] dark:border-[#222D34] shadow-xs hover:border-[#E64E25]/40"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-[12px] bg-[#E64E25]/10 dark:bg-[#E64E25]/20 flex items-center justify-center text-[#E64E25]">
                  <CheckCheck className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-mono uppercase bg-[#FAF9FA] dark:bg-[#202C33] text-[#E64E25] px-2.5 py-1 rounded-full border border-[#F1E8EB] dark:border-[#222D34] font-medium">
                  Delivery Transparency
                </span>
              </div>

              <h3 className="text-xl font-semibold text-[#171717] dark:text-[#E9EDEF] mb-2 tracking-tight">
                Read Receipts &amp; Presence
              </h3>
              <p className="text-xs sm:text-sm text-[#737373] dark:text-[#8696A0] leading-relaxed mb-6">
                Always know when your messages are dispatched, received, and read. Watch live typing
                indicators animate in real-time as peers compose their thoughts.
              </p>

              {/* Status breakdown visual */}
              <div className="rounded-[14px] bg-[#F0F2F5]/70 dark:bg-[#202C33]/70 p-3.5 border border-[#F1E8EB] dark:border-[#222D34] space-y-2 mb-6 text-xs">
                <div className="flex items-center justify-between text-[#54656F] dark:text-[#8696A0]">
                  <span className="flex items-center gap-1.5">
                    <span className="text-[#8696A0] font-bold">✓</span> Sent to server
                  </span>
                  <span className="font-mono text-[10px] text-emerald-600">12ms</span>
                </div>
                <div className="flex items-center justify-between text-[#54656F] dark:text-[#8696A0]">
                  <span className="flex items-center gap-1.5">
                    <span className="text-[#8696A0] font-bold">✓✓</span> Delivered to peer
                  </span>
                  <span className="font-mono text-[10px] text-emerald-600">28ms</span>
                </div>
                <div className="flex items-center justify-between text-[#111B21] dark:text-[#E9EDEF] font-medium">
                  <span className="flex items-center gap-1.5 text-[#00A884]">
                    <span className="font-bold">✓✓</span> Read by recipient
                  </span>
                  <span className="font-mono text-[10px] text-[#00A884]">Active</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#F1E8EB] dark:border-[#222D34] flex items-center justify-between text-xs text-[#737373] dark:text-[#8696A0]">
              <span className="flex items-center gap-1 font-medium text-[#E64E25]">
                <Zap className="w-4 h-4" /> Live WebSockets
              </span>
              <span className="font-mono text-[11px]">&lt; 25ms Global</span>
            </div>
          </motion.div>
        </div>

        {/* Action Callout Bar */}
        <div className="mt-12 p-6 rounded-[16px] bg-white dark:bg-[#182229] border border-[#F1E8EB] dark:border-[#222D34] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[10px] bg-[#00A884]/15 text-[#00A884] flex items-center justify-center flex-shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#171717] dark:text-[#E9EDEF]">
                Ready to chat with friends, colleagues, or family?
              </h4>
              <p className="text-xs text-[#737373] dark:text-[#8696A0]">
                Sign in with Google in 1 second. Zero credit cards. Zero subscriptions.
              </p>
            </div>
          </div>

          <Button
            onClick={onStartChat}
            variant="brand"
            size="default"
            className="rounded-[10px] bg-[#00A884] hover:bg-[#008f6f] text-white px-5 h-10 text-xs sm:text-sm font-medium gap-2 shadow-xs transition-all whitespace-nowrap"
          >
            <span>Start Chatting Now</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
