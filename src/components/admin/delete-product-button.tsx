"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

export function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete "${name}"? This will remove it from the catalog. Existing orders keep their snapshot.`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Delete failed");
      }
      toast({ title: "Product deleted", description: name });
      router.refresh();
    } catch (err) {
      toast({ title: "Delete failed", description: err instanceof Error ? err.message : "Unknown error", variant: "destructive" });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <button type="button" onClick={handleDelete} disabled={deleting} className="luxe-mono text-[11px] text-red-600 underline hover:text-red-800 disabled:opacity-50">
      {deleting ? "Deleting…" : "Delete"}
    </button>
  );
}
