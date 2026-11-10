"use client";

import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import RelatedProducts, { RelatedProduct } from "./RelatedProducts";
import { useEffect } from "react";
import { useRecentlyViewedStore } from "@/store/recently-viewed-store";
import { MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import { STORE_CONTACT } from "@/components/common/SocialIcons";

interface ProductDetailsPageProps {
  product: {
    id: string;
    slug?: string;
    name: string;
    price: number;
    oldPrice?: number;
    description: string;
    rating?: number;
    reviews?: number;
    stock?: number;
    images: {
      id: string;
      url: string;
      alt?: string;
    }[];
  };
  relatedProducts?: RelatedProduct[];
}

export default function ProductDetailsPage({
  product,
  relatedProducts = [],
}: ProductDetailsPageProps) {
  const addItem = useRecentlyViewedStore((s) => s.addItem);

  useEffect(() => {
    if (product?.id) {
      addItem({
        id: product.id,
        slug: product.slug || product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0]?.url || "/placeholder.svg",
      });
    }
  }, [product, addItem]);

  return (
    <main className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 bg-[#F9F4EF]">
      {/* Product Hero */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
        {/* Gallery */}
        <div className="w-full">
          <ProductGallery images={product.images} productName={product.name} />
        </div>

        {/* Info */}
        <div className="w-full">
          <ProductInfo
            product={{
              id: product.id,
              name: product.name,
              price: product.price,
              oldPrice: product.oldPrice,
              description: product.description,
              rating: product.rating,
              reviews: product.reviews,
              stock: product.stock,
              image: product.images?.[0]?.url,
            }}
          />
        </div>
      </div>

      {/* Beauty Advisory Strip */}
      <section className="mt-16 sm:mt-24 rounded-3xl bg-[#704638] p-6 sm:p-10 border border-[#D4A45E]/40 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(ellipse_at_top_right,rgba(212,164,94,0.2)_0%,transparent_70%)] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D4A45E]/40 bg-[#D4A45E]/20 px-3.5 py-1 text-xs font-mono font-semibold uppercase tracking-wider text-[#D4A45E] mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ROSHÉ VIP Advisory</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-heading">
              Need Sizing, Shade Guidance, or Product Advice?
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-[#F4DCD8] leading-relaxed">
              Our dedicated ROSHÉ BEAUTY &amp; JEWELRY specialists provide customized regimen recommendations, jewelry sizing guidance, and live shade swatch matching on WhatsApp.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`https://wa.me/${STORE_CONTACT.whatsappNumber}?text=${encodeURIComponent(
                `Hi ROSHÉ BEAUTY & JEWELRY! I would like to consult an advisor regarding: ${product.name}.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#D4A45E] to-[#B8893E] px-6 py-3 text-xs sm:text-sm font-bold text-black shadow-lg shadow-[#D4A45E]/20 transition hover:brightness-110 active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Consult Advisor on WhatsApp</span>
            </a>

            <div className="flex items-center gap-2 text-xs text-[#F4DCD8] border border-white/20 rounded-xl px-4 py-3 bg-white/10">
              <ShieldCheck className="w-4 h-4 text-[#D4A45E]" />
              <span>100% Authentic Quality</span>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <RelatedProducts products={relatedProducts} />
      )}
    </main>
  );
}
