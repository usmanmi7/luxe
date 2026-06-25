"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "luxe_cookie_consent_v1";

type Consent = {
  accepted: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
};

export function CookieConsent() {
  const [show, setShow] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
          setShow(true);
        } else {
          const consent = JSON.parse(stored) as Consent;
          const age = Date.now() - new Date(consent.timestamp).getTime();
          if (age > 1000 * 60 * 60 * 24 * 30 * 6) {
            setShow(true);
          }
        }
      } catch {
        setShow(true);
      }
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const save = (consent: Omit<Consent, "timestamp">) => {
    const full: Consent = { ...consent, timestamp: new Date().toISOString() };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(full)); } catch {}
    setShow(false);
    window.dispatchEvent(new CustomEvent("luxe:cookie-consent", { detail: full }));
  };

  const acceptAll = () => save({ accepted: true, analytics: true, marketing: true });
  const rejectAll = () => save({ accepted: false, analytics: false, marketing: false });
  const savePrefs = () => save({ accepted: analytics, analytics, marketing });

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6" role="dialog" aria-label="Cookie consent" aria-live="polite">
      <div className="luxe-wrap max-w-3xl mx-auto">
        <div className="bg-[#0a0a0a] text-[#fafaf8] rounded-md shadow-xl border border-white/10 overflow-hidden">
          <div className="p-5 md:p-6">
            <div className="flex items-start gap-3 mb-3">
              <span className="text-2xl" aria-hidden="true">🍪</span>
              <div className="flex-1">
                <h2 className="font-display text-lg font-medium">We value your privacy</h2>
                <p className="text-sm text-white/70 mt-1 leading-relaxed">
                  We use cookies to keep you signed in, remember your cart, and understand how the site is used.{" "}
                  <Link href="/privacy" className="underline hover:text-[#D1FE17]">Read our Privacy Policy</Link>.
                </p>
              </div>
            </div>

            {showPrefs && (
              <div className="space-y-3 my-4 p-4 bg-white/5 rounded">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked disabled className="mt-1 w-4 h-4" />
                  <div>
                    <div className="text-sm font-medium">Essential cookies</div>
                    <div className="text-xs text-white/60">Required for login, cart, checkout. Always on.</div>
                  </div>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} className="mt-1 w-4 h-4" />
                  <div>
                    <div className="text-sm font-medium">Analytics cookies</div>
                    <div className="text-xs text-white/60">Anonymous traffic data so we can improve the site.</div>
                  </div>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} className="mt-1 w-4 h-4" />
                  <div>
                    <div className="text-sm font-medium">Marketing cookies</div>
                    <div className="text-xs text-white/60">Used to show relevant ads on other platforms. Opt-in only.</div>
                  </div>
                </label>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2 mt-4">
              <button onClick={acceptAll} className="luxe-btn-lime text-xs py-2.5 px-4">Accept all</button>
              <button onClick={rejectAll} className="luxe-mono text-xs py-2.5 px-4 border border-white/30 rounded-full hover:bg-white/5 transition-colors">Reject all</button>
              <button onClick={() => setShowPrefs((v) => !v)} className="luxe-mono text-xs py-2.5 px-4 underline hover:text-[#D1FE17]">{showPrefs ? "Hide options" : "Customize"}</button>
              {showPrefs && (
                <button onClick={savePrefs} className="luxe-mono text-xs py-2.5 px-4 ml-auto bg-[#D1FE17] text-[#0a0a0a] rounded-full hover:bg-[#b9e30f] transition-colors">Save preferences</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
