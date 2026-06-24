"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export function SiteFooter() {
  const [email, setEmail] = useState("");

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast({ title: "You're on the list!", description: "Check your inbox for a 15% off code." });
    setEmail("");
  };

  return (
    <footer className="bg-[#0a0a0a] text-[#fafaf8] mt-auto">
      <div className="luxe-wrap pt-20 pb-7">
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr_1.2fr] gap-12 pb-14 border-b border-white/14">
          <div>
            <div className="font-display text-2xl font-semibold mb-4">
              LUXE<span className="text-[#D1FE17]">.</span>
            </div>
            <p className="text-white/60 text-sm max-w-[32ch]">
              Clean, high-performance beauty in bold color. Formulated for real skin, made to be seen.
            </p>
          </div>

          <div>
            <h4 className="luxe-mono text-[#D1FE17] mb-[18px]">Shop</h4>
            <ul className="flex flex-col gap-3">
              <li><Link href="/shop?cat=Skincare" className="text-white/70 hover:text-[#D1FE17] text-sm transition-colors">Skincare</Link></li>
              <li><Link href="/shop?cat=Makeup" className="text-white/70 hover:text-[#D1FE17] text-sm transition-colors">Makeup</Link></li>
              <li><Link href="/shop?cat=Sale" className="text-white/70 hover:text-[#D1FE17] text-sm transition-colors">Sale</Link></li>
              <li><Link href="/shop" className="text-white/70 hover:text-[#D1FE17] text-sm transition-colors">All products</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="luxe-mono text-[#D1FE17] mb-[18px]">Company</h4>
            <ul className="flex flex-col gap-3">
              <li><Link href="/about" className="text-white/70 hover:text-[#D1FE17] text-sm transition-colors">About</Link></li>
              <li><Link href="/contact" className="text-white/70 hover:text-[#D1FE17] text-sm transition-colors">Contact</Link></li>
              <li><Link href="/cart" className="text-white/70 hover:text-[#D1FE17] text-sm transition-colors">Cart</Link></li>
              <li><Link href="/account" className="text-white/70 hover:text-[#D1FE17] text-sm transition-colors">My account</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="luxe-mono text-[#D1FE17] mb-[18px]">Stay in the loop</h4>
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
              <button type="submit" className="text-[#D1FE17] luxe-mono">
                Join →
              </button>
            </form>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-3 pt-7">
          <span className="text-white/60 text-sm">© {new Date().getFullYear()} LUXE Cosmetics. All rights reserved.</span>
          <div className="flex gap-5 text-sm">
            <Link href="/privacy" className="text-white/60 hover:text-[#D1FE17] transition-colors">Privacy</Link>
            <Link href="/terms" className="text-white/60 hover:text-[#D1FE17] transition-colors">Terms</Link>
            <Link href="/shipping" className="text-white/60 hover:text-[#D1FE17] transition-colors">Shipping</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
