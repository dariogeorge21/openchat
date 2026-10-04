import type { Metadata } from "next";
import { Josefin_Sans, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/auth-context";

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
      suppressHydrationWarning
      className={`${josefinSans.variable} ${inter.variable} scroll-smooth`}
    >
      <head>
        <meta name="apple-mobile-web-app-title" content="OpenChat" />
      </head>
      <body className="min-h-screen bg-[#FFFFFF] dark:bg-[#111B21] text-[#171717] dark:text-[#E9EDEF] font-sans antialiased selection:bg-[#66CCF2]/20 selection:text-[#171717]">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
