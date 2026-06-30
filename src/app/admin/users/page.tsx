import { db } from "@/lib/db";
import { UserActions } from "@/components/admin/user-actions";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Users" };
export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, email: true, name: true, role: true, banned: true, createdAt: true, _count: { select: { orders: true } } },
  });

  const adminCount = users.filter((u) => u.role === "ADMIN").length;
  const bannedCount = users.filter((u) => u.banned).length;

  return (
    <div>
      <div className="mb-8">
        <span className="luxe-eyebrow mb-2">People</span>
        <h1 className="font-display text-4xl font-medium tracking-tight">Users</h1>
        <p className="mt-1 text-sm text-[#2b2b28]">{users.length} users · {adminCount} admin · {bannedCount} banned</p>
      </div>

      <div className="bg-white border border-[#e4e1d6] rounded-md overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead className="bg-[#f3f1ea]">
            <tr className="luxe-mono text-[10px] text-[#2b2b28] text-left">
              <th className="px-4 py-3">NAME</th>
              <th className="px-4 py-3">EMAIL</th>
              <th className="px-4 py-3">JOINED</th>
              <th className="px-4 py-3">ORDERS</th>
              <th className="px-4 py-3">ROLE</th>
              <th className="px-4 py-3 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e4e1d6]">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-[#fafaf8]">
                <td className="px-4 py-3">
                  <div className="font-display font-medium">{u.name || "(no name)"}</div>
                  {u.banned && <span className="luxe-mono text-[9px] text-red-700 bg-red-100 px-1.5 py-0.5 rounded">BANNED</span>}
                </td>
                <td className="px-4 py-3 text-sm text-[#2b2b28]">{u.email}</td>
                <td className="px-4 py-3 luxe-mono text-[11px] text-[#2b2b28]">{u.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                <td className="px-4 py-3 luxe-mono text-xs">{u._count.orders}</td>
                <td className="px-4 py-3">
                  {u.role === "ADMIN" ? (
                    <span className="luxe-mono text-[10px] text-[#0a0a0a] bg-[#D1FE17] px-2 py-1 rounded">ADMIN</span>
                  ) : (
                    <span className="luxe-mono text-[10px] text-[#2b2b28]">USER</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <UserActions userId={u.id} email={u.email} role={u.role} banned={u.banned} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
