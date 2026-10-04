"use client";

import React from "react";
import { motion } from "framer-motion";
import { GoogleIcon } from "@/components/icons/google-icon";
import { Search, MessageSquare, CheckCircle2, ShieldCheck, Zap } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "One-Click Google Verification",
      description:
        "Authenticate using your trusted Google identity in under 1 second. No phone numbers, no SMS OTP codes, and no passwords.",
      badge: "No SIM Card Required",
      icon: GoogleIcon,
      accent: "#00A884",
      metric: "< 1s Instant Login",
    },
    {
      num: "02",
      title: "Find Anyone by Email or Name",
      description:
        "Connect directly with anyone by searching their Google email address or display name. Start private 1-on-1 chats or spin up group circles instantly.",
      badge: "Zero Phone Sharing",
      icon: Search,
      accent: "#66CCF2",
      metric: "Direct Search",
    },
    {
      num: "03",
      title: "Chat with Familiar Real-Time Comfort",
      description:
        "Enjoy lightning-fast real-time messaging, typing indicators, read receipts (✓✓), presence status ('Online' / 'Last Seen'), and end-to-end security.",
      badge: "Realtime WebSocket Sync",
      icon: MessageSquare,
      accent: "#E64E25",
      metric: "< 25ms Sync",
    },
  ];

  return (
    <section id="how-it-works" className="py-14 sm:py-20 md:py-24 bg-[#FCFAF9]/60 dark:bg-[#111B21]/60 border-y border-[#F1E8EB] dark:border-[#222D34] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-[#00A884] font-semibold bg-[#00A884]/10 dark:bg-[#00A884]/20 px-3.5 py-1 rounded-full border border-[#00A884]/25">
            Frictionless Communication
          </span>
          <h2 className="mt-4 font-[family-name:var(--font-josefin)] font-light text-3xl min-[480px]:text-4xl sm:text-5xl text-[#171717] dark:text-white tracking-tight">
            How OpenChat works in <span className="font-normal text-[#00A884]">3 simple steps</span>
          </h2>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-[#737373] dark:text-[#8696A0] leading-relaxed">
            Eliminating phone-number friction. You are 1 click away from messaging anyone with a Google account.
          </p>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
          {steps.map((step, idx) => {
            const IconComp = step.icon;
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="relative bg-white dark:bg-[#182229] rounded-[16px] p-6 sm:p-8 border border-[#F1E8EB] dark:border-[#222D34] shadow-[0_2px_12px_-4px_rgba(23,23,23,0.03)] hover:shadow-[0_12px_30px_-8px_rgba(0,168,132,0.12)] hover:border-[#00A884]/50 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5 sm:mb-6">
                    <span className="font-[family-name:var(--font-josefin)] text-2xl sm:text-3xl font-light text-[#737373]/40 dark:text-[#8696A0]/40 group-hover:text-[#00A884] transition-colors">
                      {step.num}
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-mono px-2.5 py-1 rounded-full bg-[#FAF9FA] dark:bg-[#202C33] text-[#737373] dark:text-[#8696A0] border border-[#F1E8EB] dark:border-[#222D34]">
                      {step.metric}
                    </span>
                  </div>

                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-[12px] bg-[#FAF9FA] dark:bg-[#202C33] border border-[#F1E8EB] dark:border-[#222D34] flex items-center justify-center mb-5 sm:mb-6 group-hover:bg-white dark:group-hover:bg-[#2A3942] group-hover:border-[#00A884]/40 transition-colors">
                    <IconComp className="w-5 h-5 text-[#171717] dark:text-[#E9EDEF]" />
                  </div>

                  <h3 className="text-base sm:text-lg font-semibold text-[#171717] dark:text-[#E9EDEF] mb-2 sm:mb-2.5 tracking-tight">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#737373] dark:text-[#8696A0] leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 sm:mt-8 pt-4 border-t border-[#F1E8EB]/70 dark:border-[#222D34] flex items-center gap-1.5 text-xs font-medium text-[#171717] dark:text-[#E9EDEF]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00A884] flex-shrink-0" />
                  <span className="truncate">{step.badge}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
