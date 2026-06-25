"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/account";
  const error = params.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(
    error === "CredentialsSignin" ? "Invalid email or password" : null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (!res || res.error) {
        setFormError("Invalid email or password");
        setSubmitting(false);
        return;
      }
      router.push(callbackUrl);
      router.refresh();
    } catch {
      setFormError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="luxe-wrap py-16 md:py-24">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-10">
          <span className="luxe-eyebrow mb-3">Welcome back</span>
          <h1 className="font-display text-4xl md:text-5xl font-medium tracking-tight">
            Sign in
          </h1>
          <p className="mt-3 text-[#2b2b28]">
            Don't have an account?{" "}
            <Link href="/signup" className="underline hover:text-[#0a0a0a]">
              Sign up
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
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
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full bg-transparent border-b-2 border-[#0a0a0a] py-2 outline-none focus:border-[#D1FE17]"
            />
          </label>

          {formError && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded text-sm">
              {formError}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="luxe-btn-primary w-full disabled:opacity-50"
          >
            <span>{submitting ? "Signing in…" : "Sign in"}</span>
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/" className="luxe-btn-ghost">← Back to home</Link>
        </div>

        <div className="mt-8 p-4 bg-[#f3f1ea] rounded text-xs text-[#2b2b28]">
          <strong>Demo admin:</strong> webworks456@gmail.com / admin123
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="luxe-wrap py-20 text-center luxe-mono">Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}
