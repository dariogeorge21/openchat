"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Hash, Users, ArrowUpRight, Flame, Sparkles, MessageCircle } from "lucide-react";

interface ActiveRoomsShowcaseProps {
  onJoinRoom: (roomName: string) => void;
}

const PUBLIC_ROOMS = [
  {
    name: "general-lounge",
    description: "The global lobby. Open discussion on technology, ideas, and live web exploration.",
    peers: 42,
    topic: "Global Community",
    highlight: "blue",
    featured: true,
  },
  {
    name: "ai-agents",
    description: "Autonomous reasoning, agentic coding workflows, and LLM orchestration patterns.",
    peers: 29,
    topic: "AI / Tech",
    highlight: "orange",
    featured: true,
  },
  {
    name: "design-critique",
    description: "Minimalist interfaces, geometric typography, subtle shadows, and user experience.",
    peers: 18,
    topic: "UI / UX",
    highlight: "blue",
  },
  {
    name: "open-devs",
    description: "Open source builders, Next.js architecture, WebSockets, and real-time mesh systems.",
    peers: 34,
    topic: "Engineering",
    highlight: "neutral",
  },
  {
    name: "founders-radar",
    description: "Early-stage founders sharing launch updates, traction metrics, and feedback loops.",
    peers: 21,
    topic: "Products",
    highlight: "orange",
  },
  {
    name: "ephemeral-sandbox",
    description: "Temporary zero-trace room. Conversations automatically purge every 60 minutes.",
    peers: 15,
    topic: "Privacy",
    highlight: "blue",
  },
];

export function ActiveRoomsShowcase({ onJoinRoom }: ActiveRoomsShowcaseProps) {
  const [filter, setFilter] = useState("all");

  const filteredRooms =
    filter === "all"
      ? PUBLIC_ROOMS
      : PUBLIC_ROOMS.filter(
          (r) => r.topic.toLowerCase().includes(filter.toLowerCase()) || filter === "featured" && r.featured
        );

  return (
    <section id="rooms" className="py-24 bg-[#FAF9FA] border-b border-[#F1E8EB] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#E64E25] font-semibold bg-[#E64E25]/10 px-3 py-1 rounded-full border border-[#E64E25]/20">
              Live Channels
            </span>
            <h2 className="mt-4 font-[family-name:var(--font-josefin)] font-light text-4xl sm:text-5xl text-[#171717] tracking-tight">
              Explore open public <span className="font-normal text-[#66CCF2]">rooms</span>
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#737373]">
              Join any room in one second with GoogleAuth. No invites or waiting lists.
            </p>
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {["all", "AI / Tech", "UI / UX", "Engineering", "Privacy"].map((tag) => (
              <button
                key={tag}
                onClick={() => setFilter(tag)}
                className={`px-3 py-1.5 rounded-[10px] text-xs font-medium border transition-all cursor-pointer whitespace-nowrap ${
                  filter === tag
                    ? "bg-[#171717] text-white border-[#171717]"
                    : "bg-white text-[#737373] border-[#F1E8EB] hover:text-[#171717] hover:border-[#66CCF2]"
                }`}
              >
                {tag === "all" ? "All Channels" : tag}
              </button>
            ))}
          </div>
        </div>

        {/* Room Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room, idx) => (
            <motion.div
              key={room.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="bg-white rounded-[16px] p-6 border border-[#F1E8EB] shadow-[0_2px_8px_-2px_rgba(23,23,23,0.03)] hover:shadow-[0_12px_28px_-6px_rgba(102,204,242,0.12)] hover:border-[#66CCF2]/60 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1.5">
                    <span className="p-1 rounded-[6px] bg-[#FAF9FA] text-[#737373] group-hover:text-[#66CCF2] group-hover:bg-[#66CCF2]/10 transition-colors">
                      <Hash className="w-4 h-4" />
                    </span>
                    <span className="font-semibold text-base text-[#171717] group-hover:text-[#171717]">
                      {room.name}
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1.5 text-xs text-[#737373] bg-[#FAF9FA] px-2.5 py-1 rounded-full border border-[#F1E8EB]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-mono text-[#171717]">{room.peers}</span> peers
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#737373] leading-relaxed mb-6 line-clamp-2">
                  {room.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#F1E8EB]/70 flex items-center justify-between">
                <span className="text-[11px] font-mono text-[#737373] bg-[#FAF9FA] px-2 py-0.5 rounded-[6px]">
                  {room.topic}
                </span>

                <Button
                  onClick={() => onJoinRoom(room.name)}
                  variant="outline"
                  size="sm"
                  className="rounded-[10px] text-xs h-8 px-3 gap-1.5 group-hover:border-[#66CCF2] group-hover:text-[#0983b6] group-hover:bg-[#66CCF2]/10 transition-colors"
                >
                  <span>Enter Room</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
