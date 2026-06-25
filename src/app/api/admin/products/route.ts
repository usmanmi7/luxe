import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth/auth";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") return null;
  return session;
}

export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  try {
    const body = await req.json();
    const { name, slug, category, price, originalPrice, img, gallery, desc, longDesc, ingredients, tag, shades, sizes, stock, active } = body;

    if (!name || !img || !desc || typeof price !== "number" || price <= 0) {
      return NextResponse.json({ error: "Missing required fields: name, img, desc, price" }, { status: 400 });
    }

    let finalSlug = slug;
    const existing = await db.product.findUnique({ where: { slug } });
    if (existing) finalSlug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;

    const product = await db.product.create({
      data: {
        name, slug: finalSlug, category: category || "Skincare", price,
        originalPrice: originalPrice || null, img,
        gallery: Array.isArray(gallery) ? gallery : [img],
        desc, longDesc: longDesc || desc, ingredients: ingredients || "",
        tag: tag || null, shades: Array.isArray(shades) ? shades : [],
        sizes: Array.isArray(sizes) ? sizes : [],
        stock: typeof stock === "number" ? stock : 0,
        active: active !== false,
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/admin/products] Error:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to create product" }, { status: 500 });
  }
}
