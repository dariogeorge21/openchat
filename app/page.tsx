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

export default function LandingPage() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email: string;
    avatar: string;
  } | null>(null);

  const handleAuthenticated = (user: {
    name: string;
    email: string;
    avatar: string;
  }) => {
    setCurrentUser(user);
  };

  const handleJoinRoom = (roomName: string) => {
    if (!currentUser) {
      setAuthModalOpen(true);
    } else {
      const el = document.getElementById("hero");
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#171717] selection:bg-[#66CCF2]/25 selection:text-[#171717]">
      {/* Top Banner when Authenticated */}
      {currentUser && (
        <div className="bg-[#66CCF2]/10 border-b border-[#66CCF2]/30 px-4 py-2.5 text-xs text-[#171717] flex items-center justify-between z-50 sticky top-0">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            <ShieldCheck className="w-4 h-4 text-[#0983b6]" />
            <span>
              Signed in as <strong>{currentUser.name}</strong> ({currentUser.email}) via Google Identity. Ready to chat in any channel!
            </span>
            <button
              onClick={() => setCurrentUser(null)}
              className="ml-auto text-[#737373] hover:text-[#171717] p-1 rounded hover:bg-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <Navigation onOpenAuth={() => setAuthModalOpen(true)} />

      {/* Hero Section */}
      <div id="hero">
        <Hero onOpenAuth={() => setAuthModalOpen(true)} />
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
      <CTABanner onOpenAuth={() => setAuthModalOpen(true)} />

      {/* Footer */}
      <Footer />

      {/* Google Authentication Demonstration Modal */}
      <GoogleAuthModal
        open={authModalOpen}
        onOpenChange={setAuthModalOpen}
        onAuthenticated={handleAuthenticated}
      />
    </div>
  );
}
