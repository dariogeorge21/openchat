'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Smile, Paperclip } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';
import type { EmojiClickData } from 'emoji-picker-react';
import { Theme } from 'emoji-picker-react';

const EmojiPicker = dynamic(() => import('emoji-picker-react'), {
  ssr: false,
  loading: () => (
    <div className="w-[340px] h-[400px] flex items-center justify-center bg-white dark:bg-[#202c33] text-sm text-[#8696a0]">
      Loading emojis...
    </div>
  ),
});

interface MessageInputProps {
  onSendMessage: (text: string) => Promise<void>;
  onTyping: () => void;
  disabled?: boolean;
}

export function MessageInput({
  onSendMessage,
  onTyping,
  disabled = false,
}: MessageInputProps) {
  const [text, setText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Close emoji picker on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node) &&
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setShowEmojiPicker(false);
      }
    }

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [showEmojiPicker]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    onTyping();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || disabled) return;

    setText('');
    setShowEmojiPicker(false);
    await onSendMessage(trimmed);
    inputRef.current?.focus();
  };

  const handleInsertEmoji = (emoji: string) => {
    setText((prev) => prev + emoji);
    onTyping();
    inputRef.current?.focus();
  };

  return (
    <div className="relative border-t border-[#e9edef] dark:border-[#222d34] bg-[#f0f2f5] dark:bg-[#202c33] px-4 py-2.5">
      {/* Full Emoji Picker Popover */}
      {showEmojiPicker && (
        <div
          ref={pickerRef}
          className="absolute bottom-16 left-4 z-50 shadow-2xl rounded-2xl overflow-hidden animate-in fade-in-50 zoom-in-95 border border-[#e9edef] dark:border-[#2a3942]"
        >
          <EmojiPicker
            onEmojiClick={(emojiData: EmojiClickData) => {
              handleInsertEmoji(emojiData.emoji);
            }}
            theme={resolvedTheme === 'dark' ? Theme.DARK : Theme.LIGHT}
            lazyLoadEmojis={true}
            searchPlaceHolder="Search emojis..."
            width={340}
            height={400}
          />
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-center gap-2 max-w-7xl mx-auto">
        {/* Emoji Button */}
        <button
          ref={emojiButtonRef}
          type="button"
          onClick={() => setShowEmojiPicker((prev) => !prev)}
          className={`p-2 rounded-full transition-colors cursor-pointer ${
            showEmojiPicker
              ? 'text-[#00A884] bg-white dark:bg-[#111b21]'
              : 'text-[#54656f] dark:text-[#8696a0] hover:text-[#111b21] dark:hover:text-[#e9edef]'
          }`}
          title="Emojis"
        >
          <Smile className="w-5 h-5" />
        </button>

        {/* Text Input */}
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={handleChange}
            placeholder="Type a message (End-to-End Encrypted)..."
            disabled={disabled}
            className="w-full h-10 px-4 text-sm rounded-xl bg-white dark:bg-[#2a3942] border border-transparent focus:border-[#00A884] focus:outline-hidden text-[#111b21] dark:text-[#e9edef] placeholder-[#8696a0] shadow-2xs transition-colors"
          />
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={disabled || !text.trim()}
          className="p-2.5 rounded-full bg-[#00A884] hover:bg-[#008f6f] text-white shadow-sm transition-transform active:scale-95 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          title="Send Encrypted Message"
        >
          <Send className="w-4 h-4 ml-0.5" />
        </button>
      </form>
    </div>
  );
}
