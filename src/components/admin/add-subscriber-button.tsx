"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

export function AddSubscriberButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "admin" }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to add subscriber");
      }
      toast({ title: "Subscriber added", description: email });
      setEmail("");
      setOpen(false);
      router.refresh();
    } catch (err) {
      toast({
        title: "Failed",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="luxe-btn-primary">
        <span>+ Add subscriber</span>
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div className="bg-white rounded-md p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-display text-2xl font-medium mb-4">Add subscriber</h2>
            <p className="text-sm text-[#2b2b28] mb-4">
              Manually add an email. The subscriber will be marked as confirmed immediately (no confirmation email sent).
            </p>
            <form onSubmit={add} className="space-y-4">
              <label className="block">
                <span className="luxe-mono text-[11px] text-[#2b2b28]">Email address</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full bg-white border border-[#e4e1d6] rounded px-3 py-2 outline-none focus:border-[#0a0a0a]"
                  placeholder="customer@email.com"
                />
              </label>
              <div className="flex gap-3">
                <button type="submit" disabled={submitting} className="luxe-btn-primary disabled:opacity-50">
                  <span>{submitting ? "Adding…" : "Add subscriber"}</span>
                </button>
                <button type="button" onClick={() => setOpen(false)} className="luxe-btn-ghost">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
