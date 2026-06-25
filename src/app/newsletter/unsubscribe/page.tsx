"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function UnsubscribeContent() {
  const params = useSearchParams();
  const status = params.get("status");

  if (status === "success") {
    return (
      <div className="luxe-wrap py-20 md:py-32 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 rounded-full bg-[#D1FE17] flex items-center justify-center mx-auto mb-6 text-4xl">✓</div>
          <h1 className="font-display text-4xl md:text-5xl font-medium tracking-tight mb-4">Unsubscribed</h1>
          <p className="text-[#2b2b28] mb-8 leading-relaxed">
            You've been removed from the LUXE newsletter. You won't receive any more emails from us.
            <br /><br />
            Changed your mind? You can re-subscribe anytime from our website footer.
          </p>
          <Link href="/" className="luxe-btn-primary">
            <span>Back to home</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="luxe-wrap py-20 md:py-32 text-center">
      <div className="max-w-md mx-auto">
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6 text-4xl">✕</div>
        <h1 className="font-display text-4xl md:text-5xl font-medium tracking-tight mb-4">Invalid link</h1>
        <p className="text-[#2b2b28] mb-8 leading-relaxed">
          This unsubscribe link is invalid or has already been used.
          If you're still receiving emails you don't want, contact us at hello@luxe.local.
        </p>
        <Link href="/" className="luxe-btn-primary">
          <span>Back to home</span>
        </Link>
      </div>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={<div className="luxe-wrap py-20 text-center luxe-mono">Loading…</div>}>
      <UnsubscribeContent />
    </Suspense>
  );
}
