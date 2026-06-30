"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

type ShowcaseProduct = {
  id: string;
  slug: string;
  name: string;
  price: number;
  img: string;
  tag: string | null;
};

export function HeroShowcase({ products }: { products: ShowcaseProduct[] }) {
  const [product, setProduct] = useState<ShowcaseProduct | null>(null);

  // Pick a random product on mount (runs once per page load)
  // This means every refresh shows a different product
  useEffect(() => {
    if (products.length === 0) return;
    const randomIdx = Math.floor(Math.random() * products.length);
    setProduct(products[randomIdx]);
  }, [products]);

  // While client hydrates, show the first product to avoid layout shift
  // (this is replaced by the random pick once useEffect runs)
  const display = product || products[0];
  if (!display) return null;

  const tag = display.tag || "Featured";
  const tagClass =
    tag === "Sale" ? "luxe-tag-sale"
    : tag === "New" ? "luxe-tag-new"
    : tag === "Bestseller" ? "luxe-tag-bestseller"
    : "luxe-tag-bestseller";

  return (
    <div className="relative flex items-center">
      <Link
        href={`/product/${display.slug}`}
        className="flex flex-col group bg-white rounded-md overflow-hidden shadow-sm border border-[#e4e1d6] w-full h-[60vh] md:h-[680px]"
      >
        <div className="overflow-hidden bg-[#f3f1ea] flex-1 min-h-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={display.img}
            alt={display.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        <div className="p-5 flex-shrink-0">
          <div className="flex items-center justify-between luxe-mono text-[11px] mb-2">
            <span className={`luxe-tag ${tagClass}`}>{tag}</span>
            <span>★ Featured</span>
          </div>
          <div className="font-display text-xl font-medium">{display.name}</div>
          <div className="mt-2 flex items-center justify-between">
            <span className="font-mono">${display.price.toFixed(2)}</span>
            <span className="luxe-mono text-[11px] group-hover:text-[#b9e30f] transition-colors">Shop now →</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
