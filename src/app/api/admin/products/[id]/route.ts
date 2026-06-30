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

export async function PUT(req: Request, { params }: { params: Params }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  try {
    const { id } = await params;
    const body = await req.json();
    const { name, slug, category, price, originalPrice, img, gallery, desc, longDesc, ingredients, tag, shades, sizes, stock, active } = body;

    const existing = await db.product.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    if (slug && slug !== existing.slug) {
      const slugConflict = await db.product.findUnique({ where: { slug } });
      if (slugConflict && slugConflict.id !== id) {
        return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
      }
    }

    const product = await db.product.update({
      where: { id },
      data: {
        name: name ?? existing.name,
        slug: slug ?? existing.slug,
        category: category ?? existing.category,
        price: typeof price === "number" ? price : existing.price,
        originalPrice: originalPrice === null ? null : (originalPrice ?? existing.originalPrice),
        img: img ?? existing.img,
        gallery: Array.isArray(gallery) ? gallery : existing.gallery,
        desc: desc ?? existing.desc,
        longDesc: longDesc ?? existing.longDesc,
        ingredients: ingredients ?? existing.ingredients,
        tag: tag === null ? null : (tag ?? existing.tag),
        shades: Array.isArray(shades) ? shades : existing.shades,
        sizes: Array.isArray(sizes) ? sizes : existing.sizes,
        stock: typeof stock === "number" ? stock : existing.stock,
        active: typeof active === "boolean" ? active : existing.active,
      },
    });

    return NextResponse.json({ product });
  } catch (err) {
    console.error("[PUT /api/admin/products/[id]] Error:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Params }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  try {
    const { id } = await params;
    const existing = await db.product.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    const orderCount = await db.orderItem.count({ where: { productId: id } });
    if (orderCount > 0) {
      await db.product.update({ where: { id }, data: { active: false, stock: 0 } });
      return NextResponse.json({ product: { id }, softDeleted: true, message: `Product has ${orderCount} order(s) - marked inactive instead of deleting` });
    }

    await db.product.delete({ where: { id } });
    return NextResponse.json({ product: { id }, deleted: true });
  } catch (err) {
    console.error("[DELETE /api/admin/products/[id]] Error:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to delete product" }, { status: 500 });
  }
}
