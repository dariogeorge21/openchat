'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { createClient } from '@/lib/supabase/client';
import {
  ShieldCheck,
  Key,
  Copy,
  Check,
  LogOut,
  User,
  Loader2,
} from 'lucide-react';

interface ProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileModal({ open, onOpenChange }: ProfileModalProps) {
  const { user, profile, keyPair, refreshProfile, signOut } = useAuth();
  const [supabase] = useState(() => createClient());

  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [about, setAbout] = useState(profile?.about || '');
  const [isSaving, setIsSaving] = useState(false);
  const [copiedFingerprint, setCopiedFingerprint] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

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
          display_name: displayName.trim() || 'User',
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
            <span>Profile &amp; E2EE Security</span>
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

        {/* Editable Fields */}
        <div className="space-y-3 pt-1">
          <div className="space-y-1">
            <label className="text-xs font-medium text-[#111b21] dark:text-[#e9edef]">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full h-9 px-3 text-xs rounded-xl bg-[#f0f2f5] dark:bg-[#111b21] border border-transparent focus:border-[#00A884] focus:outline-hidden text-[#111b21] dark:text-[#e9edef]"
            />
          </div>

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
              className="h-8 text-xs bg-[#00A884] hover:bg-[#008f6f] text-white rounded-lg"
            >
              {isSaving && <Loader2 className="w-3 h-3 animate-spin mr-1" />}
              {saveSuccess ? 'Saved!' : 'Save Profile'}
            </Button>
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
