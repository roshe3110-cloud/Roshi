import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, Gem, Crown, ShieldCheck, ArrowRight, Droplets } from "lucide-react";
import { STORE_CONTACT } from "@/components/common/SocialIcons";

export const metadata: Metadata = {
  title: "About Us | ROSHÉ BEAUTY & JEWELRY",
  description:
    "Learn about ROSHÉ BEAUTY & JEWELRY — Pakistan's premier destination for luxury skincare, radiant cosmetics, and 18K gold-plated waterproof fine jewelry.",
  alternates: { canonical: "/about" },
  openGraph: {
    url: "/about",
    title: "About Us | ROSHÉ BEAUTY & JEWELRY",
    description:
      "Empowering skin radiance and timeless style with luxury skincare, cosmetics, and waterproof fine jewelry across Pakistan.",
  },
};

export default function AboutPage() {
  return (
    <main className="bg-[#F9F4EF] min-h-screen">
      <div className="container mx-auto max-w-5xl px-5 py-16">
        {/* Hero */}
        <section className="text-center mb-20">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#F4DCD8] text-[#704638] border border-[#D4A45E]/30 mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#D4A45E]" />
            <span>About ROSHÉ BEAUTY &amp; JEWELRY</span>
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[#704638] mb-6 font-heading">
            Empowering Pakistan with{" "}
            <span className="bg-gradient-to-r from-[#D4A45E] to-[#704638] bg-clip-text text-transparent">
              Pure Luxury, Radiance &amp; Timeless Jewels
            </span>
          </h1>
          <p className="max-w-3xl mx-auto text-base sm:text-lg text-[#8C5E50] leading-relaxed">
            ROSHÉ BEAUTY &amp; JEWELRY was founded with a singular devotion: creating luxury skincare, radiant cosmetics, and 18K gold-plated waterproof jewelry that elevate your everyday presence. From active botanical serums and velvety pigments to sweat-proof, anti-tarnish fine jewelry, every creation embodies purity, durability, and timeless elegance.
          </p>
        </section>

        {/* 4 Pillars of ROSHÉ BEAUTY & JEWELRY */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {[
            {
              icon: Droplets,
              title: "Active Skincare & Serums",
              description:
                "Infused with Vitamin C, Niacinamide, and botanical Hyaluronic acid to deeply replenish, hydrate, and brighten your complexion.",
            },
            {
              icon: Crown,
              title: "Velvet Matte Cosmetics",
              description:
                "Weightless, richly pigmented formulations that deliver 12-hour comfortable wear and a flawless velvet matte finish.",
            },
            {
              icon: Gem,
              title: "18K Gold Waterproof Jewels",
              description:
                "Anti-tarnish, hypoallergenic 316L stainless steel finished in 18K gold PVD. Safe for showers, perfume, and daily wear without fading.",
            },
            {
              icon: ShieldCheck,
              title: "VIP WhatsApp Concierge",
              description:
                `Personalized routine consultations, shade advice, and jewelry sizing at ${STORE_CONTACT.phoneFormatted} with rapid nationwide dispatch.`,
            },
          ].map((v) => {
            const Icon = v.icon;
            return (
              <div
                key={v.title}
                className="bg-white rounded-3xl border border-[#D4A45E]/30 p-6 sm:p-7 text-left transition-all hover:shadow-xl hover:border-[#D4A45E]"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#F4DCD8] text-[#704638] flex items-center justify-center mb-5 shadow-sm">
                  <Icon className="w-6 h-6" />
                </div>
                <h2 className="text-base font-bold text-[#704638] mb-2 font-heading">
                  {v.title}
                </h2>
                <p className="text-xs text-[#8C5E50] leading-relaxed">
                  {v.description}
                </p>
              </div>
            );
          })}
        </section>

        {/* Trust & Quality Commitment */}
        <section className="bg-[#704638] rounded-3xl p-8 sm:p-14 text-center text-white mb-20 relative overflow-hidden shadow-2xl border border-[#D4A45E]/40">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#D4A45E]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <blockquote className="text-xl sm:text-3xl font-extrabold leading-snug tracking-tight font-heading">
              &ldquo;We don&apos;t just craft beauty and jewelry. We inspire confidence, celebrate individuality, and unveil your timeless natural glow.&rdquo;
            </blockquote>
            <p className="mt-6 text-[#D4A45E] text-xs font-semibold tracking-widest uppercase">
              — The ROSHÉ BEAUTY &amp; JEWELRY Quality Standard
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#704638] mb-3 font-heading">
            Discover Your Signature Glow &amp; Elegance
          </h2>
          <p className="text-[#8C5E50] text-sm max-w-lg mx-auto mb-8">
            Explore our curated catalog of luxury skincare, velvet cosmetics, and 18K gold-plated waterproof jewelry.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/collection"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#D4A45E] to-[#B8893E] text-black px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-[#D4A45E]/25 hover:brightness-110 transition-all text-sm"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href={STORE_CONTACT.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-[#D4A45E]/40 bg-white text-[#704638] px-7 py-3.5 rounded-2xl font-semibold hover:bg-[#F4DCD8]/40 transition-all text-sm shadow-sm"
            >
              Consult Concierge on WhatsApp ({STORE_CONTACT.phoneFormatted})
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
