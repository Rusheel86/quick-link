import type { Metadata, Viewport } from "next"; // Added Viewport type
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 1. Separate Viewport Export (Fixes the Vercel Error)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

// 2. Metadata Export (Removed viewport from here)
export const metadata: Metadata = {
  title: "Quick-Link | Instant Marketplace & Portfolio Links",
  description: "Create professional, mobile-optimized marketplace links and portfolios in 60 seconds. Built-in QR codes and ad-free options.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google AdSense Integration */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9215034208801607"
          crossOrigin="anonymous"
          strategy="beforeInteractive" 
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300`}
      >
        {children}
      </body>
    </html>
  );
}