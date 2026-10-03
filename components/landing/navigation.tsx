"use client";

import React, { useState } from "react";
import Link from "next/link";
import { OpenChatLogo, OpenChatIconMark } from "@/components/brand/open-chat-logo";
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/components/icons/google-icon";
import { Menu, X, ArrowUpRight, ShieldCheck, Zap } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

import { useAuth } from "@/contexts/auth-context";

export function Navigation({
  onOpenAuth,
}: {
  onOpenAuth: () => void;
}) {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-[#F1E8EB]/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo and Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <OpenChatLogo height={28} className="transition-transform group-hover:scale-[1.02]" />
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#737373]">
          <a
            href="#protocol"
            className="hover:text-[#171717] transition-colors relative py-1 hover:after:w-full after:w-0 after:h-[2px] after:bg-[#66CCF2] after:absolute after:bottom-0 after:left-0 after:transition-all"
          >
            How it Works
          </a>
          <a
            href="#rooms"
            className="hover:text-[#171717] transition-colors relative py-1 hover:after:w-full after:w-0 after:h-[2px] after:bg-[#E64E25] after:absolute after:bottom-0 after:left-0 after:transition-all"
          >
            Live Rooms
          </a>
          <a
            href="#features"
            className="hover:text-[#171717] transition-colors relative py-1 hover:after:w-full after:w-0 after:h-[2px] after:bg-[#66CCF2] after:absolute after:bottom-0 after:left-0 after:transition-all"
          >
            Capabilities
          </a>
          <a
            href="#faq"
            className="hover:text-[#171717] transition-colors relative py-1 hover:after:w-full after:w-0 after:h-[2px] after:bg-[#E64E25] after:absolute after:bottom-0 after:left-0 after:transition-all"
          >
            FAQ
          </a>
        </nav>

        {/* Right CTA */}
        <div className="hidden sm:flex items-center gap-3">
          <ThemeToggle />
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-[10px] bg-[#FAF9FA] dark:bg-[#182229] border border-[#F1E8EB] dark:border-[#222D34] text-xs text-[#737373] dark:text-[#8696A0]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[#171717] dark:text-[#E9EDEF]">E2EE</span> Mesh Active
          </div>

          {user ? (
            <Link href="/chat">
              <Button
                variant="default"
                size="default"
                className="rounded-[10px] font-medium text-xs sm:text-sm px-4 h-10 bg-[#00A884] hover:bg-[#008f6f] text-white flex items-center gap-2"
              >
                <span>Open Chat</span>
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button
                variant="google"
                size="default"
                className="rounded-[10px] font-medium text-xs sm:text-sm px-4 h-10 border border-[#F1E8EB] hover:border-[#66CCF2]"
              >
                <GoogleIcon className="w-4 h-4" />
                <span>Sign in with Google</span>
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex sm:hidden items-center gap-2">
          {user ? (
            <Link href="/chat">
              <Button
                variant="default"
                size="sm"
                className="h-8 px-2.5 text-xs bg-[#00A884] text-white"
              >
                <span>Chat</span>
              </Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button
                variant="google"
                size="sm"
                className="h-8 px-2.5 text-xs"
              >
                <GoogleIcon className="w-3.5 h-3.5" />
                <span>Sign in</span>
              </Button>
            </Link>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-[8px] border border-[#F1E8EB] text-[#171717]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-[#F1E8EB] bg-white px-6 py-5 space-y-4 shadow-lg animate-in slide-in-from-top-2">
          <div className="flex flex-col space-y-3 text-sm font-medium text-[#171717]">
            <a
              href="#protocol"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#66CCF2]"
            >
              How it Works
            </a>
            <a
              href="#rooms"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#E64E25]"
            >
              Live Rooms
            </a>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#66CCF2]"
            >
              Capabilities
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#E64E25]"
            >
              FAQ
            </a>
          </div>

          <div className="pt-3 border-t border-[#F1E8EB] flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-[#737373]">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>1,420 peers active</span>
            </div>
            <Button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAuth();
              }}
              variant="brand"
              size="sm"
            >
              Connect Now
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
