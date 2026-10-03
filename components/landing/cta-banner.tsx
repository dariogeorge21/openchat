"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/components/icons/google-icon";
import { ArrowRight, ShieldCheck, Zap } from "lucide-react";

export function CTABanner({ onOpenAuth }: { onOpenAuth: () => void }) {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[20px] border border-[#F1E8EB] p-10 sm:p-16 text-center bg-gradient-to-b from-[#FBF9FA] via-white to-[#FBF9FA] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          {/* Subtle colored accent shapes */}
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#66CCF2]/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-[#E64E25]/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#F1E8EB] text-xs text-[#737373] shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              1,420+ peers actively connected
            </span>

            <h2 className="font-[family-name:var(--font-josefin)] font-light text-4xl sm:text-5xl md:text-6xl text-[#171717] tracking-tight leading-tight">
              Start chatting openly. <br />
              <span className="font-normal text-[#66CCF2]">Zero setup</span> required.
            </h2>

            <p className="text-sm sm:text-base text-[#737373] max-w-xl mx-auto leading-relaxed">
              Step into high-speed multi-user channels with single-click Google authentication. No forms. No barriers.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Button
                onClick={onOpenAuth}
                variant="google"
                size="xl"
                className="w-full sm:w-auto h-13 px-8 text-sm font-semibold rounded-[10px] gap-2.5 border-[#F1E8EB] shadow-sm hover:shadow-md hover:border-[#66CCF2]"
              >
                <GoogleIcon className="w-4 h-4" />
                <span>Continue with Google</span>
              </Button>

              <a href="#rooms" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="xl"
                  className="w-full sm:w-auto h-13 px-6 text-sm font-medium rounded-[10px] gap-2 border-[#F1E8EB] text-[#171717] hover:border-[#E64E25]/50 hover:bg-white"
                >
                  <span>Browse Channels</span>
                  <ArrowRight className="w-4 h-4 text-[#737373]" />
                </Button>
              </a>
            </div>

            <div className="pt-4 flex items-center justify-center gap-6 text-xs text-[#737373]">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Google Verified Only
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#0284c7]" />
                Instant Room Access
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
