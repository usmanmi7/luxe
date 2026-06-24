import type { Metadata } from "next";
import { Inter, Space_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "LUXE — Beauty, Unfiltered",
    template: "%s — LUXE",
  },
  description:
    "Clean, high-performance beauty in bold color. Shop skincare and makeup made for real skin.",
  keywords: [
    "beauty",
    "cosmetics",
    "skincare",
    "makeup",
    "LUXE",
    "clean beauty",
  ],
  authors: [{ name: "LUXE Cosmetics" }],
  openGraph: {
    title: "LUXE — Beauty, Unfiltered",
    description:
      "Clean, high-performance beauty in bold color. Shop skincare and makeup made for real skin.",
    siteName: "LUXE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LUXE — Beauty, Unfiltered",
    description:
      "Clean, high-performance beauty in bold color. Shop skincare and makeup made for real skin.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceMono.variable} ${fraunces.variable} antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <Toaster />
      </body>
    </html>
  );
}
