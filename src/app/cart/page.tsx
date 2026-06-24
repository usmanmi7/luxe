"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCart, setQty, removeFromCart, clearCart, type CartItem } from "@/lib/luxe/cart";
import { toast } from "@/hooks/use-toast";
import type { Product } from "@/components/site/product-card";

type CartLine = CartItem & { product: Product | null };

export default function CartPage() {
  const router = useRouter();
  const [lines, setLines] = useState<CartLine[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      const cart = getCart();
      // Fetch all products in parallel
      const lines: CartLine[] = await Promise.all(
        cart.map(async (item) => {
          const res = await fetch(`/api/products/${item.id}`);
          const product = res.ok ? ((await res.json()).product as Product) : null;
          return { ...item, product };
        })
      );
      setLines(lines);
      setLoaded(true);
    };
    load();
    const onChange = () => load();
    window.addEventListener("luxe:cart-changed", onChange);
    return () => window.removeEventListener("luxe:cart-changed", onChange);
  }, []);

  const subtotal = lines.reduce((s, l) => s + (l.product ? l.product.price * l.qty : 0), 0);
  const shipping = subtotal >= 60 ? 0 : 0; // free for now; will compute properly in Phase 2
  const tax = 0; // demo store
  const total = subtotal + shipping + tax;

  const updateQty = (key: string, qty: number) => {
    setQty(key, qty);
  };
  const remove = (key: string, name: string) => {
    removeFromCart(key);
    toast({ title: "Removed from bag", description: name });
  };

  if (!loaded) {
    return (
      <div className="luxe-wrap py-20 text-center luxe-mono text-[#2b2b28]">
        Loading cart…
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="luxe-wrap py-24 text-center">
        <h1 className="font-display text-5xl font-medium mb-4">Your bag is empty</h1>
        <p className="text-[#2b2b28] mb-8">Looks like you haven't added anything yet. Let's fix that.</p>
        <Link href="/shop" className="luxe-btn-primary">
          <span>Browse products</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="luxe-wrap py-12">
      <div className="mb-10">
        <span className="luxe-eyebrow mb-3">Step 1 of 2</span>
        <h1 className="font-display text-5xl font-medium tracking-tight">Your bag</h1>
      </div>

      <div className="grid md:grid-cols-[1.5fr_1fr] gap-10">
        {/* Cart items */}
        <div className="divide-y divide-[#e4e1d6]">
          {lines.map((line) => (
            <div key={line.key} className="py-6 flex gap-5">
              <Link
                href={line.product ? `/product/${line.product.slug}` : "#"}
                className="flex-shrink-0 w-24 h-32 rounded-md overflow-hidden bg-[#f3f1ea]"
              >
                {line.product && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={line.product.img} alt={line.product.name} className="w-full h-full object-cover" />
                )}
              </Link>
              <div className="flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="luxe-mono text-[10px] text-[#2b2b28]/70 mb-1">
                      {line.product?.category}
                    </div>
                    <Link
                      href={line.product ? `/product/${line.product.slug}` : "#"}
                      className="font-display text-lg font-medium hover:underline"
                    >
                      {line.product?.name || "(product not found)"}
                    </Link>
                    {line.variant && (
                      <div className="luxe-mono text-[11px] text-[#2b2b28] mt-1">{line.variant}</div>
                    )}
                  </div>
                  <div className="font-mono font-bold">
                    ${((line.product?.price || 0) * line.qty).toFixed(2)}
                  </div>
                </div>
                <div className="mt-auto flex items-center gap-4 pt-3">
                  <div className="flex items-center border-2 border-[#0a0a0a] rounded-full">
                    <button
                      type="button"
                      onClick={() => updateQty(line.key, line.qty - 1)}
                      className="w-8 h-9 hover:bg-[#f3f1ea] rounded-l-full"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="w-10 text-center font-mono text-sm">{line.qty}</span>
                    <button
                      type="button"
                      onClick={() => updateQty(line.key, line.qty + 1)}
                      className="w-8 h-9 hover:bg-[#f3f1ea] rounded-r-full"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(line.key, line.product?.name || "Item")}
                    className="luxe-mono text-[11px] text-[#2b2b28] hover:text-[#E05C2C] underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="pt-6 flex justify-between">
            <Link href="/shop" className="luxe-btn-ghost">← Continue shopping</Link>
            <button
              type="button"
              onClick={() => {
                if (confirm("Clear all items from your bag?")) {
                  clearCart();
                  toast({ title: "Bag cleared" });
                }
              }}
              className="luxe-mono text-[11px] text-[#2b2b28] hover:text-[#E05C2C] underline"
            >
              Clear bag
            </button>
          </div>
        </div>

        {/* Order summary */}
        <aside className="md:sticky md:top-24 h-fit bg-[#f3f1ea] p-7 rounded-md">
          <h2 className="font-display text-2xl font-medium mb-5">Order summary</h2>
          <div className="space-y-3 font-mono text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="border-t border-[#e4e1d6] pt-3 mt-3 flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => router.push("/checkout")}
            className="luxe-btn-primary w-full mt-6"
          >
            <span>Proceed to checkout</span>
          </button>
          <p className="luxe-mono text-[10px] text-[#2b2b28]/70 text-center mt-3">
            🔒 Secure checkout · Free returns within 30 days
          </p>
        </aside>
      </div>
    </div>
  );
}
