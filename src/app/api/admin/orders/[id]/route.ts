import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth/auth";
import { fireEvent } from "@/lib/luxe/n8n-webhook";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") return null;
  return session;
}

type Params = Promise<{ id: string }>;

const VALID_STATUSES = ["pending", "pending_cod", "pending_bank", "paid", "shipped", "delivered", "cancelled", "refunded"];

export async function PATCH(req: Request, { params }: { params: Params }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  try {
    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const existing = await db.order.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    const order = await db.order.update({
      where: { id },
      data: { status },
      include: { items: true },
    });

    // Fire "status_change" event to n8n (fire-and-forget)
    fireEvent("status_change", {
      orderId: order.id,
      orderNumber: order.orderNumber,
      email: order.email,
      customerName: `${order.shipFirstName} ${order.shipLastName}`,
      oldStatus: existing.status,
      newStatus: status,
      paymentMethod: order.paymentMethod,
      total: order.total,
      phone: order.shipPhone,
      shippingAddress: {
        firstName: order.shipFirstName,
        lastName: order.shipLastName,
        address: order.shipAddress,
        city: order.shipCity,
        postal: order.shipPostal,
        country: order.shipCountry,
        phone: order.shipPhone,
      },
      items: order.items.map((i) => ({
        name: i.name,
        qty: i.qty,
        price: i.price,
        variant: i.variant,
      })),
    }).catch((err) => console.error("[n8n] Failed to fire status_change event:", err));

    return NextResponse.json({ order });
  } catch (err) {
    console.error("[PATCH /api/admin/orders/[id]] Error:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to update order" }, { status: 500 });
  }
}

export async function GET(_req: Request, { params }: { params: Params }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { id } = await params;
  const order = await db.order.findUnique({ where: { id }, include: { items: true, user: true } });
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ order });
}
