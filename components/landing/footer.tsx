"use client";

import React from "react";
import Link from "next/link";
import { OpenChatLogo } from "@/components/brand/open-chat-logo";
import { ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-[#F1E8EB] pt-16 pb-12 relative">
      {/* Brand accent bar at the very top of the footer */}
      <div className="absolute top-0 left-0 right-0 h-[2px] flex">
        <div className="w-1/2 bg-[#66CCF2]" />
        <div className="w-1/2 bg-[#E64E25]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-[#F1E8EB]">
          {/* Brand info (2 cols) */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <OpenChatLogo height={28} />
            </Link>
            <p className="text-xs sm:text-sm text-[#737373] max-w-sm leading-relaxed">
              OpenChat is an open, frictionless application enabling multi-user real-time
              communication powered strictly by GoogleAuth. High whitespace, geometric
              minimalism, zero passwords.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF9FA] border border-[#F1E8EB] text-xs text-[#737373]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All Systems Operational • Global Mesh Online</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-xs font-semibold text-[#171717] uppercase tracking-wider mb-4">
              Protocol
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#737373]">
              <li>
                <a href="#protocol" className="hover:text-[#171717] transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-[#171717] transition-colors">
                  GoogleAuth Zero-Friction
                </a>
              </li>
              <li>
                <a href="#rooms" className="hover:text-[#171717] transition-colors">
                  Live Rooms
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-[#171717] transition-colors">
                  Architecture & Privacy
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-[#171717] uppercase tracking-wider mb-4">
              Community Channels
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#737373]">
              <li>
                <a href="#rooms" className="hover:text-[#66CCF2] transition-colors">
                  #general-lounge
                </a>
              </li>
              <li>
                <a href="#rooms" className="hover:text-[#E64E25] transition-colors">
                  #ai-agents
                </a>
              </li>
              <li>
                <a href="#rooms" className="hover:text-[#66CCF2] transition-colors">
                  #design-critique
                </a>
              </li>
              <li>
                <a href="#rooms" className="hover:text-[#171717] transition-colors">
                  #open-devs
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-[#171717] uppercase tracking-wider mb-4">
              Design Specs
            </h4>
            <div className="space-y-2 text-xs text-[#737373]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#66CCF2]" />
                <span className="font-mono text-[#171717]">#66CCF2</span> (Brand Blue)
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#E64E25]" />
                <span className="font-mono text-[#171717]">#E64E25</span> (Brand Orange)
              </div>
              <div className="text-[11px] pt-1 text-[#737373] leading-tight">
                Josefin Sans Thin • Inter UI • 10px Radius Buttons • 16px Cards
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#737373]">
          <p>© {new Date().getFullYear()} OpenChat. Crafted with geometric minimalism.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Privacy First • OAuth 2.0 PKCE
            </span>
            <span>Zero Tracking Cookies</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
