import { db } from "@/lib/db";
import { ProductCard, type Product } from "@/components/site/product-card";
import { ShopFilters } from "@/components/site/shop-filters";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop All",
  description: "Shop the full LUXE catalog: clean, high-performance skincare and makeup.",
};

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ cat?: string }>;

export default async function ShopPage({ searchParams }: { searchParams: SearchParams }) {
  const { cat } = await searchParams;
  const validCats = ["All", "Skincare", "Makeup", "Sale"];
  const active = validCats.includes(cat || "") ? cat! : "All";

  let products: Product[];
  if (active === "Sale") {
    const rows = await db.product.findMany({
      where: { active: true, originalPrice: { not: null } },
      orderBy: { createdAt: "asc" },
    });
    products = rows.map(toCard);
  } else if (active === "All") {
    const rows = await db.product.findMany({
      where: { active: true },
      orderBy: { createdAt: "asc" },
    });
    products = rows.map(toCard);
  } else {
    const rows = await db.product.findMany({
      where: { active: true, category: active },
      orderBy: { createdAt: "asc" },
    });
    products = rows.map(toCard);
  }

  return (
    <>
      {/* Page hero */}
      <section className="py-16 md:py-20 border-b border-[#e4e1d6]">
        <div className="luxe-wrap">
          <span className="luxe-eyebrow mb-3">Full catalog</span>
          <h1 className="font-display text-5xl md:text-6xl font-medium tracking-tight">
            Shop everything.
          </h1>
          <p className="mt-4 text-lg text-[#2b2b28] max-w-[60ch]">
            Skincare and makeup, formulated first. Filter by category below.
          </p>
        </div>
      </section>

      {/* Shop content */}
      <section className="py-16">
        <div className="luxe-wrap">
          <ShopFilters active={active} count={products.length} />

          {products.length === 0 ? (
            <div className="py-20 text-center">
              <p className="luxe-mono text-[#2b2b28]">No products in this category yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10 mt-10">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function toCard(p: {
  id: string; slug: string; name: string; category: string;
  price: number; originalPrice: number | null; img: string; tag: string | null;
}): Product {
  return {
    id: p.id, slug: p.slug, name: p.name, category: p.category,
    price: p.price, originalPrice: p.originalPrice, img: p.img, tag: p.tag,
  };
}
