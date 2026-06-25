"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { toast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login?callbackUrl=/account/profile");
    if (session?.user) {
      setName(session.user.name || "");
      setEmail(session.user.email || "");
    }
  }, [session, status, router]);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to update profile");
      }
      toast({ title: "Profile updated", description: "Your name has been saved." });
      router.refresh();
    } catch (err) {
      toast({ title: "Update failed", description: err instanceof Error ? err.message : "Unknown error", variant: "destructive" });
    } finally {
      setSavingProfile(false);
    }
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    if (newPassword.length < 8) {
      toast({ title: "Password too short", description: "Minimum 8 characters", variant: "destructive" });
      return;
    }
    setSavingPassword(true);
    try {
      const res = await fetch("/api/account/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to change password");
      }
      toast({ title: "Password changed", description: "Use your new password next time you sign in." });
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch (err) {
      toast({ title: "Failed", description: err instanceof Error ? err.message : "Unknown error", variant: "destructive" });
    } finally {
      setSavingPassword(false);
    }
  };

  if (status === "loading") return <div className="luxe-wrap py-20 text-center luxe-mono">Loading…</div>;
  if (!session?.user) return null;

  return (
    <div className="luxe-wrap py-12 max-w-2xl">
      <div className="mb-6">
        <Link href="/account" className="luxe-btn-ghost">← Back to account</Link>
      </div>

      <span className="luxe-eyebrow mb-2">Settings</span>
      <h1 className="font-display text-4xl font-medium tracking-tight mb-8">Profile</h1>

      <form onSubmit={saveProfile} className="space-y-5 mb-12 pb-12 border-b border-[#e4e1d6]">
        <h2 className="font-display text-xl font-medium">Personal info</h2>

        <label className="block">
          <span className="luxe-mono text-[11px] text-[#2b2b28]">Name</span>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full bg-transparent border-b-2 border-[#0a0a0a] py-2 outline-none focus:border-[#D1FE17]" placeholder="Your name" />
        </label>

        <label className="block">
          <span className="luxe-mono text-[11px] text-[#2b2b28]">Email (read-only)</span>
          <input type="email" value={email} disabled className="mt-1 w-full bg-transparent border-b border-[#e4e1d6] py-2 outline-none text-[#2b2b28]/60 cursor-not-allowed" />
        </label>

        <button type="submit" disabled={savingProfile} className="luxe-btn-primary disabled:opacity-50">
          <span>{savingProfile ? "Saving…" : "Save changes"}</span>
        </button>
      </form>

      <form onSubmit={changePassword} className="space-y-5">
        <h2 className="font-display text-xl font-medium">Change password</h2>

        <label className="block">
          <span className="luxe-mono text-[11px] text-[#2b2b28]">Current password</span>
          <input type="password" required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="mt-1 w-full bg-transparent border-b-2 border-[#0a0a0a] py-2 outline-none focus:border-[#D1FE17]" />
        </label>

        <label className="block">
          <span className="luxe-mono text-[11px] text-[#2b2b28]">New password</span>
          <input type="password" required minLength={8} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="mt-1 w-full bg-transparent border-b-2 border-[#0a0a0a] py-2 outline-none focus:border-[#D1FE17]" />
          <span className="luxe-mono text-[10px] text-[#2b2b28]/60">Minimum 8 characters</span>
        </label>

        <label className="block">
          <span className="luxe-mono text-[11px] text-[#2b2b28]">Confirm new password</span>
          <input type="password" required minLength={8} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mt-1 w-full bg-transparent border-b-2 border-[#0a0a0a] py-2 outline-none focus:border-[#D1FE17]" />
        </label>

        <button type="submit" disabled={savingPassword} className="luxe-btn-primary disabled:opacity-50">
          <span>{savingPassword ? "Changing…" : "Change password"}</span>
        </button>
      </form>
    </div>
  );
}
