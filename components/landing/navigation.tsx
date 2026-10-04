"use client";

import React, { useState } from "react";
import Link from "next/link";
import { OpenChatLogo } from "@/components/brand/open-chat-logo";
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/components/icons/google-icon";
import { Menu, X, ArrowUpRight, ShieldCheck, Sparkles, Loader2 } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

import { useAuth } from "@/contexts/auth-context";

export function Navigation({
  onOpenAuth,
  isAuthenticating = false,
}: {
  onOpenAuth: () => void;
  isAuthenticating?: boolean;
}) {
  const { user, profile, isCryptoReady } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const displayName =
    profile?.display_name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#111b21]/95 backdrop-blur-md border-b border-[#F1E8EB] dark:border-[#222D34] transition-all">
      {/* Integrated Auth Banner when Authenticated */}
      {user && (
        <div className="bg-[#00A884]/10 dark:bg-[#00A884]/20 border-b border-[#00A884]/20 px-4 py-2 text-xs text-[#111B21] dark:text-[#E9EDEF]">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 truncate">
              <ShieldCheck className="w-4 h-4 text-[#00A884] flex-shrink-0" />
              <span className="truncate">
                Signed in as <strong className="font-semibold">{displayName}</strong>{" "}
                <span className="text-[#54656F] dark:text-[#8696A0]">({user.email})</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-mono text-[#00A884] bg-[#00A884]/15 dark:bg-[#00A884]/25 px-2.5 py-0.5 rounded-full font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {isCryptoReady ? "E2EE Keys Ready" : "Securing Local Keys..."}
              </span>
            </div>
            <Link
              href="/chat"
              aria-label="Go to chat dashboard"
              className="text-xs font-semibold text-[#00A884] hover:text-[#008f6f] flex items-center gap-1 flex-shrink-0 transition-colors"
            >
              <span>Go to Chat</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-4">
        {/* Left: Brand Logo */}
        <Link href="/" aria-label="OpenChat Home" className="flex items-center gap-3 group flex-shrink-0">
          <OpenChatLogo height={28} className="transition-transform group-hover:scale-[1.02]" />
        </Link>

        {/* Center: Nav Links */}
        <nav
          aria-label="Main Navigation"
          className="hidden lg:flex items-center gap-7 xl:gap-9 text-sm font-medium text-[#737373] dark:text-[#8696A0]"
        >
          <a
            href="#how-it-works"
            className="hover:text-[#171717] dark:hover:text-white transition-colors relative py-1 hover:after:w-full after:w-0 after:h-[2px] after:bg-[#00A884] after:absolute after:bottom-0 after:left-0 after:transition-all"
          >
            How It Works
          </a>
          <a
            href="#comparison"
            className="hover:text-[#171717] dark:hover:text-white transition-colors relative py-1 hover:after:w-full after:w-0 after:h-[2px] after:bg-[#E64E25] after:absolute after:bottom-0 after:left-0 after:transition-all whitespace-nowrap"
          >
            Why OpenChat
          </a>
          <a
            href="#features"
            className="hover:text-[#171717] dark:hover:text-white transition-colors relative py-1 hover:after:w-full after:w-0 after:h-[2px] after:bg-[#66CCF2] after:absolute after:bottom-0 after:left-0 after:transition-all"
          >
            Features
          </a>
          <a
            href="#faq"
            className="hover:text-[#171717] dark:hover:text-white transition-colors relative py-1 hover:after:w-full after:w-0 after:h-[2px] after:bg-[#E64E25] after:absolute after:bottom-0 after:left-0 after:transition-all"
          >
            FAQ
          </a>
        </nav>

        {/* Right: Actions */}
        <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
          <ThemeToggle />

          {!user && (
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-[10px] bg-[#FAF9FA] dark:bg-[#182229] border border-[#F1E8EB] dark:border-[#222D34] text-xs text-[#737373] dark:text-[#8696A0]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-medium text-[#171717] dark:text-[#E9EDEF]">Free &amp; Open</span> • No Phone Required
            </div>
          )}

          {user ? (
            <Link href="/chat">
              <Button
                variant="default"
                size="default"
                aria-label="Enter chat dashboard"
                className="rounded-[10px] font-medium text-xs sm:text-sm px-4 h-10 bg-[#00A884] hover:bg-[#008f6f] text-white flex items-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <span>Enter Chat</span>
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            </Link>
          ) : (
            <Button
              onClick={onOpenAuth}
              disabled={isAuthenticating}
              variant="google"
              size="default"
              aria-label="Sign in with Google"
              className="rounded-[10px] font-medium text-xs sm:text-sm px-4 h-10 border border-[#F1E8EB] dark:border-[#222D34] hover:border-[#00A884] bg-white dark:bg-[#202c33] dark:text-white shadow-sm transition-all cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isAuthenticating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#00A884]" />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <GoogleIcon className="w-4 h-4" />
                  <span>Sign in with Google</span>
                </>
              )}
            </Button>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex sm:hidden items-center gap-2">
          <ThemeToggle />
          {user ? (
            <Link href="/chat">
              <Button
                variant="default"
                size="sm"
                aria-label="Open chat"
                className="h-8 px-2.5 text-xs bg-[#00A884] text-white rounded-[8px]"
              >
                <span>Chat</span>
              </Button>
            </Link>
          ) : (
            <Button
              onClick={onOpenAuth}
              disabled={isAuthenticating}
              variant="google"
              size="sm"
              aria-label="Sign in with Google"
              className="h-8 px-2.5 text-xs rounded-[8px] disabled:opacity-70"
            >
              {isAuthenticating ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#00A884]" />
              ) : (
                <>
                  <GoogleIcon className="w-3.5 h-3.5" />
                  <span>Sign in</span>
                </>
              )}
            </Button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-[8px] border border-[#F1E8EB] dark:border-[#222D34] text-[#171717] dark:text-white cursor-pointer"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[#F1E8EB] dark:border-[#222D34] bg-white dark:bg-[#111b21] px-6 py-5 space-y-4 shadow-lg animate-in slide-in-from-top-2">
          <div className="flex flex-col space-y-3 text-sm font-medium text-[#171717] dark:text-[#E9EDEF]">
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#00A884]"
            >
              How It Works
            </a>
            <a
              href="#comparison"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#E64E25]"
            >
              Why OpenChat
            </a>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#66CCF2]"
            >
              Features
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#E64E25]"
            >
              FAQ
            </a>
          </div>

          <div className="pt-3 border-t border-[#F1E8EB] dark:border-[#222D34] flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-[#737373] dark:text-[#8696A0]">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>100% Free &amp; Open</span>
            </div>
            {user ? (
              <Link href="/chat" onClick={() => setMobileMenuOpen(false)}>
                <Button
                  variant="brand"
                  size="sm"
                  aria-label="Enter chat"
                  className="rounded-[8px] bg-[#00A884] hover:bg-[#008f6f] text-white"
                >
                  Enter Chat
                </Button>
              </Link>
            ) : (
              <Button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth();
                }}
                disabled={isAuthenticating}
                variant="brand"
                size="sm"
                aria-label="Sign in with Google"
                className="rounded-[8px] bg-[#00A884] hover:bg-[#008f6f] text-white disabled:opacity-75"
              >
                {isAuthenticating ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Connecting...
                  </span>
                ) : (
                  "Sign in with Google"
                )}
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
