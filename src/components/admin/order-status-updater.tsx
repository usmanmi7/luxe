"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

const STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "pending_cod", label: "Pending (COD)" },
  { value: "pending_bank", label: "Pending (Bank)" },
  { value: "paid", label: "Paid" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
  { value: "refunded", label: "Refunded" },
];

const COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  pending_cod: "bg-blue-100 text-blue-800",
  pending_bank: "bg-blue-100 text-blue-800",
  paid: "bg-green-100 text-green-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-200 text-green-900",
  cancelled: "bg-red-100 text-red-800",
  refunded: "bg-gray-200 text-gray-800",
};

export function OrderStatusUpdater({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [saving, setSaving] = useState(false);

  const handleChange = async (newStatus: string) => {
    if (newStatus === status) return;
    setSaving(true);
    const oldStatus = status;
    setStatus(newStatus);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to update status");
      }
      toast({ title: "Status updated", description: `→ ${newStatus.replace(/_/g, " ")}` });
      router.refresh();
    } catch (err) {
      setStatus(oldStatus);
      toast({ title: "Update failed", description: err instanceof Error ? err.message : "Unknown error", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <label className="luxe-mono text-[11px] text-[#2b2b28]">STATUS</label>
      <select
        value={status}
        onChange={(e) => handleChange(e.target.value)}
        disabled={saving}
        className={`luxe-mono text-[11px] px-3 py-2 rounded-full border-2 border-[#0a0a0a] outline-none cursor-pointer ${COLORS[status] || ""}`}
      >
        {STATUSES.map((s) => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>
      {saving && <span className="luxe-mono text-[10px] text-[#2b2b28]">Saving…</span>}
    </div>
  );
}
