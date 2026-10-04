"use client";
import React from "react";

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  height?: number | string;
  animated?: boolean;
}

export function OpenChatLogo({
  className = "",
  height = 36,
  animated = false,
  ...props
}: LogoProps) {
  return (
    <svg
      viewBox="0 0 540 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      height={height}
      className={`select-none overflow-visible ${className}`}
      {...props}
    >
      {animated && (
        <style>{`
          @keyframes openchat-dash {
            0% {
              stroke-dashoffset: 160;
              opacity: 0.15;
            }
            30% {
              opacity: 1;
            }
            100% {
              stroke-dashoffset: 0;
              opacity: 1;
            }
          }
          @keyframes openchat-glow {
            0%, 100% {
              filter: drop-shadow(0 0 0px rgba(102, 204, 242, 0));
            }
            50% {
              filter: drop-shadow(0 0 8px rgba(102, 204, 242, 0.45));
            }
          }
        `}</style>
      )}
      {/* OPEN in #66CCF2 */}
      <g
        stroke="#66CCF2"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={
          animated
            ? {
                strokeDasharray: 160,
                strokeDashoffset: 0,
                animation:
                  'openchat-dash 1.3s cubic-bezier(0.16, 1, 0.3, 1) forwards, openchat-glow 2.5s ease-in-out infinite',
              }
            : undefined
        }
      >
        {/* O: Geometric circle */}
        <circle cx="32" cy="30" r="20" />

        {/* P: Vertical line + curved bowl */}
        <path d="M 76 10 V 50" />
        <path d="M 76 10 H 94 C 104 10 104 30 94 30 H 76" />

        {/* E: Three distinct horizontal bars */}
        <path d="M 132 14 H 170" />
        <path d="M 132 30 H 170" />
        <path d="M 132 46 H 170" />

        {/* N: Two verticals with diagonal */}
        <path d="M 198 50 V 10 L 236 50 V 10" />
      </g>

      {/* CHAT in #E64E25 */}
      <g
        stroke="#E64E25"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={
          animated
            ? {
                strokeDasharray: 160,
                strokeDashoffset: 0,
                animation:
                  'openchat-dash 1.3s cubic-bezier(0.16, 1, 0.3, 1) 0.18s forwards',
              }
            : undefined
        }
      >
        {/* C: Geometric open arc */}
        <path d="M 298 16 C 290 10 270 10 262 20 C 254 30 254 40 262 50 C 270 60 290 60 298 44" />

        {/* H: Two verticals with center crossbar */}
        <path d="M 326 10 V 50" />
        <path d="M 326 30 H 362" />
        <path d="M 362 10 V 50" />

        {/* A: Stylized chevron without crossbar (Λ) */}
        <path d="M 388 50 L 413 10 L 438 50" />

        {/* T: Top horizontal bar + center stem */}
        <path d="M 462 10 H 502" />
        <path d="M 482 10 V 50" />
      </g>
    </svg>
  );
}

export function OpenChatSplash({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between py-12 px-6 bg-[#f0f2f5] dark:bg-[#111b21] text-[#111b21] dark:text-[#e9edef] select-none ${className}`}
    >
      <style>{`
        @keyframes splash-fadein {
          0% {
            opacity: 0;
            transform: scale(0.92) translateY(8px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes splash-progress {
          0% {
            width: 0%;
          }
          30% {
            width: 40%;
          }
          70% {
            width: 80%;
          }
          100% {
            width: 100%;
          }
        }
        @keyframes splash-glow {
          0%, 100% {
            opacity: 0.35;
            transform: scale(0.95);
          }
          50% {
            opacity: 0.75;
            transform: scale(1.05);
          }
        }
      `}</style>

      {/* Top spacer to balance vertical layout */}
      <div className="w-full h-8" />

      {/* Center Brand Identity with animated logo */}
      <div
        className="flex flex-col items-center gap-6 relative"
        style={{ animation: 'splash-fadein 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
      >
        {/* Ambient radial blur glow */}
        <div
          className="absolute -inset-10 bg-gradient-to-r from-[#66CCF2]/20 via-[#66CCF2]/10 to-[#E64E25]/20 dark:from-[#66CCF2]/25 dark:to-[#E64E25]/25 rounded-full blur-3xl -z-10 pointer-events-none"
          style={{ animation: 'splash-glow 2s ease-in-out infinite' }}
        />

        {/* Animated Brand Logo */}
        <OpenChatLogo height={44} animated className="w-auto h-10 sm:h-12 max-w-[80vw]" />

        {/* Minimal Modern Hairline Loading Bar */}
        <div className="w-40 sm:w-48 h-1 rounded-full bg-[#dfe5e7] dark:bg-[#202c33] overflow-hidden mt-2 relative">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#66CCF2] to-[#E64E25]"
            style={{
              animation: 'splash-progress 2s cubic-bezier(0.25, 0.1, 0.25, 1) forwards',
            }}
          />
        </div>
      </div>

      {/* Footer Security Badge */}
      <div
        className="flex items-center gap-2 text-xs font-medium text-[#667781] dark:text-[#8696a0] tracking-wide"
        style={{ animation: 'splash-fadein 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
      >
        <svg
          className="w-4 h-4 text-[#00A884]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
        <span>End-to-end encrypted</span>
      </div>
    </div>
  );
}

export function OpenChatIconMark({
  size = 36,
  className = "",
}: {
  size?: number | string;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="48" height="48" rx="14" fill="#FFFFFF" stroke="#F1E8EB" strokeWidth="1.5" />
      {/* Stylized O & C geometry */}
      <circle cx="20" cy="24" r="10" stroke="#66CCF2" strokeWidth="3" />
      <path
        d="M 36 17 C 32 14 26 15 24 20 C 22 25 24 30 28 32 C 32 34 36 32 36 31"
        stroke="#E64E25"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="36" cy="18" r="2.5" fill="#E64E25" />
    </svg>
  );
}
