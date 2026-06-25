"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";

export type ProductFormData = {
  name: string; category: string; price: string; originalPrice: string;
  img: string; gallery: string; desc: string; longDesc: string;
  ingredients: string; tag: string; shades: string; sizes: string;
  stock: string; active: boolean; notifySubscribers: boolean;
};

const EMPTY: ProductFormData = {
  name: "", category: "Skincare", price: "", originalPrice: "",
  img: "", gallery: "", desc: "", longDesc: "", ingredients: "",
  tag: "", shades: "", sizes: "", stock: "100", active: true,
  notifySubscribers: false,
};

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function ProductForm({ initial, productId }: { initial?: ProductFormData; productId?: string }) {
  const router = useRouter();
  const [form, setForm] = useState<ProductFormData>(initial || EMPTY);
  const [saving, setSaving] = useState(false);
  const isEdit = Boolean(productId);

  const update = (field: keyof ProductFormData, value: string | boolean) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const gallery = form.gallery.split("\n").map((s) => s.trim()).filter(Boolean);
    if (gallery.length === 0 && form.img) gallery.push(form.img);

    const payload = {
      name: form.name.trim(),
      slug: slugify(form.name),
      category: form.category,
      price: parseFloat(form.price) || 0,
      originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : null,
      img: form.img.trim(),
      gallery,
      desc: form.desc.trim(),
      longDesc: form.longDesc.trim(),
      ingredients: form.ingredients.trim(),
      tag: form.tag.trim() || null,
      shades: form.shades.split(",").map((s) => s.trim()).filter(Boolean),
      sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
      stock: parseInt(form.stock) || 0,
      active: form.active,
      notifySubscribers: form.notifySubscribers,
    };

    if (!payload.name || !payload.img || payload.price <= 0) {
      toast({ title: "Missing fields", description: "Name, image URL, and price are required", variant: "destructive" });
      setSaving(false);
      return;
    }

    try {
      const url = isEdit ? `/api/admin/products/${productId}` : "/api/admin/products";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Save failed");
      }
      const { product } = await res.json();
      toast({ title: isEdit ? "Product updated" : "Product created", description: product.name });
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      toast({ title: "Save failed", description: err instanceof Error ? err.message : "Unknown error", variant: "destructive" });
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="grid md:grid-cols-2 gap-5">
        <Field label="Name *">
          <input type="text" required value={form.name} onChange={(e) => update("name", e.target.value)} className="luxe-input" placeholder="Velvet Lift Serum" />
        </Field>
        <Field label="Category">
          <select value={form.category} onChange={(e) => update("category", e.target.value)} className="luxe-input">
            <option value="Skincare">Skincare</option>
            <option value="Makeup">Makeup</option>
          </select>
        </Field>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        <Field label="Price (USD) *">
          <input type="number" step="0.01" required value={form.price} onChange={(e) => update("price", e.target.value)} className="luxe-input" placeholder="58.00" />
        </Field>
        <Field label="Original price (optional, for sale)">
          <input type="number" step="0.01" value={form.originalPrice} onChange={(e) => update("originalPrice", e.target.value)} className="luxe-input" placeholder="72.00" />
        </Field>
        <Field label="Stock">
          <input type="number" required value={form.stock} onChange={(e) => update("stock", e.target.value)} className="luxe-input" placeholder="100" />
        </Field>
      </div>

      <Field label="Main image URL *">
        <input type="url" required value={form.img} onChange={(e) => update("img", e.target.value)} className="luxe-input" placeholder="/products/your-image.png" />
      </Field>

      <Field label="Gallery image URLs (one per line)" hint="If empty, the main image is used. Recommended 3 images.">
        <textarea rows={3} value={form.gallery} onChange={(e) => update("gallery", e.target.value)} className="luxe-input resize-none" placeholder={"/products/img1.png\n/products/img2.png\n/products/img3.png"} />
      </Field>

      <Field label="Short description *">
        <textarea rows={2} required value={form.desc} onChange={(e) => update("desc", e.target.value)} className="luxe-input resize-none" placeholder="A weightless vitamin C serum that brightens and firms." />
      </Field>

      <Field label="Long description">
        <textarea rows={5} value={form.longDesc} onChange={(e) => update("longDesc", e.target.value)} className="luxe-input resize-none" placeholder="Formulated with 15% L-Ascorbic Acid at a pH of 3.5..." />
      </Field>

      <Field label="Ingredients">
        <textarea rows={3} value={form.ingredients} onChange={(e) => update("ingredients", e.target.value)} className="luxe-input resize-none font-mono text-xs" placeholder="Aqua, Ascorbic Acid 15%, Niacinamide 5%, ..." />
      </Field>

      <div className="grid md:grid-cols-2 gap-5">
        <Field label="Tag (optional)" hint="One of: Sale, New, Bestseller, or leave blank">
          <select value={form.tag} onChange={(e) => update("tag", e.target.value)} className="luxe-input">
            <option value="">None</option>
            <option value="Sale">Sale</option>
            <option value="New">New</option>
            <option value="Bestseller">Bestseller</option>
          </select>
        </Field>
        <Field label="Status">
          <label className="flex items-center gap-2 py-2">
            <input type="checkbox" checked={form.active} onChange={(e) => update("active", e.target.checked)} className="w-4 h-4" />
            <span className="text-sm">Active (visible on storefront)</span>
          </label>
        </Field>
      </div>

      {/* Newsletter notification — only on new products, not edit */}
      {!isEdit && (
        <div className="bg-[#D1FE17]/10 border border-[#D1FE17]/30 rounded-md p-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.notifySubscribers}
              onChange={(e) => update("notifySubscribers", e.target.checked)}
              className="w-4 h-4 mt-0.5"
            />
            <div>
              <div className="font-display text-sm font-medium">✉️ Notify all subscribers about this new product</div>
              <p className="text-xs text-[#2b2b28] mt-1">
                When checked, every confirmed subscriber will receive a branded "New product launched" email with the product image, name, price, and a "Shop now" button.
                Each email includes a one-click unsubscribe link (CAN-SPAM compliant).
              </p>
            </div>
          </label>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-5">
        <Field label="Shades (comma-separated)" hint="e.g. Acid, Ember, Slate">
          <input type="text" value={form.shades} onChange={(e) => update("shades", e.target.value)} className="luxe-input" placeholder="Acid, Ember, Slate" />
        </Field>
        <Field label="Sizes (comma-separated)" hint="e.g. 15ml, 30ml, 50ml">
          <input type="text" value={form.sizes} onChange={(e) => update("sizes", e.target.value)} className="luxe-input" placeholder="15ml, 30ml, 50ml" />
        </Field>
      </div>

      <div className="flex items-center gap-3 pt-6 border-t border-[#e4e1d6]">
        <button type="submit" disabled={saving} className="luxe-btn-primary disabled:opacity-50">
          <span>{saving ? "Saving…" : isEdit ? "Save changes" : "Create product"}</span>
        </button>
        <Link href="/admin/products" className="luxe-btn-ghost">Cancel</Link>
      </div>

      <style>{`
        .luxe-input {
          width: 100%;
          background: white;
          border: 1.5px solid #e4e1d6;
          border-radius: 6px;
          padding: 10px 14px;
          font-family: inherit;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
        }
        .luxe-input:focus { border-color: #0a0a0a; }
      `}</style>
    </form>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="luxe-mono text-[11px] text-[#2b2b28]">{label}</span>
      {hint && <span className="block text-[10px] text-[#2b2b28]/60 mt-0.5">{hint}</span>}
      <div className="mt-1">{children}</div>
    </label>
  );
}
