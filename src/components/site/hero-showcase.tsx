"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";

type ShowcaseProduct = {
  id: string;
  slug: string;
  name: string;
  price: number;
  img: string;
  tag: string | null;
};

const ROTATE_INTERVAL = 5 * 60 * 1000; // 5 minutes

export function HeroShowcase({ products }: { products: ShowcaseProduct[] }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const advance = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIdx((idx) => (idx + 1) % products.length);
      setIsTransitioning(false);
    }, 400);
  }, [products.length]);

  const goTo = useCallback((idx: number) => {
    if (idx === currentIdx) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIdx(idx);
      setIsTransitioning(false);
    }, 400);
  }, [currentIdx]);

  useEffect(() => {
    if (products.length <= 1) return;
    const interval = setInterval(advance, ROTATE_INTERVAL);
    return () => clearInterval(interval);
  }, [advance, products.length]);

  if (products.length === 0) return null;

  const product = products[currentIdx];
  const tag = product.tag || "Featured";
  const tagClass =
    tag === "Sale" ? "luxe-tag-sale"
    : tag === "New" ? "luxe-tag-new"
    : tag === "Bestseller" ? "luxe-tag-bestseller"
    : "luxe-tag-bestseller";

  return (
    <div className="relative flex items-center">
      <Link
        href={`/product/${product.slug}`}
        className={`flex flex-col group bg-white rounded-md overflow-hidden shadow-sm border border-[#e4e1d6] w-full h-[60vh] md:h-[680px] transition-opacity duration-300 ${
          isTransitioning ? "opacity-0" : "opacity-100"
        }`}
        key={product.id}
      >
        <div className="overflow-hidden bg-[#f3f1ea] flex-1 min-h-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.img}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        <div className="p-5 flex-shrink-0">
          <div className="flex items-center justify-between luxe-mono text-[11px] mb-2">
            <span className={`luxe-tag ${tagClass}`}>{tag}</span>
            <span>★ Featured</span>
          </div>
          <div className="font-display text-xl font-medium">{product.name}</div>
          <div className="mt-2 flex items-center justify-between">
            <span className="font-mono">${product.price.toFixed(2)}</span>
            <span className="luxe-mono text-[11px] group-hover:text-[#b9e30f] transition-colors">Shop now →</span>
          </div>
        </div>
      </Link>

      {/* Dot indicators — clickable to manually advance */}
      {products.length > 1 && (
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {products.map((p, idx) => (
            <button
              key={p.id}
              onClick={(e) => {
                e.preventDefault();
                goTo(idx);
              }}
              aria-label={`Show product ${idx + 1}: ${p.name}`}
              className={`h-1.5 rounded-full transition-all ${
                idx === currentIdx
                  ? "w-6 bg-[#0a0a0a]"
                  : "w-1.5 bg-[#0a0a0a]/30 hover:bg-[#0a0a0a]/60"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
