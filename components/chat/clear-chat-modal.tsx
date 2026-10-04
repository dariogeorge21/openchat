'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2 } from 'lucide-react';

interface ClearChatModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  conversationName?: string;
  isClearing?: boolean;
}

export function ClearChatModal({
  open,
  onOpenChange,
  onConfirm,
  conversationName,
  isClearing = false,
}: ClearChatModalProps) {
  const handleConfirm = async () => {
    await onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[400px] bg-white dark:bg-[#202c33] border border-[#e9edef] dark:border-[#2a3942] rounded-2xl p-6 text-[#111b21] dark:text-[#e9edef] shadow-2xl">
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Danger Icon Badge */}
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 dark:bg-red-500/15 border border-red-500/20 text-red-500 flex items-center justify-center">
            <Trash2 className="w-6 h-6 text-red-500" />
          </div>

          <DialogHeader className="space-y-1 text-center">
            <DialogTitle className="text-base font-semibold text-[#111b21] dark:text-[#e9edef]">
              Clear chat{conversationName ? ` with ${conversationName}` : ''}?
            </DialogTitle>
            <DialogDescription className="text-xs text-[#667781] dark:text-[#8696a0] leading-relaxed pt-1">
              Are you sure you want to clear this chat? All messages in this conversation will be permanently deleted from the database and your device. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 w-full pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isClearing}
              onClick={() => onOpenChange(false)}
              className="flex-1 rounded-xl text-xs text-black dark:text-white border-[#e9edef] dark:border-[#2a3942] hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={isClearing}
              onClick={handleConfirm}
              className="flex-1 rounded-xl text-xs bg-red-600 hover:bg-red-700 text-white font-medium cursor-pointer transition-colors"
            >
              {isClearing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                  <span>Clearing...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                  <span>Clear Chat</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
