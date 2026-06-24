"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Passwords don't match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setSubmitting(true);
    try {
      // Create the user
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to create account");
      }

      // Auto-sign-in the new user
      const signInRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (!signInRes || signInRes.error) {
        // Account created but auto-login failed — send to login page
        router.push("/login?registered=1");
        return;
      }
      router.push("/account");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setSubmitting(false);
    }
  };

  return (
    <div className="luxe-wrap py-16 md:py-24">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-10">
          <span className="luxe-eyebrow mb-3">Join LUXE</span>
          <h1 className="font-display text-4xl md:text-5xl font-medium tracking-tight">
            Create account
          </h1>
          <p className="mt-3 text-[#2b2b28]">
            Already have one?{" "}
            <Link href="/login" className="underline hover:text-[#0a0a0a]">
              Sign in
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="luxe-mono text-[11px] text-[#2b2b28]">Name (optional)</span>
            <input
              type="text"
              name="name"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full bg-transparent border-b-2 border-[#0a0a0a] py-2 outline-none focus:border-[#D1FE17]"
            />
          </label>
          <label className="block">
            <span className="luxe-mono text-[11px] text-[#2b2b28]">Email</span>
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full bg-transparent border-b-2 border-[#0a0a0a] py-2 outline-none focus:border-[#D1FE17]"
            />
          </label>
          <label className="block">
            <span className="luxe-mono text-[11px] text-[#2b2b28]">Password</span>
            <input
              type="password"
              name="password"
              required
              autoComplete="new-password"
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full bg-transparent border-b-2 border-[#0a0a0a] py-2 outline-none focus:border-[#D1FE17]"
            />
            <span className="luxe-mono text-[10px] text-[#2b2b28]/60">Minimum 8 characters</span>
          </label>
          <label className="block">
            <span className="luxe-mono text-[11px] text-[#2b2b28]">Confirm password</span>
            <input
              type="password"
              name="confirm"
              required
              autoComplete="new-password"
              minLength={8}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="mt-1 w-full bg-transparent border-b-2 border-[#0a0a0a] py-2 outline-none focus:border-[#D1FE17]"
            />
          </label>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="luxe-btn-primary w-full disabled:opacity-50"
          >
            <span>{submitting ? "Creating account…" : "Create account"}</span>
          </button>
        </form>

        <p className="mt-6 text-xs text-[#2b2b28]/70 text-center">
          By signing up you agree to our{" "}
          <Link href="/terms" className="underline">Terms</Link> and{" "}
          <Link href="/privacy" className="underline">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
