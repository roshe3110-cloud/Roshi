import type { Metadata } from "next";
import Features from "@/components/common/card/Features";
import BannerSlider from "@/components/common/hero/BannerSlider";
import Marquee from "@/components/common/marquee/Marquee";
import ProductsGrid from "@/components/common/product-card/ProductsGrid";
import ProductsHydrator from "@/components/common/product-card/ProductsHydrator";
import CollectionShowcase from "@/components/common/showcase/CollectionShowcase";
import FeaturedShowcase from "@/components/common/featured/FeaturedShowcase";
import RecentlyViewedSection from "@/components/common/recently-viewed/RecentlyViewedSection";
import PopupModal from "@/components/common/popup/PopupModal";
import { getCategories } from "@/services/category.service";
import { getCategorySlug } from "@/lib/utils";
import {
  getLatestProducts,
  getFeaturedProducts,
  getUpcomingProducts,
  Product,
} from "@/services/product.service";
import { getBanners } from "@/services/banner.service";
import type { CollectionItem } from "@/components/common/showcase/types";
import type { Banner } from "@/services/banner.service";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "ROSHÉ BEAUTY | Luxury Skincare, Cosmetics & Radiant Beauty Essentials",
  description:
    "Shop premium luxury skincare, velvet matte cosmetics, rejuvenating face serums, and radiant beauty essentials at ROSHÉ BEAUTY. Authentic products with nationwide delivery.",
  alternates: { canonical: "/" },
  keywords: [
    "ROSHÉ BEAUTY",
    "Roshe Beauty",
    "Luxury Skincare Pakistan",
    "Cosmetics Pakistan",
    "Face Serums",
    "Velvet Matte Lipstick",
    "Glow Palette",
    "Dermatology Tested Skincare",
  ],
  openGraph: {
    url: "/",
    title: "ROSHÉ BEAUTY | Luxury Skincare, Cosmetics & Radiant Beauty Essentials",
    description: "Shop premium luxury skincare, velvet cosmetics, and radiant beauty essentials.",
    images: [{ url: "/logo.png", width: 1200, height: 630, alt: "ROSHÉ BEAUTY" }],
  },
};

const fallbackDefaultProducts = [
  {
    id: "fallback-prod-1",
    slug: "radiant-vitamin-c-glow-serum",
    name: "Radiant Rose Gold Vitamin C Glow Serum 30ml",
    price: 4850,
    oldPrice: 5500,
    sale: true,
    image: "/categories/skincare-serums.svg",
  },
  {
    id: "fallback-prod-2",
    slug: "velvet-matte-luxe-lipstick",
    name: "Velvet Matte Luxe Hydrating Lipstick — Rose Nude",
    price: 2950,
    oldPrice: 3500,
    sale: false,
    image: "/categories/lip-eye-care.svg",
  },
  {
    id: "fallback-prod-3",
    slug: "botanical-barrier-restoration-cream",
    name: "Botanical Barrier Deep Restoration Moisture Cream",
    price: 3800,
    oldPrice: 4400,
    sale: false,
    image: "/categories/skincare-serums.svg",
  },
  {
    id: "fallback-prod-4",
    slug: "illuminating-pearl-highlighter-palette",
    name: "Illuminating Pearl Highlighting & Contour Glow Palette",
    price: 4200,
    oldPrice: 4900,
    sale: true,
    image: "/categories/luxury-cosmetics.svg",
  },
];

export default async function Home() {
  const [latestRes, featuredRes, upcomingRes, categoriesRes, bannersRes] =
    await Promise.allSettled([
      getLatestProducts(8),
      getFeaturedProducts(4),
      getUpcomingProducts(1),
      getCategories(),
      getBanners(),
    ]);

  const dbProducts: Product[] =
    latestRes.status === "fulfilled" ? latestRes.value || [] : [];
  const featuredProducts: Product[] =
    featuredRes.status === "fulfilled" ? featuredRes.value || [] : [];
  const upcomingProducts: Product[] =
    upcomingRes.status === "fulfilled" ? upcomingRes.value || [] : [];
  const cats =
    categoriesRes.status === "fulfilled" ? categoriesRes.value || [] : [];
  const banners: Banner[] =
    bannersRes.status === "fulfilled" ? bannersRes.value || [] : [];

  let showcaseItems: CollectionItem[] = [];

  if (cats && cats.length > 0) {
    showcaseItems = cats.map((cat) => ({
      id: cat.id,
      title: cat.name,
      image: cat.image_url ?? "/placeholder.svg",
      href: `/collection?category=${getCategorySlug(cat)}`,
    }));
  } else {
    showcaseItems = [
      {
        id: "skincare-serums",
        title: "Skincare & Serums",
        image: "/categories/skincare-serums.svg",
        href: "/collection?category=skincare-serums",
      },
      {
        id: "luxury-cosmetics",
        title: "Luxury Cosmetics",
        image: "/categories/luxury-cosmetics.svg",
        href: "/collection?category=luxury-cosmetics",
      },
      {
        id: "lip-eye-care",
        title: "Lip & Eye Care",
        image: "/categories/lip-eye-care.svg",
        href: "/collection?category=lip-eye-care",
      },
      {
        id: "fragrance-glow",
        title: "Fragrance & Glow",
        image: "/categories/fragrance-glow.svg",
        href: "/collection?category=fragrance-glow",
      },
    ];
  }

  const mappedProducts = dbProducts.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    image: p.product_images?.[0]?.image_url || "/placeholder.svg",
    price: p.price,
    oldPrice: p.compare_at_price || undefined,
    sale: p.compare_at_price ? p.compare_at_price > p.price : false,
  }));

  const activeProducts =
    mappedProducts.length > 0 ? mappedProducts : fallbackDefaultProducts;

  return (
    <div className="bg-[#F9F4EF]">
      {/* Promotional & Announcement Popup Ad */}
      <PopupModal />

      <ProductsHydrator products={activeProducts} />

      <div className="container mx-auto sm:max-w-7xl px-4 sm:px-6">
        {/* Hero Banner Slider */}
        <BannerSlider banners={banners} />
      </div>

      {/* Dynamic Marquee with Beauty & Glow Highlights */}
      <Marquee
        speed={20}
        items={[
          "🌸 Luxury Skincare & Radiant Skin Formulations",
          "💄 Velvet Matte Pigments & Exquisite Cosmetics",
          "✨ 100% Authentic Quality & Tested Formulations",
          "🌿 Nourishing Botanicals, Vitamin C & Hyaluronic Elixirs",
          "🚚 Free Nationwide Delivery Across Pakistan",
          "💬 Personalized WhatsApp Consultations & Rapid Dispatch",
        ]}
      />

      <div className="container mx-auto sm:max-w-7xl">
        <Features />

        {/* Featured Exclusives & Spotlight */}
        <FeaturedShowcase
          featuredProducts={featuredProducts}
          upcomingProducts={upcomingProducts}
        />

        {/* Categories Showcase */}
        <CollectionShowcase items={showcaseItems} />

        {/* Latest Products Grid */}
        <ProductsGrid products={activeProducts} />

        {/* Recently Viewed Products */}
        <RecentlyViewedSection />
      </div>
    </div>
  );
}
