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

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const { user } = useAuth();
  const router = useRouter();

  const handleOpenAuth = () => {
    if (user) {
      router.push("/chat");
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B141A] text-[#171717] dark:text-[#E9EDEF] selection:bg-[#00A884]/25 selection:text-[#171717] dark:selection:text-white">
      {/* Navigation with integrated user status banner */}
      <Navigation onOpenAuth={handleOpenAuth} />

      {/* Hero Section with Interactive Messenger Sandbox */}
      <div id="hero">
        <Hero onOpenAuth={handleOpenAuth} />
      </div>

      {/* Direct 1-on-1 & Group Chatting Showcase */}
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
