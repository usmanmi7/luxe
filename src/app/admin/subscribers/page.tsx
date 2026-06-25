import { db } from "@/lib/db";
import { AddSubscriberButton } from "@/components/admin/add-subscriber-button";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Subscribers" };
export const dynamic = "force-dynamic";

export default async function AdminSubscribersPage() {
  const subscribers = await db.subscriber.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true, email: true, status: true, source: true,
      createdAt: true, confirmedAt: true, unsubscribedAt: true,
    },
  });

  const confirmed = subscribers.filter((s) => s.status === "confirmed");
  const pending = subscribers.filter((s) => s.status === "pending");
  const unsubscribed = subscribers.filter((s) => s.status === "unsubscribed");

  // CSV export data (escaped properly)
  const csvRows = [
    "email,status,source,subscribed_at,confirmed_at,unsubscribed_at",
    ...confirmed.map((s) =>
      [
        `"${s.email}"`,
        s.status,
        s.source,
        s.createdAt.toISOString(),
        s.confirmedAt?.toISOString() || "",
        s.unsubscribedAt?.toISOString() || "",
      ].join(",")
    ),
  ];
  const csv = csvRows.join("\n");

  return (
    <div>
      <div className="flex items-end justify-between mb-8 flex-wrap gap-3">
        <div>
          <span className="luxe-eyebrow mb-2">Newsletter</span>
          <h1 className="font-display text-4xl font-medium tracking-tight">Subscribers</h1>
          <p className="mt-1 text-sm text-[#2b2b28]">{confirmed.length} confirmed · {pending.length} pending · {unsubscribed.length} unsubscribed</p>
        </div>
        <div className="flex gap-3">
          <a
            href={`data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`}
            download="luxe-subscribers.csv"
            className="luxe-btn-outline"
          >
            <span>Export CSV</span>
          </a>
          <AddSubscriberButton />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <div className="bg-[#D1FE17] p-5 rounded">
          <div className="luxe-mono text-[10px] text-[#0a0a0a]">CONFIRMED</div>
          <div className="font-display text-3xl font-medium mt-1">{confirmed.length}</div>
          <div className="luxe-mono text-[10px] text-[#0a0a0a]/60 mt-1">Receives product launch emails</div>
        </div>
        <div className="bg-[#f3f1ea] p-5 rounded">
          <div className="luxe-mono text-[10px] text-[#2b2b28]">PENDING</div>
          <div className="font-display text-3xl font-medium mt-1">{pending.length}</div>
          <div className="luxe-mono text-[10px] text-[#2b2b28]/60 mt-1">Awaiting email confirmation</div>
        </div>
        <div className="bg-[#0a0a0a] text-[#fafaf8] p-5 rounded">
          <div className="luxe-mono text-[10px] opacity-70">UNSUBSCRIBED</div>
          <div className="font-display text-3xl font-medium mt-1">{unsubscribed.length}</div>
          <div className="luxe-mono text-[10px] opacity-60 mt-1">Opted out of emails</div>
        </div>
      </div>

      {/* Subscriber list */}
      <div className="bg-white border border-[#e4e1d6] rounded-md overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead className="bg-[#f3f1ea]">
            <tr className="luxe-mono text-[10px] text-[#2b2b28] text-left">
              <th className="px-4 py-3">EMAIL</th>
              <th className="px-4 py-3">STATUS</th>
              <th className="px-4 py-3">SOURCE</th>
              <th className="px-4 py-3">SUBSCRIBED</th>
              <th className="px-4 py-3">CONFIRMED</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e4e1d6]">
            {subscribers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-[#2b2b28]">
                  No subscribers yet. Add a subscriber manually or wait for visitors to sign up via the footer form.
                </td>
              </tr>
            ) : (
              subscribers.map((s) => (
                <tr key={s.id} className="hover:bg-[#fafaf8]">
                  <td className="px-4 py-3 text-sm">{s.email}</td>
                  <td className="px-4 py-3">
                    <span className={`luxe-mono text-[10px] px-2 py-1 rounded ${
                      s.status === "confirmed" ? "bg-green-100 text-green-800"
                      : s.status === "pending" ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-200 text-gray-800"
                    }`}>
                      {s.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 luxe-mono text-[10px] text-[#2b2b28]">{s.source}</td>
                  <td className="px-4 py-3 luxe-mono text-[10px] text-[#2b2b28]">
                    {s.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3 luxe-mono text-[10px] text-[#2b2b28]">
                    {s.confirmedAt
                      ? s.confirmedAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                      : "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
