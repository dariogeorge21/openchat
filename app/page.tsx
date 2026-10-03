"use client";

import React, { useState } from "react";
import { Navigation } from "@/components/landing/navigation";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { FeatureMatrix } from "@/components/landing/feature-matrix";
import { ActiveRoomsShowcase } from "@/components/landing/active-rooms-showcase";
import { FAQSection } from "@/components/landing/faq-section";
import { CTABanner } from "@/components/landing/cta-banner";
import { Footer } from "@/components/landing/footer";
import { GoogleAuthModal } from "@/components/landing/google-auth-modal";
import { ShieldCheck, X } from "lucide-react";

import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const { user, profile, isCryptoReady } = useAuth();
  const router = useRouter();
  const displayName = profile?.display_name || user?.user_metadata?.full_name || user?.email || 'User';

  const handleJoinRoom = () => {
    if (user) {
      router.push('/chat');
    } else {
      router.push('/login');
    }
  };

  const handleOpenAuth = () => {
    if (user) {
      router.push('/chat');
    } else {
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#171717] selection:bg-[#66CCF2]/25 selection:text-[#171717]">
      {/* Top Banner when Authenticated */}
      {user && (
        <div className="bg-[#66CCF2]/10 border-b border-[#66CCF2]/30 px-4 py-2.5 text-xs text-[#171717] flex items-center justify-between z-50 sticky top-0">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            <ShieldCheck className="w-4 h-4 text-[#0983b6]" />
            <span>
              Signed in as <strong>{displayName}</strong> ({user.email}). {isCryptoReady ? 'E2EE cryptographic keys ready.' : 'Securing local keys...'}
            </span>
            <Link
              href="/chat"
              className="ml-auto bg-[#00A884] text-white hover:bg-[#008f6f] px-3 py-1 rounded text-xs font-medium transition-colors"
            >
              Enter Chat Dashboard &rarr;
            </Link>
          </div>
        </div>
      )}

      {/* Navigation */}
      <Navigation onOpenAuth={handleOpenAuth} />

      {/* Hero Section */}
      <div id="hero">
        <Hero onOpenAuth={handleOpenAuth} />
      </div>

      {/* 3-Step Protocol */}
      <HowItWorks />

      {/* Active Public Rooms Showcase */}
      <ActiveRoomsShowcase onJoinRoom={handleJoinRoom} />

      {/* Bento Grid Features */}
      <FeatureMatrix />

      {/* Minimal FAQ Section */}
      <FAQSection />

      {/* Final Action Banner */}
      <CTABanner onOpenAuth={handleOpenAuth} />

      {/* Footer */}
      <Footer />
    </div>
  );
}
