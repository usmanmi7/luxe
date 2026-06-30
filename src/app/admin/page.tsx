import Link from "next/link";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [totalProducts, lowStockProducts, totalOrders, pendingOrders, paidOrders, totalUsers, newUsersThisWeek, todayOrders] = await Promise.all([
    db.product.count({ where: { active: true } }),
    db.product.findMany({ where: { active: true, stock: { lte: 10 } }, orderBy: { stock: "asc" }, take: 5 }),
    db.order.count(),
    db.order.count({ where: { status: { in: ["pending", "pending_cod", "pending_bank"] } } }),
    db.order.count({ where: { status: "paid" } }),
    db.user.count(),
    db.user.count({ where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } }),
    db.order.count({ where: { createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } } }),
  ]);

  const revenueRows = await db.order.aggregate({ _sum: { total: true }, where: { status: { notIn: ["cancelled", "refunded"] } } });
  const totalRevenue = revenueRows._sum.total || 0;

  const recentOrders = await db.order.findMany({ orderBy: { createdAt: "desc" }, take: 6, include: { items: true } });

  const last7Days: { date: string; revenue: number; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const dayStart = new Date(new Date().setHours(0, 0, 0, 0));
    dayStart.setDate(dayStart.getDate() - i);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);
    const rows = await db.order.findMany({ where: { createdAt: { gte: dayStart, lt: dayEnd }, status: { notIn: ["cancelled", "refunded"] } }, select: { total: true } });
    last7Days.push({ date: dayStart.toLocaleDateString("en-US", { weekday: "short" }), revenue: rows.reduce((s, r) => s + r.total, 0), count: rows.length });
  }
  const maxRevenue = Math.max(...last7Days.map((d) => d.revenue), 1);

  return (
    <div>
      <div className="mb-8">
        <span className="luxe-eyebrow mb-2">Overview</span>
        <h1 className="font-display text-4xl font-medium tracking-tight">Dashboard</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <KpiCard label="TOTAL REVENUE" value={`$${totalRevenue.toFixed(2)}`} accent />
        <KpiCard label="ORDERS" value={String(totalOrders)} sublabel={`${todayOrders} today`} />
        <KpiCard label="USERS" value={String(totalUsers)} sublabel={`${newUsersThisWeek} this week`} />
        <KpiCard label="PRODUCTS" value={String(totalProducts)} sublabel={`${lowStockProducts.length} low stock`} />
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-10">
        <div className="bg-white border border-[#e4e1d6] rounded-md p-6">
          <h2 className="font-display text-xl font-medium mb-4">Revenue · last 7 days</h2>
          <div className="flex items-end justify-between gap-2 h-40">
            {last7Days.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-[#f3f1ea] rounded-t-sm relative" style={{ height: "100%" }}>
                  <div className="absolute bottom-0 left-0 right-0 bg-[#D1FE17] rounded-t-sm transition-all" style={{ height: `${(d.revenue / maxRevenue) * 100}%` }} title={`$${d.revenue.toFixed(2)} · ${d.count} orders`} />
                </div>
                <div className="luxe-mono text-[10px] text-[#2b2b28]">{d.date}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-[#e4e1d6] flex justify-between luxe-mono text-xs">
            <span className="text-[#2b2b28]">7-DAY TOTAL</span>
            <span className="font-bold">${last7Days.reduce((s, d) => s + d.revenue, 0).toFixed(2)}</span>
          </div>
        </div>

        <div className="bg-white border border-[#e4e1d6] rounded-md p-6">
          <h2 className="font-display text-xl font-medium mb-4">Order status</h2>
          <div className="space-y-3">
            <StatusBar label="Pending / COD / Bank" count={pendingOrders} total={totalOrders} color="bg-yellow-400" />
            <StatusBar label="Paid" count={paidOrders} total={totalOrders} color="bg-green-400" />
            <StatusBar label="Other" count={Math.max(0, totalOrders - pendingOrders - paidOrders)} total={totalOrders} color="bg-gray-400" />
          </div>
          <Link href="/admin/orders" className="luxe-btn-ghost mt-6 inline-block">View all orders →</Link>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white border border-[#e4e1d6] rounded-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-medium">Low stock alerts</h2>
            <Link href="/admin/products" className="luxe-mono text-xs text-[#2b2b28] hover:text-[#0a0a0a]">MANAGE →</Link>
          </div>
          {lowStockProducts.length === 0 ? (
            <p className="text-sm text-[#2b2b28]">All products are well-stocked.</p>
          ) : (
            <ul className="space-y-3">
              {lowStockProducts.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3">
                  <Link href={`/admin/products/${p.id}/edit`} className="flex items-center gap-3 hover:underline">
                    <img src={p.img} alt={p.name} className="w-10 h-12 object-cover rounded" />
                    <div>
                      <div className="font-display text-sm font-medium">{p.name}</div>
                      <div className="luxe-mono text-[10px] text-[#2b2b28]">{p.category}</div>
                    </div>
                  </Link>
                  <span className={`luxe-mono text-xs px-2 py-1 rounded ${p.stock === 0 ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}`}>{p.stock} left</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white border border-[#e4e1d6] rounded-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-medium">Recent orders</h2>
            <Link href="/admin/orders" className="luxe-mono text-xs text-[#2b2b28] hover:text-[#0a0a0a]">VIEW ALL →</Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-[#2b2b28]">No orders yet.</p>
          ) : (
            <ul className="space-y-3">
              {recentOrders.map((o) => (
                <li key={o.id}>
                  <Link href={`/admin/orders/${o.id}`} className="flex items-center justify-between gap-3 hover:underline">
                    <div>
                      <div className="font-mono text-xs font-bold">{o.orderNumber}</div>
                      <div className="text-xs text-[#2b2b28]">{o.shipFirstName} {o.shipLastName} · {o.items.length} item{o.items.length === 1 ? "" : "s"}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-sm">${o.total.toFixed(2)}</div>
                      <div className="luxe-mono text-[10px] text-[#2b2b28]">{o.status.replace(/_/g, " ")}</div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function KpiCard({ label, value, sublabel, accent }: { label: string; value: string; sublabel?: string; accent?: boolean }) {
  return (
    <div className={`p-5 rounded-md ${accent ? "bg-[#0a0a0a] text-[#fafaf8]" : "bg-white border border-[#e4e1d6]"}`}>
      <div className={`luxe-mono text-[10px] ${accent ? "text-[#D1FE17]" : "text-[#2b2b28]"}`}>{label}</div>
      <div className="font-display text-3xl font-medium mt-1">{value}</div>
      {sublabel && <div className={`luxe-mono text-[10px] mt-1 ${accent ? "text-white/60" : "text-[#2b2b28]/70"}`}>{sublabel}</div>}
    </div>
  );
}

function StatusBar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between luxe-mono text-[11px] text-[#2b2b28] mb-1">
        <span>{label}</span>
        <span>{count} ({pct}%)</span>
      </div>
      <div className="h-2 bg-[#f3f1ea] rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
