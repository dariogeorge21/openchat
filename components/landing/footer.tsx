"use client";

import React from "react";
import Link from "next/link";
import { OpenChatLogo } from "@/components/brand/open-chat-logo";
import { ShieldCheck, Lock, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white dark:bg-[#0B141A] border-t border-[#F1E8EB] dark:border-[#222D34] pt-16 pb-12 relative">
      {/* Brand accent bar at the very top of the footer */}
      <div className="absolute top-0 left-0 right-0 h-[2px] flex">
        <div className="w-1/3 bg-[#00A884]" />
        <div className="w-1/3 bg-[#66CCF2]" />
        <div className="w-1/3 bg-[#E64E25]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-[#F1E8EB] dark:border-[#222D34]">
          {/* Brand info (2 cols) */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <OpenChatLogo height={28} />
            </Link>
            <p className="text-xs sm:text-sm text-[#737373] dark:text-[#8696A0] max-w-sm leading-relaxed">
              OpenChat is a free, open WhatsApp alternative enabling personal 1-on-1 and
              group communication powered by GoogleAuth. Zero phone numbers, zero passwords,
              familiar real-time messaging across all devices.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF9FA] dark:bg-[#182229] border border-[#F1E8EB] dark:border-[#222D34] text-xs text-[#737373] dark:text-[#8696A0]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Realtime WebSockets Active • E2EE Mesh</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-xs font-semibold text-[#171717] dark:text-[#E9EDEF] uppercase tracking-wider mb-4">
              Messaging
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#737373] dark:text-[#8696A0]">
              <li>
                <a href="#chat-experience" className="hover:text-[#171717] dark:hover:text-white transition-colors">
                  1-on-1 Direct Chats
                </a>
              </li>
              <li>
                <a href="#chat-experience" className="hover:text-[#171717] dark:hover:text-white transition-colors">
                  Group Circles
                </a>
              </li>
              <li>
                <a href="#demo" className="hover:text-[#171717] dark:hover:text-white transition-colors">
                  Interactive Web Demo
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-[#171717] dark:hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-[#171717] dark:text-[#E9EDEF] uppercase tracking-wider mb-4">
              Platform &amp; Privacy
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#737373] dark:text-[#8696A0]">
              <li>
                <a href="#comparison" className="hover:text-[#00A884] transition-colors">
                  WhatsApp vs OpenChat
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-[#66CCF2] transition-colors">
                  GoogleAuth (No Phone #)
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-[#00A884] transition-colors">
                  End-to-End Encryption
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-[#E64E25] transition-colors">
                  Security &amp; FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-[#171717] dark:text-[#E9EDEF] uppercase tracking-wider mb-4">
              Design Specs
            </h4>
            <div className="space-y-2 text-xs text-[#737373] dark:text-[#8696A0]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#00A884]" />
                <span className="font-mono text-[#171717] dark:text-[#E9EDEF]">#00A884</span> (Open Emerald)
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#66CCF2]" />
                <span className="font-mono text-[#171717] dark:text-[#E9EDEF]">#66CCF2</span> (Brand Sky)
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#E64E25]" />
                <span className="font-mono text-[#171717] dark:text-[#E9EDEF]">#E64E25</span> (Accent Coral)
              </div>
              <div className="text-[11px] pt-1 text-[#737373] dark:text-[#8696A0] leading-tight">
                Josefin Sans • Inter UI • 10px Radius Buttons • 16-22px Cards
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#737373] dark:text-[#8696A0]">
          <p>© {new Date().getFullYear()} OpenChat. Free and open real-time messaging application.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00A884]" />
              Privacy First • OAuth 2.0 PKCE
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#0284c7]" />
              Local Client Encryption
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
