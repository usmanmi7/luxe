"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { toast } from "@/hooks/use-toast";

type Address = {
  id: string; label: string; firstName: string; lastName: string;
  address: string; city: string; postal: string; country: string;
  phone: string | null; isDefault: boolean;
};

export default function AddressesPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/account/addresses");
      return;
    }
    if (status !== "authenticated") return;
    fetch("/api/account/addresses")
      .then((r) => r.json())
      .then((data) => setAddresses(data.addresses || []))
      .catch(() => toast({ title: "Failed to load addresses", variant: "destructive" }))
      .finally(() => setLoading(false));
  }, [status, router]);

  const setDefault = async (id: string) => {
    const res = await fetch(`/api/account/addresses/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isDefault: true }),
    });
    if (res.ok) {
      toast({ title: "Default address updated" });
      router.refresh();
      const data = await fetch("/api/account/addresses").then((r) => r.json());
      setAddresses(data.addresses || []);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this address?")) return;
    const res = await fetch(`/api/account/addresses/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast({ title: "Address deleted" });
      setAddresses((list) => list.filter((a) => a.id !== id));
    } else {
      toast({ title: "Delete failed", variant: "destructive" });
    }
  };

  if (status === "loading" || loading) return <div className="luxe-wrap py-20 text-center luxe-mono">Loading…</div>;
  if (!session?.user) return null;

  return (
    <div className="luxe-wrap py-12 max-w-3xl">
      <div className="mb-6">
        <Link href="/account" className="luxe-btn-ghost">← Back to account</Link>
      </div>

      <div className="flex items-end justify-between mb-8 flex-wrap gap-3">
        <div>
          <span className="luxe-eyebrow mb-2">Settings</span>
          <h1 className="font-display text-4xl font-medium tracking-tight">Saved addresses</h1>
          <p className="mt-1 text-sm text-[#2b2b28]">{addresses.length} address{addresses.length === 1 ? "" : "es"} saved</p>
        </div>
        <Link href="/account/addresses/new" className="luxe-btn-primary"><span>+ Add address</span></Link>
      </div>

      {addresses.length === 0 ? (
        <div className="bg-[#f3f1ea] p-10 rounded text-center">
          <p className="text-[#2b2b28] mb-5">No saved addresses yet.</p>
          <Link href="/account/addresses/new" className="luxe-btn-primary"><span>Add your first address</span></Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {addresses.map((a) => (
            <div key={a.id} className={`border-2 rounded-md p-5 ${a.isDefault ? "border-[#D1FE17] bg-[#D1FE17]/5" : "border-[#e4e1d6] bg-white"}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="luxe-mono text-[11px] text-[#2b2b28]">{a.label.toUpperCase()}</span>
                {a.isDefault && <span className="luxe-tag luxe-tag-bestseller">Default</span>}
              </div>
              <div className="text-sm leading-relaxed">
                <strong>{a.firstName} {a.lastName}</strong><br />
                {a.address}<br />
                {a.city}, {a.postal}<br />
                {a.country}
                {a.phone && <><br /><span className="text-[#2b2b28]">{a.phone}</span></>}
              </div>
              <div className="mt-4 pt-3 border-t border-[#e4e1d6] flex gap-3">
                <Link href={`/account/addresses/${a.id}/edit`} className="luxe-mono text-[11px] underline hover:text-[#0a0a0a]">Edit</Link>
                {!a.isDefault && (
                  <button onClick={() => setDefault(a.id)} className="luxe-mono text-[11px] underline hover:text-[#0a0a0a]">Set default</button>
                )}
                <button onClick={() => remove(a.id)} className="luxe-mono text-[11px] text-red-600 underline hover:text-red-800">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
