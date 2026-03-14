import type { Metadata } from "next";
import type React from "react";
import { Inter, JetBrains_Mono } from "next/font/google";
import { AppProviders } from "@/components/providers/app-providers";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono"
});

export const metadata: Metadata = {
  title: {
    default: "DSA Suite",
    template: "%s | DSA Suite"
  },
  description: "Master DSA, Competitive Programming, and GATE CSE in one platform."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${mono.variable}`}>
        <AppProviders>
          <div className="min-h-screen">
            <Navbar />
            <main className="mx-auto max-w-7xl px-4 py-10">{children}</main>
            <Footer />
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
