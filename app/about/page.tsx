"use client";

import React from "react";
import Link from "next/link";
import { OpenChatLogo } from "@/components/brand/open-chat-logo";
import { Footer } from "@/components/landing/footer";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Zap,
  Lock,
  Globe2,
  Users,
  ExternalLink,
  Sparkles,
  Heart,
} from "lucide-react";
import { GoogleIcon } from "@/components/icons/google-icon";
import { useAuth } from "@/contexts/auth-context";

export default function AboutPage() {
  const { user, signInWithGoogle } = useAuth();

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B141A] text-[#171717] dark:text-[#E9EDEF] flex flex-col justify-between selection:bg-[#00A884]/25">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#111B21]/90 backdrop-blur-md border-b border-[#F1E8EB] dark:border-[#222D34]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <OpenChatLogo height={28} className="transition-transform group-hover:scale-[1.02]" />
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/" className="hidden sm:inline-flex">
              <Button
                variant="outline"
                size="sm"
                className="rounded-[10px] text-xs h-9 px-3 gap-1.5 border-[#F1E8EB] dark:border-[#222D34]"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Home</span>
              </Button>
            </Link>

            {user ? (
              <Link href="/chat">
                <Button
                  size="sm"
                  className="rounded-[10px] text-xs h-9 px-4 bg-[#00A884] hover:bg-[#008f6f] text-white"
                >
                  Enter Chat
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button
                  variant="google"
                  size="sm"
                  className="rounded-[10px] text-xs h-9 px-3 border border-[#F1E8EB] dark:border-[#222D34]"
                >
                  <GoogleIcon className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#00A884]/25 bg-[#00A884]/10 dark:bg-[#00A884]/20 text-xs font-semibold text-[#00A884] mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Our Vision &amp; Story</span>
        </div>

        <h1 className="font-[family-name:var(--font-josefin)] font-light text-4xl sm:text-5xl md:text-6xl text-[#171717] dark:text-white tracking-tight leading-[1.1] mb-6">
          Reimagining messaging without{" "}
          <span className="font-normal text-[#00A884]">SIM cards</span> or phone surveillance.
        </h1>

        <p className="text-base sm:text-lg text-[#54656F] dark:text-[#8696A0] leading-relaxed mb-12">
          OpenChat was built on a simple conviction: communication between human beings shouldn’t
          require exposing your private cellular phone number to strangers, synchronizing your entire
          address book with advertising corporations, or managing complex passwords.
        </p>

        {/* Creator Attribution Card */}
        <div className="p-6 sm:p-8 rounded-[20px] bg-gradient-to-br from-[#FAF9FA] to-white dark:from-[#182229] dark:to-[#111B21] border border-[#F1E8EB] dark:border-[#222D34] shadow-xs mb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#00A884]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#00A884] font-semibold">
                Creator &amp; Engineering
              </span>
              <h3 className="text-xl sm:text-2xl font-semibold text-[#171717] dark:text-[#E9EDEF]">
                A Product by Dario George
              </h3>
              <p className="text-xs sm:text-sm text-[#54656F] dark:text-[#8696A0] max-w-lg leading-relaxed">
                OpenChat is conceived, engineered, and maintained by{" "}
                <strong className="text-[#111B21] dark:text-[#E9EDEF]">Dario George</strong>. An effort to create
                an open, clean, phone-independent alternative to closed proprietary messengers.
              </p>
            </div>

            <a
              href="https://dariogeorge.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[12px] bg-[#171717] dark:bg-white text-white dark:text-[#111B21] hover:bg-[#00A884] dark:hover:bg-[#00A884] dark:hover:text-white transition-all text-xs font-semibold shadow-sm flex-shrink-0 group"
            >
              <span>Visit dariogeorge.in</span>
              <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>

        {/* Core Pillars Grid */}
        <div className="space-y-12 mb-16">
          <h2 className="text-2xl font-semibold text-[#171717] dark:text-white tracking-tight">
            Why We Built OpenChat
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-[16px] border border-[#F1E8EB] dark:border-[#222D34] bg-white dark:bg-[#182229]">
              <div className="w-10 h-10 rounded-[10px] bg-[#00A884]/15 text-[#00A884] flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-[#171717] dark:text-[#E9EDEF] mb-2">
                1. No Phone Number Gatekeeping
              </h3>
              <p className="text-xs sm:text-sm text-[#54656F] dark:text-[#8696A0] leading-relaxed">
                Why should joining a chat group expose your cellular phone number to everyone in the room?
                OpenChat uses your Google account. Zero phone numbers collected, zero spam calls.
              </p>
            </div>

            <div className="p-6 rounded-[16px] border border-[#F1E8EB] dark:border-[#222D34] bg-white dark:bg-[#182229]">
              <div className="w-10 h-10 rounded-[10px] bg-[#66CCF2]/15 text-[#0284c7] flex items-center justify-center mb-4">
                <Globe2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-[#171717] dark:text-[#E9EDEF] mb-2">
                2. 100% Web-Native Freedom
              </h3>
              <p className="text-xs sm:text-sm text-[#54656F] dark:text-[#8696A0] leading-relaxed">
                Traditional messengers require keeping your phone powered on and linked with QR codes.
                OpenChat works directly in any browser on macOS, Windows, Linux, iOS, or Android.
              </p>
            </div>

            <div className="p-6 rounded-[16px] border border-[#F1E8EB] dark:border-[#222D34] bg-white dark:bg-[#182229]">
              <div className="w-10 h-10 rounded-[10px] bg-[#E64E25]/15 text-[#E64E25] flex items-center justify-center mb-4">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-[#171717] dark:text-[#E9EDEF] mb-2">
                3. Client-Side Encryption
              </h3>
              <p className="text-xs sm:text-sm text-[#54656F] dark:text-[#8696A0] leading-relaxed">
                Messages are protected via local Web Crypto API keys (AES-GCM / ECDH) stored in your device's
                browser storage. The server never reads your private conversations.
              </p>
            </div>

            <div className="p-6 rounded-[16px] border border-[#F1E8EB] dark:border-[#222D34] bg-white dark:bg-[#182229]">
              <div className="w-10 h-10 rounded-[10px] bg-emerald-500/15 text-emerald-600 flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-[#171717] dark:text-[#E9EDEF] mb-2">
                4. Completely Free Forever
              </h3>
              <p className="text-xs sm:text-sm text-[#54656F] dark:text-[#8696A0] leading-relaxed">
                No subscription tiers, no paywalled voice notes or group sizes, and no commercial banner ads.
                Built as a pure, frictionless human connection utility.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Card */}
        <div className="p-8 sm:p-10 rounded-[20px] bg-[#FAF9FA] dark:bg-[#182229] border border-[#F1E8EB] dark:border-[#222D34] text-center space-y-4">
          <h3 className="font-[family-name:var(--font-josefin)] font-light text-2xl sm:text-3xl text-[#171717] dark:text-white">
            Experience the difference today.
          </h3>
          <p className="text-xs sm:text-sm text-[#54656F] dark:text-[#8696A0] max-w-md mx-auto">
            Sign in with Google in under a second and start messaging anyone directly.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link href="/login">
              <Button className="rounded-[10px] bg-[#00A884] hover:bg-[#008f6f] text-white px-6 h-11 text-sm font-semibold">
                <span>Start Chatting Free</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
