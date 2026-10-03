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
      {/* OPEN in #66CCF2 */}
      <g stroke="#66CCF2" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
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
      <g stroke="#E64E25" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
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
