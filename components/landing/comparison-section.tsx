"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, X, ShieldCheck, Zap, Smartphone, Globe, Lock, Sparkles } from "lucide-react";

export function ComparisonSection() {
  const comparisons = [
    {
      feature: "Phone Number & SIM Required",
      whatsapp: {
        text: "Mandatory (Locked to 1 cellular SIM)",
        supported: false,
      },
      openchat: {
        text: "Never (Use any Google Account)",
        supported: true,
      },
    },
    {
      feature: "Multi-Device Independence",
      whatsapp: {
        text: "Must pair & sync through primary phone",
        supported: false,
      },
      openchat: {
        text: "100% Web-Native (Open on any PC, tablet, phone)",
        supported: true,
      },
    },
    {
      feature: "Onboarding Speed",
      whatsapp: {
        text: "App install + SMS verification code (~5 mins)",
        supported: false,
      },
      openchat: {
        text: "1-Click Google Sign-In (< 1 second)",
        supported: true,
      },
    },
    {
      feature: "Contact Privacy in Chats",
      whatsapp: {
        text: "Exposes your private mobile number to all peers",
        supported: false,
      },
      openchat: {
        text: "Protected Google Identity (Zero phone exposure)",
        supported: true,
      },
    },
    {
      feature: "Real-Time Typing & Read Receipts",
      whatsapp: {
        text: "Yes (Sent, Delivered, Read ✓✓)",
        supported: true,
      },
      openchat: {
        text: "Yes (Instant WebSocket Sync ✓✓)",
        supported: true,
      },
    },
    {
      feature: "Cost & Platform Freedom",
      whatsapp: {
        text: "Closed proprietary Meta ecosystem",
        supported: false,
      },
      openchat: {
        text: "100% Free Forever & Open Application",
        supported: true,
      },
    },
  ];

  return (
    <section id="comparison" className="py-14 sm:py-20 md:py-24 bg-white dark:bg-[#111B21] border-b border-[#F1E8EB] dark:border-[#222D34] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-[#E64E25] font-semibold bg-[#E64E25]/10 dark:bg-[#E64E25]/20 px-3.5 py-1 rounded-full border border-[#E64E25]/25">
            The Modern Alternative
          </span>
          <h2 className="mt-4 font-[family-name:var(--font-josefin)] font-light text-3xl min-[480px]:text-4xl sm:text-5xl text-[#171717] dark:text-white tracking-tight">
            Why people choose <span className="font-normal text-[#00A884]">OpenChat</span> over traditional messengers
          </h2>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-[#737373] dark:text-[#8696A0] leading-relaxed">
            All the familiar comfort of WhatsApp—without phone number tracking, SIM dependencies, or app store barriers.
          </p>
        </div>

        {/* Desktop Table View (Hidden on mobile) */}
        <div className="hidden sm:block rounded-[20px] border border-[#F1E8EB] dark:border-[#222D34] bg-white dark:bg-[#182229] overflow-hidden shadow-xs">
          {/* Header Row */}
          <div className="grid grid-cols-12 bg-[#FAF9FA] dark:bg-[#202C33] border-b border-[#F1E8EB] dark:border-[#222D34] p-4 sm:p-6 text-xs sm:text-sm font-semibold text-[#171717] dark:text-[#E9EDEF]">
            <div className="col-span-4 text-[#54656F] dark:text-[#8696A0]">Feature</div>
            <div className="col-span-4 text-[#737373] dark:text-[#8696A0] text-left">
              Traditional WhatsApp
            </div>
            <div className="col-span-4 text-[#00A884] flex items-center justify-start gap-1.5 font-bold">
              <span>OpenChat</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#00A884]/15 text-[#00A884]">
                RECOMMENDED
              </span>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-[#F1E8EB] dark:divide-[#222D34]">
            {comparisons.map((row, idx) => (
              <motion.div
                key={row.feature}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="grid grid-cols-12 p-4 sm:p-5 text-xs sm:text-sm items-center hover:bg-[#FAF9FA]/60 dark:hover:bg-[#202C33]/50 transition-colors"
              >
                {/* Feature Column */}
                <div className="col-span-4 font-medium text-[#171717] dark:text-[#E9EDEF] pr-2">
                  {row.feature}
                </div>

                {/* WhatsApp Column */}
                <div className="col-span-4 text-[#737373] dark:text-[#8696A0] pr-2 flex items-center gap-2">
                  {row.whatsapp.supported ? (
                    <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  ) : (
                    <span className="w-5 h-5 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center flex-shrink-0">
                      <X className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                  <span className="text-xs">{row.whatsapp.text}</span>
                </div>

                {/* OpenChat Column */}
                <div className="col-span-4 text-[#111B21] dark:text-white font-medium flex items-center justify-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#00A884]/15 text-[#00A884] flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                  <span className="text-xs text-[#00A884] dark:text-emerald-400 font-semibold">
                    {row.openchat.text}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile Card-Based Comparison (Shown only on small screens) */}
        <div className="sm:hidden space-y-3.5">
          {comparisons.map((row, idx) => (
            <motion.div
              key={row.feature}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="rounded-[16px] border border-[#F1E8EB] dark:border-[#222D34] bg-white dark:bg-[#182229] p-4 shadow-xs"
            >
              {/* Feature Title */}
              <div className="text-xs font-semibold text-[#171717] dark:text-[#E9EDEF] mb-3 pb-2 border-b border-[#F1E8EB] dark:border-[#222D34]">
                {row.feature}
              </div>

              {/* Comparison entries */}
              <div className="space-y-2.5 text-xs">
                {/* WhatsApp */}
                <div className="flex items-start gap-2.5 p-2 rounded-[10px] bg-[#FAF9FA] dark:bg-[#111B21]/60">
                  <div className="mt-0.5 flex-shrink-0">
                    {row.whatsapp.supported ? (
                      <span className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    ) : (
                      <span className="w-4 h-4 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center">
                        <X className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] font-medium text-[#737373] dark:text-[#8696A0] uppercase block">
                      WhatsApp
                    </span>
                    <span className="text-[#54656F] dark:text-[#8696A0] leading-snug">
                      {row.whatsapp.text}
                    </span>
                  </div>
                </div>

                {/* OpenChat */}
                <div className="flex items-start gap-2.5 p-2 rounded-[10px] bg-[#00A884]/8 dark:bg-[#00A884]/15 border border-[#00A884]/20">
                  <div className="mt-0.5 flex-shrink-0">
                    <span className="w-4 h-4 rounded-full bg-[#00A884] text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#00A884] uppercase tracking-wider block">
                      OpenChat
                    </span>
                    <span className="text-[#111B21] dark:text-white font-medium leading-snug">
                      {row.openchat.text}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Micro-Badges footer */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-[#737373] dark:text-[#8696A0]">
          <span className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[#00A884]" />
            Local Cryptographic Keys
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-[#66CCF2]" />
            Pure Web-Native Client
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#E64E25]" />
            Always Free Forever
          </span>
        </div>
      </div>
    </section>
  );
}
