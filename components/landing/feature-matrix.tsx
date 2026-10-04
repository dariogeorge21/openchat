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
  Lock,
  Layers,
  Sparkles,
  Smartphone,
  CheckCheck,
} from "lucide-react";
import { GoogleIcon } from "@/components/icons/google-icon";

export function FeatureMatrix() {
  return (
    <section id="features" className="py-28 bg-[#FAF9FA] dark:bg-[#0E161B] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section title */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-xs font-mono uppercase tracking-widest text-[#00A884] font-semibold bg-[#00A884]/10 dark:bg-[#00A884]/20 px-3.5 py-1 rounded-full border border-[#00A884]/25">
            Modern Architecture
          </span>
          <h2 className="mt-4 font-[family-name:var(--font-josefin)] font-light text-4xl sm:text-5xl text-[#171717] dark:text-white tracking-tight">
            Crafted for <span className="font-normal text-[#00A884]">speed</span>, privacy, and simplicity
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#737373] dark:text-[#8696A0] leading-relaxed">
            Every layer is engineered to deliver a seamless, distraction-free messaging experience without phone-number lock-in.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Large Focus on GoogleAuth Identity (2 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2 rounded-[20px] border border-[#F1E8EB] dark:border-[#222D34] p-8 sm:p-10 bg-gradient-to-br from-white via-[#FAF9FA] to-white dark:from-[#182229] dark:via-[#111B21] dark:to-[#182229] relative overflow-hidden group hover:border-[#00A884]/60 transition-all duration-300"
          >
            <div className="relative z-10 max-w-md">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-[#202C33] border border-[#F1E8EB] dark:border-[#222D34] text-xs font-medium text-[#171717] dark:text-[#E9EDEF] mb-6 shadow-2xs">
                <GoogleIcon className="w-3.5 h-3.5" />
                <span>Zero Phone Number Required</span>
              </div>
              <h3 className="font-[family-name:var(--font-josefin)] text-2xl sm:text-3xl text-[#171717] dark:text-white font-light mb-3">
                1-Click <span className="font-normal text-[#00A884]">Google Authentication</span>
              </h3>
              <p className="text-sm text-[#737373] dark:text-[#8696A0] leading-relaxed mb-6">
                Why should messaging friends or coworkers expose your private mobile telephone number?
                OpenChat replaces SMS verification and SIM card dependencies with trusted Google authentication.
                Sign in in under a second and keep your personal phone number private.
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-[8px] bg-white dark:bg-[#202C33] border border-[#F1E8EB] dark:border-[#222D34] text-[#171717] dark:text-[#E9EDEF] font-mono">
                  OAuth 2.0 PKCE
                </span>
                <span className="px-2.5 py-1 rounded-[8px] bg-white dark:bg-[#202C33] border border-[#F1E8EB] dark:border-[#222D34] text-[#171717] dark:text-[#E9EDEF] font-mono">
                  0 Phone Numbers Stored
                </span>
                <span className="px-2.5 py-1 rounded-[8px] bg-white dark:bg-[#202C33] border border-[#F1E8EB] dark:border-[#222D34] text-[#171717] dark:text-[#E9EDEF] font-mono">
                  Instant Access
                </span>
              </div>
            </div>

            {/* Visual Decorative Widget */}
            <div className="hidden sm:block absolute right-6 bottom-6 md:right-10 md:bottom-10 w-72 rounded-[14px] bg-white dark:bg-[#202C33] border border-[#F1E8EB] dark:border-[#222D34] p-4 shadow-lg">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#F1E8EB] dark:border-[#222D34]">
                <ShieldCheck className="w-4 h-4 text-[#00A884]" />
                <span className="text-xs font-semibold text-[#171717] dark:text-[#E9EDEF]">Google Identity Verified</span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#737373] dark:text-[#8696A0]">
                  <span>Phone Number</span>
                  <span className="text-[#00A884] font-mono font-semibold">Not Required</span>
                </div>
                <div className="flex justify-between text-[#737373] dark:text-[#8696A0]">
                  <span>Sign-In Time</span>
                  <span className="text-[#00A884] font-mono">&lt; 380ms</span>
                </div>
                <div className="flex justify-between text-[#737373] dark:text-[#8696A0]">
                  <span>Passwords Stored</span>
                  <span className="text-[#171717] dark:text-[#E9EDEF] font-mono">0 Bytes</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Real-time Presence & Receipts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="rounded-[20px] border border-[#F1E8EB] dark:border-[#222D34] p-8 bg-white dark:bg-[#182229] group hover:border-[#66CCF2]/60 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-[10px] bg-[#66CCF2]/10 dark:bg-[#66CCF2]/20 flex items-center justify-center text-[#0284c7] mb-6">
                <CheckCheck className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold text-[#171717] dark:text-[#E9EDEF] mb-2 tracking-tight">
                Presence &amp; Double Ticks
              </h3>
              <p className="text-xs sm:text-sm text-[#737373] dark:text-[#8696A0] leading-relaxed">
                Enjoy real-time typing indicators, online/offline presence status, and instant sent/delivered/read double ticks (✓✓).
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#F1E8EB] dark:border-[#222D34] text-xs font-mono text-[#0284c7] flex items-center gap-1.5">
              <span>● Live Supabase Realtime</span>
            </div>
          </motion.div>

          {/* Card 3: 1-on-1 & Group Conversations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="rounded-[20px] border border-[#F1E8EB] dark:border-[#222D34] p-8 bg-white dark:bg-[#182229] group hover:border-[#E64E25]/50 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-[10px] bg-[#E64E25]/10 dark:bg-[#E64E25]/20 flex items-center justify-center text-[#E64E25] mb-6">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold text-[#171717] dark:text-[#E9EDEF] mb-2 tracking-tight">
                1-on-1 &amp; Group Chats
              </h3>
              <p className="text-xs sm:text-sm text-[#737373] dark:text-[#8696A0] leading-relaxed">
                Start direct private conversations with anyone by email, or gather friends and teams into custom group circles with full media sharing.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#F1E8EB] dark:border-[#222D34] text-xs font-mono text-[#E64E25]">
              Search by Google Email
            </div>
          </motion.div>

          {/* Card 4: End-to-End Cryptography */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
            className="rounded-[20px] border border-[#F1E8EB] dark:border-[#222D34] p-8 bg-white dark:bg-[#182229] group hover:border-[#00A884]/60 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-[10px] bg-[#00A884]/10 dark:bg-[#00A884]/20 flex items-center justify-center text-[#00A884] mb-6">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold text-[#171717] dark:text-[#E9EDEF] mb-2 tracking-tight">
                Client-Side E2EE
              </h3>
              <p className="text-xs sm:text-sm text-[#737373] dark:text-[#8696A0] leading-relaxed">
                Cryptographic key pairs are generated locally in your browser. Conversations stay strictly between you and your recipients.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#F1E8EB] dark:border-[#222D34] text-xs font-mono text-[#00A884]">
              Web Crypto API
            </div>
          </motion.div>

          {/* Card 5: 100% Free & Open Platform */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="rounded-[20px] border border-[#F1E8EB] dark:border-[#222D34] p-8 bg-white dark:bg-[#182229] group hover:border-[#66CCF2]/60 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-[10px] bg-[#66CCF2]/10 dark:bg-[#66CCF2]/20 flex items-center justify-center text-[#0284c7] mb-6">
                <Globe2 className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold text-[#171717] dark:text-[#E9EDEF] mb-2 tracking-tight">
                100% Free &amp; Open
              </h3>
              <p className="text-xs sm:text-sm text-[#737373] dark:text-[#8696A0] leading-relaxed">
                No subscription paywalls, no hidden premium tiers, no ads. Built on open web protocols for anyone with a browser.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#F1E8EB] dark:border-[#222D34] text-xs font-mono text-[#0284c7]">
              Free Forever Web App
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
