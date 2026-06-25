"use client";

import { useState } from "react";
import { toast } from "@/hooks/use-toast";

type Variant = "footer" | "section";

export function NewsletterForm({ variant = "section" }: { variant?: Variant }) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: variant === "footer" ? "footer" : "homepage_section" }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to subscribe");
      }
      if (data.alreadySubscribed) {
        toast({ title: "You're already subscribed!", description: "Check your inbox for our latest." });
      } else {
        toast({
          title: "Almost there! ✓",
          description: "We sent you a confirmation email. Click the link to complete your subscription and get your 15% off code.",
        });
      }
      setEmail("");
    } catch (err) {
      toast({
        title: "Subscription failed",
        description: err instanceof Error ? err.message : "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Footer variant: minimal inline form (no label, transparent bg, underline-style)
  if (variant === "footer") {
    return (
      <form onSubmit={subscribe} className="flex items-center gap-0 border-b-[1.5px] border-white/30 pb-[10px] mt-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          aria-label="Email address"
          className="bg-transparent border-none text-white font-sans text-sm flex-1 outline-none placeholder:text-white/45"
        />
        <button type="submit" disabled={submitting} className="text-[#D1FE17] luxe-mono disabled:opacity-50">
          {submitting ? "…" : "Join →"}
        </button>
      </form>
    );
  }

  // Section variant: full form with white bg, button next to input
  return (
    <form onSubmit={subscribe} className="flex gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@email.com"
        aria-label="Email address"
        className="flex-1 bg-white border border-[#e4e1d6] rounded-md px-4 py-3 outline-none focus:border-[#0a0a0a]"
      />
      <button type="submit" disabled={submitting} className="luxe-btn-primary disabled:opacity-50">
        <span>{submitting ? "Sending…" : "Subscribe"}</span>
      </button>
    </form>
  );
}
