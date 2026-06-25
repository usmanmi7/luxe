import { db } from "@/lib/db";
import { ProductCard, type Product } from "@/components/site/product-card";
import { ShopSidebar } from "@/components/site/shop-sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop All",
  description: "Shop the full LUXE catalog: clean, high-performance skincare and makeup.",
};

export const dynamic = "force-dynamic";

type SearchParams = Promise<{
  cat?: string;
  tag?: string;
  sort?: string;
  minPrice?: string;
  maxPrice?: string;
}>;

export default async function ShopPage({ searchParams }: { searchParams: SearchParams }) {
  const { cat, tag, sort, minPrice, maxPrice } = await searchParams;

  // Build filter
  const where: {
    active: boolean;
    category?: string;
    originalPrice?: { not: null };
    tag?: string;
    price?: { gte?: number; lte?: number };
  } = { active: true };

  // Category filter
  if (cat === "Skincare" || cat === "Makeup") {
    where.category = cat;
  } else if (cat === "Sale") {
    where.originalPrice = { not: null };
  }

  // Tag filter
  if (tag && ["Sale", "New", "Bestseller"].includes(tag)) {
    where.tag = tag;
  }

  // Price range filter
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = parseFloat(minPrice);
    if (maxPrice) where.price.lte = parseFloat(maxPrice);
  }

  // Sort
  let orderBy: { [key: string]: "asc" | "desc" } = { createdAt: "asc" };
  if (sort === "price-asc") orderBy = { price: "asc" };
  else if (sort === "price-desc") orderBy = { price: "desc" };
  else if (sort === "newest") orderBy = { createdAt: "desc" };

  const rows = await db.product.findMany({ where, orderBy });
  const products: Product[] = rows.map((p) => ({
    id: p.id, slug: p.slug, name: p.name, category: p.category,
    price: p.price, originalPrice: p.originalPrice, img: p.img, tag: p.tag,
  }));

  // Get facets for sidebar
  const allProducts = await db.product.findMany({
    where: { active: true },
    select: { category: true, tag: true, price: true, originalPrice: true },
  });
  const categories = [
    { label: "All Products", value: "All", count: allProducts.length },
    { label: "Skincare", value: "Skincare", count: allProducts.filter((p) => p.category === "Skincare").length },
    { label: "Makeup", value: "Makeup", count: allProducts.filter((p) => p.category === "Makeup").length },
    { label: "On Sale", value: "Sale", count: allProducts.filter((p) => p.originalPrice).length },
  ];
  const tags = [
    { label: "Sale", value: "Sale", count: allProducts.filter((p) => p.tag === "Sale").length },
    { label: "New", value: "New", count: allProducts.filter((p) => p.tag === "New").length },
    { label: "Bestseller", value: "Bestseller", count: allProducts.filter((p) => p.tag === "Bestseller").length },
  ];
  const prices = allProducts.map((p) => p.price);
  const priceRange = { min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) };

  const activeFilters = {
    cat: cat || "All",
    tag: tag || "",
    sort: sort || "featured",
    minPrice: minPrice || "",
    maxPrice: maxPrice || "",
  };

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
            Skincare and makeup, formulated first. Use the filters to find your perfect match.
          </p>
        </div>
      </section>

      {/* Shop content with sidebar */}
      <section className="py-12">
        <div className="luxe-wrap">
          <div className="grid md:grid-cols-[240px_1fr] lg:grid-cols-[260px_1fr] gap-10">
            {/* Sidebar */}
            <ShopSidebar
              categories={categories}
              tags={tags}
              priceRange={priceRange}
              active={activeFilters}
              resultCount={products.length}
            />

            {/* Product grid */}
            <div>
              {products.length === 0 ? (
                <div className="py-20 text-center">
                  <p className="font-display text-2xl mb-3">No products match your filters</p>
                  <p className="text-[#2b2b28] mb-6">Try removing some filters to see more results.</p>
                  <a href="/shop" className="luxe-btn-primary"><span>Clear all filters</span></a>
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                  {products.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
