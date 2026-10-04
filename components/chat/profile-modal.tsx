'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { createClient } from '@/lib/supabase/client';
import { useTheme } from 'next-themes';
import {
  ShieldCheck,
  Key,
  Copy,
  Check,
  LogOut,
  User,
  Loader2,
  Sun,
  Moon,
  Laptop,
  Lock,
} from 'lucide-react';

interface ProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileModal({ open, onOpenChange }: ProfileModalProps) {
  const { user, profile, keyPair, refreshProfile, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const [supabase] = useState(() => createClient());

  const [about, setAbout] = useState(profile?.about || '');
  const [isSaving, setIsSaving] = useState(false);
  const [copiedFingerprint, setCopiedFingerprint] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (profile?.about !== undefined) {
      setAbout(profile.about || '');
    }
  }, [profile?.about]);

  const handleCopyFingerprint = () => {
    if (keyPair?.fingerprint) {
      navigator.clipboard.writeText(keyPair.fingerprint);
      setCopiedFingerprint(true);
      setTimeout(() => setCopiedFingerprint(false), 2000);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    try {
      setIsSaving(true);
      const { error } = await supabase
        .from('profiles')
        .update({
          about: about.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (!error) {
        await refreshProfile();
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[440px] bg-white dark:bg-[#202c33] border border-[#e9edef] dark:border-[#2a3942] rounded-2xl p-6 text-[#111b21] dark:text-[#e9edef] shadow-2xl">
        <DialogHeader className="space-y-1 text-left">
          <DialogTitle className="text-lg font-semibold tracking-tight text-[#111b21] dark:text-[#e9edef] flex items-center gap-2">
            <User className="w-5 h-5 text-[#00A884]" />
            <span>Profile &amp; Security</span>
          </DialogTitle>
        </DialogHeader>

        {/* User Card */}
        <div className="flex items-center gap-4 py-2">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-[#dfe5e7] dark:bg-[#374248] shrink-0 border-2 border-[#00A884]">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.display_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xl font-bold text-[#8696a0]">
                {profile?.display_name?.charAt(0) || 'U'}
              </div>
            )}
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-[#111b21] dark:text-[#e9edef] truncate">
              {profile?.display_name}
            </h3>
            <p className="text-xs text-[#667781] dark:text-[#8696a0] truncate">{user?.email}</p>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[#00A884]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Identity Verified via Google</span>
            </div>
          </div>
        </div>

        {/* Profile Fields */}
        <div className="space-y-3 pt-1">
          {/* Display Name (Permanent Identity - Cannot be modified) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-[#111b21] dark:text-[#e9edef]">
                Display Name
              </label>
              <span className="text-[10px] text-[#8696a0] flex items-center gap-1 font-medium">
                <Lock className="w-3 h-3 text-[#00A884]" />
                Original Identity
              </span>
            </div>
            <input
              type="text"
              value={profile?.display_name || ''}
              readOnly
              disabled
              className="w-full h-9 px-3 text-xs rounded-xl bg-[#f0f2f5]/60 dark:bg-[#111b21]/60 border border-[#e9edef] dark:border-[#222d34] text-[#54656f] dark:text-[#8696a0] cursor-not-allowed select-none opacity-85"
              title="Display name cannot be modified as it represents your original identity"
            />
          </div>

          {/* About / Bio (Modifiable) */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-[#111b21] dark:text-[#e9edef]">
              About / Bio
            </label>
            <input
              type="text"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              placeholder="Hey there! I am using OpenChat."
              className="w-full h-9 px-3 text-xs rounded-xl bg-[#f0f2f5] dark:bg-[#111b21] border border-transparent focus:border-[#00A884] focus:outline-hidden text-[#111b21] dark:text-[#e9edef]"
            />
          </div>

          <div className="flex justify-end">
            <Button
              size="sm"
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="h-8 text-xs bg-[#00A884] hover:bg-[#008f6f] text-white rounded-lg cursor-pointer"
            >
              {isSaving && <Loader2 className="w-3 h-3 animate-spin mr-1" />}
              {saveSuccess ? 'Saved!' : 'Save Bio'}
            </Button>
          </div>
        </div>

        {/* Theme & Appearance */}
        <div className="p-3.5 rounded-xl bg-[#f0f2f5] dark:bg-[#111b21] border border-[#e9edef] dark:border-[#222d34] space-y-2">
          <span className="text-xs font-semibold text-[#111b21] dark:text-[#e9edef] flex items-center gap-1.5">
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            <span>Theme &amp; Appearance</span>
          </span>
          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                theme === 'light'
                  ? 'bg-white text-[#111b21] border-[#00A884] shadow-xs'
                  : 'bg-white/60 dark:bg-[#202c33]/60 text-[#667781] dark:text-[#8696a0] border-transparent hover:bg-white dark:hover:bg-[#202c33]'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Light</span>
            </button>
            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                theme === 'dark'
                  ? 'bg-[#202c33] text-white border-[#00A884] shadow-xs'
                  : 'bg-white/60 dark:bg-[#202c33]/60 text-[#667781] dark:text-[#8696a0] border-transparent hover:bg-white dark:hover:bg-[#202c33]'
              }`}
            >
              <Moon className="w-3.5 h-3.5 text-blue-400" />
              <span>Dark</span>
            </button>
            <button
              type="button"
              onClick={() => setTheme('system')}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                theme === 'system'
                  ? 'bg-white dark:bg-[#202c33] text-[#00A884] border-[#00A884] shadow-xs'
                  : 'bg-white/60 dark:bg-[#202c33]/60 text-[#667781] dark:text-[#8696a0] border-transparent hover:bg-white dark:hover:bg-[#202c33]'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>System</span>
            </button>
          </div>
        </div>

        {/* Public Key Safety Number (Fingerprint) */}
        <div className="p-3.5 rounded-xl bg-[#f0f2f5] dark:bg-[#111b21] border border-[#e9edef] dark:border-[#222d34] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#111b21] dark:text-[#e9edef] flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-[#66CCF2]" />
              <span>Device Key Fingerprint</span>
            </span>
            <button
              onClick={handleCopyFingerprint}
              className="text-xs text-[#00A884] hover:underline flex items-center gap-1 cursor-pointer"
            >
              {copiedFingerprint ? (
                <>
                  <Check className="w-3 h-3" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <p className="font-mono text-[11px] text-[#667781] dark:text-[#8696a0] bg-white dark:bg-[#202c33] p-2 rounded-lg border border-[#e9edef] dark:border-[#2a3942] break-all select-all">
            {keyPair?.fingerprint || 'Generating local keys...'}
          </p>
          <p className="text-[10px] text-[#8696a0]">
            This cryptographic hash represents your public ECDH identity. Contacts can verify this fingerprint out-of-band to ensure no man-in-the-middle attacks.
          </p>
        </div>

        {/* Logout */}
        <div className="pt-3 border-t border-[#e9edef] dark:border-[#2a3942] flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={signOut}
            className="text-red-500 hover:text-red-600 hover:bg-red-500/10 text-xs gap-1.5 rounded-lg"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-lg text-xs"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
