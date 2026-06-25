import Link from "next/link";
import { db } from "@/lib/db";
import { ProductCard, type Product } from "@/components/site/product-card";
import { HeroShowcase } from "@/components/site/hero-showcase";
import { NewsletterForm } from "@/components/site/newsletter-form";

async function getProducts() {
  const products = await db.product.findMany({
    where: { active: true },
    orderBy: { createdAt: "asc" },
  });
  return products.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: p.category,
    price: p.price,
    originalPrice: p.originalPrice,
    img: p.img,
    tag: p.tag,
  })) as Product[];
}

export default async function HomePage() {
  const products = await getProducts();
  const saleProducts = products.filter((p) => p.originalPrice).slice(0, 4);
  const newArrivals = products;

  return (
    <>
      {/* ===== PROMO BANNER ===== */}
      <div className="bg-[#0a0a0a] text-[#fafaf8] text-center text-sm py-2.5 luxe-mono">
        <span>🎉 Up to <strong className="text-[#D1FE17]">20% off</strong> sale items this week — </span>
        <Link href="/shop?cat=Sale" className="underline hover:text-[#D1FE17]">Shop the sale →</Link>
      </div>

      {/* ===== HERO — exactly 90vh on desktop (1920x1080) ===== */}
      <section className="relative overflow-hidden h-[90vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-[#f3f1ea] via-[#fafaf8] to-[#D1FE17]/10" />
        <div className="luxe-wrap relative grid md:grid-cols-[1.2fr_1fr] gap-12 items-center w-full">
          <div>
            <div className="luxe-eyebrow mb-5">New season drop</div>
            <h1 className="font-display text-5xl md:text-7xl font-medium leading-[1.05] tracking-tight">
              Skin that <em className="italic text-[#b9e30f]">speaks</em>
              <br />
              for itself.
            </h1>
            <p className="mt-6 text-lg text-[#2b2b28] max-w-[52ch]">
              Clean actives. Bold colour. Science that works. Shop the collection trusted by 12,000+ verified buyers.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/shop" className="luxe-btn-lime">Shop now</Link>
              <Link href="/shop?cat=Sale" className="luxe-btn-outline">Sale — up to 20% off</Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 luxe-mono text-[11px] text-[#2b2b28]">
              <span>⭐ 4.8 avg rating</span>
              <span>🚚 Free shipping $60+</span>
              <span>↩ 30-day returns</span>
            </div>
          </div>

          <div className="relative flex items-center">
            <HeroShowcase
              products={products.map((p) => ({
                id: p.id, slug: p.slug, name: p.name,
                price: p.price, img: p.img, tag: p.tag,
              }))}
            />
          </div>
        </div>
      </section>

      {/* ===== LOGO MARQUEE ===== */}
      <section className="border-y border-[#e4e1d6] py-8 overflow-hidden">
        <div className="luxe-wrap mb-4">
          <div className="luxe-mono text-center text-[#2b2b28]/70">As featured in & trusted by</div>
        </div>
        <div className="relative">
          <div className="flex gap-12 animate-[marquee_30s_linear_infinite] whitespace-nowrap">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-12">
                {["Vogue", "Elle", "Harper's Bazaar", "Cosmopolitan", "Allure", "WWD", "Refinery29", "Into The Gloss", "Byrdie", "Glamour"].map((name) => (
                  <span key={name} className="font-display text-2xl text-[#2b2b28]/40 italic">{name}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </section>

      {/* ===== ALL PRODUCTS ===== */}
      <section className="py-20">
        <div className="luxe-wrap">
          <div className="flex items-end justify-between mb-10 reveal">
            <div>
              <span className="luxe-eyebrow mb-3 block">Full collection</span>
              <h2 className="font-display text-4xl md:text-5xl font-medium">Shop all products</h2>
            </div>
            <Link href="/shop" className="luxe-btn-outline">Browse shop</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {newArrivals.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== SALE STRIP ===== */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#f3f1ea] via-[#fafaf8] to-[#D1FE17]/10" />
        <div className="luxe-wrap relative grid md:grid-cols-[1fr_1.5fr] gap-12 items-center">
          <div>
            <span className="luxe-tag luxe-tag-sale mb-4 inline-block">Sale</span>
            <h2 className="font-display text-4xl md:text-5xl font-medium mt-4">Up to 20% off this week</h2>
            <p className="mt-4 text-[#2b2b28] max-w-[40ch]">
              Stocked up on our top formulas — now at our lowest prices of the year. Ends Sunday.
            </p>
            <Link href="/shop?cat=Sale" className="luxe-btn-lime mt-6 inline-flex">Shop the sale</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {saleProducts.map((p) => {
              const pct = p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : 0;
              return (
                <Link key={p.id} href={`/product/${p.slug}`} className="bg-white text-[#0a0a0a] rounded-md overflow-hidden group">
                  <div className="aspect-square overflow-hidden bg-[#f3f1ea] relative">
                    <span className="absolute top-2 left-2 z-10 bg-[#D1FE17] text-[#0a0a0a] font-mono text-[10px] px-1.5 py-0.5 rounded">-{pct}%</span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.img} alt={p.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                  </div>
                  <div className="p-3">
                    <div className="font-display text-sm font-medium truncate">{p.name}</div>
                    <div className="font-mono text-xs mt-1">
                      ${p.price.toFixed(2)} <s className="text-[#2b2b28]/50">${p.originalPrice?.toFixed(2)}</s>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== TRUST BADGES + NEWSLETTER ===== */}
      <section className="py-20">
        <div className="luxe-wrap">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-16 reveal">
            {[
              { icon: "🧪", title: "Dermatologist tested", desc: "Every formula, every batch" },
              { icon: "🐰", title: "Cruelty free", desc: "Leaping Bunny certified" },
              { icon: "♻️", title: "Refillable packaging", desc: "Less waste, same ritual" },
              { icon: "🚚", title: "Free shipping", desc: "On orders over $60" },
              { icon: "↩", title: "30-day returns", desc: "No questions asked" },
            ].map((b) => (
              <div key={b.title} className="text-center md:text-left">
                <div className="text-3xl mb-3">{b.icon}</div>
                <strong className="font-display text-base font-medium block">{b.title}</strong>
                <p className="text-sm text-[#2b2b28]/70 mt-1">{b.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-[#f3f1ea] rounded-md p-10 md:p-14 reveal">
            <div className="grid md:grid-cols-[1.2fr_1fr] gap-8 items-center">
              <div>
                <h3 className="font-display text-3xl font-medium">Get 15% off your first order</h3>
                <p className="mt-2 text-[#2b2b28]">New drops, formula deep-dives, restocks. No spam.</p>
              </div>
              <NewsletterForm variant="section" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
