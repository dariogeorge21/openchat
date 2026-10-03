"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Zap,
  Users,
  EyeOff,
  Flame,
  Globe2,
  Cpu,
  Layers,
  Sparkles,
} from "lucide-react";
import { GoogleIcon } from "@/components/icons/google-icon";

export function FeatureMatrix() {
  return (
    <section id="features" className="py-28 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section title */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-xs font-mono uppercase tracking-widest text-[#66CCF2] font-semibold bg-[#66CCF2]/10 px-3 py-1 rounded-full border border-[#66CCF2]/30">
            Engineered for Minimalism
          </span>
          <h2 className="mt-4 font-[family-name:var(--font-josefin)] font-light text-4xl sm:text-5xl text-[#171717] tracking-tight">
            Crafted for <span className="font-normal text-[#E64E25]">speed</span>, privacy, and flow
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#737373] leading-relaxed">
            Every pixel and network call is optimized to give you a distraction-free multi-user chat environment.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Large Focus on GoogleAuth (2 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2 rounded-[16px] border border-[#F1E8EB] p-8 sm:p-10 bg-gradient-to-br from-white via-[#FAF9FA] to-white relative overflow-hidden group hover:border-[#66CCF2]/60 transition-all duration-300"
          >
            <div className="relative z-10 max-w-md">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#F1E8EB] text-xs font-medium text-[#171717] mb-6">
                <GoogleIcon className="w-3.5 h-3.5" />
                <span>Zero Password Fatigue</span>
              </div>
              <h3 className="font-[family-name:var(--font-josefin)] text-2xl sm:text-3xl text-[#171717] font-light mb-3">
                One-Click <span className="font-normal text-[#66CCF2]">Google Identity</span>
              </h3>
              <p className="text-sm text-[#737373] leading-relaxed mb-6">
                Your time is precious. We eliminated database password storage entirely. By using GoogleAuth directly, you verify identity instantly while keeping your sensitive credentials safely with Google.
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-[8px] bg-white border border-[#F1E8EB] text-[#171717] font-mono">
                  OAuth 2.0 PKCE
                </span>
                <span className="px-2.5 py-1 rounded-[8px] bg-white border border-[#F1E8EB] text-[#171717] font-mono">
                  0 Stored Passwords
                </span>
                <span className="px-2.5 py-1 rounded-[8px] bg-white border border-[#F1E8EB] text-[#171717] font-mono">
                  Instant Token Rotation
                </span>
              </div>
            </div>

            {/* Visual Decorative Widget */}
            <div className="hidden sm:block absolute right-6 bottom-6 md:right-10 md:bottom-10 w-72 rounded-[14px] bg-white border border-[#F1E8EB] p-4 shadow-lg">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#F1E8EB]">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-semibold text-[#171717]">Identity Verified</span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#737373]">
                  <span>Method</span>
                  <span className="text-[#171717] font-mono">Google OAuth 2</span>
                </div>
                <div className="flex justify-between text-[#737373]">
                  <span>Verification Time</span>
                  <span className="text-emerald-600 font-mono">312ms</span>
                </div>
                <div className="flex justify-between text-[#737373]">
                  <span>Data Stored</span>
                  <span className="text-[#171717] font-mono">0 Bytes</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Multi-Peer Realtime Mesh */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="rounded-[16px] border border-[#F1E8EB] p-8 bg-white group hover:border-[#E64E25]/50 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-[10px] bg-[#E64E25]/10 flex items-center justify-center text-[#E64E25] mb-6">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold text-[#171717] mb-2 tracking-tight">
                Multi-User Channels
              </h3>
              <p className="text-xs sm:text-sm text-[#737373] leading-relaxed">
                Chat seamlessly across public and custom channels with dozens of peers at once. Automatic reconnection and heartbeat presence.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#F1E8EB] text-xs font-mono text-[#E64E25] flex items-center gap-1.5">
              <span>● Live broadcast mesh</span>
            </div>
          </motion.div>

          {/* Card 3: Geometric Minimal Design */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="rounded-[16px] border border-[#F1E8EB] p-8 bg-white group hover:border-[#66CCF2]/50 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-[10px] bg-[#66CCF2]/15 flex items-center justify-center text-[#0983b6] mb-6">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold text-[#171717] mb-2 tracking-tight">
                High-Whitespace UI
              </h3>
              <p className="text-xs sm:text-sm text-[#737373] leading-relaxed">
                Airy geometry, Josefin Sans display typography, strict 10px button geometry, and minimal distraction. Built for pure conversational clarity.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#F1E8EB] text-xs font-mono text-[#737373]">
              Josefin Sans + Inter
            </div>
          </motion.div>

          {/* Card 4: Ephemeral Rooms */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
            className="rounded-[16px] border border-[#F1E8EB] p-8 bg-white group hover:border-[#171717] transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-[10px] bg-[#171717]/5 flex items-center justify-center text-[#171717] mb-6">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold text-[#171717] mb-2 tracking-tight">
                Self-Destructing Rooms
              </h3>
              <p className="text-xs sm:text-sm text-[#737373] leading-relaxed">
                Need to share temporary logs, quick design notes, or sensitive snippets? Launch ephemeral rooms that leave zero trace once closed.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#F1E8EB] text-xs font-mono text-[#737373]">
              Optional 24h expiration
            </div>
          </motion.div>

          {/* Card 5: Open & Decentralized Ethos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="rounded-[16px] border border-[#F1E8EB] p-8 bg-white group hover:border-[#66CCF2]/50 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-[10px] bg-[#66CCF2]/10 flex items-center justify-center text-[#0983b6] mb-6">
                <Globe2 className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold text-[#171717] mb-2 tracking-tight">
                Open Web Standard
              </h3>
              <p className="text-xs sm:text-sm text-[#737373] leading-relaxed">
                No walled gardens. OpenChat is built on standard web protocols, modern WebSockets, and transparent privacy rules.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#F1E8EB] text-xs font-mono text-[#0983b6]">
              100% Open Protocol
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
