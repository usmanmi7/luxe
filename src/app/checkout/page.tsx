"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCart, clearCart, type CartItem } from "@/lib/luxe/cart";
import type { Product } from "@/components/site/product-card";
import { toast } from "@/hooks/use-toast";

type CartLine = CartItem & { product: Product | null };
type PaymentMethod = "card" | "cod" | "bank";

export default function CheckoutPage() {
  const router = useRouter();
  const [lines, setLines] = useState<CartLine[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");

  useEffect(() => {
    const load = async () => {
      const cart = getCart();
      if (cart.length === 0) {
        router.push("/cart");
        return;
      }
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
  }, [router]);

  const subtotal = lines.reduce((s, l) => s + (l.product ? l.product.price * l.qty : 0), 0);
  const shipping = subtotal >= 60 ? 0 : 0;
  const codFee = paymentMethod === "cod" ? 5 : 0;
  const tax = 0;
  const total = subtotal + shipping + codFee + tax;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (lines.length === 0) return;

    const form = new FormData(e.currentTarget);
    const data = Object.fromEntries(form.entries());

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          city: data.city,
          postal: data.postal,
          country: data.country,
          phone: data.phone,
          paymentMethod,
          items: lines.map((l) => ({
            id: l.id,
            name: l.product?.name || "Unknown",
            price: l.product?.price || 0,
            img: l.product?.img || "",
            qty: l.qty,
            variant: l.variant,
          })),
          subtotal,
          shipping,
          codFee,
          tax,
          total,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to place order");
      }

      const { order } = await res.json();
      clearCart();
      toast({ title: "Order placed!", description: `Order #${order.orderNumber}` });
      router.push(`/checkout/confirmation?id=${order.id}`);
    } catch (err) {
      toast({
        title: "Order failed",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      });
      setSubmitting(false);
    }
  };

  if (!loaded) {
    return (
      <div className="luxe-wrap py-20 text-center luxe-mono text-[#2b2b28]">
        Loading checkout…
      </div>
    );
  }

  return (
    <div className="luxe-wrap py-12">
      <div className="mb-10">
        <span className="luxe-eyebrow mb-3">Step 2 of 2</span>
        <h1 className="font-display text-5xl font-medium tracking-tight">Checkout</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-[1.5fr_1fr] gap-10">
        {/* Form fields */}
        <div className="space-y-8">
          {/* Contact */}
          <fieldset>
            <legend className="font-display text-xl font-medium mb-4">Contact</legend>
            <label className="block">
              <span className="luxe-mono text-[11px] text-[#2b2b28]">Email</span>
              <input
                type="email"
                name="email"
                required
                placeholder="you@email.com"
                className="mt-1 w-full bg-transparent border-b-2 border-[#0a0a0a] py-2 outline-none focus:border-[#D1FE17]"
              />
            </label>
          </fieldset>

          {/* Shipping */}
          <fieldset>
            <legend className="font-display text-xl font-medium mb-4">Shipping address</legend>
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="luxe-mono text-[11px] text-[#2b2b28]">First name</span>
                <input name="firstName" required className="mt-1 w-full bg-transparent border-b-2 border-[#0a0a0a] py-2 outline-none focus:border-[#D1FE17]" />
              </label>
              <label className="block">
                <span className="luxe-mono text-[11px] text-[#2b2b28]">Last name</span>
                <input name="lastName" required className="mt-1 w-full bg-transparent border-b-2 border-[#0a0a0a] py-2 outline-none focus:border-[#D1FE17]" />
              </label>
            </div>
            <label className="block mt-4">
              <span className="luxe-mono text-[11px] text-[#2b2b28]">Address</span>
              <input name="address" required placeholder="Street and house number" className="mt-1 w-full bg-transparent border-b-2 border-[#0a0a0a] py-2 outline-none focus:border-[#D1FE17]" />
            </label>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <label className="block">
                <span className="luxe-mono text-[11px] text-[#2b2b28]">City</span>
                <input name="city" required className="mt-1 w-full bg-transparent border-b-2 border-[#0a0a0a] py-2 outline-none focus:border-[#D1FE17]" />
              </label>
              <label className="block">
                <span className="luxe-mono text-[11px] text-[#2b2b28]">Postal code</span>
                <input name="postal" required className="mt-1 w-full bg-transparent border-b-2 border-[#0a0a0a] py-2 outline-none focus:border-[#D1FE17]" />
              </label>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <label className="block">
                <span className="luxe-mono text-[11px] text-[#2b2b28]">Country</span>
                <input name="country" required defaultValue="Sri Lanka" className="mt-1 w-full bg-transparent border-b-2 border-[#0a0a0a] py-2 outline-none focus:border-[#D1FE17]" />
              </label>
              <label className="block">
                <span className="luxe-mono text-[11px] text-[#2b2b28]">Phone</span>
                <input name="phone" type="tel" placeholder="+94 ..." className="mt-1 w-full bg-transparent border-b-2 border-[#0a0a0a] py-2 outline-none focus:border-[#D1FE17]" />
              </label>
            </div>
          </fieldset>

          {/* Payment method */}
          <fieldset>
            <legend className="font-display text-xl font-medium mb-4">Payment method</legend>
            <div className="space-y-3">
              <label className={`flex items-start gap-3 p-4 border-2 rounded-md cursor-pointer transition-all ${paymentMethod === "card" ? "border-[#0a0a0a] bg-[#f3f1ea]" : "border-[#e4e1d6] hover:border-[#0a0a0a]/50"}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="font-display font-medium">💳 Card payment <span className="luxe-tag luxe-tag-new ml-2">Phase 2</span></div>
                  <p className="text-sm text-[#2b2b28] mt-1">PayHere-hosted checkout — Visa, Master, Amex, eZ Cash, mCash. <strong>Not yet active</strong> — order will be saved as pending.</p>
                </div>
              </label>

              <label className={`flex items-start gap-3 p-4 border-2 rounded-md cursor-pointer transition-all ${paymentMethod === "cod" ? "border-[#0a0a0a] bg-[#f3f1ea]" : "border-[#e4e1d6] hover:border-[#0a0a0a]/50"}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="font-display font-medium">🚚 Cash on Delivery <span className="luxe-mono text-[10px] text-[#2b2b28] ml-2">+ $5.00 fee</span></div>
                  <p className="text-sm text-[#2b2b28] mt-1">Pay in cash when your order arrives. Available island-wide in Sri Lanka.</p>
                </div>
              </label>

              <label className={`flex items-start gap-3 p-4 border-2 rounded-md cursor-pointer transition-all ${paymentMethod === "bank" ? "border-[#0a0a0a] bg-[#f3f1ea]" : "border-[#e4e1d6] hover:border-[#0a0a0a]/50"}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bank"
                  checked={paymentMethod === "bank"}
                  onChange={() => setPaymentMethod("bank")}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="font-display font-medium">🏦 Bank transfer</div>
                  <p className="text-sm text-[#2b2b28] mt-1">Manual bank deposit/transfer. We'll email you bank details and hold your order for 3 days.</p>
                </div>
              </label>
            </div>
          </fieldset>

          <div className="flex items-center justify-between">
            <Link href="/cart" className="luxe-btn-ghost">← Back to bag</Link>
            <button
              type="submit"
              disabled={submitting}
              className="luxe-btn-primary disabled:opacity-50"
            >
              <span>{submitting ? "Placing order…" : `Place order — $${total.toFixed(2)}`}</span>
            </button>
          </div>
        </div>

        {/* Summary */}
        <aside className="md:sticky md:top-24 h-fit bg-[#f3f1ea] p-7 rounded-md">
          <h2 className="font-display text-2xl font-medium mb-5">Order summary</h2>
          <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
            {lines.map((l) => (
              <div key={l.key} className="flex gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <div className="relative flex-shrink-0">
                  <img src={l.product?.img} alt={l.product?.name || ""} className="w-14 h-16 object-cover rounded" />
                  <span className="absolute -top-1 -right-1 bg-[#0a0a0a] text-[#fafaf8] font-mono text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                    {l.qty}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-display text-sm font-medium truncate">{l.product?.name}</div>
                  {l.variant && <div className="luxe-mono text-[10px] text-[#2b2b28]">{l.variant}</div>}
                  <div className="font-mono text-sm">${((l.product?.price || 0) * l.qty).toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-[#e4e1d6] pt-4 space-y-2 font-mono text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span></div>
            {codFee > 0 && <div className="flex justify-between"><span>COD fee</span><span>${codFee.toFixed(2)}</span></div>}
            <div className="flex justify-between"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
            <div className="border-t border-[#e4e1d6] pt-2 mt-2 flex justify-between text-lg font-bold">
              <span>Total</span><span>${total.toFixed(2)}</span>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}
