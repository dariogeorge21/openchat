'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { GoogleIcon } from '@/components/icons/google-icon';
import { ShieldCheck, Lock, Key, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, signInWithGoogle } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) {
      router.replace('/chat');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('error')) {
        setErrorMessage('Authentication was canceled or encountered an issue. Please try again.');
      }
    }
  }, []);

  const handleGoogleLogin = async () => {
    try {
      setIsSigningIn(true);
      setErrorMessage(null);
      await signInWithGoogle();
    } catch (err) {
      console.error('Login error:', err);
      setErrorMessage('Could not initiate Google authentication. Check your configuration.');
      setIsSigningIn(false);
    }
  };

  if (loading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FBF9FA] dark:bg-[#111B21]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#66CCF2]" />
          <p className="text-xs text-[#737373] dark:text-[#8696A0]">Securing session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF9FA] dark:bg-[#111B21] text-[#171717] dark:text-[#E9EDEF] flex flex-col justify-between selection:bg-[#66CCF2]/20">
      {/* Top Banner */}
      <header className="border-b border-[#F1E8EB] dark:border-[#202C33] bg-white/80 dark:bg-[#111B21]/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#66CCF2] to-[#E64E25] flex items-center justify-center text-white font-bold text-base shadow-sm">
              OC
            </div>
            <span className="font-semibold text-lg tracking-tight">
              Open<span className="text-[#66CCF2]">Chat</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#737373] dark:text-[#8696A0] bg-[#F1E8EB]/50 dark:bg-[#202C33] px-3 py-1.5 rounded-full border border-[#F1E8EB] dark:border-[#222E35]">
            <Lock className="w-3.5 h-3.5 text-[#00A884]" />
            <span className="font-medium text-[#171717] dark:text-[#D1D7DB]">E2EE Protected</span>
          </div>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white dark:bg-[#202C33] border border-[#F1E8EB] dark:border-[#2A3942] rounded-2xl p-8 shadow-xl shadow-black/[0.03] space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-[#66CCF2]/10 dark:bg-[#66CCF2]/15 text-[#00897B] dark:text-[#66CCF2] mb-1">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#171717] dark:text-[#E9EDEF]">
              Welcome to OpenChat
            </h1>
            <p className="text-xs text-[#737373] dark:text-[#8696A0] max-w-sm mx-auto leading-relaxed">
              Real-time messaging protected by client-side Web Crypto End-to-End Encryption. Sign in with your Google account to get started.
            </p>
          </div>

          {errorMessage && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Google Sign In Action */}
          <button
            onClick={handleGoogleLogin}
            disabled={isSigningIn}
            className="w-full h-12 flex items-center justify-center gap-3 bg-white dark:bg-[#111B21] hover:bg-[#FBF9FA] dark:hover:bg-[#182229] border border-[#E1D4DA] dark:border-[#2A3942] hover:border-[#66CCF2] dark:hover:border-[#66CCF2] rounded-xl font-medium text-sm text-[#171717] dark:text-[#E9EDEF] shadow-sm transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed group"
          >
            {isSigningIn ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#66CCF2]" />
                <span>Redirecting to Google...</span>
              </>
            ) : (
              <>
                <GoogleIcon className="w-5 h-5" />
                <span>Continue with Google</span>
                <ArrowRight className="w-4 h-4 ml-auto text-[#737373] group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>

          {/* Cryptographic Security Details */}
          <div className="pt-4 border-t border-[#F1E8EB] dark:border-[#2A3942]/60 space-y-3">
            <h2 className="text-[11px] font-semibold uppercase tracking-wider text-[#737373] dark:text-[#8696A0]">
              Zero-Knowledge Security Architecture
            </h2>
            <div className="grid grid-cols-1 gap-2.5 text-xs text-[#737373] dark:text-[#8696A0]">
              <div className="flex items-start gap-2.5">
                <Key className="w-4 h-4 text-[#66CCF2] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#171717] dark:text-[#D1D7DB]">Client-Side Keys:</strong> Your private ECDH encryption key is generated locally and never leaves your browser.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-[#00A884] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#171717] dark:text-[#D1D7DB]">Ciphertext Only:</strong> The database and realtime servers only ever receive encrypted payloads.
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-[#737373] dark:text-[#8696A0] border-t border-[#F1E8EB] dark:border-[#202C33]">
        OpenChat &bull; Powered by Next.js, Supabase, and Browser Web Crypto
      </footer>
    </div>
  );
}
