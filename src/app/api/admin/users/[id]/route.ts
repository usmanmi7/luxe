import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth/auth";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") return null;
  return session;
}

type Params = Promise<{ id: string }>;

export async function PATCH(req: Request, { params }: { params: Params }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  try {
    const { id } = await params;
    const body = await req.json();
    const { action } = body as { action: "ban" | "unban" | "promote" | "demote" };

    if (!["ban", "unban", "promote", "demote"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const target = await db.user.findUnique({ where: { id } });
    if (!target) return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (session.user.id === id && (action === "ban" || action === "demote")) {
      return NextResponse.json({ error: "You can't ban or demote yourself" }, { status: 400 });
    }

    const updates: { banned?: boolean; role?: string } = {};
    if (action === "ban") updates.banned = true;
    if (action === "unban") updates.banned = false;
    if (action === "promote") updates.role = "ADMIN";
    if (action === "demote") updates.role = "USER";

    const user = await db.user.update({ where: { id }, data: updates, select: { id: true, email: true, role: true, banned: true } });
    return NextResponse.json({ user });
  } catch (err) {
    console.error("[PATCH /api/admin/users/[id]] Error:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to update user" }, { status: 500 });
  }
}
