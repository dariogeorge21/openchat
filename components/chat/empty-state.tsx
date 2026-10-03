'use client';

import React from 'react';
import { ShieldCheck, Lock, KeyRound, MessageSquarePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  onStartChat?: () => void;
}

export function EmptyState({ onStartChat }: EmptyStateProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#f0f2f5] dark:bg-[#111b21] border-l border-[#e9edef] dark:border-[#222d34] select-none text-center">
      <div className="max-w-md flex flex-col items-center space-y-6">
        {/* Modern Cryptographic Icon Illustration */}
        <div className="relative">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-[#66CCF2]/20 via-[#00A884]/20 to-[#E64E25]/15 flex items-center justify-center border border-[#e9edef] dark:border-[#2a3942] shadow-sm">
            <ShieldCheck className="w-12 h-12 text-[#00A884]" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-xl bg-white dark:bg-[#202c33] border border-[#e9edef] dark:border-[#2a3942] flex items-center justify-center shadow-xs">
            <KeyRound className="w-4 h-4 text-[#66CCF2]" />
          </div>
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h2 className="text-2xl font-light text-[#111b21] dark:text-[#e9edef] tracking-tight">
            OpenChat Web
          </h2>
          <p className="text-sm text-[#667781] dark:text-[#8696a0] leading-relaxed">
            Send and receive end-to-end encrypted messages in realtime. Your private keys never leave your device, and conversations remain completely private from servers and database administrators.
          </p>
        </div>

        {onStartChat && (
          <Button
            onClick={onStartChat}
            className="bg-[#00A884] hover:bg-[#008f6f] text-white rounded-full px-5 py-2.5 text-sm font-medium flex items-center gap-2 shadow-sm transition-transform active:scale-95"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Start a New Chat</span>
          </Button>
        )}

        {/* Bottom E2EE Assurance */}
        <div className="pt-8 flex items-center gap-2 text-xs text-[#8696a0] dark:text-[#667781]">
          <Lock className="w-3.5 h-3.5 text-[#00A884]" />
          <span>End-to-end encrypted with ECDH &amp; AES-256-GCM</span>
        </div>
      </div>
    </div>
  );
}
