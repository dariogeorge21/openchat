"use client";

import React from "react";
import Link from "next/link";
import { OpenChatLogo } from "@/components/brand/open-chat-logo";
import { Footer } from "@/components/landing/footer";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ShieldCheck,
  Lock,
  EyeOff,
  Database,
  ExternalLink,
  KeyRound,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

export default function PrivacyPolicyPage() {
  const { user } = useAuth();

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
            <Link href="/" className="inline-flex">
              <Button
                variant="outline"
                size="sm"
                className="rounded-[10px] text-xs h-9 px-2.5 sm:px-3 gap-1.5 text-[#111B21] dark:text-[#E9EDEF] border-[#E9EDEF] dark:border-[#222D34] bg-white/60 dark:bg-[#111B21]/60 hover:bg-[#F5F6F6] dark:hover:bg-[#202C33] hover:text-[#00A884] dark:hover:text-[#00A884] hover:border-[#00A884]/30 dark:hover:border-[#00A884]/40 transition-all shadow-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">Back to Home</span>
                <span className="sm:hidden">Home</span>
              </Button>
            </Link>

            {user && (
              <Link href="/chat">
                <Button
                  size="sm"
                  className="rounded-[10px] text-xs h-9 px-4 bg-[#00A884] hover:bg-[#008f6f] text-white"
                >
                  Dashboard
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#00A884]/25 bg-[#00A884]/10 dark:bg-[#00A884]/20 text-xs font-semibold text-[#00A884] mb-6">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Privacy First Architecture</span>
        </div>

        <h1 className="font-[family-name:var(--font-josefin)] font-light text-4xl sm:text-5xl text-[#171717] dark:text-white tracking-tight leading-[1.1] mb-4">
          Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-[#54656F] dark:text-[#8696A0] mb-10">
          Last updated: October 2026 • A product by{" "}
          <a
            href="https://dariogeorge.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#00A884] underline underline-offset-2 hover:opacity-80"
          >
            dariogeorge.in
          </a>
        </p>

        {/* Quick Highlights Box */}
        <div className="p-6 rounded-[16px] bg-[#FAF9FA] dark:bg-[#182229] border border-[#F1E8EB] dark:border-[#222D34] mb-12 space-y-3">
          <h3 className="text-xs font-mono uppercase tracking-wider text-[#00A884] font-semibold">
            Key Privacy Guarantees
          </h3>
          <ul className="space-y-2 text-xs sm:text-sm text-[#54656F] dark:text-[#8696A0]">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00A884] flex-shrink-0" />
              <span>We never ask for, collect, or store your cellular telephone number.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00A884] flex-shrink-0" />
              <span>Authentication is handled directly through Google OAuth 2.0 PKCE. No passwords stored.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00A884] flex-shrink-0" />
              <span>Conversations are protected with local cryptographic keys using Web Crypto APIs.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00A884] flex-shrink-0" />
              <span>Zero third-party advertising trackers or selling of personal information.</span>
            </li>
          </ul>
        </div>

        {/* Sections */}
        <div className="space-y-10 text-sm leading-relaxed text-[#54656F] dark:text-[#8696A0]">
          <section id="security" className="space-y-3">
            <h2 className="text-xl font-semibold text-[#171717] dark:text-white tracking-tight flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#00A884]" /> 1. Information We Collect
            </h2>
            <p>
              When you authenticate with OpenChat using GoogleAuth, we receive only the basic identity
              profile verified by Google: your primary email address, public display name, and avatar image URL.
              We do <strong>not</strong> have access to your Google contacts, Google Drive, or any private account data.
            </p>
            <p>
              We specifically do <strong>not</strong> collect your phone number, IMEI, SIM identifier, or cellular carrier.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-[#171717] dark:text-white tracking-tight flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-[#0284c7]" /> 2. Cryptographic Security &amp; Keys
            </h2>
            <p>
              OpenChat generates an asymmetric key pair directly inside your browser using the standard Web
              Cryptography API (ECDH / AES-GCM). Your private key stays on your local device. Public keys are
              exchanged to allow participants to encrypt messages in transit.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-[#171717] dark:text-white tracking-tight flex items-center gap-2">
              <Database className="w-5 h-5 text-[#E64E25]" /> 3. Data Storage &amp; Message Retention
            </h2>
            <p>
              Messages and conversations are stored securely in database instances backed by Supabase with Row Level
              Security (RLS) enforcement. Only participants belonging to a conversation can read or dispatch messages.
              You have the option to clear chat history or archive conversations at any time.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-[#171717] dark:text-white tracking-tight flex items-center gap-2">
              <EyeOff className="w-5 h-5 text-[#00A884]" /> 4. Third-Party Sharing &amp; Ads
            </h2>
            <p>
              We do not sell, rent, or monetize your personal information or chat logs. There are no tracking pixels
              or commercial advertising SDKs embedded in OpenChat.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-[#171717] dark:text-white tracking-tight">
              5. Contact &amp; Maintainer
            </h2>
            <p>
              OpenChat is a project engineered by Dario George. If you have inquiries regarding privacy or wish to request
              deletion of your user profile, please contact via{" "}
              <a
                href="https://dariogeorge.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#00A884] font-medium underline underline-offset-2"
              >
                dariogeorge.in
              </a>
              .
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
