import type { Metadata } from "next";
import { Josefin_Sans, Inter } from "next/font/google";
import "./globals.css";

const josefinSans = Josefin_Sans({
  variable: "--font-josefin",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "600"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "OpenChat — Frictionless Multi-User Realtime Chat",
  description:
    "Connect instantly and chat openly with multiple users worldwide. One-click GoogleAuth, zero friction, and high-aesthetic geometric minimalism.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${josefinSans.variable} ${inter.variable} scroll-smooth`}
    >
      <body className="min-h-screen bg-[#FFFFFF] text-[#171717] font-sans antialiased selection:bg-[#66CCF2]/20 selection:text-[#171717]">
        {children}
      </body>
    </html>
  );
}
