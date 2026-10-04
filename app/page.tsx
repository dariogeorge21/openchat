"use client";

import React, { useState, useEffect } from "react";
import { Navigation } from "@/components/landing/navigation";
import { Hero } from "@/components/landing/hero";
import { DirectChatShowcase } from "@/components/landing/direct-chat-showcase";
import { HowItWorks } from "@/components/landing/how-it-works";
import { ComparisonSection } from "@/components/landing/comparison-section";
import { FeatureMatrix } from "@/components/landing/feature-matrix";
import { FAQSection } from "@/components/landing/faq-section";
import { CTABanner } from "@/components/landing/cta-banner";
import { Footer } from "@/components/landing/footer";
import { OpenChatSplash } from "@/components/brand/open-chat-logo";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const { user, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Prevent browser from restoring previous scroll position on initial load
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
    }
  }, []);

  // Display OpenChat logo splash for 2 seconds with minimal modern animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      // Ensure landing page strictly starts at top (0, 0)
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Unified authentication / chat launch handler with loading state
  const handleAuth = async () => {
    if (isAuthenticating) return;

    if (user) {
      setIsAuthenticating(true);
      router.push("/chat");
      return;
    }

    try {
      setIsAuthenticating(true);
      await signInWithGoogle();
    } catch (err) {
      console.warn("Direct Google sign-in fallback to /login:", err);
      router.push("/login");
    } finally {
      setTimeout(() => setIsAuthenticating(false), 2500);
    }
  };

  if (showSplash) {
    return <OpenChatSplash />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B141A] text-[#171717] dark:text-[#E9EDEF] selection:bg-[#00A884]/25 selection:text-[#171717] dark:selection:text-white overflow-x-hidden w-full">
      {/* Navigation with integrated user status banner and auth loading state */}
      <Navigation onOpenAuth={handleAuth} isAuthenticating={isAuthenticating} />

      {/* Hero Section with Interactive Messenger Sandbox */}
      <div id="hero">
        <Hero onOpenAuth={handleAuth} isAuthenticating={isAuthenticating} />
      </div>

      {/* Direct 1-on-1 & Group Chatting Showcase */}
      <DirectChatShowcase onStartChat={handleAuth} isAuthenticating={isAuthenticating} />

      {/* 3-Step Protocol: GoogleAuth, Find User, Start Chatting */}
      <HowItWorks />

      {/* WhatsApp vs OpenChat Side-by-Side Comparison */}
      <ComparisonSection />

      {/* Bento Grid Architecture Features */}
      <FeatureMatrix />

      {/* FAQ Section */}
      <FAQSection />

      {/* Final Action Banner */}
      <CTABanner onOpenAuth={handleAuth} isAuthenticating={isAuthenticating} />

      {/* Footer */}
      <Footer />
    </div>
  );
}
