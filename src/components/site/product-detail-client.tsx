"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import { addToCart } from "@/lib/luxe/cart";
import { ProductCard, type Product } from "./product-card";

type Review = { id: string; name: string; rating: number; text: string };

type FullProduct = {
  id: string; slug: string; name: string; category: string;
  price: number; originalPrice: number | null;
  img: string; gallery: string[];
  desc: string; longDesc: string; ingredients: string;
  tag: string | null; shades: string[]; sizes: string[];
  rating: number; reviewCount: number; stock: number;
  reviews: Review[];
};

const SHADE_COLORS: Record<string, string> = {
  "Acid": "#D1FE17", "Ember": "#E05C2C", "Slate": "#6B7280", "Nude 01": "#D4A89A",
  "Nude 02": "#C4917F", "Black Cherry": "#3D0C0C", "Porcelain": "#F9F0E8",
  "Ivory": "#EEE4D2", "Sand": "#D4B896", "Warm Beige": "#C8956C", "Golden": "#B8763A",
  "Caramel": "#8B5E3C", "Mahogany": "#5C3317", "Espresso": "#2C1408",
  "Translucent": "#F0EEE8", "Soft Matte": "#E8E0D4", "Luminous": "#F5E8C0",
  "Charcoal Black": "#1a1a1a", "Deep Brown": "#4A2C1A",
  "Solar Gold": "#FFD700", "Champagne": "#F7E7CE", "Rose Aurora": "#F4A0B0",
  "Clear": "rgba(255,255,255,0.3)", "Baby Pink": "#FBBFD1", "Rose": "#E8829A",
  "Mauve": "#B77A8E", "Berry": "#7B3F5E", "Nude": "#C9947A", "Peach": "#FFAA80", "Red": "#CC2200",
};

function renderStars(rating: number): string {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  let s = "";
  for (let i = 0; i < full; i++) s += "★";
  if (half) s += "½";
  for (let i = full + (half ? 1 : 0); i < 5; i++) s += "☆";
  return s;
}

export function ProductDetailClient({
  product,
  related,
}: {
  product: FullProduct;
  related: Product[];
}) {
  const [activeImg, setActiveImg] = useState(0);
  const [selectedShade, setSelectedShade] = useState<string | null>(
    product.shades.length > 0 ? product.shades[0] : null
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(
    product.sizes.length > 0 ? product.sizes[0] : null
  );
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "ingredients" | "reviews">("details");

  const handleAdd = () => {
    const variant = selectedShade || selectedSize || null;
    addToCart(product.id, qty, variant);
    setAdded(true);
    toast({ title: "Added to bag ✓", description: `${product.name}${variant ? ` · ${variant}` : ""} × ${qty}` });
    setTimeout(() => setAdded(false), 2500);
  };

  const savingsPct = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const badgeClass = product.tag === "Sale" ? "luxe-tag-sale" : product.tag === "New" ? "luxe-tag-new" : "luxe-tag-bestseller";

  return (
    <>
      {/* Gallery */}
      <div className="flex flex-col-reverse md:flex-row gap-4">
        {/* Thumbnails */}
        <div className="flex md:flex-col gap-3 overflow-x-auto md:max-h-[600px] md:overflow-y-auto">
          {product.gallery.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveImg(i)}
              className={`flex-shrink-0 w-16 h-20 md:w-20 md:h-24 rounded overflow-hidden border-2 transition-all ${
                activeImg === i ? "border-[#0a0a0a]" : "border-transparent opacity-60 hover:opacity-100"
              }`}
              aria-label={`View image ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src.replace("w=900", "w=200")} alt={`${product.name} view ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
        {/* Main image */}
        <div className="flex-1 relative">
          {product.tag && (
            <span className={`luxe-tag ${badgeClass} absolute top-3 left-3 z-10`}>{product.tag}</span>
          )}
          <div className="aspect-[4/5] rounded-md overflow-hidden bg-[#f3f1ea]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={product.gallery[activeImg]} alt={product.name} className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* Info panel */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <span className="luxe-mono text-[#2b2b28]">{product.category}</span>
          {product.tag && <span className={`luxe-tag ${badgeClass}`}>{product.tag}</span>}
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-medium leading-[1.05] tracking-tight">
          {product.name}
        </h1>

        {/* Rating */}
        <div className="mt-3 flex items-center gap-2 text-sm">
          <span className="text-[#D1FE17] text-lg" aria-label={`${product.rating} stars`}>{renderStars(product.rating)}</span>
          <span className="font-mono">{product.rating}</span>
          <span className="text-[#2b2b28]/70">({product.reviewCount.toLocaleString()} reviews)</span>
        </div>

        {/* Price */}
        <div className="mt-5 flex items-baseline gap-3">
          <span className="font-mono text-2xl font-bold">${product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <>
              <span className="font-mono text-lg text-[#2b2b28]/50 line-through">${product.originalPrice.toFixed(2)}</span>
              <span className="luxe-tag luxe-tag-sale">Save {savingsPct}%</span>
            </>
          )}
        </div>

        <p className="mt-5 text-[#2b2b28] leading-relaxed">{product.desc}</p>

        {/* Shade picker */}
        {product.shades.length > 0 && (
          <div className="mt-7">
            <div className="luxe-mono mb-3">
              Shade: <strong className="text-[#0a0a0a]">{selectedShade}</strong>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.shades.map((shade) => {
                const hex = SHADE_COLORS[shade] || "#ccc";
                return (
                  <button
                    key={shade}
                    type="button"
                    onClick={() => setSelectedShade(shade)}
                    title={shade}
                    aria-label={shade}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      selectedShade === shade ? "border-[#0a0a0a] scale-110" : "border-[#e4e1d6] hover:border-[#0a0a0a]/50"
                    }`}
                    style={{
                      background: hex,
                      borderColor: selectedShade === shade ? "#0a0a0a" : (hex === "#F9F0E8" || hex === "rgba(255,255,255,0.3)" ? "#ccc" : hex),
                    }}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Size picker */}
        {product.sizes.length > 0 && (
          <div className="mt-7">
            <div className="luxe-mono mb-3">
              Size: <strong className="text-[#0a0a0a]">{selectedSize}</strong>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`luxe-mono px-4 py-2 rounded border-2 transition-all ${
                    selectedSize === size
                      ? "bg-[#0a0a0a] text-[#fafaf8] border-[#0a0a0a]"
                      : "bg-transparent text-[#0a0a0a] border-[#e4e1d6] hover:border-[#0a0a0a]"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Stock indicator */}
        <div className="mt-5 luxe-mono text-sm">
          {product.stock === 0 ? (
            <span className="text-[#E05C2C] font-medium">Out of stock</span>
          ) : product.stock <= 5 ? (
            <span className="text-[#E05C2C] font-medium">Only {product.stock} left in stock</span>
          ) : product.stock <= 10 ? (
            <span className="text-[#D97706]">Low stock: {product.stock} available</span>
          ) : (
            <span className="text-[#2b2b28]/70">In stock: {product.stock} available</span>
          )}
        </div>

        {/* Qty + Add to bag */}
        <div className="mt-7 flex items-center gap-3">
          <div className="flex items-center border-2 border-[#0a0a0a] rounded-full">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="w-10 h-12 text-xl hover:bg-[#f3f1ea] rounded-l-full"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <input
              type="number"
              value={qty}
              min={1}
              max={99}
              onChange={(e) => setQty(Math.max(1, Math.min(99, parseInt(e.target.value) || 1)))}
              className="w-12 h-12 text-center bg-transparent outline-none font-mono [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              aria-label="Quantity"
            />
            <button
              type="button"
              onClick={() => setQty((q) => Math.min(99, q + 1))}
              className="w-10 h-12 text-xl hover:bg-[#f3f1ea] rounded-r-full"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            disabled={product.stock === 0}
            className="luxe-btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>
              {added ? "Added to bag! ✓" : product.stock === 0 ? "Out of stock" : "Add to bag"}
            </span>
          </button>
        </div>

        {/* Perks */}
        <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 luxe-mono text-[11px] text-[#2b2b28]">
          <span>🚚 Free shipping $60+</span>
          <span>↩ 30-day returns</span>
          <span>🧪 Dermatologist tested</span>
        </div>

        {/* Tabs */}
        <div className="mt-10 border-t border-[#e4e1d6] pt-6">
          <div className="flex gap-6 mb-4">
            {(["details", "ingredients", "reviews"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`luxe-mono pb-2 border-b-2 transition-all ${
                  activeTab === tab
                    ? "border-[#0a0a0a] text-[#0a0a0a]"
                    : "border-transparent text-[#2b2b28]/60 hover:text-[#0a0a0a]"
                }`}
              >
                {tab === "reviews" ? `Reviews (${product.reviewCount})` : tab}
              </button>
            ))}
          </div>
          <div className="text-[#2b2b28] leading-relaxed">
            {activeTab === "details" && <p>{product.longDesc}</p>}
            {activeTab === "ingredients" && <p className="font-mono text-sm">{product.ingredients}</p>}
            {activeTab === "reviews" && (
              <div className="space-y-5">
                {product.reviews.length === 0 ? (
                  <p className="text-[#2b2b28]/60">No reviews yet.</p>
                ) : (
                  product.reviews.map((r) => (
                    <div key={r.id} className="border-b border-[#e4e1d6] pb-4">
                      <div className="flex items-center justify-between mb-1">
                        <strong className="font-display">{r.name}</strong>
                        <span className="text-[#D1FE17]">{renderStars(r.rating)}</span>
                      </div>
                      <p className="text-sm">"{r.text}"</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div className="md:col-span-2 mt-16">
          <div className="luxe-wrap">
            <div className="flex items-end justify-between mb-8">
              <h2 className="font-display text-3xl font-medium">You might also like</h2>
              <Link href="/shop" className="luxe-btn-ghost">View all</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
