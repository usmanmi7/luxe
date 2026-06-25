"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ConfirmContent() {
  const params = useSearchParams();
  const status = params.get("status");

  const content = {
    success: {
      icon: "✓",
      title: "You're confirmed!",
      message: "Thanks for joining the LUXE insider list. Check your inbox — we just sent you a welcome email with your 15% off code.",
      cta: "Start shopping",
      ctaHref: "/shop",
    },
    already: {
      icon: "✓",
      title: "Already confirmed",
      message: "You're already on the list — no action needed. We'll email you about new products and sales.",
      cta: "Browse products",
      ctaHref: "/shop",
    },
    invalid: {
      icon: "✕",
      title: "Invalid confirmation link",
      message: "This confirmation link is invalid or has expired. Please subscribe again to get a new link.",
      cta: "Go to homepage",
      ctaHref: "/",
    },
    unsubscribed: {
      icon: "ℹ",
      title: "Account previously unsubscribed",
      message: "You previously unsubscribed from LUXE emails. Please subscribe again from our website to rejoin.",
      cta: "Go to homepage",
      ctaHref: "/",
    },
    error: {
      icon: "✕",
      title: "Something went wrong",
      message: "We couldn't confirm your subscription. Please try again or contact us at hello@luxe.local.",
      cta: "Go to homepage",
      ctaHref: "/",
    },
  }[status || "error"];

  return (
    <div className="luxe-wrap py-20 md:py-32 text-center">
      <div className="max-w-md mx-auto">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl ${
          content.icon === "✓" ? "bg-[#D1FE17]" : content.icon === "✕" ? "bg-red-100" : "bg-[#f3f1ea]"
        }`}>
          {content.icon}
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-medium tracking-tight mb-4">{content.title}</h1>
        <p className="text-[#2b2b28] mb-8 leading-relaxed">{content.message}</p>
        <Link href={content.ctaHref} className="luxe-btn-primary">
          <span>{content.cta}</span>
        </Link>
      </div>
    </div>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={<div className="luxe-wrap py-20 text-center luxe-mono">Loading…</div>}>
      <ConfirmContent />
    </Suspense>
  );
}
