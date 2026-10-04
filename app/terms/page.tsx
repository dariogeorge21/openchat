"use client";

import React from "react";
import Link from "next/link";
import { OpenChatLogo } from "@/components/brand/open-chat-logo";
import { Footer } from "@/components/landing/footer";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, CheckCircle2, ShieldAlert } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

export default function TermsPage() {
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
            <Link href="/">
              <Button
                variant="outline"
                size="sm"
                className="rounded-[10px] text-xs h-9 px-3 gap-1.5 border-[#F1E8EB] dark:border-[#222D34]"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Home</span>
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
          <FileText className="w-3.5 h-3.5" />
          <span>User Agreement</span>
        </div>

        <h1 className="font-[family-name:var(--font-josefin)] font-light text-4xl sm:text-5xl text-[#171717] dark:text-white tracking-tight leading-[1.1] mb-4">
          Terms of Service
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

        {/* Content sections */}
        <div className="space-y-10 text-sm leading-relaxed text-[#54656F] dark:text-[#8696A0]">
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-[#171717] dark:text-white tracking-tight">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing OpenChat, signing in with your Google account, or using our messaging features,
              you agree to be bound by these Terms of Service. If you do not agree with any part of these terms,
              you must refrain from using the platform.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-[#171717] dark:text-white tracking-tight">
              2. Acceptable Use
            </h2>
            <p>
              OpenChat is designed to foster private, direct, and collaborative human communication.
              You agree not to use the service for:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
              <li>Transmitting unlawful, abusive, defamatory, harassing, or threatening messages.</li>
              <li>Impersonating other persons or organizations.</li>
              <li>Automated spamming, scraping, or denial-of-service activities against the platform.</li>
              <li>Distributing malicious code, exploits, or unauthorized software.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-[#171717] dark:text-white tracking-tight">
              3. Service Availability &amp; Disclaimer
            </h2>
            <p>
              OpenChat is provided free of charge on an "as is" and "as available" basis without warranties
              of any kind, either express or implied. While we strive for continuous uptime and low-latency
              delivery, we do not warrant that the service will be uninterrupted, error-free, or entirely bug-free.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-[#171717] dark:text-white tracking-tight">
              4. Open Platform &amp; Attribution
            </h2>
            <p>
              OpenChat is engineered by Dario George. All trademarks, branding, and assets are owned by the maintainers.
              You can learn more about related engineering works at{" "}
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
