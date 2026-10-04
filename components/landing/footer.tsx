"use client";

import React from "react";
import Link from "next/link";
import { OpenChatLogo } from "@/components/brand/open-chat-logo";
import { ShieldCheck, Lock, Sparkles, ExternalLink, Heart, Globe } from "lucide-react";

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#F1E8EB] dark:border-[#222D34]">
          {/* Brand info (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" aria-label="OpenChat Home" className="inline-block">
              <OpenChatLogo height={28} />
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
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF9FA] dark:bg-[#182229] border border-[#F1E8EB] dark:border-[#222D34] text-xs text-[#54656F] dark:text-[#8696A0] hover:border-[#00A884] hover:text-[#00A884] transition-all group shadow-2xs"
              >
                <span className="w-2 h-2 rounded-full bg-[#00A884] group-hover:animate-pulse" />
                <span>
                  A product by{" "}
                  <strong className="font-semibold text-[#111B21] dark:text-[#E9EDEF] group-hover:text-[#00A884] underline underline-offset-2">
                    dariogeorge.in
                  </strong>
                </span>
                <ExternalLink className="w-3 h-3 text-[#54656F] dark:text-[#8696A0] group-hover:text-[#00A884] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF9FA] dark:bg-[#182229] border border-[#F1E8EB] dark:border-[#222D34] text-xs text-[#54656F] dark:text-[#8696A0]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Realtime WebSockets Active • E2EE Mesh</span>
            </div>
          </div>

          {/* Column 2: Features */}
          <div>
            <h4 className="text-xs font-semibold text-[#171717] dark:text-[#E9EDEF] uppercase tracking-wider mb-4">
              Features
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#54656F] dark:text-[#8696A0]">
              <li>
                <Link href="/#chat-experience" className="hover:text-[#00A884] transition-colors">
                  1-on-1 Direct Chats
                </Link>
              </li>
              <li>
                <Link href="/#chat-experience" className="hover:text-[#00A884] transition-colors">
                  Group Circles
                </Link>
              </li>
              <li>
                <Link href="/#chat-experience" className="hover:text-[#00A884] transition-colors">
                  Presence &amp; Read Receipts
                </Link>
              </li>
              <li>
                <Link href="/#features" className="hover:text-[#66CCF2] transition-colors">
                  End-to-End Encryption
                </Link>
              </li>
              <li>
                <Link href="/#features" className="hover:text-[#66CCF2] transition-colors">
                  Zero Phone GoogleAuth
                </Link>
              </li>
              <li>
                <Link href="/#demo-preview" className="hover:text-[#E64E25] transition-colors">
                  Interactive Web Sandbox
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Compare & Learn */}
          <div>
            <h4 className="text-xs font-semibold text-[#171717] dark:text-[#E9EDEF] uppercase tracking-wider mb-4">
              Compare &amp; Learn
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#54656F] dark:text-[#8696A0]">
              <li>
                <Link href="/#comparison" className="hover:text-[#00A884] transition-colors">
                  Why OpenChat
                </Link>
              </li>
              <li>
                <Link href="/#comparison" className="hover:text-[#00A884] transition-colors">
                  WhatsApp vs OpenChat
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-[#66CCF2] transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-[#E64E25] transition-colors">
                  FAQ &amp; Architecture
                </Link>
              </li>
              <li>
                <Link href="/privacy#security" className="hover:text-[#171717] dark:hover:text-white transition-colors">
                  Security Model
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Company & Legal */}
          <div>
            <h4 className="text-xs font-semibold text-[#171717] dark:text-[#E9EDEF] uppercase tracking-wider mb-4">
              Company &amp; Legal
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#54656F] dark:text-[#8696A0]">
              <li>
                <Link href="/about" className="hover:text-[#00A884] transition-colors font-medium">
                  About OpenChat
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#00A884] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#00A884] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <a
                  href="https://dariogeorge.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#111B21] dark:hover:text-white transition-colors flex items-center gap-1 font-medium"
                >
                  <span>dariogeorge.in</span>
                  <ExternalLink className="w-3 h-3 text-[#54656F] dark:text-[#8696A0]" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#54656F] dark:text-[#8696A0]">
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

          <div className="flex flex-wrap items-center gap-6">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00A884]" />
              Privacy First • OAuth 2.0 PKCE
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#0284c7]" />
              Local Client Encryption
            </span>
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
