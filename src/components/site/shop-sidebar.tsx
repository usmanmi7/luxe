"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useMemo } from "react";

type Category = { label: string; value: string; count: number };
type Tag = { label: string; value: string; count: number };

type ActiveFilters = {
  cat: string;
  tag: string;
  sort: string;
  minPrice: string;
  maxPrice: string;
};

export function ShopSidebar({
  categories,
  tags,
  priceRange,
  active,
  resultCount,
}: {
  categories: Category[];
  tags: Tag[];
  priceRange: { min: number; max: number };
  active: ActiveFilters;
  resultCount: number;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Local state for price inputs (so user can type before applying)
  const [minPrice, setMinPrice] = useState(active.minPrice);
  const [maxPrice, setMaxPrice] = useState(active.maxPrice);

  const updateUrl = (updates: Partial<ActiveFilters>) => {
    const sp = new URLSearchParams(params.toString());
    const next = { ...active, ...updates };

    if (next.cat && next.cat !== "All") sp.set("cat", next.cat);
    else sp.delete("cat");

    if (next.tag) sp.set("tag", next.tag);
    else sp.delete("tag");

    if (next.sort && next.sort !== "featured") sp.set("sort", next.sort);
    else sp.delete("sort");

    if (next.minPrice) sp.set("minPrice", next.minPrice);
    else sp.delete("minPrice");

    if (next.maxPrice) sp.set("maxPrice", next.maxPrice);
    else sp.delete("maxPrice");

    const qs = sp.toString();
    router.push(qs ? `/shop?${qs}` : "/shop");
    setMobileOpen(false);
  };

  const applyPrice = () => {
    updateUrl({ minPrice, maxPrice });
  };

  const clearAll = () => {
    router.push("/shop");
    setMinPrice("");
    setMaxPrice("");
  };

  const hasActiveFilters =
    active.cat !== "All" || active.tag || active.sort !== "featured" || active.minPrice || active.maxPrice;

  const SidebarContent = (
    <div className="space-y-8">
      {/* Result count + clear */}
      <div className="flex items-center justify-between pb-4 border-b border-[#e4e1d6]">
        <span className="luxe-mono text-[11px] text-[#2b2b28]">
          {resultCount} product{resultCount === 1 ? "" : "s"}
        </span>
        {hasActiveFilters && (
          <button onClick={clearAll} className="luxe-mono text-[10px] text-[#0a0a0a] underline hover:text-[#b9e30f]">
            Clear all
          </button>
        )}
      </div>

      {/* Category */}
      <div>
        <h3 className="luxe-mono text-[11px] text-[#2b2b28] mb-3">CATEGORY</h3>
        <ul className="space-y-1">
          {categories.map((c) => (
            <li key={c.value}>
              <button
                onClick={() => updateUrl({ cat: c.value })}
                className={`w-full text-left py-1.5 px-2 rounded transition-colors flex items-center justify-between ${
                  active.cat === c.value
                    ? "bg-[#0a0a0a] text-[#fafaf8]"
                    : "text-[#0a0a0a] hover:bg-[#f3f1ea]"
                }`}
              >
                <span className="font-display text-sm">{c.label}</span>
                <span className={`luxe-mono text-[10px] ${active.cat === c.value ? "text-[#D1FE17]" : "text-[#2b2b28]/60"}`}>
                  {c.count}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Tags */}
      <div>
        <h3 className="luxe-mono text-[11px] text-[#2b2b28] mb-3">FILTER BY TAG</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <button
              key={t.value}
              onClick={() => updateUrl({ tag: active.tag === t.value ? "" : t.value })}
              className={`luxe-mono text-[10px] px-3 py-1.5 rounded-full border transition-all ${
                active.tag === t.value
                  ? "bg-[#D1FE17] text-[#0a0a0a] border-[#D1FE17]"
                  : "bg-transparent text-[#0a0a0a] border-[#0a0a0a]/30 hover:border-[#0a0a0a]"
              }`}
            >
              {t.label} ({t.count})
            </button>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <h3 className="luxe-mono text-[11px] text-[#2b2b28] mb-3">PRICE RANGE</h3>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <label className="block">
              <span className="luxe-mono text-[9px] text-[#2b2b28]/60">MIN</span>
              <input
                type="number"
                min={priceRange.min}
                max={priceRange.max}
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder={String(priceRange.min)}
                className="w-full bg-white border border-[#e4e1d6] rounded px-2 py-1.5 text-sm outline-none focus:border-[#0a0a0a]"
              />
            </label>
          </div>
          <span className="text-[#2b2b28] mt-4">-</span>
          <div className="flex-1">
            <label className="block">
              <span className="luxe-mono text-[9px] text-[#2b2b28]/60">MAX</span>
              <input
                type="number"
                min={priceRange.min}
                max={priceRange.max}
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder={String(priceRange.max)}
                className="w-full bg-white border border-[#e4e1d6] rounded px-2 py-1.5 text-sm outline-none focus:border-[#0a0a0a]"
              />
            </label>
          </div>
        </div>
        <button
          onClick={applyPrice}
          className="w-full mt-3 luxe-mono text-[10px] py-2 border border-[#0a0a0a] rounded-full hover:bg-[#0a0a0a] hover:text-[#fafaf8] transition-colors"
        >
          APPLY PRICE
        </button>
      </div>

      {/* Sort */}
      <div>
        <h3 className="luxe-mono text-[11px] text-[#2b2b28] mb-3">SORT BY</h3>
        <select
          value={active.sort}
          onChange={(e) => updateUrl({ sort: e.target.value })}
          className="w-full bg-white border border-[#e4e1d6] rounded px-3 py-2 text-sm outline-none focus:border-[#0a0a0a] cursor-pointer"
        >
          <option value="featured">Featured</option>
          <option value="newest">Newest first</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar (sticky) */}
      <aside className="hidden md:block">
        <div className="sticky top-24">
          {SidebarContent}
        </div>
      </aside>

      {/* Mobile: filter toggle button + drawer */}
      <div className="md:hidden">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-full luxe-mono text-xs py-3 px-4 border border-[#0a0a0a] rounded-full flex items-center justify-between"
        >
          <span>FILTERS & SORT</span>
          <span className="flex items-center gap-2">
            {hasActiveFilters && (
              <span className="bg-[#D1FE17] text-[#0a0a0a] text-[10px] px-2 py-0.5 rounded-full">
                Active
              </span>
            )}
            <span>{mobileOpen ? "✕" : "☰"}</span>
          </span>
        </button>

        {mobileOpen && (
          <div className="mt-4 p-5 bg-white border border-[#e4e1d6] rounded-md">
            {SidebarContent}
          </div>
        )}
      </div>
    </>
  );
}
