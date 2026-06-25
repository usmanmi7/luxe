import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

// GET /api/newsletter/unsubscribe?token=xxx
// One-click unsubscribe (CAN-SPAM + GDPR Article 21 requirement)
// Link is included in every newsletter email's footer
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.redirect(new URL("/newsletter/unsubscribe?status=invalid", req.url));
    }

    const subscriber = await db.subscriber.findUnique({ where: { unsubscribeToken: token } });
    if (!subscriber) {
      return NextResponse.redirect(new URL("/newsletter/unsubscribe?status=invalid", req.url));
    }

    // Mark as unsubscribed immediately (no waiting period — legal requirement)
    await db.subscriber.update({
      where: { id: subscriber.id },
      data: { status: "unsubscribed", unsubscribedAt: new Date() },
    });

    return NextResponse.redirect(new URL("/newsletter/unsubscribe?status=success", req.url));
  } catch (err) {
    console.error("[GET /api/newsletter/unsubscribe] Error:", err);
    return NextResponse.redirect(new URL("/newsletter/unsubscribe?status=error", req.url));
  }
}
