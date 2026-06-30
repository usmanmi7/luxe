import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "The LUXE story - clean, high-performance beauty in bold color.",
};

const TEAM = [
  { name: "Aanya Perera", role: "Founder & Formulator", img: "https://images.unsplash.com/photo-1581182815808-b6eb627a8798?w=600&q=85" },
  { name: "Dilani Fernando", role: "Creative Director", img: "https://images.unsplash.com/photo-1648249969490-44f3052a3721?w=600&q=85" },
  { name: "Chen Wei", role: "Head of R&D", img: "https://images.unsplash.com/photo-1593260853607-d0e0f639bdab?w=600&q=85" },
];

const VALUES = [
  { icon: "🧪", title: "Science-first formulas", desc: "Every product starts in the lab. We use clinically-proven actives at effective concentrations - never filler, never greenwashing." },
  { icon: "🐰", title: "Cruelty-free, always", desc: "Leaping Bunny certified. We never test on animals and never work with suppliers who do." },
  { icon: "♻️", title: "Refillable, less waste", desc: "Our packaging is designed to be refilled. Buy the bottle once, refill forever. Less plastic, same ritual." },
  { icon: "🌍", title: "Made in Sri Lanka", desc: "Formulated and manufactured locally. Supporting local jobs, local suppliers, local talent." },
];

export default function AboutPage() {
  return (
    <>
      <section className="py-20 md:py-28 border-b border-[#e4e1d6]">
        <div className="luxe-wrap max-w-3xl">
          <span className="luxe-eyebrow mb-4">Our story</span>
          <h1 className="font-display text-5xl md:text-7xl font-medium leading-[1.05] tracking-tight">
            Beauty, <em className="italic text-[#0a0a0a]/70">unfiltered.</em>
          </h1>
          <p className="mt-6 text-lg text-[#2b2b28] leading-relaxed">
            LUXE was born in 2024 in Colombo, out of frustration with a beauty industry that prioritized marketing over formulation. We make clean, high-performance skincare and makeup - bold color, real actives, zero filler - priced honestly and made for real skin.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="luxe-wrap">
          <h2 className="font-display text-4xl md:text-5xl font-medium mb-12">What we stand for</h2>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
            {VALUES.map((v) => (
              <div key={v.title}>
                <div className="text-4xl mb-4">{v.icon}</div>
                <h3 className="font-display text-2xl font-medium mb-2">{v.title}</h3>
                <p className="text-[#2b2b28] leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0a0a0a] text-[#fafaf8] py-20">
        <div className="luxe-wrap grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { num: "12,000+", label: "Verified buyers" },
            { num: "4.8★", label: "Average rating" },
            { num: "100%", label: "Cruelty-free" },
            { num: "0", label: "Filler ingredients" },
          ].map((s) => (
            <div key={s.label}>
              <div className="font-display text-5xl md:text-6xl font-medium text-[#D1FE17]">{s.num}</div>
              <div className="luxe-mono text-[11px] mt-2 text-white/70">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20">
        <div className="luxe-wrap">
          <h2 className="font-display text-4xl md:text-5xl font-medium mb-12">The team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {TEAM.map((member) => (
              <div key={member.name}>
                <div className="aspect-[3/4] rounded-md overflow-hidden bg-[#f3f1ea] mb-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-display text-xl font-medium">{member.name}</h3>
                <p className="luxe-mono text-[11px] text-[#2b2b28]">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#D1FE17] py-20">
        <div className="luxe-wrap text-center">
          <h2 className="font-display text-4xl md:text-5xl font-medium mb-4">Ready to glow?</h2>
          <p className="text-[#0a0a0a] mb-6">Shop the collection trusted by 12,000+ verified buyers.</p>
          <Link href="/shop" className="luxe-btn-primary">
            <span>Shop now</span>
          </Link>
        </div>
      </section>
    </>
  );
}
