import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ProductDetailClient } from "@/components/site/product-detail-client";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const product = await db.product.findUnique({ where: { slug } });
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.desc,
    openGraph: {
      title: `${product.name} - LUXE`,
      description: product.desc,
      images: [product.img],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} - LUXE`,
      description: product.desc,
      images: [product.img],
    },
    alternates: { canonical: `/product/${product.slug}` },
  };
}

function productJsonLd(product: {
  name: string; desc: string; img: string; price: number;
  category: string; rating: number; reviewCount: number; slug: string;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://luxe-ruby-delta.vercel.app";
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.desc,
    image: [product.img],
    sku: product.slug,
    brand: { "@type": "Brand", name: "LUXE" },
    category: product.category,
    offers: {
      "@type": "Offer",
      url: `${baseUrl}/product/${product.slug}`,
      priceCurrency: "USD",
      price: product.price,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await db.product.findUnique({
    where: { slug },
    include: {
      reviews: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!product || !product.active) {
    notFound();
  }

  // Related: same category or has a tag, exclude current, max 4
  const relatedRows = await db.product.findMany({
    where: {
      active: true,
      id: { not: product.id },
      OR: [{ category: product.category }, { tag: { not: null } }],
    },
    take: 4,
  });

  const related = relatedRows.map((p) => ({
    id: p.id, slug: p.slug, name: p.name, category: p.category,
    price: p.price, originalPrice: p.originalPrice, img: p.img, tag: p.tag,
  }));

  return (
    <>
      {/* JSON-LD structured data for Google Shopping */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd({
            name: product.name, desc: product.desc, img: product.img,
            price: product.price, category: product.category,
            rating: product.rating, reviewCount: product.reviewCount,
            slug: product.slug,
          })),
        }}
      />

      {/* Breadcrumb */}
      <div className="luxe-wrap pt-6 pb-2">
        <nav className="luxe-mono text-[11px] text-[#2b2b28]" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#0a0a0a]">HOME</Link>
          <span className="mx-2">/</span>
          <Link href="/shop" className="hover:text-[#0a0a0a]">SHOP</Link>
          <span className="mx-2">/</span>
          <span className="text-[#0a0a0a]">{product.name.toUpperCase()}</span>
        </nav>
      </div>

      {/* Product detail */}
      <section className="py-10 md:py-14">
        <div className="luxe-wrap grid md:grid-cols-2 gap-10 lg:gap-16">
          <ProductDetailClient
            product={{
              id: product.id,
              slug: product.slug,
              name: product.name,
              category: product.category,
              price: product.price,
              originalPrice: product.originalPrice,
              img: product.img,
              gallery: product.gallery,
              desc: product.desc,
              longDesc: product.longDesc,
              ingredients: product.ingredients,
              tag: product.tag,
              shades: product.shades,
              sizes: product.sizes,
              rating: product.rating,
              reviewCount: product.reviewCount,
              stock: product.stock,
              reviews: product.reviews.map((r) => ({
                id: r.id, name: r.name, rating: r.rating, text: r.text,
              })),
            }}
            related={related}
          />
        </div>
      </section>
    </>
  );
}
