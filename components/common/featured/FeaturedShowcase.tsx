"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Flame,
  MessageCircle,
  Heart,
  CheckCircle2,
  ShieldCheck,
  Tag,
  MapPin,
  Phone,
} from "lucide-react";
import { Product } from "@/services/product.service";
import { useCartStore } from "@/store/cart-store";
import { toast } from "sonner";
import ProductCard from "@/components/common/product-card/ProductCard";
import { STORE_CONTACT } from "@/components/common/SocialIcons";

interface FeaturedShowcaseProps {
  featuredProducts?: Product[];
  upcomingProducts?: Product[];
}

interface BeautyHighlight {
  id: string;
  shortTitle: string;
  badge: string;
  title: string;
  tagline: string;
  description: string;
  category: string;
  image: string;
  specs: { label: string; value: string }[];
  highlights: string[];
  inquiryText: string;
}

const DEFAULT_SIGNATURE_BEAUTY_HIGHLIGHTS: BeautyHighlight[] = [
  {
    id: "radiant-vitamin-c-serum",
    shortTitle: "✨ Rose Gold Glow Serum",
    badge: "Signature Formulation · Active Radiance",
    title: "Radiant Rose Gold Vitamin C Glow Serum",
    tagline: "Concentrated 15% Vitamin C, Niacinamide & Hyaluronic Elixir",
    description:
      "Need personalized skincare advice for glowing, even-toned skin? Our beauty consultants help you tailor your morning and evening skincare routines for noticeable radiance and youthful firmness.",
    category: "Skincare",
    image: "/categories/skincare-serums.svg",
    specs: [
      { label: "Active Blend", value: "15% Pure Vitamin C" },
      { label: "Key Ingredient", value: "Niacinamide + HA" },
      { label: "Finish", value: "Dewy Glass Skin" },
      { label: "Skin Type", value: "All Skin Types" },
    ],
    highlights: [
      "Visibly brightens dull tone and fades dark spots",
      "Locks in deep 72-hour moisture with botanical hyaluronic acid",
      "Direct consultation with ROSHÉ BEAUTY & JEWELRY specialists on WhatsApp",
    ],
    inquiryText: "Radiant Rose Gold Vitamin C Glow Serum Consultation",
  },
  {
    id: "waterproof-gold-herringbone-chain",
    shortTitle: "👑 18K Waterproof Jewelry",
    badge: "18K Gold PVD · Waterproof & Anti-Tarnish",
    title: "18K Gold-Plated Waterproof Herringbone Snake Chain",
    tagline: "Solid 316L Stainless Steel with Permanent Gold PVD Finish",
    description:
      "Tired of jewelry that tarnishes after perfume or showers? Our fine jewelry is engineered with hypoallergenic 316L stainless steel and real 18K gold vacuum plating—designed to wear 24/7 without turning green or losing its luster.",
    category: "Fine Jewelry",
    image: "/categories/fine-jewelry.svg",
    specs: [
      { label: "Plating", value: "18K Gold PVD" },
      { label: "Core Metal", value: "316L Stainless Steel" },
      { label: "Durability", value: "100% Waterproof" },
      { label: "Skin Safety", value: "Hypoallergenic & Nickel-Free" },
    ],
    highlights: [
      "Wear in shower, pool, and gym without color fading or skin greening",
      "Immune to perfume, sweating, and humidity",
      "Signature ROSHÉ luxury velvet jewelry box included",
    ],
    inquiryText: "18K Gold Waterproof Herringbone Necklace Consultation",
  },
  {
    id: "velvet-matte-lipstick",
    shortTitle: "💄 Velvet Matte Lip Elixir",
    badge: "Pure Pigment · Long-Wear Glamour",
    title: "Velvet Matte Hydrating Lip Elixir Collection",
    tagline: "Infused with Jojoba Oil, Vitamin E & Weightless 12H Wear",
    description:
      "Looking for the perfect shade match for your skin tone? Contact our beauty stylists on WhatsApp for live swatch recommendations and personalized lip care tips.",
    category: "Cosmetics",
    image: "/categories/lip-eye-care.svg",
    specs: [
      { label: "Finish", value: "Velvet Soft Matte" },
      { label: "Wear Time", value: "Up to 12 Hours" },
      { label: "Nourishment", value: "Jojoba + Vit E" },
      { label: "Texture", value: "Non-Drying Comfort" },
    ],
    highlights: [
      "Ultra-pigmented single-swipe coverage without feathering",
      "Transfer-resistant, lightweight, and cushiony on lips",
      "Cruelty-free & free of harsh synthetic parabens",
    ],
    inquiryText: "Velvet Matte Lip Elixir Shade Matching",
  },
  {
    id: "botanical-barrier-cream",
    shortTitle: "🌿 Barrier Restore Cream",
    badge: "Skin Recovery · Deep Moisture",
    title: "Botanical Barrier Deep Restoration Moisture Cream",
    tagline: "Ceramide NP Complex, Centella Asiatica & Organic Squalane",
    description:
      "Strengthen your moisture barrier and calm redness. Formulated with soothing botanical extracts to restore hydration, smooth fine texture, and protect against dry weather.",
    category: "Skincare",
    image: "/categories/skincare-serums.svg",
    specs: [
      { label: "Ceramides", value: "Tri-Ceramide Complex" },
      { label: "Soothing", value: "Centella & Squalane" },
      { label: "Texture", value: "Rich Silky Cream" },
      { label: "Safety", value: "Hypoallergenic" },
    ],
    highlights: [
      "Repairs compromised skin barrier within 7 days",
      "Calms redness, sensitivity, and environmental dryness",
      "Perfect base under makeup or as an overnight recovery balm",
    ],
    inquiryText: "Botanical Barrier Restoration Cream Advice",
  },
  {
    id: "illuminating-pearl-palette",
    shortTitle: "💎 Pearl Glow Palette",
    badge: "Highlighter & Contour · Multi-Glow",
    title: "Illuminating Pearl Highlighting & Glow Palette",
    tagline: "Ultra-Fine Micro-Pearls for a Candlelit Radiance",
    description:
      "Elevate your makeup with multi-dimensional shimmer. Featuring four versatile, universally flattering shades that melt effortlessly into the skin for a natural, lit-from-within glow.",
    category: "Cosmetics",
    image: "/categories/luxury-cosmetics.svg",
    specs: [
      { label: "Formula", value: "Micro-Milled Powder" },
      { label: "Shades", value: "4 Versatile Tones" },
      { label: "Application", value: "Wet & Dry Blending" },
      { label: "Glow Level", value: "Customizable Radiance" },
    ],
    highlights: [
      "Seamlessly blends without accentuating pores or texture",
      "Doubles as radiant eyeshadow and collarbone highlighter",
      "Luxury compact with custom mirror for on-the-go glamour",
    ],
    inquiryText: "Illuminating Pearl Highlighting Palette Tips",
  },
];

const fallbackFeaturedProducts: Product[] = [
  {
    id: "fallback-f-1",
    name: "Radiant Rose Gold Vitamin C Glow Serum 30ml",
    price: 4850,
    compare_at_price: 5500,
    slug: "radiant-vitamin-c-glow-serum",
    product_images: [{ id: "fb-img-1", image_url: "/categories/skincare-serums.svg", position: 0 }],
  } as unknown as Product,
  {
    id: "fallback-f-2",
    name: "18K Gold-Plated Waterproof Herringbone Snake Chain",
    price: 3650,
    compare_at_price: 4200,
    slug: "18k-gold-plated-waterproof-herringbone-necklace",
    product_images: [{ id: "fb-img-2", image_url: "/categories/fine-jewelry.svg", position: 0 }],
  } as unknown as Product,
  {
    id: "fallback-f-3",
    name: "Velvet Matte Luxe Hydrating Lipstick — Rose Nude",
    price: 2950,
    compare_at_price: 3500,
    slug: "velvet-matte-luxe-lipstick",
    product_images: [{ id: "fb-img-3", image_url: "/categories/lip-eye-care.svg", position: 0 }],
  } as unknown as Product,
  {
    id: "fallback-f-4",
    name: "Sparkling Zirconia Waterproof Eternity Band (18K PVD)",
    price: 2850,
    compare_at_price: 3400,
    slug: "sparkling-zirconia-eternity-band-ring",
    product_images: [{ id: "fb-img-4", image_url: "/categories/fine-jewelry.svg", position: 0 }],
  } as unknown as Product,
];

export default function FeaturedShowcase({
  featuredProducts = [],
  upcomingProducts = [],
}: FeaturedShowcaseProps) {
  const addItemToCart = useCartStore((s) => s.addItem);
  const [selectedHighlightIdx, setSelectedHighlightIdx] = useState(0);
  const [upcomingImgLoaded, setUpcomingImgLoaded] = useState(false);
  const [upcomingImgSrc, setUpcomingImgSrc] = useState<string | null>(null);

  const highlights = useMemo(() => {
    if (upcomingProducts && upcomingProducts.length > 0) {
      const dbHighlights: BeautyHighlight[] = upcomingProducts.map((p) => ({
        id: String(p.id),
        shortTitle: `✨ ${p.name.split(" ").slice(0, 3).join(" ")}`,
        badge: "New Release · Upcoming Beauty",
        title: p.name,
        tagline: "Curated by ROSHÉ BEAUTY & JEWELRY Specialists",
        description:
          p.description ||
          "Looking for product ingredients, shade guidance, or jewelry specifications? Consult our team directly on WhatsApp for full details and swatches.",
        category: "Upcoming Exclusives",
        image: p.product_images?.[0]?.image_url || "/placeholder.svg",
        specs: [
          { label: "Status", value: "New Arrival" },
          { label: "Quality", value: "Verified Authentic" },
          { label: "Consultation", value: "Available on WhatsApp" },
          { label: "Dispatch Area", value: "Nationwide Pakistan" },
        ],
        highlights: [
          "Pure, fresh, and authentic beauty and jewelry creations",
          "Personalized routine, shade, and sizing consultations",
          "Direct WhatsApp care from ROSHÉ BEAUTY & JEWELRY specialists",
        ],
        inquiryText: `${p.name} Details & Consultation`,
      }));
      return [...dbHighlights, ...DEFAULT_SIGNATURE_BEAUTY_HIGHLIGHTS];
    }
    return DEFAULT_SIGNATURE_BEAUTY_HIGHLIGHTS;
  }, [upcomingProducts]);

  const currentHighlight = highlights[selectedHighlightIdx] || highlights[0];

  const activeFeatured =
    featuredProducts.length > 0 ? featuredProducts : fallbackFeaturedProducts;

  const handleAddToCart = (product: { id: string | number; name: string; price: number; image: string }) => {
    addItemToCart({
      id: String(product.id),
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    });
    toast.success(`${product.name} added to cart`);
  };

  const currentImageUrl =
    upcomingImgSrc || currentHighlight?.image || "/placeholder.svg";

  const whatsappInquiryUrl = `https://wa.me/${STORE_CONTACT.whatsappNumber}?text=${encodeURIComponent(
    `Hi ROSHÉ BEAUTY & JEWELRY! I would like personal advice and details for: ${currentHighlight.title}. Please provide details.`
  )}`;

  return (
    <section className="container mx-auto my-14 px-4 sm:px-6 lg:px-8 max-w-7xl">
      {/* ── Signature Beauty Spotlight Section ── */}
      <div className="mb-16 relative overflow-hidden rounded-3xl bg-[#704638] text-white border border-[#D4A45E]/40 shadow-2xl">
        {/* Ambient Spotlight Background Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[radial-gradient(ellipse_at_top,rgba(212,164,94,0.22)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-[radial-gradient(ellipse_at_bottom,rgba(244,220,216,0.18)_0%,transparent_70%)] pointer-events-none" />

        <div className="relative z-10 p-6 sm:p-10 lg:p-12">
          {/* ── Selector Navigation Bar ── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 mb-6 border-b border-white/10">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-[#D4A45E]">
              <Sparkles className="w-4 h-4" />
              <span>ROSHÉ Signature Exclusives</span>
            </div>

            {/* Interactive Solution Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              {highlights.map((item, idx) => {
                const isActive = selectedHighlightIdx === idx;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedHighlightIdx(idx);
                      setUpcomingImgSrc(null);
                      setUpcomingImgLoaded(false);
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border cursor-pointer ${
                      isActive
                        ? "bg-[#D4A45E] text-[#704638] border-[#D4A45E] font-bold shadow-md shadow-[#D4A45E]/30"
                        : "bg-white/10 text-[#F4DCD8] border-white/15 hover:bg-white/15 hover:text-white"
                    }`}
                  >
                    {item.shortTitle}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Main Showcase Grid ── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentHighlight.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              {/* Left Column */}
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#D4A45E]/40 bg-[#D4A45E]/20 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#D4A45E] mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{currentHighlight.badge}</span>
                </div>

                <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
                  {currentHighlight.title}
                </h2>

                <p className="mt-1 text-xs sm:text-sm font-semibold text-[#D4A45E]">
                  {currentHighlight.tagline}
                </p>

                <p className="mt-3 text-xs sm:text-sm text-[#F4DCD8] max-w-xl leading-relaxed">
                  {currentHighlight.description}
                </p>

                {/* Specs Grid */}
                <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-xl">
                  {currentHighlight.specs.map((spec, sIdx) => (
                    <div
                      key={sIdx}
                      className="rounded-xl border border-white/15 bg-white/10 p-2.5 backdrop-blur-sm"
                    >
                      <span className="block text-[10px] font-mono uppercase tracking-wider text-[#F4DCD8]/80 truncate">
                        {spec.label}
                      </span>
                      <span className="block text-xs sm:text-sm font-bold text-white mt-0.5 truncate">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Highlights */}
                <div className="mt-4 space-y-1.5 max-w-xl">
                  {currentHighlight.highlights.map((h, hIdx) => (
                    <div
                      key={hIdx}
                      className="flex items-center gap-2 text-xs text-[#F4DCD8]"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#D4A45E] shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>

                {/* Call To Action Buttons */}
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <a
                    href={whatsappInquiryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#D4A45E] to-[#B8893E] px-5 py-3 text-xs sm:text-sm font-bold text-black shadow-lg shadow-[#D4A45E]/20 transition-all hover:brightness-110 active:scale-95"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Ask Concierge on WhatsApp</span>
                  </a>

                  <Link
                    href="/collection"
                    className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-xs sm:text-sm font-medium text-white transition-all hover:bg-white/15"
                  >
                    <Heart className="w-4 h-4 text-[#D4A45E]" />
                    <span>View Collection</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Right Column: Visual Preview */}
              <div className="lg:col-span-5 flex flex-col items-center">
                <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-2xl border border-[#D4A45E]/30 bg-white p-4 shadow-xl">
                  <div className="relative h-full w-full overflow-hidden rounded-xl bg-[#F9F4EF] flex items-center justify-center">
                    {!upcomingImgLoaded && (
                      <div className="absolute inset-0 z-0 bg-[#F4DCD8] animate-pulse rounded-xl" />
                    )}

                    <Image
                      src={currentImageUrl}
                      alt={currentHighlight.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      className={`object-contain p-6 transition-all duration-700 hover:scale-105 ${
                        upcomingImgLoaded ? "opacity-100" : "opacity-0"
                      }`}
                      onLoad={() => setUpcomingImgLoaded(true)}
                      onError={() => {
                        setUpcomingImgSrc("/placeholder.svg");
                        setUpcomingImgLoaded(true);
                      }}
                    />

                    {/* Top Right: Quality Badge */}
                    <div className="absolute top-3 right-3 rounded-xl bg-[#704638]/90 px-3 py-1.5 text-[11px] font-bold text-[#D4A45E] backdrop-blur-md border border-[#D4A45E]/30 flex items-center gap-1.5 shadow-md">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#D4A45E]" />
                      <span>100% Authentic</span>
                    </div>

                    {/* Bottom Category Pill */}
                    <div className="absolute bottom-3 left-3 rounded-xl bg-[#704638]/90 px-3 py-1.5 text-[11px] font-medium text-[#F4DCD8] backdrop-blur-md border border-[#D4A45E]/30 flex items-center gap-1.5 shadow-md">
                      <Tag className="w-3.5 h-3.5 text-[#D4A45E]" />
                      <span>{currentHighlight.category}</span>
                    </div>
                  </div>
                </div>

                {/* Physical Store Strip */}
                <div className="mt-3 text-[11px] text-[#F4DCD8] flex flex-wrap items-center justify-center gap-2">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#D4A45E]" />
                    <span>{STORE_CONTACT.address}</span>
                  </span>
                  <span className="text-[#D4A45E] hidden sm:inline">•</span>
                  <span className="flex items-center gap-1 font-mono">
                    <Phone className="w-3 h-3 text-[#D4A45E]" />
                    <span>{STORE_CONTACT.phoneFormatted}</span>
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Featured Products Section ── */}
      <div>
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#D4A45E]/30 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#D4A45E] mb-1">
              <Flame className="w-4 h-4 text-[#D4A45E]" />
              <span>Handpicked Luxury</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#704638] font-heading">
              Featured Beauty &amp; Jewelry Exclusives
            </h2>
          </div>
          <Link
            href="/collection"
            className="group flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#704638] hover:text-[#D4A45E] transition-colors"
          >
            <span>Explore Entire Collection</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {activeFeatured.map((p) => {
            const imgUrl =
              p.product_images?.[0]?.image_url || "/placeholder.svg";
            const isSale = p.compare_at_price
              ? p.compare_at_price > p.price
              : false;

            return (
              <ProductCard
                key={p.id}
                product={{
                  id: p.id,
                  slug: p.slug,
                  name: p.name,
                  image: imgUrl,
                  price: p.price,
                  oldPrice: p.compare_at_price ?? undefined,
                  sale: isSale,
                }}
                onAddToCart={(cardProduct) =>
                  handleAddToCart({
                    id: cardProduct.id,
                    name: cardProduct.name,
                    price: cardProduct.price,
                    image: cardProduct.image,
                  })
                }
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
