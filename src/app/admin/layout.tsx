import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = { title: { default: "Admin — LUXE", template: "%s — LUXE Admin" } };
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/admin");
  if (session.user.role !== "ADMIN") redirect("/account?error=admin_required");

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#fafaf8]">
      <AdminSidebar userEmail={session.user.email || ""} userName={session.user.name || ""} />
      <div className="flex-1 md:ml-64 min-w-0">
        <main className="p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}
