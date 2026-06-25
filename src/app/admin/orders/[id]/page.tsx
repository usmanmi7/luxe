import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { OrderStatusUpdater } from "@/components/admin/order-status-updater";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

export default async function AdminOrderDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const order = await db.order.findUnique({
    where: { id },
    include: { items: true, user: true },
  });

  if (!order) notFound();

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/orders" className="luxe-btn-ghost">← All orders</Link>
      </div>

      <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
        <div>
          <span className="luxe-eyebrow mb-2">Order</span>
          <h1 className="font-display text-3xl font-medium tracking-tight">{order.orderNumber}</h1>
          <p className="mt-1 text-sm text-[#2b2b28]">Placed {order.createdAt.toLocaleString("en-US", { dateStyle: "long", timeStyle: "short" })}</p>
        </div>
        <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
      </div>

      <div className="grid md:grid-cols-[1.5fr_1fr] gap-8">
        <div className="bg-white border border-[#e4e1d6] rounded-md p-6">
          <h2 className="font-display text-xl font-medium mb-4">Items ({order.items.length})</h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-4 pb-4 border-b border-[#e4e1d6] last:border-0 last:pb-0">
                <img src={item.img} alt={item.name} className="w-16 h-20 object-cover rounded" />
                <div className="flex-1">
                  <div className="font-display font-medium">{item.name}</div>
                  {item.variant && <div className="luxe-mono text-[11px] text-[#2b2b28]">{item.variant}</div>}
                  <div className="luxe-mono text-xs text-[#2b2b28]">Qty: {item.qty} × ${item.price.toFixed(2)}</div>
                </div>
                <div className="font-mono font-bold">${(item.price * item.qty).toFixed(2)}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-[#e4e1d6] space-y-2 font-mono text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>${order.subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>${order.shipping.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Tax</span><span>${order.tax.toFixed(2)}</span></div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-[#e4e1d6]">
              <span>Total</span><span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-[#e4e1d6] rounded-md p-6">
            <h3 className="luxe-mono text-[11px] text-[#2b2b28] mb-3">CUSTOMER</h3>
            {order.user ? (
              <>
                <div className="font-display font-medium">{order.user.name || "(no name)"}</div>
                <div className="text-sm text-[#2b2b28]">{order.user.email}</div>
                <div className="luxe-mono text-[10px] text-[#2b2b28] mt-2">Member since {order.user.createdAt.toLocaleDateString("en-US", { month: "short", year: "numeric" })}</div>
              </>
            ) : (
              <>
                <div className="text-sm">Guest checkout</div>
                <div className="text-sm text-[#2b2b28]">{order.email}</div>
              </>
            )}
          </div>

          <div className="bg-white border border-[#e4e1d6] rounded-md p-6">
            <h3 className="luxe-mono text-[11px] text-[#2b2b28] mb-3">SHIPPING ADDRESS</h3>
            <p className="text-sm leading-relaxed">
              {order.shipFirstName} {order.shipLastName}<br />
              {order.shipAddress}<br />
              {order.shipCity}, {order.shipPostal}<br />
              {order.shipCountry}
              {order.shipPhone && <><br /><span className="text-[#2b2b28]">Phone: {order.shipPhone}</span></>}
            </p>
          </div>

          <div className="bg-white border border-[#e4e1d6] rounded-md p-6">
            <h3 className="luxe-mono text-[11px] text-[#2b2b28] mb-3">PAYMENT</h3>
            <div className="luxe-mono text-xs uppercase">{order.paymentMethod}</div>
            {order.paymentRef && <div className="luxe-mono text-[10px] text-[#2b2b28] mt-2">Ref: {order.paymentRef}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
