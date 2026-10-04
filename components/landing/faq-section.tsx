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
    question: "How is OpenChat a free alternative to WhatsApp?",
    answer:
      "OpenChat offers the same beloved messaging experience—direct 1-on-1 chats, group circles, real-time typing indicators, double-check read receipts (✓✓), online presence status, and rich media sharing—without requiring a SIM card or phone number. You log in seamlessly with Google, enjoy 100% free access, and chat across any browser on mobile or desktop.",
  },
  {
    question: "Do I ever need to enter or share my personal phone number?",
    answer:
      "Never. Traditional messengers force you to expose your personal mobile number to everyone in your chat list. OpenChat relies strictly on GoogleAuth (OAuth 2.0 PKCE). Your cell phone number is never collected, stored, or visible to peers.",
  },
  {
    question: "How do I find friends and start chatting with them?",
    answer:
      "Simply search for any contact using their Google email address or display name. Once selected, you can immediately begin a direct private 1-on-1 conversation or add them into a group circle.",
  },
  {
    question: "Is OpenChat really 100% free to use?",
    answer:
      "Yes! OpenChat is completely open and free. There are no subscription tiers, no message limitations, no paywalled features, and no third-party banner ads.",
  },
  {
    question: "Can I use OpenChat across multiple devices without a linked phone?",
    answer:
      "Yes. OpenChat is web-native. You can access your conversations directly from your MacBook, Windows PC, iPad, iPhone, or Android phone without needing your primary mobile device powered on or scanning a pairing QR code.",
  },
  {
    question: "How is privacy and message security handled?",
    answer:
      "Conversations are secured using modern client-side Web Cryptography APIs (AES-GCM / ECDH). Your encryption keys are stored locally on your device, ensuring messages remain strictly confidential between you and the recipient.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-14 sm:py-20 md:py-24 bg-white dark:bg-[#111B21] border-b border-[#F1E8EB] dark:border-[#222D34]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-[#00A884] font-semibold bg-[#00A884]/10 dark:bg-[#00A884]/20 px-3.5 py-1 rounded-full border border-[#00A884]/25">
            Got Questions?
          </span>
          <h2 className="mt-4 font-[family-name:var(--font-josefin)] font-light text-3xl min-[480px]:text-4xl sm:text-5xl text-[#171717] dark:text-white tracking-tight">
            Frequently Asked <span className="font-normal text-[#00A884]">Questions</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#737373] dark:text-[#8696A0]">
            Everything you need to know about OpenChat, GoogleAuth, and privacy.
          </p>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-[14px] sm:rounded-[16px] border border-[#F1E8EB] dark:border-[#222D34] overflow-hidden bg-white dark:bg-[#182229] transition-all hover:border-[#00A884]/50"
              >
                <button
                  onClick={() => toggle(idx)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${idx}`}
                  aria-label={faq.question}
                  className="w-full px-4 sm:px-6 py-3.5 sm:py-5 flex items-center justify-between text-left cursor-pointer transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#00A884]"
                >
                  <span id={`faq-question-${idx}`} className="font-medium text-sm sm:text-base text-[#171717] dark:text-[#E9EDEF] pr-3 sm:pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#737373] dark:text-[#8696A0] transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? "rotate-180 text-[#00A884]" : ""
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${idx}`}
                      role="region"
                      aria-labelledby={`faq-question-${idx}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-1 text-xs sm:text-sm text-[#737373] dark:text-[#8696A0] leading-relaxed border-t border-[#F1E8EB]/50 dark:border-[#222D34]/50">
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
