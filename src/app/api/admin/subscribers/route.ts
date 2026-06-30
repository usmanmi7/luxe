import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth/auth";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") return null;
  return session;
}

// POST - admin manually adds a subscriber (auto-confirmed, no email sent)
export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  try {
    const body = await req.json();
    const { email, source = "admin" } = body as { email?: string; source?: string };

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await db.subscriber.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      if (existing.status === "confirmed") {
        return NextResponse.json({ error: "Already subscribed" }, { status: 409 });
      }
      // Re-confirm
      await db.subscriber.update({
        where: { id: existing.id },
        data: { status: "confirmed", confirmedAt: new Date(), unsubscribedAt: null },
      });
      return NextResponse.json({ subscriber: { id: existing.id } });
    }

    const subscriber = await db.subscriber.create({
      data: {
        email: normalizedEmail,
        status: "confirmed", // admin-added = auto-confirmed
        source,
        confirmedAt: new Date(),
      },
    });
    return NextResponse.json({ subscriber }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/admin/subscribers] Error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
