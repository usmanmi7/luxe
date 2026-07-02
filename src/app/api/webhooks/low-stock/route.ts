import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

// GET /api/webhooks/low-stock?threshold=5
// Returns products at or below the stock threshold.
// n8n can call this on a schedule (e.g., every 6 hours) and alert if results exist.
//
// Auth: uses N8N_WEBHOOK_SECRET header for simple auth
export async function GET(req: Request) {
  try {
    // Simple auth check
    const secret = process.env.N8N_WEBHOOK_SECRET;
    if (secret) {
      const authHeader = req.headers.get("x-n8n-secret");
      if (authHeader !== secret) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const { searchParams } = new URL(req.url);
    const threshold = parseInt(searchParams.get("threshold") || "5", 10);

    const lowStockProducts = await db.product.findMany({
      where: {
        active: true,
        stock: { lte: threshold },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        stock: true,
        tag: true,
        img: true,
      },
      orderBy: { stock: "asc" },
    });

    return NextResponse.json({
      threshold,
      count: lowStockProducts.length,
      products: lowStockProducts,
      checkedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[GET /api/webhooks/low-stock] Error:", err);
    return NextResponse.json({ error: "Failed to check stock" }, { status: 500 });
  }
}