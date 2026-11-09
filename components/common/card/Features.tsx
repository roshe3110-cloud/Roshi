"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  Heart,
  ShieldCheck,
  Truck,
  Droplets,
  CheckCircle2,
  Crown,
  MessageCircle,
  Star,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function Features() {
  return (
    <section className="my-20 sm:my-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* ── Section Header ── */}
      <div className="mb-14 text-center md:text-left md:flex md:items-end md:justify-between border-b border-[#D4A45E]/30 pb-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest bg-gradient-to-r from-[#F4DCD8] to-[#EBD5C5] text-[#704638] border border-[#D4A45E]/40 shadow-xs mb-3.5">
            <Sparkles className="w-3.5 h-3.5 text-[#D4A45E]" />
            <span>Pure Luxury &amp; Timeless Radiance</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#704638] leading-tight">
            Crafted For Your{" "}
            <span className="bg-gradient-to-r from-[#704638] via-[#B8893E] to-[#704638] bg-clip-text text-transparent">
              Natural Radiance.
            </span>
          </h2>

          <p className="mt-3 text-sm sm:text-base text-[#8C5E50] leading-relaxed">
            Why skincare connoisseurs and beauty enthusiasts across Pakistan trust ROSHÉ BEAUTY for their everyday luminous glow.
          </p>
        </div>

        {/* Live Trust Metrics Tag */}
        <div className="mt-6 md:mt-0 flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#D4A45E]/40 shadow-xs text-xs font-semibold text-[#704638]">
            <div className="flex text-[#D4A45E]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-[#D4A45E]" />
              ))}
            </div>
            <span>4.9 / 5 Rating (15K+ Orders)</span>
          </div>
        </div>
      </div>

      {/* ── High-Fashion Bento Grid Layout ── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-7">
        {/* ── Bento 1: Botanical Elixirs (Span 7 cols) - Rose Brown Luxury ── */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="md:col-span-7 relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#5D372B] via-[#704638] to-[#4F2C21] text-white p-8 sm:p-10 border border-[#D4A45E]/40 shadow-2xl flex flex-col justify-between group hover:border-[#D4A45E] hover:shadow-2xl hover:shadow-[#D4A45E]/20 transition-all duration-500"
        >
          {/* Ambient Warm Golden Halo Glow (Desktop only, lightweight blur) */}
          <div className="hidden sm:block absolute -right-20 -top-20 w-72 h-72 bg-[#D4A45E]/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute right-6 top-6 font-mono text-[10px] text-[#D4A45E] uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full border border-white/15 backdrop-blur-md">
            ROSHÉ // ACTIVE FLORA
          </div>

          <div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-white/15 to-white/5 border border-white/20 text-[#D4A45E] flex items-center justify-center mb-6 shadow-inner group-hover:scale-105 transition-transform duration-300">
              <Droplets className="w-7 h-7 fill-[#D4A45E]/30" />
            </div>

            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#D4A45E] mb-2 uppercase tracking-wider font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Bio-Concentrated Cellular Elixirs</span>
            </div>

            <h3 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-3 leading-snug">
              Deep Hydration &amp; Rose Gold Radiance
            </h3>

            <p className="text-xs sm:text-sm text-[#F4DCD8] leading-relaxed max-w-xl mb-8">
              Enriched with stable Vitamin C, fermented Niacinamide, and triple-weight Hyaluronic botanicals. Deeply replenishes the moisture barrier, visibly brightens uneven tone, and defends against environmental dullness.
            </p>
          </div>

          {/* Micro Specs Pills */}
          <div className="flex flex-wrap items-center gap-2.5 pt-6 border-t border-white/15">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3.5 py-1.5 rounded-full bg-white/10 text-white border border-white/20 backdrop-blur-md shadow-xs">
              <Sparkles className="w-3 h-3 text-[#D4A45E]" />
              Pure Vitamin C &amp; Rose Gold
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3.5 py-1.5 rounded-full bg-white/10 text-white border border-white/20 backdrop-blur-md shadow-xs">
              <CheckCircle2 className="w-3 h-3 text-[#D4A45E]" />
              72H Moisture Lock
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3.5 py-1.5 rounded-full bg-white/10 text-white border border-white/20 backdrop-blur-md shadow-xs">
              <Heart className="w-3 h-3 text-[#F4DCD8]" />
              Dermatologist Verified
            </span>
          </div>
        </motion.div>

        {/* ── Bento 2: Velvet Matte Haute Cosmetics (Span 5 cols) - Pure White ── */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="md:col-span-5 relative overflow-hidden rounded-[32px] bg-white p-8 sm:p-10 border border-[#D4A45E]/40 shadow-lg flex flex-col justify-between group hover:border-[#D4A45E] hover:shadow-2xl hover:shadow-[#D4A45E]/15 transition-all duration-500"
        >
          <div className="absolute right-6 top-6 font-mono text-[10px] text-[#8C5E50] uppercase tracking-widest bg-[#F9F4EF] px-3 py-1 rounded-full border border-[#D4A45E]/30">
            MAKEUP // VELVET
          </div>

          <div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#F4DCD8] to-[#EBD5C5] text-[#704638] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300 shadow-sm">
              <Crown className="w-7 h-7 text-[#704638]" />
            </div>

            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#8C5E50] mb-2 uppercase tracking-wider font-semibold">
              <span>Velvet Matte &amp; Weightless Texture</span>
            </div>

            <h3 className="font-heading text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-[#704638] mb-3 leading-snug">
              Weightless Lipsticks &amp; Radiant Palettes
            </h3>

            <p className="text-xs sm:text-sm text-[#8C5E50] leading-relaxed mb-6">
              Richly concentrated mineral pigments designed for effortless glide, featherlight velvet feel, and 12-hour comfortable wear that never feathers or dries.
            </p>

            {/* Visual Velvet Shade Swatches */}
            <div className="flex items-center gap-2 mb-6">
              <span className="text-[11px] font-mono text-[#8C5E50] uppercase tracking-wider">
                Signature Shades:
              </span>
              <div className="flex items-center -space-x-1.5">
                <div className="w-5 h-5 rounded-full bg-[#8E2838] border-2 border-white shadow-xs" title="Ruby Velvet" />
                <div className="w-5 h-5 rounded-full bg-[#B85860] border-2 border-white shadow-xs" title="Rose Cashmere" />
                <div className="w-5 h-5 rounded-full bg-[#D48270] border-2 border-white shadow-xs" title="Warm Nude" />
                <div className="w-5 h-5 rounded-full bg-[#E5A17A] border-2 border-white shadow-xs" title="Peach Glow" />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 pt-6 border-t border-[#F4DCD8]">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-[#F9F4EF] text-[#704638] border border-[#D4A45E]/30 shadow-xs">
              <CheckCircle2 className="w-3 h-3 text-[#D4A45E]" />
              12H Comfort Wear
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-[#F9F4EF] text-[#704638] border border-[#D4A45E]/30 shadow-xs">
              <Sparkles className="w-3 h-3 text-[#D4A45E]" />
              Non-Drying Matte
            </span>
          </div>
        </motion.div>

        {/* ── Bento 3: Clean Clinical & Gentle Formula (Span 5 cols) - Silk Blush ── */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="md:col-span-5 relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#F4DCD8] via-[#F8E8E5] to-[#EBD5C5] p-8 sm:p-10 border border-[#D4A45E]/40 shadow-lg flex flex-col justify-between group hover:border-[#D4A45E] hover:shadow-2xl hover:shadow-[#D4A45E]/15 transition-all duration-500"
        >
          <div className="absolute right-6 top-6 font-mono text-[10px] text-[#704638] uppercase tracking-widest bg-white/70 px-3 py-1 rounded-full border border-[#D4A45E]/30">
            ETHICAL // CLEAN
          </div>

          <div>
            <div className="w-14 h-14 rounded-2xl bg-white text-[#704638] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300 shadow-sm border border-[#D4A45E]/30">
              <ShieldCheck className="w-7 h-7 text-[#704638]" />
            </div>

            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#704638] mb-2 uppercase tracking-wider font-bold">
              <span>Pure &amp; Dermatologically Gentle</span>
            </div>

            <h3 className="font-heading text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-[#704638] mb-3 leading-snug">
              Gentle on Sensitive Skin Types
            </h3>

            <p className="text-xs sm:text-sm text-[#704638]/85 leading-relaxed mb-6">
              Formulated without harsh parabens, sulfates, synthetic irritants, or phthalates. Thoughtfully balanced to support your natural skin barrier and reveal healthy radiance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 pt-6 border-t border-[#704638]/15">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-white text-[#704638] border border-[#D4A45E]/30 shadow-xs">
              <Heart className="w-3 h-3 text-rose-500 fill-rose-500/20" />
              100% Cruelty-Free
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-white text-[#704638] border border-[#D4A45E]/30 shadow-xs">
              <CheckCircle2 className="w-3 h-3 text-[#D4A45E]" />
              Paraben-Free
            </span>
          </div>
        </motion.div>

        {/* ── Bento 4: VIP WhatsApp Advisory & Luxury Unboxing (Span 7 cols) ── */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="md:col-span-7 relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#FAF3EB] via-[#F4DCD8] to-[#EBD5C5] text-[#704638] p-8 sm:p-10 border border-[#D4A45E]/40 shadow-xl flex flex-col justify-between group hover:border-[#D4A45E] hover:shadow-2xl hover:shadow-[#D4A45E]/20 transition-all duration-500"
        >
          <div className="absolute right-6 top-6 font-mono text-[10px] text-[#704638] uppercase tracking-widest bg-white/80 px-3 py-1 rounded-full border border-[#D4A45E]/30">
            SERVICE // WHITE-GLOVE
          </div>

          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-[#704638] text-[#D4A45E] flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-md">
                <Truck className="w-7 h-7" />
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#25D366]/15 border border-[#25D366]/30 text-[#128C7E] text-xs font-bold">
                <span className="h-2 w-2 rounded-full bg-[#25D366] animate-ping" />
                <span>Live WhatsApp Shade Concierge</span>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#704638] mb-2 uppercase tracking-wider font-bold">
              <span>Personalized Beauty Advisory &amp; Safe Nationwide Delivery</span>
            </div>

            <h3 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#704638] mb-3 leading-snug">
              WhatsApp Shade Matching &amp; Luxury Unboxing
            </h3>

            <p className="text-xs sm:text-sm text-[#8C5E50] leading-relaxed max-w-xl mb-6">
              Unsure which serum or lipstick matches your undertone? Chat directly with our beauty advisors on WhatsApp. Every ROSHÉ package arrives in sealed luxury presentation packaging across Pakistan.
            </p>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#704638] text-white hover:bg-gradient-to-r hover:from-[#D4A45E] hover:to-[#B8893E] hover:text-[#704638] text-xs font-bold transition-all duration-300 shadow-md mb-6 w-fit"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Connect With A Beauty Advisor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 pt-6 border-t border-[#D4A45E]/30">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-white/90 text-[#704638] border border-[#D4A45E]/30 shadow-xs">
              <CheckCircle2 className="w-3 h-3 text-[#D4A45E]" />
              Free Delivery Across Pakistan
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-white/90 text-[#704638] border border-[#D4A45E]/30 shadow-xs">
              <Sparkles className="w-3 h-3 text-[#D4A45E]" />
              Luxury Gift-Ready Presentation
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
