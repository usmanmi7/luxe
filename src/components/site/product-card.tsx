"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { addToCart } from "@/lib/luxe/cart";

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number | null;
  img: string;
  tag: string | null;
};

export function ProductCard({ product, prefix = "" }: { product: Product; prefix?: string }) {
  const [adding, setAdding] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id, 1);
    setAdding(true);
    toast({ title: "Added to bag ✓", description: product.name });
    setTimeout(() => setAdding(false), 1800);
  };

  const saleBadge = product.tag === "Sale" && product.originalPrice ? (
    <span className="luxe-tag luxe-tag-sale absolute top-3 left-3 z-10">{product.tag}</span>
  ) : null;
  const otherBadge = product.tag && product.tag !== "Sale" ? (
    <span className={`luxe-tag absolute top-3 left-3 z-10 ${product.tag === "New" ? "luxe-tag-new" : "luxe-tag-bestseller"}`}>{product.tag}</span>
  ) : null;

  return (
    <article className="group">
      <Link href={`${prefix}/product/${product.slug}`} className="block relative overflow-hidden rounded-md bg-[#f3f1ea] aspect-[4/5]">
        {saleBadge || otherBadge}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.img}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-105"
        />
        <div className="absolute bottom-3 left-3 right-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <button
            type="button"
            onClick={handleQuickAdd}
            className="w-full luxe-btn-lime text-xs py-3"
          >
            {adding ? "Added ✓" : "Quick add"}
          </button>
        </div>
      </Link>
      <div className="pt-3">
        <div className="luxe-mono text-[10px] text-[#2b2b28]/70 mb-1">{product.category}</div>
        <Link href={`${prefix}/product/${product.slug}`} className="font-display text-base font-medium hover:text-[#0a0a0a]">
          {product.name}
        </Link>
        <div className="mt-1 font-mono text-sm">
          {product.originalPrice ? (
            <>
              <span className="text-[#0a0a0a]">${product.price.toFixed(2)}</span>{" "}
              <span className="text-[#2b2b28]/50 line-through">${product.originalPrice.toFixed(2)}</span>
            </>
          ) : (
            <span className="text-[#0a0a0a]">${product.price.toFixed(2)}</span>
          )}
        </div>
      </div>
    </article>
  );
}
