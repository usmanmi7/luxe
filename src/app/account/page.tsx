import Link from "next/link";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account",
};

export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: "Awaiting payment", color: "bg-yellow-100 text-yellow-800" },
  pending_cod: { label: "COD - Awaiting fulfillment", color: "bg-blue-100 text-blue-800" },
  pending_bank: { label: "Bank transfer - pending", color: "bg-blue-100 text-blue-800" },
  paid: { label: "Paid", color: "bg-green-100 text-green-800" },
  shipped: { label: "Shipped", color: "bg-purple-100 text-purple-800" },
  delivered: { label: "Delivered", color: "bg-green-200 text-green-900" },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800" },
  refunded: { label: "Refunded", color: "bg-gray-200 text-gray-800" },
};

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/account");
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true, email: true, name: true, role: true, createdAt: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  const orders = await db.order.findMany({
    where: { userId: user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  const totalSpent = orders
    .filter((o) => !["cancelled", "refunded"].includes(o.status))
    .reduce((s, o) => s + o.total, 0);

  return (
    <div className="luxe-wrap py-12 md:py-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
        <div>
          <span className="luxe-eyebrow mb-3">Account</span>
          <h1 className="font-display text-4xl md:text-5xl font-medium tracking-tight">
            Hi, {user.name || user.email.split("@")[0]}
          </h1>
          <p className="mt-2 text-[#2b2b28]">{user.email}</p>
          {user.role === "ADMIN" && (
            <Link
              href="/admin"
              className="luxe-tag luxe-tag-new mt-3 inline-block"
            >
              Admin dashboard →
            </Link>
          )}
        </div>
        <div className="text-right">
          <div className="luxe-mono text-[11px] text-[#2b2b28]">Member since</div>
          <div className="font-display text-lg">
            {user.createdAt.toLocaleDateString("en-US", {
              year: "numeric", month: "long", day: "numeric",
            })}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
        <div className="bg-[#f3f1ea] p-5 rounded">
          <div className="luxe-mono text-[11px] text-[#2b2b28]">ORDERS</div>
          <div className="font-display text-3xl font-medium mt-1">{orders.length}</div>
        </div>
        <div className="bg-[#f3f1ea] p-5 rounded">
          <div className="luxe-mono text-[11px] text-[#2b2b28]">TOTAL SPENT</div>
          <div className="font-display text-3xl font-medium mt-1">${totalSpent.toFixed(2)}</div>
        </div>
        <div className="bg-[#0a0a0a] text-[#D1FE17] p-5 rounded">
          <div className="luxe-mono text-[11px] opacity-70">LUXE MEMBER</div>
          <div className="font-display text-3xl font-medium mt-1">★ Insider</div>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid md:grid-cols-2 gap-4 mb-12">
        <Link href="/account/profile" className="border border-[#e4e1d6] rounded-md p-5 hover:border-[#0a0a0a] transition-colors block">
          <div className="luxe-mono text-[11px] text-[#2b2b28] mb-1">SETTINGS</div>
          <div className="font-display text-xl font-medium">Profile & password →</div>
          <p className="text-sm text-[#2b2b28] mt-1">Update your name, change your password.</p>
        </Link>
        <Link href="/account/addresses" className="border border-[#e4e1d6] rounded-md p-5 hover:border-[#0a0a0a] transition-colors block">
          <div className="luxe-mono text-[11px] text-[#2b2b28] mb-1">SETTINGS</div>
          <div className="font-display text-xl font-medium">Saved addresses →</div>
          <p className="text-sm text-[#2b2b28] mt-1">Manage shipping addresses for faster checkout.</p>
        </Link>
      </div>

      {/* Order history */}
      <h2 className="font-display text-3xl font-medium mb-6">Order history</h2>
      {orders.length === 0 ? (
        <div className="bg-[#f3f1ea] p-10 rounded text-center">
          <p className="text-[#2b2b28] mb-5">You haven't placed any orders yet.</p>
          <Link href="/shop" className="luxe-btn-primary">
            <span>Start shopping</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusInfo = STATUS_LABELS[order.status] || { label: order.status, color: "bg-gray-100 text-gray-800" };
            return (
              <div key={order.id} className="border border-[#e4e1d6] rounded-md p-5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                  <div>
                    <div className="font-mono text-sm font-bold">{order.orderNumber}</div>
                    <div className="luxe-mono text-[11px] text-[#2b2b28]">
                      {order.createdAt.toLocaleString("en-US", {
                        year: "numeric", month: "short", day: "numeric",
                        hour: "numeric", minute: "2-digit",
                      })}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`luxe-mono text-[10px] px-3 py-1 rounded-full ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                    <span className="font-mono font-bold">${order.total.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex gap-3 flex-wrap">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-2 bg-[#fafaf8] rounded pr-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.img} alt={item.name} className="w-12 h-14 object-cover rounded-l" />
                      <div>
                        <div className="font-display text-sm font-medium">{item.name}</div>
                        <div className="luxe-mono text-[10px] text-[#2b2b28]">
                          {item.variant ? `${item.variant} · ` : ""}Qty {item.qty}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-[#e4e1d6] flex items-center justify-between">
                  <span className="luxe-mono text-[11px] text-[#2b2b28]">
                    Ship to: {order.shipFirstName} {order.shipLastName}, {order.shipCity}
                  </span>
                  <Link
                    href={`/checkout/confirmation?id=${order.id}`}
                    className="luxe-btn-ghost"
                  >
                    View details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
