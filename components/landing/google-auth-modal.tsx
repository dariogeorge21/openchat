"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/components/icons/google-icon";
import { Check, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";

interface GoogleAuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAuthenticated?: (user: { name: string; email: string; avatar: string }) => void;
}

export function GoogleAuthModal({
  open,
  onOpenChange,
  onAuthenticated,
}: GoogleAuthModalProps) {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const mockUsers = [
    {
      name: "Alex Rivera",
      email: "alex.rivera.dev@gmail.com",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
      color: "#66CCF2",
    },
    {
      name: "Maya Chen",
      email: "maya.chen.design@gmail.com",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face",
      color: "#E64E25",
    },
  ];

  const handleSelectAccount = (user: (typeof mockUsers)[0]) => {
    setSelectedUser(user.email);
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#66CCF2", "#E64E25", "#171717"],
      });

      if (onAuthenticated) {
        onAuthenticated(user);
      }

      setTimeout(() => {
        setIsSuccess(false);
        setSelectedUser(null);
        onOpenChange(false);
      }, 1400);
    }, 900);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[420px] rounded-[16px] border border-[#F1E8EB] p-7 shadow-2xl bg-white">
        <DialogHeader className="space-y-2 text-left">
          <div className="flex items-center gap-2 mb-1">
            <GoogleIcon className="w-5 h-5" />
            <span className="text-xs uppercase tracking-wider font-semibold text-[#737373]">
              Google Identity Services
            </span>
          </div>
          <DialogTitle className="text-xl font-medium tracking-tight text-[#171717]">
            Sign in to <span className="text-[#66CCF2]">Open</span>
            <span className="text-[#E64E25]">Chat</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-[#737373] leading-relaxed">
            Select an account to instantly enter multi-user channels. No passwords or account setup required.
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
              <Check className="w-7 h-7 stroke-[2.5]" />
            </div>
            <div>
              <p className="font-semibold text-base text-[#171717]">Authenticated Successfully</p>
              <p className="text-xs text-[#737373] mt-0.5">Connecting to realtime peer mesh...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3 mt-2">
            <div className="space-y-2">
              {mockUsers.map((user) => (
                <button
                  key={user.email}
                  disabled={isProcessing}
                  onClick={() => handleSelectAccount(user)}
                  className="w-full flex items-center gap-3.5 p-3 rounded-[12px] border border-[#F1E8EB] hover:border-[#66CCF2] hover:bg-[#FBF9FA] transition-all text-left group cursor-pointer disabled:opacity-60"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#F1E8EB]"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#171717] group-hover:text-[#171717]">
                      {user.name}
                    </p>
                    <p className="text-xs text-[#737373] truncate">{user.email}</p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[#66CCF2]">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-[#F1E8EB]/70 flex items-center justify-between text-[11px] text-[#737373]">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Zero password storage
              </span>
              <span>OAuth 2.0 Direct</span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
