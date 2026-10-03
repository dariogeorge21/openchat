"use client";

import React from "react";
import { motion } from "framer-motion";
import { GoogleIcon } from "@/components/icons/google-icon";
import { Users2, Radio, Lock, Zap, CheckCircle2 } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "One-Click Google Verification",
      description:
        "Authenticate using your trusted Google identity in under 400 milliseconds. No signup forms, no password resets, no friction.",
      badge: "Zero-Knowledge Storage",
      icon: GoogleIcon,
      accent: "#66CCF2",
      metric: "400ms Handshake",
    },
    {
      num: "02",
      title: "Discover Rooms & Real-time Peers",
      description:
        "Browse open public spaces or generate private ephemeral channel codes to share with friends, teams, or study circles instantly.",
      badge: "Multi-User Presence",
      icon: Users2,
      accent: "#E64E25",
      metric: "Unlimited Peers",
    },
    {
      num: "03",
      title: "Collaborate & Stream Without Lag",
      description:
        "Enjoy lightning-fast low-latency messaging with active typing states, fluid animations, and rich markdown communication.",
      badge: "Realtime Sync",
      icon: Radio,
      accent: "#171717",
      metric: "< 25ms Latency",
    },
  ];

  return (
    <section id="protocol" className="py-24 bg-[#FCFAF9]/60 border-y border-[#F1E8EB] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-[#E64E25] font-semibold bg-[#E64E25]/10 px-3 py-1 rounded-full border border-[#E64E25]/20">
            Frictionless Protocol
          </span>
          <h2 className="mt-4 font-[family-name:var(--font-josefin)] font-light text-4xl sm:text-5xl text-[#171717] tracking-tight">
            How OpenChat works in <span className="font-normal text-[#66CCF2]">3 simple steps</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#737373] leading-relaxed">
            Eliminating 100% of traditional chat onboarding friction. You are 1 click away from real conversations.
          </p>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => {
            const IconComp = step.icon;
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="relative bg-white rounded-[16px] p-8 border border-[#F1E8EB] shadow-[0_2px_12px_-4px_rgba(23,23,23,0.03)] hover:shadow-[0_12px_30px_-8px_rgba(102,204,242,0.12)] hover:border-[#66CCF2]/50 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-[family-name:var(--font-josefin)] text-3xl font-light text-[#737373]/40 group-hover:text-[#66CCF2] transition-colors">
                      {step.num}
                    </span>
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-[#FAF9FA] text-[#737373] border border-[#F1E8EB]">
                      {step.metric}
                    </span>
                  </div>

                  <div className="w-12 h-12 rounded-[12px] bg-[#FAF9FA] border border-[#F1E8EB] flex items-center justify-center mb-6 group-hover:bg-white group-hover:border-[#66CCF2]/40 transition-colors">
                    <IconComp className="w-5 h-5 text-[#171717]" />
                  </div>

                  <h3 className="text-lg font-semibold text-[#171717] mb-2.5 tracking-tight">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#737373] leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-[#F1E8EB]/70 flex items-center gap-1.5 text-xs font-medium text-[#171717]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#66CCF2]" />
                  <span>{step.badge}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
