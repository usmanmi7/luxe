"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

const FILTERS = [
  { label: "All", value: "All" },
  { label: "Skincare", value: "Skincare" },
  { label: "Makeup", value: "Makeup" },
  { label: "Sale", value: "Sale" },
];

export function ShopFilters({ active, count }: { active: string; count: number }) {
  const router = useRouter();
  const params = useSearchParams();

  const setFilter = (value: string) => {
    const sp = new URLSearchParams(params.toString());
    if (value === "All") {
      sp.delete("cat");
    } else {
      sp.set("cat", value);
    }
    const qs = sp.toString();
    router.push(qs ? `/shop?${qs}` : "/shop");
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={`luxe-mono px-4 py-2 rounded-full border transition-all ${
              active === f.value
                ? "bg-[#0a0a0a] text-[#fafaf8] border-[#0a0a0a]"
                : "bg-transparent text-[#0a0a0a] border-[#0a0a0a]/30 hover:border-[#0a0a0a]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="luxe-mono text-[#2b2b28]">
        {count} product{count === 1 ? "" : "s"}
      </div>
    </div>
  );
}
