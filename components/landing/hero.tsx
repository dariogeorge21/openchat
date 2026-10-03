"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/components/icons/google-icon";
import { ArrowRight, ShieldCheck, Zap, Sparkles, MessageSquare } from "lucide-react";
import { LiveChatSandbox } from "@/components/landing/live-chat-sandbox";

export function Hero({
  onOpenAuth,
}: {
  onOpenAuth: () => void;
}) {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-white">
      {/* Background airy geometric accents */}
      <div className="absolute inset-0 pointer-events-none bg-geometric-grid opacity-60" />

      {/* Gentle ambient colored flares */}
      <div className="absolute top-16 left-1/2 -translate-x-[60%] w-[500px] h-[340px] bg-[#66CCF2]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-28 left-1/2 translate-x-[20%] w-[420px] h-[300px] bg-[#E64E25]/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#F1E8EB] bg-[#FAF9FA]/90 backdrop-blur text-xs text-[#171717] mb-8 shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#66CCF2] animate-pulse" />
          <span className="font-medium text-[#171717]">Frictionless Multi-User Chat</span>
          <span className="text-[#737373]">•</span>
          <span className="text-[#737373] flex items-center gap-1">
            <GoogleIcon className="w-3 h-3" /> Powered by GoogleAuth
          </span>
        </motion.div>

        {/* Display Headline with Josefin Sans Thin / Light */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-[family-name:var(--font-josefin)] font-light text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-[#171717] leading-[1.08] max-w-5xl mx-auto"
        >
          Connect <span className="font-normal text-[#66CCF2]">instantly</span>.
          <br className="hidden sm:inline" /> Chat{" "}
          <span className="font-normal text-[#E64E25]">openly</span> with everyone.
        </motion.h1>

        {/* Subtitle with Inter */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-base sm:text-lg md:text-xl text-[#737373] max-w-2xl mx-auto font-normal leading-relaxed"
        >
          No passwords. No 5-step registration hurdles. Just single-click Google
          verification to chat in real-time with communities, teams, and peers across
          the globe.
        </motion.p>

        {/* Action CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto"
        >
          <Button
            onClick={onOpenAuth}
            variant="google"
            size="xl"
            className="w-full sm:w-auto h-13 px-7 text-sm font-semibold rounded-[10px] shadow-sm hover:shadow-md transition-all gap-2.5 border border-[#F1E8EB] hover:border-[#66CCF2]"
          >
            <GoogleIcon className="w-4 h-4" />
            <span>Continue with Google</span>
          </Button>

          <a href="#rooms" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="xl"
              className="w-full sm:w-auto h-13 px-6 text-sm font-medium rounded-[10px] gap-2 border-[#F1E8EB] text-[#171717] hover:border-[#E64E25]/50 hover:bg-[#FAF9FA]"
            >
              <span>Explore Public Rooms</span>
              <ArrowRight className="w-4 h-4 text-[#737373]" />
            </Button>
          </a>
        </motion.div>

        {/* Metric micro-chips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-[#737373]"
        >
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-[#66CCF2]/15 flex items-center justify-center text-[#0284c7]">
              <Zap className="w-3 h-3 stroke-[2.5]" />
            </div>
            <span>
              <strong className="text-[#171717] font-semibold">&lt; 0.4s</strong> to first message
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-[#E64E25]/15 flex items-center justify-center text-[#E64E25]">
              <ShieldCheck className="w-3 h-3 stroke-[2.5]" />
            </div>
            <span>
              <strong className="text-[#171717] font-semibold">Zero passwords</strong> to manage
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-[#171717]/10 flex items-center justify-center text-[#171717]">
              <MessageSquare className="w-3 h-3 stroke-[2.5]" />
            </div>
            <span>
              <strong className="text-[#171717] font-semibold">Multi-User</strong> concurrent channels
            </span>
          </div>
        </motion.div>

        {/* Live Interactive Chat Sandbox */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-14"
        >
          <div className="text-center mb-3">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#737373] bg-[#FAF9FA] px-3 py-1 rounded-full border border-[#F1E8EB]">
              Interactive Preview • Test the experience below
            </span>
          </div>
          <LiveChatSandbox onTriggerAuth={onOpenAuth} />
        </motion.div>
      </div>
    </section>
  );
}
