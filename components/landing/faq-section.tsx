"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "Why does OpenChat use only GoogleAuth?",
    answer:
      "Traditional chat applications burden you with 8-character passwords, confirmation emails, spam captchas, and password reset workflows. GoogleAuth provides industry-standard OAuth 2.0 authentication in a single click, eliminating database password breaches and making joining instantaneous.",
  },
  {
    question: "How does multi-user real-time chatting work?",
    answer:
      "When you join any channel, your presence is broadcast through a high-throughput, low-latency WebSocket connection. You see other active peers, their typing indicators, and message streams with sub-30ms global dispatch.",
  },
  {
    question: "Can I create private or temporary ephemeral rooms?",
    answer:
      "Yes. In addition to public lobby channels, you can generate an ephemeral private link with custom room tokens. Ephemeral channels can be configured to purge all messages and memory once participants leave.",
  },
  {
    question: "Is there any software or browser extension to install?",
    answer:
      "None. OpenChat is 100% web-native, responsive across mobile and desktop devices, and loads instantly without heavy client bundles.",
  },
  {
    question: "Is OpenChat free to use?",
    answer:
      "OpenChat is completely open and free for individuals, developer communities, and collaborative groups.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 bg-white border-b border-[#F1E8EB]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-[#66CCF2] font-semibold bg-[#66CCF2]/10 px-3 py-1 rounded-full border border-[#66CCF2]/30">
            Frequently Asked Questions
          </span>
          <h2 className="mt-4 font-[family-name:var(--font-josefin)] font-light text-4xl sm:text-5xl text-[#171717] tracking-tight">
            Clear answers to <span className="font-normal text-[#E64E25]">common queries</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#737373]">
            Everything you need to know about OpenChat, privacy, and architecture.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-[16px] border border-[#F1E8EB] overflow-hidden bg-white transition-all hover:border-[#66CCF2]/50"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left cursor-pointer transition-colors"
                >
                  <span className="font-medium text-base text-[#171717] pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#737373] transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? "rotate-180 text-[#66CCF2]" : ""
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="px-6 pb-6 pt-1 text-sm text-[#737373] leading-relaxed border-t border-[#F1E8EB]/50">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
