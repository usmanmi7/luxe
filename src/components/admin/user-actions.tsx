"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

export function UserActions({ userId, email, role, banned }: { userId: string; email: string; role: string; banned: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const call = async (action: "ban" | "unban" | "promote" | "demote") => {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Action failed");
      }
      const labels = { ban: "Banned", unban: "Unbanned", promote: "Promoted to admin", demote: "Demoted to user" };
      toast({ title: labels[action], description: email });
      router.refresh();
    } catch (err) {
      toast({ title: "Action failed", description: err instanceof Error ? err.message : "Unknown error", variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex justify-end gap-2">
      {banned ? (
        <button onClick={() => call("unban")} disabled={busy} className="luxe-mono text-[11px] text-green-700 underline hover:text-green-900 disabled:opacity-50">Unban</button>
      ) : (
        <button onClick={() => call("ban")} disabled={busy} className="luxe-mono text-[11px] text-orange-700 underline hover:text-orange-900 disabled:opacity-50">Ban</button>
      )}
      {role === "ADMIN" ? (
        <button onClick={() => call("demote")} disabled={busy} className="luxe-mono text-[11px] text-[#2b2b28] underline hover:text-[#0a0a0a] disabled:opacity-50">Demote</button>
      ) : (
        <button onClick={() => call("promote")} disabled={busy} className="luxe-mono text-[11px] text-[#0a0a0a] underline hover:text-[#b9e30f] disabled:opacity-50">Promote</button>
      )}
    </div>
  );
}
