"use client";

import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const FAQS = [
  { q: "How long does shipping take?", a: "Within Sri Lanka: 2-4 business days. International: 7-14 business days. Free shipping on orders over $60." },
  { q: "What's your return policy?", a: "30-day no-questions-asked returns on unopened products. If you've had a reaction, contact us within 14 days for a full refund." },
  { q: "Are your products cruelty-free?", a: "Yes - Leaping Bunny certified. We never test on animals and never work with suppliers who do." },
  { q: "Where are you based?", a: "Colombo, Sri Lanka. All products are formulated and manufactured locally." },
  { q: "Do you ship internationally?", a: "Yes - we ship worldwide. International shipping is calculated at checkout based on destination and weight." },
];

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data = Object.fromEntries(form.entries());
    setSubmitting(true);
    try {
      // Fire contact form to n8n webhook
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to send message");
      }
      toast({
        title: "Message sent ✓",
        description: `Thanks ${data.name} - we'll reply to ${data.email} within 24h.`,
      });
      (e.target as HTMLFormElement).reset();
    } catch {
      toast({ title: "Failed to send", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <section className="py-20 md:py-28 border-b border-[#e4e1d6]">
        <div className="luxe-wrap max-w-3xl">
          <span className="luxe-eyebrow mb-4">Get in touch</span>
          <h1 className="font-display text-5xl md:text-7xl font-medium leading-[1.05] tracking-tight">
            Say <em className="italic text-[#0a0a0a]/70">hello.</em>
          </h1>
          <p className="mt-6 text-lg text-[#2b2b28]">
            Questions about a product, an order, or just want to chat skincare? We reply to every message within 24 hours.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="luxe-wrap grid md:grid-cols-[1fr_1fr] gap-12">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block">
                <span className="luxe-mono text-[11px] text-[#2b2b28]">Your name</span>
                <input
                  name="name"
                  required
                  className="mt-1 w-full bg-transparent border-b-2 border-[#0a0a0a] py-2 outline-none focus:border-[#D1FE17]"
                />
              </label>
            </div>
            <div>
              <label className="block">
                <span className="luxe-mono text-[11px] text-[#2b2b28]">Email</span>
                <input
                  name="email"
                  type="email"
                  required
                  className="mt-1 w-full bg-transparent border-b-2 border-[#0a0a0a] py-2 outline-none focus:border-[#D1FE17]"
                />
              </label>
            </div>
            <div>
              <label className="block">
                <span className="luxe-mono text-[11px] text-[#2b2b28]">Subject</span>
                <input
                  name="subject"
                  required
                  className="mt-1 w-full bg-transparent border-b-2 border-[#0a0a0a] py-2 outline-none focus:border-[#D1FE17]"
                />
              </label>
            </div>
            <div>
              <label className="block">
                <span className="luxe-mono text-[11px] text-[#2b2b28]">Message</span>
                <textarea
                  name="message"
                  required
                  rows={5}
                  className="mt-1 w-full bg-transparent border-b-2 border-[#0a0a0a] py-2 outline-none focus:border-[#D1FE17] resize-none"
                />
              </label>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="luxe-btn-primary disabled:opacity-50"
            >
              <span>{submitting ? "Sending…" : "Send message"}</span>
            </button>
          </form>

          {/* Contact info */}
          <div className="space-y-8">
            <div>
              <h3 className="luxe-mono text-[11px] text-[#2b2b28] mb-2">EMAIL</h3>
              <a href="mailto:hello@luxe.local" className="font-display text-2xl hover:underline">
                hello@luxe.local
              </a>
            </div>
            <div>
              <h3 className="luxe-mono text-[11px] text-[#2b2b28] mb-2">PHONE</h3>
              <a href="tel:+9411234567" className="font-display text-2xl hover:underline">
                +94 11 234 567
              </a>
            </div>
            <div>
              <h3 className="luxe-mono text-[11px] text-[#2b2b28] mb-2">VISIT</h3>
              <p className="font-display text-lg">
                42 Galle Face Road<br />
                Colombo 03, Sri Lanka
              </p>
            </div>
            <div>
              <h3 className="luxe-mono text-[11px] text-[#2b2b28] mb-2">HOURS</h3>
              <p className="text-[#2b2b28]">
                Monday – Friday: 9am – 6pm<br />
                Saturday: 10am – 4pm<br />
                Sunday: Closed
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-[#f3f1ea]">
        <div className="luxe-wrap max-w-3xl">
          <h2 className="font-display text-4xl font-medium mb-8">Frequently asked</h2>
          <div className="space-y-2">
            {FAQS.map((faq, i) => (
              <details key={i} className="group border-b border-[#e4e1d6] py-4">
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <span className="font-display text-lg font-medium">{faq.q}</span>
                  <span className="luxe-mono text-2xl transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-[#2b2b28] leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
