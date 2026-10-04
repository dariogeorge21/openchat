'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Profile } from '@/types/database';
import {
  Mail,
  Copy,
  Check,
  UserPlus,
  Eye,
  ShieldCheck,
  User,
  Download,
  X,
  ExternalLink,
} from 'lucide-react';

interface ContactInfoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact: Profile | null;
  isOnline?: boolean;
  presenceText?: string;
}

export function ContactInfoModal({
  open,
  onOpenChange,
  contact,
  isOnline = false,
  presenceText,
}: ContactInfoModalProps) {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [savedContact, setSavedContact] = useState(false);
  const [pictureViewerOpen, setPictureViewerOpen] = useState(false);

  if (!contact) return null;

  const displayName = contact.display_name || 'Contact';
  const email = contact.email || '';
  const about = contact.about?.trim() || 'Hey there! I am using OpenChat.';
  const avatarUrl = contact.avatar_url;

  // 1. Copy Email feature
  const handleCopyEmail = async () => {
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  // 2. Email Now feature
  const handleEmailNow = () => {
    if (!email) return;
    window.location.href = `mailto:${email}?subject=Hello%20from%20OpenChat`;
  };

  // 3. Save as Contact feature (.vcf vCard export)
  const handleSaveAsContact = () => {
    try {
      const vCardLines = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `FN:${displayName}`,
        email ? `EMAIL;TYPE=INTERNET:${email}` : '',
        about ? `NOTE:${about.replace(/\r?\n/g, ' ')}` : 'NOTE:OpenChat Contact',
        'END:VCARD',
      ].filter(Boolean);

      const vCardContent = vCardLines.join('\r\n');
      const blob = new Blob([vCardContent], { type: 'text/vcard;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const safeFilename = displayName.replace(/[^a-zA-Z0-9_-]/g, '_');
      link.download = `${safeFilename}.vcf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setSavedContact(true);
      setTimeout(() => setSavedContact(false), 2500);
    } catch (err) {
      console.error('Failed to generate contact card:', err);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[440px] bg-white dark:bg-[#202c33] border border-[#e9edef] dark:border-[#2a3942] rounded-2xl p-0 text-[#111b21] dark:text-[#e9edef] shadow-2xl overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-[#66CCF2]/20 via-[#00A884]/15 to-[#E64E25]/15 h-20 relative" />

          {/* Contact Profile Content */}
          <div className="px-6 pb-6 pt-0 -mt-12 relative flex flex-col items-center text-center">
            {/* Contact Avatar / Picture */}
            <div className="relative group cursor-pointer" onClick={() => setPictureViewerOpen(true)}>
              <div className="w-24 h-24 rounded-full overflow-hidden bg-[#dfe5e7] dark:bg-[#374248] border-4 border-white dark:border-[#202c33] shadow-lg flex items-center justify-center">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-200"
                  />
                ) : (
                  <span className="text-3xl font-bold text-[#8696a0]">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              {/* Hover Badge on Picture */}
              <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity text-[10px] font-medium border-4 border-transparent">
                <Eye className="w-5 h-5 mb-0.5" />
                <span>View</span>
              </div>

              {/* Online Presence Dot */}
              {isOnline && (
                <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-[#00A884] border-2 border-white dark:border-[#202c33]" />
              )}
            </div>

            {/* Name and Status */}
            <div className="mt-3 space-y-1">
              <h2 className="text-lg font-bold text-[#111b21] dark:text-[#e9edef]">
                {displayName}
              </h2>
              <div>
                {isOnline ? (
                  <span className="inline-flex items-center gap-1.5 text-xs text-[#00A884] font-medium">
                    <span className="w-2 h-2 rounded-full bg-[#00A884] animate-pulse" />
                    Online
                  </span>
                ) : (
                  <span className="text-xs text-[#667781] dark:text-[#8696a0]">
                    {presenceText || 'Offline'}
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons Grid */}
            <div className="grid grid-cols-2 gap-2.5 w-full mt-5">
              {/* Email Now */}
              <button
                type="button"
                onClick={handleEmailNow}
                disabled={!email}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#f0f2f5] dark:bg-[#111b21] hover:bg-[#e9edef] dark:hover:bg-[#2a3942] text-[#111b21] dark:text-[#e9edef] border border-[#e9edef]/80 dark:border-[#2a3942] text-xs font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                title={email ? `Email ${email}` : 'No email provided'}
              >
                <Mail className="w-4 h-4 text-[#00A884]" />
                <span>Email Now</span>
              </button>

              {/* View Contact Picture */}
              <button
                type="button"
                onClick={() => setPictureViewerOpen(true)}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#f0f2f5] dark:bg-[#111b21] hover:bg-[#e9edef] dark:hover:bg-[#2a3942] text-[#111b21] dark:text-[#e9edef] border border-[#e9edef]/80 dark:border-[#2a3942] text-xs font-medium transition-colors cursor-pointer"
                title="View full picture"
              >
                <Eye className="w-4 h-4 text-[#66CCF2]" />
                <span>View Picture</span>
              </button>

              {/* Copy Email */}
              <button
                type="button"
                onClick={handleCopyEmail}
                disabled={!email}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#f0f2f5] dark:bg-[#111b21] hover:bg-[#e9edef] dark:hover:bg-[#2a3942] text-[#111b21] dark:text-[#e9edef] border border-[#e9edef]/80 dark:border-[#2a3942] text-xs font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                title="Copy email to clipboard"
              >
                {copiedEmail ? (
                  <>
                    <Check className="w-4 h-4 text-[#00A884]" />
                    <span className="text-[#00A884]">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[#8696a0]" />
                    <span>Copy Email</span>
                  </>
                )}
              </button>

              {/* Save as Contact */}
              <button
                type="button"
                onClick={handleSaveAsContact}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#f0f2f5] dark:bg-[#111b21] hover:bg-[#e9edef] dark:hover:bg-[#2a3942] text-[#111b21] dark:text-[#e9edef] border border-[#e9edef]/80 dark:border-[#2a3942] text-xs font-medium transition-colors cursor-pointer"
                title="Save as vCard contact"
              >
                {savedContact ? (
                  <>
                    <Check className="w-4 h-4 text-[#00A884]" />
                    <span className="text-[#00A884]">Saved!</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 text-[#E64E25]" />
                    <span>Save as Contact</span>
                  </>
                )}
              </button>
            </div>

            {/* Information Cards */}
            <div className="w-full space-y-3 mt-4 text-left">
              {/* About / Bio Card */}
              <div className="p-3.5 rounded-xl bg-[#f0f2f5] dark:bg-[#111b21] border border-[#e9edef]/70 dark:border-[#2a3942] space-y-1">
                <span className="text-[11px] font-semibold text-[#8696a0] uppercase tracking-wider block">
                  About / Bio
                </span>
                <p className="text-xs text-[#111b21] dark:text-[#e9edef] leading-relaxed break-words whitespace-pre-wrap">
                  {about}
                </p>
              </div>

              {/* Email Card */}
              <div className="p-3.5 rounded-xl bg-[#f0f2f5] dark:bg-[#111b21] border border-[#e9edef]/70 dark:border-[#2a3942] flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] font-semibold text-[#8696a0] uppercase tracking-wider block">
                    Email
                  </span>
                  <p className="text-xs text-[#111b21] dark:text-[#e9edef] truncate font-medium mt-0.5">
                    {email || 'No email registered'}
                  </p>
                </div>
                {email && (
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-[#8696a0] hover:text-[#111b21] dark:hover:text-[#e9edef] transition-colors cursor-pointer shrink-0"
                    title="Copy email"
                  >
                    {copiedEmail ? (
                      <Check className="w-4 h-4 text-[#00A884]" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>

              {/* E2EE Security Card */}
              <div className="p-3 rounded-xl bg-[#00A884]/10 dark:bg-[#00A884]/15 border border-[#00A884]/20 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-[#00A884] shrink-0" />
                <div className="text-[11px] text-[#54656f] dark:text-[#d1d7db] leading-snug">
                  <span className="font-semibold text-[#111b21] dark:text-[#e9edef]">
                    End-to-End Encrypted
                  </span>
                  <p className="text-[#667781] dark:text-[#8696a0] text-[10px] mt-0.5">
                    Messages are protected with Web Crypto ECDH P-256 + AES-GCM.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Enlarged Picture Lightbox Viewer */}
      <Dialog open={pictureViewerOpen} onOpenChange={setPictureViewerOpen}>
        <DialogContent className="max-w-[480px] bg-black/90 border border-white/10 rounded-2xl p-6 text-white shadow-2xl flex flex-col items-center">
          <DialogHeader className="w-full flex flex-row items-center justify-between pb-3 border-b border-white/10">
            <DialogTitle className="text-sm font-semibold text-white">
              {displayName}&apos;s Profile Picture
            </DialogTitle>
          </DialogHeader>

          <div className="my-4 w-full flex items-center justify-center">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="max-h-[380px] max-w-full rounded-xl object-contain shadow-2xl"
              />
            ) : (
              <div className="w-48 h-48 rounded-full bg-white/10 flex items-center justify-center text-5xl font-bold text-white/70">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 w-full pt-2">
            {avatarUrl && (
              <a
                href={avatarUrl}
                target="_blank"
                rel="noreferrer"
                download
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Open Full Size</span>
              </a>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPictureViewerOpen(false)}
              className="rounded-lg text-xs bg-transparent border-white/20 text-white hover:bg-white/10 cursor-pointer"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
