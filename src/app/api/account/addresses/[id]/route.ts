import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth/auth";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

async function getOwnedAddress(userId: string, id: string) {
  return db.address.findFirst({ where: { id, userId } });
}

export async function PUT(req: Request, { params }: { params: Params }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await params;
    const existing = await getOwnedAddress(session.user.id, id);
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const body = await req.json();
    const { label, firstName, lastName, address, city, postal, country, phone, isDefault } = body;

    if (isDefault) {
      await db.address.updateMany({
        where: { userId: session.user.id, isDefault: true, id: { not: id } },
        data: { isDefault: false },
      });
    }

    const updated = await db.address.update({
      where: { id },
      data: {
        label: label ?? existing.label,
        firstName: firstName ?? existing.firstName,
        lastName: lastName ?? existing.lastName,
        address: address ?? existing.address,
        city: city ?? existing.city,
        postal: postal ?? existing.postal,
        country: country ?? existing.country,
        phone: phone !== undefined ? (phone || null) : existing.phone,
        isDefault: typeof isDefault === "boolean" ? isDefault : existing.isDefault,
      },
    });
    return NextResponse.json({ address: updated });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Params }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await params;
    const existing = await getOwnedAddress(session.user.id, id);
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const body = await req.json();
    if (body.isDefault === true) {
      await db.address.updateMany({
        where: { userId: session.user.id, isDefault: true, id: { not: id } },
        data: { isDefault: false },
      });
      const updated = await db.address.update({ where: { id }, data: { isDefault: true } });
      return NextResponse.json({ address: updated });
    }
    return NextResponse.json({ address: existing });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Params }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await params;
    const existing = await getOwnedAddress(session.user.id, id);
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await db.address.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed" }, { status: 500 });
  }
}
