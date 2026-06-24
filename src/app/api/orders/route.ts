import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth/auth";
import { sendOrderConfirmationEmail } from "@/lib/luxe/email";

export const dynamic = "force-dynamic";

function generateOrderNumber(): string {
  return "LUXE-" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase();
}

type OrderPayload = {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postal: string;
  country: string;
  phone?: string;
  paymentMethod: "card" | "cod" | "bank";
  items: Array<{
    id: string;
    name: string;
    price: number;
    img: string;
    qty: number;
    variant?: string | null;
  }>;
  subtotal: number;
  shipping: number;
  codFee?: number;
  tax: number;
  total: number;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as OrderPayload;

    // Basic validation
    if (!body.email || !body.items || body.items.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Attach to logged-in user if session exists
    const session = await auth();
    const userId = session?.user?.id || null;

    const orderNumber = generateOrderNumber();
    const codFee = body.codFee || 0;
    const status =
      body.paymentMethod === "cod" ? "pending_cod"
      : body.paymentMethod === "bank" ? "pending_bank"
      : "pending"; // card → pending until Phase 2 PayHere webhook confirms

    const order = await db.order.create({
      data: {
        orderNumber,
        email: body.email,
        userId,
        status,
        subtotal: body.subtotal,
        shipping: body.shipping + codFee, // fold COD fee into shipping line
        tax: body.tax,
        total: body.total,
        paymentMethod: body.paymentMethod,
        shipFirstName: body.firstName,
        shipLastName: body.lastName,
        shipAddress: body.address,
        shipCity: body.city,
        shipPostal: body.postal,
        shipCountry: body.country,
        shipPhone: body.phone || null,
        items: {
          create: body.items.map((item) => ({
            productId: item.id,
            name: item.name,
            price: item.price,
            img: item.img,
            qty: item.qty,
            variant: item.variant || null,
          })),
        },
      },
      include: { items: true },
    });

    // Decrement stock for each purchased product
    for (const item of body.items) {
      await db.product.update({
        where: { id: item.id },
        data: { stock: { decrement: item.qty } },
      });
    }

    // Send order confirmation email (fire-and-forget; don't block the response)
    sendOrderConfirmationEmail({
      orderNumber: order.orderNumber,
      email: order.email,
      customerName: `${order.shipFirstName} ${order.shipLastName}`,
      total: order.total,
      items: order.items.map((i) => ({
        name: i.name, qty: i.qty, price: i.price, variant: i.variant,
      })),
      shippingAddress: {
        firstName: order.shipFirstName,
        lastName: order.shipLastName,
        address: order.shipAddress,
        city: order.shipCity,
        postal: order.shipPostal,
        country: order.shipCountry,
        phone: order.shipPhone,
      },
      paymentMethod: order.paymentMethod || "card",
      status: order.status,
    }).catch((err) => console.error("[email] Background send failed:", err));

    return NextResponse.json({ order }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/orders] Error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Public list of all orders — FOR ADMIN ONLY in production.
  // Phase 3 will add auth check here. For now, returns empty for safety.
  return NextResponse.json({ orders: [], note: "Admin auth required" });
}
