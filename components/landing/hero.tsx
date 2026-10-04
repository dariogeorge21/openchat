"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/components/icons/google-icon";
import { ArrowRight, ShieldCheck, Zap, Users, Sparkles, MessageCircle, Lock, Loader2 } from "lucide-react";
import { LiveChatSandbox } from "@/components/landing/live-chat-sandbox";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";

export function Hero({
  onOpenAuth,
  isAuthenticating = false,
}: {
  onOpenAuth: () => void;
  isAuthenticating?: boolean;
}) {
  const { user } = useAuth();

  return (
    <section className="relative pt-8 pb-14 sm:pt-12 sm:pb-20 md:pt-16 md:pb-24 overflow-hidden bg-white dark:bg-[#0B141A]">
      {/* Background airy geometric accents */}
      <div className="absolute inset-0 pointer-events-none bg-geometric-grid opacity-60 dark:opacity-20" />

      {/* Gentle ambient colored flares matching brand system */}
      <div className="absolute top-16 left-1/2 -translate-x-[65%] w-[320px] sm:w-[520px] h-[260px] sm:h-[360px] bg-[#00A884]/10 dark:bg-[#00A884]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-28 left-1/2 translate-x-[20%] w-[280px] sm:w-[440px] h-[220px] sm:h-[320px] bg-[#66CCF2]/10 dark:bg-[#66CCF2]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-full border border-[#F1E8EB] dark:border-[#222D34] bg-[#FAF9FA]/90 dark:bg-[#182229]/90 backdrop-blur text-[11px] sm:text-xs text-[#171717] dark:text-[#E9EDEF] mb-6 sm:mb-8 shadow-xs max-w-full"
        >
          <span className="w-2 h-2 rounded-full bg-[#00A884] animate-pulse flex-shrink-0" />
          <span className="font-semibold truncate">Free WhatsApp Alternative</span>
          <span className="text-[#737373] dark:text-[#8696A0] hidden min-[360px]:inline">•</span>
          <span className="text-[#737373] dark:text-[#8696A0] hidden min-[360px]:flex items-center gap-1.5 truncate">
            <GoogleIcon className="w-3.5 h-3.5 flex-shrink-0" /> 1-Click Sign-In
          </span>
        </motion.div>

        {/* Display Headline with Josefin Sans Light */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-[family-name:var(--font-josefin)] font-light text-4xl min-[480px]:text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-[#171717] dark:text-white leading-[1.08] sm:leading-[1.06] max-w-5xl mx-auto"
        >
          Chat with <span className="font-normal text-[#00A884]">anyone</span>.
          <br />
          No phone numbers. Just{" "}
          <span className="font-normal text-[#66CCF2]">Google</span>.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 sm:mt-6 text-sm sm:text-lg md:text-xl text-[#737373] dark:text-[#8696A0] max-w-2xl mx-auto font-normal leading-relaxed px-2 sm:px-0"
        >
          Connect freely with friends, colleagues, and family. Find anyone by their
          Google email address to start instant 1-on-1 direct messages or group chats
          with live presence, read receipts, and zero SIM card lock-in.
        </motion.p>

        {/* Action CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-3.5 max-w-md mx-auto w-full px-2 sm:px-0"
        >
          {user ? (
            <Link href="/chat" className="w-full sm:w-auto">
              <Button
                variant="brand"
                size="xl"
                aria-label="Enter chat dashboard"
                className="w-full sm:w-auto h-12 sm:h-13 px-6 sm:px-8 text-sm font-semibold rounded-[10px] shadow-sm hover:shadow-md transition-all gap-2 bg-[#00A884] hover:bg-[#008f6f] text-white flex items-center justify-center"
              >
                <span>Enter Chat Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          ) : (
            <Button
              onClick={onOpenAuth}
              disabled={isAuthenticating}
              variant="google"
              size="xl"
              aria-label="Continue with Google"
              className="w-full sm:w-auto h-12 sm:h-13 px-6 sm:px-8 text-sm font-semibold rounded-[10px] shadow-sm hover:shadow-md transition-all gap-2.5 border border-[#F1E8EB] dark:border-[#222D34] bg-white dark:bg-[#202C33] dark:text-white hover:border-[#00A884] disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center"
            >
              {isAuthenticating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#00A884]" />
                  <span>Connecting to Google...</span>
                </>
              ) : (
                <>
                  <GoogleIcon className="w-4 h-4" />
                  <span>Continue with Google</span>
                </>
              )}
            </Button>
          )}

          <a href="#how-it-works" aria-label="Learn how OpenChat works" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="xl"
              aria-label="See how OpenChat works in 3 steps"
              className="w-full sm:w-auto h-12 sm:h-13 px-6 text-sm font-medium rounded-[10px] gap-2 border-[#F1E8EB] dark:border-[#222D34] text-[#171717] dark:text-[#E9EDEF] hover:border-[#66CCF2] hover:bg-[#FAF9FA] dark:hover:bg-[#182229] cursor-pointer flex items-center justify-center"
            >
              <span>See How It Works</span>
              <ArrowRight className="w-4 h-4 text-[#737373] dark:text-[#8696A0]" />
            </Button>
          </a>
        </motion.div>

        {/* Metric micro-chips (Structured 2-column grid on mobile, inline row on larger) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 sm:mt-10 grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-2.5 sm:gap-6 md:gap-8 text-xs text-[#737373] dark:text-[#8696A0] max-w-sm sm:max-w-none mx-auto text-left sm:text-center"
        >
          <div className="flex items-center gap-2 p-2 sm:p-0 rounded-[8px] sm:rounded-none bg-[#FAF9FA] sm:bg-transparent dark:bg-[#182229] dark:sm:bg-transparent border border-[#F1E8EB] sm:border-none dark:border-[#222D34]">
            <div className="w-5 h-5 rounded-full bg-[#00A884]/15 flex items-center justify-center text-[#00A884] flex-shrink-0">
              <Zap className="w-3 h-3 stroke-[2.5]" />
            </div>
            <span className="truncate">
              <strong className="text-[#171717] dark:text-[#E9EDEF] font-semibold">&lt; 1s</strong> sign-in
            </span>
          </div>

          <div className="flex items-center gap-2 p-2 sm:p-0 rounded-[8px] sm:rounded-none bg-[#FAF9FA] sm:bg-transparent dark:bg-[#182229] dark:sm:bg-transparent border border-[#F1E8EB] sm:border-none dark:border-[#222D34]">
            <div className="w-5 h-5 rounded-full bg-[#66CCF2]/15 flex items-center justify-center text-[#0284c7] flex-shrink-0">
              <Lock className="w-3 h-3 stroke-[2.5]" />
            </div>
            <span className="truncate">
              <strong className="text-[#171717] dark:text-[#E9EDEF] font-semibold">Zero SIM</strong> needed
            </span>
          </div>

          <div className="flex items-center gap-2 p-2 sm:p-0 rounded-[8px] sm:rounded-none bg-[#FAF9FA] sm:bg-transparent dark:bg-[#182229] dark:sm:bg-transparent border border-[#F1E8EB] sm:border-none dark:border-[#222D34]">
            <div className="w-5 h-5 rounded-full bg-[#E64E25]/15 flex items-center justify-center text-[#E64E25] flex-shrink-0">
              <Users className="w-3 h-3 stroke-[2.5]" />
            </div>
            <span className="truncate">
              <strong className="text-[#171717] dark:text-[#E9EDEF] font-semibold">1-on-1 &amp; Groups</strong>
            </span>
          </div>

          <div className="flex items-center gap-2 p-2 sm:p-0 rounded-[8px] sm:rounded-none bg-[#FAF9FA] sm:bg-transparent dark:bg-[#182229] dark:sm:bg-transparent border border-[#F1E8EB] sm:border-none dark:border-[#222D34]">
            <div className="w-5 h-5 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-600 flex-shrink-0">
              <Sparkles className="w-3 h-3 stroke-[2.5]" />
            </div>
            <span className="truncate">
              <strong className="text-[#171717] dark:text-[#E9EDEF] font-semibold">100% Free</strong> &amp; Open
            </span>
          </div>
        </motion.div>

        {/* Live Interactive Chat Sandbox */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-10 sm:mt-14"
        >
          <div className="text-center mb-3">
            <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider sm:tracking-widest text-[#737373] dark:text-[#8696A0] bg-[#FAF9FA] dark:bg-[#182229] px-3 sm:px-3.5 py-1 rounded-full border border-[#F1E8EB] dark:border-[#222D34] max-w-[94vw] truncate inline-block">
              Interactive Simulation • Try sending a message below
            </span>
          </div>
          <LiveChatSandbox onTriggerAuth={onOpenAuth} />
        </motion.div>
      </div>
    </section>
  );
}
