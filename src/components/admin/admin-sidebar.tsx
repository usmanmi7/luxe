"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/products", label: "Products", icon: "🧴" },
  { href: "/admin/orders", label: "Orders", icon: "📦" },
  { href: "/admin/users", label: "Users", icon: "👥" },
  { href: "/admin/subscribers", label: "Subscribers", icon: "✉️" },
];

export function AdminSidebar({ userEmail, userName }: { userEmail: string; userName: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <>
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[#0a0a0a] text-[#fafaf8] px-4 py-3 flex items-center justify-between">
        <Link href="/admin" className="font-display font-semibold">LUXE<span className="text-[#D1FE17]">.</span> Admin</Link>
        <button onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle admin nav" className="luxe-mono text-xs">
          {mobileOpen ? "CLOSE ✕" : "MENU ☰"}
        </button>
      </div>

      <aside className={`fixed top-0 left-0 z-30 h-screen w-64 bg-[#0a0a0a] text-[#fafaf8] flex flex-col transition-transform md:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6 border-b border-white/10">
          <Link href="/admin" className="font-display text-xl font-semibold block">LUXE<span className="text-[#D1FE17]">.</span></Link>
          <div className="luxe-mono text-[10px] text-white/60 mt-1">ADMIN PANEL</div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                isActive(item.href) ? "bg-[#D1FE17] text-[#0a0a0a] font-medium" : "text-white/80 hover:bg-white/5 hover:text-white"
              }`}>
              <span className="text-lg">{item.icon}</span>
              <span className="luxe-mono text-xs">{item.label.toUpperCase()}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-3">
          <div className="px-2">
            <div className="luxe-mono text-[10px] text-white/60">SIGNED IN AS</div>
            <div className="text-xs truncate">{userName || userEmail}</div>
            <div className="text-[10px] text-white/40 truncate">{userEmail}</div>
          </div>
          <Link href="/" className="block luxe-mono text-[11px] px-4 py-2 text-white/70 hover:text-white">← BACK TO STORE</Link>
          <button onClick={() => signOut({ callbackUrl: "/" })} className="block w-full text-left luxe-mono text-[11px] px-4 py-2 text-white/70 hover:text-[#D1FE17]">SIGN OUT</button>
        </div>
      </aside>

      {mobileOpen && <div className="md:hidden fixed inset-0 bg-black/50 z-20" onClick={() => setMobileOpen(false)} />}
      <div className="md:hidden h-12" />
    </>
  );
}
