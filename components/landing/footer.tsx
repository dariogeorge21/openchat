"use client";

import React from "react";
import Link from "next/link";
import { OpenChatLogo } from "@/components/brand/open-chat-logo";
import { ShieldCheck, Lock, Sparkles, ExternalLink, Heart, Globe } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white dark:bg-[#0B141A] border-t border-[#F1E8EB] dark:border-[#222D34] pt-12 sm:pt-16 pb-8 sm:pb-12 relative">
      {/* Brand accent bar at the very top of the footer */}
      <div className="absolute top-0 left-0 right-0 h-[2px] flex">
        <div className="w-1/3 bg-[#00A884]" />
        <div className="w-1/3 bg-[#66CCF2]" />
        <div className="w-1/3 bg-[#E64E25]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 pb-8 sm:pb-12 border-b border-[#F1E8EB] dark:border-[#222D34]">
          {/* Brand info (2 cols) */}
          <div className="sm:col-span-2 lg:col-span-2 space-y-3.5 sm:space-y-4">
            <Link href="/" aria-label="OpenChat Home" className="inline-block">
              <OpenChatLogo height={24} className="h-6 sm:h-7 w-auto max-w-[160px] sm:max-w-none" />
            </Link>

            <p className="text-xs sm:text-sm text-[#54656F] dark:text-[#8696A0] max-w-sm leading-relaxed">
              OpenChat is a modern, free, open WhatsApp alternative enabling personal 1-on-1 and
              group communication powered strictly by GoogleAuth. Zero phone numbers, zero passwords,
              familiar real-time messaging across all devices.
            </p>

            {/* Creator Badge: A product by dariogeorge.in */}
            <div className="pt-1">
              <a
                href="https://dariogeorge.in"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit creator website at dariogeorge.in"
                className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-[#FAF9FA] dark:bg-[#182229] border border-[#F1E8EB] dark:border-[#222D34] text-[11px] sm:text-xs text-[#54656F] dark:text-[#8696A0] hover:border-[#00A884] hover:text-[#00A884] transition-all group shadow-2xs max-w-full truncate"
              >
                <span className="w-2 h-2 rounded-full bg-[#00A884] group-hover:animate-pulse flex-shrink-0" />
                <span className="truncate">
                  A product by{" "}
                  <strong className="font-semibold text-[#111B21] dark:text-[#E9EDEF] group-hover:text-[#00A884] underline underline-offset-2">
                    dariogeorge.in
                  </strong>
                </span>
                <ExternalLink className="w-3 h-3 text-[#54656F] dark:text-[#8696A0] group-hover:text-[#00A884] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 flex-shrink-0" />
              </a>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF9FA] dark:bg-[#182229] border border-[#F1E8EB] dark:border-[#222D34] text-[11px] sm:text-xs text-[#54656F] dark:text-[#8696A0] max-w-full truncate">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
              <span className="truncate">Realtime WebSockets Active • E2EE Mesh</span>
            </div>
          </div>

          {/* Column 2: Features */}
          <div>
            <h4 className="text-xs font-semibold text-[#171717] dark:text-[#E9EDEF] uppercase tracking-wider mb-3 sm:mb-4">
              Features
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#54656F] dark:text-[#8696A0]">
              <li>
                <Link href="/#chat-experience" className="hover:text-[#00A884] transition-colors inline-block py-0.5">
                  1-on-1 Direct Chats
                </Link>
              </li>
              <li>
                <Link href="/#chat-experience" className="hover:text-[#00A884] transition-colors inline-block py-0.5">
                  Group Circles
                </Link>
              </li>
              <li>
                <Link href="/#chat-experience" className="hover:text-[#00A884] transition-colors inline-block py-0.5">
                  Presence &amp; Read Receipts
                </Link>
              </li>
              <li>
                <Link href="/#features" className="hover:text-[#66CCF2] transition-colors inline-block py-0.5">
                  End-to-End Encryption
                </Link>
              </li>
              <li>
                <Link href="/#features" className="hover:text-[#66CCF2] transition-colors inline-block py-0.5">
                  Zero Phone GoogleAuth
                </Link>
              </li>
              <li>
                <Link href="/#demo-preview" className="hover:text-[#E64E25] transition-colors inline-block py-0.5">
                  Interactive Web Sandbox
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Compare & Learn */}
          <div>
            <h4 className="text-xs font-semibold text-[#171717] dark:text-[#E9EDEF] uppercase tracking-wider mb-3 sm:mb-4">
              Compare &amp; Learn
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#54656F] dark:text-[#8696A0]">
              <li>
                <Link href="/#comparison" className="hover:text-[#00A884] transition-colors inline-block py-0.5">
                  Why OpenChat
                </Link>
              </li>
              <li>
                <Link href="/#comparison" className="hover:text-[#00A884] transition-colors inline-block py-0.5">
                  WhatsApp vs OpenChat
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-[#66CCF2] transition-colors inline-block py-0.5">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-[#E64E25] transition-colors inline-block py-0.5">
                  FAQ &amp; Architecture
                </Link>
              </li>
              <li>
                <Link href="/privacy#security" className="hover:text-[#171717] dark:hover:text-white transition-colors inline-block py-0.5">
                  Security Model
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Company & Legal */}
          <div>
            <h4 className="text-xs font-semibold text-[#171717] dark:text-[#E9EDEF] uppercase tracking-wider mb-3 sm:mb-4">
              Company &amp; Legal
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#54656F] dark:text-[#8696A0]">
              <li>
                <Link href="/about" className="hover:text-[#00A884] transition-colors font-medium inline-block py-0.5">
                  About OpenChat
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#00A884] transition-colors inline-block py-0.5">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#00A884] transition-colors inline-block py-0.5">
                  Terms of Service
                </Link>
              </li>
              <li>
                <a
                  href="https://dariogeorge.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#111B21] dark:hover:text-white transition-colors inline-flex items-center gap-1 font-medium py-0.5"
                >
                  <span>dariogeorge.in</span>
                  <ExternalLink className="w-3 h-3 text-[#54656F] dark:text-[#8696A0]" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#54656F] dark:text-[#8696A0] text-center sm:text-left">
          <p>
            © {new Date().getFullYear()} OpenChat. All rights reserved. A product by{" "}
            <a
              href="https://dariogeorge.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00A884] hover:underline font-semibold"
            >
              dariogeorge.in
            </a>
            .
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 sm:gap-6 text-[11px] sm:text-xs">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00A884]" />
              Privacy First • OAuth 2.0 PKCE
            </span>
            <span className="hidden min-[480px]:inline">•</span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#0284c7]" />
              Local Encryption
            </span>
            <span className="hidden min-[480px]:inline">•</span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#E64E25]" />
              100% Free Forever
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
