"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/components/icons/google-icon";
import { ArrowRight, ShieldCheck, Zap, Lock, Sparkles } from "lucide-react";

export function CTABanner({ onOpenAuth }: { onOpenAuth: () => void }) {
  return (
    <section className="py-20 bg-white dark:bg-[#111B21] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[22px] border border-[#F1E8EB] dark:border-[#222D34] p-10 sm:p-16 text-center bg-gradient-to-b from-[#FBF9FA] via-white to-[#FBF9FA] dark:from-[#182229] dark:via-[#111B21] dark:to-[#182229] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          {/* Subtle colored accent shapes */}
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#00A884]/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-[#66CCF2]/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#202C33] border border-[#F1E8EB] dark:border-[#222D34] text-xs text-[#737373] dark:text-[#8696A0] shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              100% Free • Open to everyone with a Google account
            </span>

            <h2 className="font-[family-name:var(--font-josefin)] font-light text-4xl sm:text-5xl md:text-6xl text-[#171717] dark:text-white tracking-tight leading-tight">
              Start chatting openly. <br />
              <span className="font-normal text-[#00A884]">Zero phone barriers</span>.
            </h2>

            <p className="text-sm sm:text-base text-[#737373] dark:text-[#8696A0] max-w-xl mx-auto leading-relaxed">
              Step into frictionless 1-on-1 and group messaging with single-click Google authentication.
              No SIM cards. No phone number sharing. Just pure connection.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Button
                onClick={onOpenAuth}
                variant="google"
                size="xl"
                className="w-full sm:w-auto h-13 px-8 text-sm font-semibold rounded-[10px] gap-2.5 border-[#F1E8EB] dark:border-[#222D34] bg-white dark:bg-[#202C33] dark:text-white shadow-sm hover:shadow-md hover:border-[#00A884]"
              >
                <GoogleIcon className="w-4 h-4" />
                <span>Continue with Google</span>
              </Button>

              <a href="#demo" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="xl"
                  className="w-full sm:w-auto h-13 px-6 text-sm font-medium rounded-[10px] gap-2 border-[#F1E8EB] dark:border-[#222D34] text-[#171717] dark:text-[#E9EDEF] hover:border-[#66CCF2] hover:bg-white dark:hover:bg-[#202C33]"
                >
                  <span>Test Live Web Demo</span>
                  <ArrowRight className="w-4 h-4 text-[#737373] dark:text-[#8696A0]" />
                </Button>
              </a>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-[#737373] dark:text-[#8696A0]">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00A884]" />
                Google Verified Identity
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#0284c7]" />
                End-to-End Encrypted
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#E64E25]" />
                Free Forever
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
