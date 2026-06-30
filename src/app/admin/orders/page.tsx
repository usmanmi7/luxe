import Link from "next/link";
import { db } from "@/lib/db";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Orders" };
export const dynamic = "force-dynamic";

type SearchParams = Promise<{ status?: string }>;

const STATUSES = ["all", "pending", "pending_cod", "pending_bank", "paid", "shipped", "delivered", "cancelled", "refunded"];

export default async function AdminOrdersPage({ searchParams }: { searchParams: SearchParams }) {
  const { status } = await searchParams;
  const activeStatus = status && STATUSES.includes(status) ? status : "all";

  const where = activeStatus === "all" ? {} : { status: activeStatus };
  const orders = await db.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { items: true, user: true },
  });

  const allOrders = await db.order.findMany({ select: { status: true } });
  const statusCounts: Record<string, number> = { all: allOrders.length };
  for (const o of allOrders) {
    statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
  }

  return (
    <div>
      <div className="mb-8">
        <span className="luxe-eyebrow mb-2">Fulfillment</span>
        <h1 className="font-display text-4xl font-medium tracking-tight">Orders</h1>
        <p className="mt-1 text-sm text-[#2b2b28]">{orders.length} orders</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={s === "all" ? "/admin/orders" : `/admin/orders?status=${s}`}
            className={`luxe-mono text-[11px] px-3 py-1.5 rounded-full border transition-all ${
              activeStatus === s ? "bg-[#0a0a0a] text-[#fafaf8] border-[#0a0a0a]" : "bg-white border-[#e4e1d6] hover:border-[#0a0a0a]"
            }`}
          >
            {s.replace(/_/g, " ").toUpperCase()} ({statusCounts[s] || 0})
          </Link>
        ))}
      </div>

      {orders.length === 0 ? (
        <div className="bg-white border border-[#e4e1d6] rounded-md p-12 text-center text-[#2b2b28]">No orders with status "{activeStatus}".</div>
      ) : (
        <div className="bg-white border border-[#e4e1d6] rounded-md overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-[#f3f1ea]">
              <tr className="luxe-mono text-[10px] text-[#2b2b28] text-left">
                <th className="px-4 py-3">ORDER #</th>
                <th className="px-4 py-3">CUSTOMER</th>
                <th className="px-4 py-3">DATE</th>
                <th className="px-4 py-3">ITEMS</th>
                <th className="px-4 py-3">PAYMENT</th>
                <th className="px-4 py-3">STATUS</th>
                <th className="px-4 py-3 text-right">TOTAL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e4e1d6]">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-[#fafaf8]">
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${o.id}`} className="font-mono text-xs font-bold hover:underline">{o.orderNumber}</Link>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm">{o.shipFirstName} {o.shipLastName}</div>
                    <div className="text-[10px] text-[#2b2b28]/60">{o.email}</div>
                    {o.user && <div className="luxe-mono text-[9px] text-[#D1FE17] bg-[#0a0a0a] inline-block px-1.5 py-0.5 rounded mt-1">REGISTERED</div>}
                  </td>
                  <td className="px-4 py-3 luxe-mono text-[11px] text-[#2b2b28]">
                    {o.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    <div className="text-[10px]">{o.createdAt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</div>
                  </td>
                  <td className="px-4 py-3 luxe-mono text-xs">{o.items.length}</td>
                  <td className="px-4 py-3 luxe-mono text-[11px] uppercase">{o.paymentMethod}</td>
                  <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-sm">${o.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    pending_cod: "bg-blue-100 text-blue-800",
    pending_bank: "bg-blue-100 text-blue-800",
    paid: "bg-green-100 text-green-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-200 text-green-900",
    cancelled: "bg-red-100 text-red-800",
    refunded: "bg-gray-200 text-gray-800",
  };
  return (
    <span className={`luxe-mono text-[10px] px-2 py-1 rounded ${colors[status] || "bg-gray-100 text-gray-800"}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}
