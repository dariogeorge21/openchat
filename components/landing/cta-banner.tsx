"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/components/icons/google-icon";
import { ArrowRight, ShieldCheck, Zap, Lock, Sparkles, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";

export function CTABanner({
  onOpenAuth,
  isAuthenticating = false,
}: {
  onOpenAuth: () => void;
  isAuthenticating?: boolean;
}) {
  const { user } = useAuth();

  return (
    <section className="py-14 sm:py-20 bg-white dark:bg-[#111B21] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[18px] sm:rounded-[22px] border border-[#F1E8EB] dark:border-[#222D34] p-6 sm:p-12 md:p-16 text-center bg-gradient-to-b from-[#FBF9FA] via-white to-[#FBF9FA] dark:from-[#182229] dark:via-[#111B21] dark:to-[#182229] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          {/* Subtle colored accent shapes */}
          <div className="absolute -top-24 -left-24 w-48 sm:w-72 h-48 sm:h-72 rounded-full bg-[#00A884]/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 sm:w-72 h-48 sm:h-72 rounded-full bg-[#66CCF2]/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-5 sm:space-y-6">
            <span className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-white dark:bg-[#202C33] border border-[#F1E8EB] dark:border-[#222D34] text-[11px] sm:text-xs text-[#737373] dark:text-[#8696A0] shadow-xs max-w-full truncate">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
              <span className="truncate">100% Free • Open to everyone with Google</span>
            </span>

            <h2 className="font-[family-name:var(--font-josefin)] font-light text-3xl min-[480px]:text-4xl sm:text-5xl md:text-6xl text-[#171717] dark:text-white tracking-tight leading-tight">
              Start chatting openly. <br />
              <span className="font-normal text-[#00A884]">Zero phone barriers</span>.
            </h2>

            <p className="text-xs sm:text-sm md:text-base text-[#737373] dark:text-[#8696A0] max-w-xl mx-auto leading-relaxed">
              Step into frictionless 1-on-1 and group messaging with single-click Google authentication.
              No SIM cards. No phone number sharing. Just pure connection.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-3.5 w-full">
              {user ? (
                <Link href="/chat" className="w-full sm:w-auto">
                  <Button
                    variant="brand"
                    size="xl"
                    aria-label="Enter chat dashboard"
                    className="w-full sm:w-auto h-12 sm:h-13 px-6 sm:px-8 text-sm font-semibold rounded-[10px] gap-2.5 bg-[#00A884] hover:bg-[#008f6f] text-white shadow-sm hover:shadow-md transition-all flex items-center justify-center"
                  >
                    <span>Enter Chat Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              ) : (
                <Button
                  onClick={onOpenAuth}
                  disabled={isAuthenticating}
                  variant="google"
                  size="xl"
                  aria-label="Continue with Google authentication"
                  className="w-full sm:w-auto h-12 sm:h-13 px-6 sm:px-8 text-sm font-semibold rounded-[10px] gap-2.5 border-[#F1E8EB] dark:border-[#222D34] bg-white dark:bg-[#202C33] dark:text-white shadow-sm hover:shadow-md hover:border-[#00A884] disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center"
                >
                  {isAuthenticating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#00A884]" />
                      <span>Connecting to Google...</span>
                    </>
                  ) : (
                    <>
                      <GoogleIcon className="w-4 h-4" />
                      <span>Continue with Google</span>
                    </>
                  )}
                </Button>
              )}

              <a href="#comparison" aria-label="Compare OpenChat with WhatsApp" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="xl"
                  aria-label="See WhatsApp comparison"
                  className="w-full sm:w-auto h-12 sm:h-13 px-6 text-sm font-medium rounded-[10px] gap-2 border-[#F1E8EB] dark:border-[#222D34] text-[#171717] dark:text-[#E9EDEF] hover:border-[#66CCF2] hover:bg-white dark:hover:bg-[#202C33] cursor-pointer flex items-center justify-center"
                >
                  <span>Compare with WhatsApp</span>
                  <ArrowRight className="w-4 h-4 text-[#737373] dark:text-[#8696A0]" />
                </Button>
              </a>
            </div>

            <div className="pt-3 sm:pt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-[#737373] dark:text-[#8696A0]">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00A884]" />
                Google Verified Identity
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#0284c7]" />
                End-to-End Encrypted
              </span>
              <span className="hidden sm:inline">•</span>
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
