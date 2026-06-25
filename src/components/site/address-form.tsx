"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { toast } from "@/hooks/use-toast";

type FormState = {
  label: string; firstName: string; lastName: string;
  address: string; city: string; postal: string; country: string;
  phone: string; isDefault: boolean;
};

export function AddressForm({ initial, addressId }: { initial?: FormState; addressId?: string }) {
  const router = useRouter();
  const { status } = useSession();
  const [form, setForm] = useState<FormState>(
    initial || {
      label: "Home", firstName: "", lastName: "", address: "",
      city: "", postal: "", country: "Sri Lanka", phone: "", isDefault: false,
    }
  );
  const [saving, setSaving] = useState(false);
  const isEdit = Boolean(addressId);

  if (status === "unauthenticated") {
    router.push("/login?callbackUrl=/account/addresses");
    return null;
  }

  const update = (k: keyof FormState, v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = isEdit ? `/api/account/addresses/${addressId}` : "/api/account/addresses";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to save address");
      }
      toast({ title: isEdit ? "Address updated" : "Address added" });
      router.push("/account/addresses");
      router.refresh();
    } catch (err) {
      toast({ title: "Save failed", description: err instanceof Error ? err.message : "Unknown error", variant: "destructive" });
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Label">
          <select value={form.label} onChange={(e) => update("label", e.target.value)} className="luxe-input">
            <option>Home</option>
            <option>Work</option>
            <option>Other</option>
          </select>
        </Field>
        <Field label="Default">
          <label className="flex items-center gap-2 py-2">
            <input type="checkbox" checked={form.isDefault} onChange={(e) => update("isDefault", e.target.checked)} className="w-4 h-4" />
            <span className="text-sm">Use as default shipping address</span>
          </label>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="First name *">
          <input required value={form.firstName} onChange={(e) => update("firstName", e.target.value)} className="luxe-input" />
        </Field>
        <Field label="Last name *">
          <input required value={form.lastName} onChange={(e) => update("lastName", e.target.value)} className="luxe-input" />
        </Field>
      </div>

      <Field label="Address *">
        <input required value={form.address} onChange={(e) => update("address", e.target.value)} className="luxe-input" placeholder="Street and house number" />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="City *">
          <input required value={form.city} onChange={(e) => update("city", e.target.value)} className="luxe-input" />
        </Field>
        <Field label="Postal code *">
          <input required value={form.postal} onChange={(e) => update("postal", e.target.value)} className="luxe-input" />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Country *">
          <input required value={form.country} onChange={(e) => update("country", e.target.value)} className="luxe-input" />
        </Field>
        <Field label="Phone">
          <input value={form.phone} onChange={(e) => update("phone", e.target.value)} className="luxe-input" placeholder="+94 ..." />
        </Field>
      </div>

      <div className="flex items-center gap-3 pt-4">
        <button type="submit" disabled={saving} className="luxe-btn-primary disabled:opacity-50">
          <span>{saving ? "Saving…" : isEdit ? "Save changes" : "Add address"}</span>
        </button>
        <Link href="/account/addresses" className="luxe-btn-ghost">Cancel</Link>
      </div>

      <style>{`
        .luxe-input {
          width: 100%;
          background: white;
          border: 1.5px solid #e4e1d6;
          border-radius: 6px;
          padding: 10px 14px;
          font-family: inherit;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
        }
        .luxe-input:focus { border-color: #0a0a0a; }
      `}</style>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="luxe-mono text-[11px] text-[#2b2b28]">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
