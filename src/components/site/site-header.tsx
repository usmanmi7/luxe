"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Read cart count from localStorage on mount + on storage events
  useEffect(() => {
    const update = () => {
      try {
        const cart = JSON.parse(localStorage.getItem("luxe_cart_v1") || "[]");
        setCartCount(cart.reduce((s: number, i: { qty: number }) => s + i.qty, 0));
      } catch {
        setCartCount(0);
      }
    };
    update();
    window.addEventListener("storage", update);
    window.addEventListener("luxe:cart-changed", update);
    return () => {
      window.removeEventListener("storage", update);
      window.removeEventListener("luxe:cart-changed", update);
    };
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-[#e4e1d6] bg-[#fafaf8]/88 backdrop-blur-md"
      style={{ borderBottomColor: "var(--line)" }}
    >
      <div className="luxe-wrap flex items-center justify-between py-[18px] gap-6">
        <Link href="/" className="font-display text-2xl font-semibold tracking-tight">
          LUXE<span className="text-[#b9e30f]">.</span>
        </Link>

        <nav className="hidden md:flex items-center gap-9" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className="luxe-mono relative py-1 transition-colors hover:text-[#0a0a0a] data-[active]:text-[#0a0a0a]"
              data-active={isActive(link.href) ? "true" : undefined}
            >
              {link.label}
              <span
                className="absolute left-0 right-0 -bottom-[2px] h-[2px] bg-[#b9e30f] origin-right transition-transform duration-300 ease-[cubic-bezier(.16,1,.3,1)] data-[active]:scale-x-100 data-[active]:origin-left"
                data-active={isActive(link.href) ? "true" : undefined}
                style={{ transform: isActive(link.href) ? "scaleX(1)" : "scaleX(0)", transformOrigin: isActive(link.href) ? "left" : "right" }}
              />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-[18px]">
          <Link
            href="/cart"
            className="relative inline-flex h-[38px] w-[38px] items-center justify-center"
            aria-label={`View cart, ${cartCount} items`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.6}
              className="h-5 w-5"
            >
              <path d="M3 3h2l2.4 12.4a2 2 0 0 0 2 1.6h7.2a2 2 0 0 0 2-1.6L21 8H6" />
              <circle cx="9" cy="20" r="1" />
              <circle cx="17" cy="20" r="1" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-[2px] -right-[2px] flex h-[17px] w-[17px] items-center justify-center rounded-full bg-[#D1FE17] font-mono text-[10px] font-bold text-[#0a0a0a]">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden flex h-[38px] w-[38px] flex-col items-center justify-center gap-[5px]"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span
              className="block h-[2px] w-[22px] bg-[#0a0a0a] transition-all"
              style={{
                transform: mobileOpen ? "translateY(7px) rotate(45deg)" : "none",
              }}
            />
            <span
              className="block h-[2px] w-[22px] bg-[#0a0a0a] transition-all"
              style={{ opacity: mobileOpen ? 0 : 1 }}
            />
            <span
              className="block h-[2px] w-[22px] bg-[#0a0a0a] transition-all"
              style={{
                transform: mobileOpen ? "translateY(-7px) rotate(-45deg)" : "none",
              }}
            />
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-[#e4e1d6] bg-[#fafaf8]">
          <div className="luxe-wrap py-4 flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="luxe-mono py-2"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
