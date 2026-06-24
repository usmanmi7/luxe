import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ id?: string }>;

export const metadata: Metadata = {
  title: "Order Confirmation",
};

export default async function ConfirmationPage({ searchParams }: { searchParams: SearchParams }) {
  const { id } = await searchParams;
  if (!id) notFound();

  const order = await db.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order) notFound();

  const statusLabel: Record<string, string> = {
    pending: "Awaiting payment",
    pending_cod: "Awaiting fulfillment (COD)",
    pending_bank: "Awaiting bank transfer",
    paid: "Paid",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
    refunded: "Refunded",
  };

  return (
    <div className="luxe-wrap py-16 md:py-24">
      <div className="max-w-2xl mx-auto text-center">
        <div className="w-20 h-20 rounded-full bg-[#D1FE17] flex items-center justify-center mx-auto mb-6">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h1 className="font-display text-5xl font-medium tracking-tight">Order placed</h1>
        <p className="mt-4 text-lg text-[#2b2b28]">
          Thanks for shopping LUXE. A confirmation has been sent to{" "}
          <strong className="text-[#0a0a0a]">{order.email}</strong>.
        </p>
        <p className="mt-2 luxe-mono text-sm text-[#2b2b28]">
          Order #{order.orderNumber}
        </p>

        <div className="mt-4 inline-block luxe-tag">
          Status: {statusLabel[order.status] || order.status}
        </div>
      </div>

      {/* Order details */}
      <div className="max-w-3xl mx-auto mt-12 bg-[#f3f1ea] p-8 rounded-md">
        <h2 className="font-display text-2xl font-medium mb-5">Order details</h2>

        {/* Items */}
        <div className="space-y-4 mb-6">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.img} alt={item.name} className="w-16 h-20 object-cover rounded" />
              <div className="flex-1">
                <div className="font-display font-medium">{item.name}</div>
                {item.variant && <div className="luxe-mono text-[11px] text-[#2b2b28]">{item.variant}</div>}
                <div className="luxe-mono text-sm">Qty: {item.qty}</div>
              </div>
              <div className="font-mono font-bold">${(item.price * item.qty).toFixed(2)}</div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="border-t border-[#e4e1d6] pt-4 space-y-2 font-mono text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>${order.subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Shipping</span><span>${order.shipping.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Tax</span><span>${order.tax.toFixed(2)}</span></div>
          <div className="border-t border-[#e4e1d6] pt-2 mt-2 flex justify-between text-lg font-bold">
            <span>Total</span><span>${order.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Shipping address */}
        <div className="border-t border-[#e4e1d6] mt-6 pt-4">
          <h3 className="luxe-mono text-[11px] text-[#2b2b28] mb-2">SHIPPING TO</h3>
          <p className="text-sm">
            {order.shipFirstName} {order.shipLastName}<br />
            {order.shipAddress}<br />
            {order.shipCity}, {order.shipPostal}<br />
            {order.shipCountry}
            {order.shipPhone && <><br />Phone: {order.shipPhone}</>}
          </p>
        </div>

        {/* Payment instructions */}
        {order.status === "pending_bank" && (
          <div className="border-t border-[#e4e1d6] mt-6 pt-4">
            <h3 className="luxe-mono text-[11px] text-[#2b2b28] mb-2">BANK TRANSFER INSTRUCTIONS</h3>
            <p className="text-sm">
              Please transfer <strong>${order.total.toFixed(2)}</strong> to:<br />
              <span className="font-mono">Bank: Commercial Bank of Ceylon</span><br />
              <span className="font-mono">Account Name: LUXE Cosmetics</span><br />
              <span className="font-mono">Account Number: 8000-123456-001</span><br />
              <span className="font-mono">Branch: Colombo 03</span>
            </p>
            <p className="text-xs text-[#2b2b28] mt-2">
              Email the transfer receipt to orders@luxe.local with order #{order.orderNumber} in the subject. Your order will be held for 3 days.
            </p>
          </div>
        )}

        {order.status === "pending_cod" && (
          <div className="border-t border-[#e4e1d6] mt-6 pt-4">
            <h3 className="luxe-mono text-[11px] text-[#2b2b28] mb-2">CASH ON DELIVERY</h3>
            <p className="text-sm">
              Please have <strong>${order.total.toFixed(2)}</strong> ready in cash. Our delivery partner will call you to confirm the delivery time. Delivery typically takes 2-4 business days.
            </p>
          </div>
        )}

        {order.status === "pending" && (
          <div className="border-t border-[#e4e1d6] mt-6 pt-4">
            <h3 className="luxe-mono text-[11px] text-[#2b2b28] mb-2">PAYMENT</h3>
            <p className="text-sm text-[#E05C2C]">
              ⚠ Online card payment is not yet active. Your order has been saved — our team will contact you to arrange payment, or you can switch to COD / bank transfer by placing a new order.
            </p>
          </div>
        )}
      </div>

      <div className="max-w-2xl mx-auto mt-10 text-center">
        <Link href="/" className="luxe-btn-primary">
          <span>Back to home</span>
        </Link>
      </div>
    </div>
  );
}
