"use client";

import React from "react";
import { Navigation } from "@/components/landing/navigation";
import { Hero } from "@/components/landing/hero";
import { DirectChatShowcase } from "@/components/landing/direct-chat-showcase";
import { HowItWorks } from "@/components/landing/how-it-works";
import { ComparisonSection } from "@/components/landing/comparison-section";
import { FeatureMatrix } from "@/components/landing/feature-matrix";
import { FAQSection } from "@/components/landing/faq-section";
import { CTABanner } from "@/components/landing/cta-banner";
import { Footer } from "@/components/landing/footer";
import { ShieldCheck } from "lucide-react";

import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const { user, profile, isCryptoReady } = useAuth();
  const router = useRouter();
  const displayName =
    profile?.display_name || user?.user_metadata?.full_name || user?.email || "User";

  const handleOpenAuth = () => {
    if (user) {
      router.push("/chat");
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B141A] text-[#171717] dark:text-[#E9EDEF] selection:bg-[#00A884]/25 selection:text-[#171717] dark:selection:text-white">
      {/* Top Banner when Authenticated */}
      {user && (
        <div className="bg-[#00A884]/10 dark:bg-[#00A884]/15 border-b border-[#00A884]/30 px-4 py-2.5 text-xs text-[#171717] dark:text-[#E9EDEF] flex items-center justify-between z-50 sticky top-0 backdrop-blur-md">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            <ShieldCheck className="w-4 h-4 text-[#00A884] flex-shrink-0" />
            <span className="truncate">
              Signed in as <strong>{displayName}</strong> ({user.email}).{" "}
              {isCryptoReady ? "E2EE cryptographic keys ready." : "Securing local keys..."}
            </span>
            <Link
              href="/chat"
              className="ml-auto bg-[#00A884] text-white hover:bg-[#008f6f] px-3.5 py-1 rounded-[8px] text-xs font-semibold transition-all shadow-xs flex-shrink-0"
            >
              Enter Chat Dashboard &rarr;
            </Link>
          </div>
        </div>
      )}

      {/* Navigation */}
      <Navigation onOpenAuth={handleOpenAuth} />

      {/* Hero Section with Interactive Messenger Sandbox */}
      <div id="hero">
        <Hero onOpenAuth={handleOpenAuth} />
      </div>

      {/* Direct 1-on-1 & Group Chatting Showcase (Replaces Discord Public Rooms) */}
      <DirectChatShowcase onStartChat={handleOpenAuth} />

      {/* 3-Step Protocol: GoogleAuth, Find User, Start Chatting */}
      <HowItWorks />

      {/* WhatsApp vs OpenChat Side-by-Side Comparison */}
      <ComparisonSection />

      {/* Bento Grid Architecture Features */}
      <FeatureMatrix />

      {/* FAQ Section */}
      <FAQSection />

      {/* Final Action Banner */}
      <CTABanner onOpenAuth={handleOpenAuth} />

      {/* Footer */}
      <Footer />
    </div>
  );
}
