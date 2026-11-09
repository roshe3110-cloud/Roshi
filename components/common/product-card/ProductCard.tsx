"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus, ArrowUpRight, Sparkles, Check } from "lucide-react";
import { Product } from "./types";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export default function ProductCard({
  product,
  onAddToCart,
}: ProductCardProps) {
  const [clicked, setClicked] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const initialImage =
    product.image && product.image.trim() !== ""
      ? product.image
      : "/placeholder.svg";
  const [imgSrc, setImgSrc] = useState(initialImage);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart?.(product);
    setClicked(true);
    setTimeout(() => setClicked(false), 1200);
  };

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[#D4A45E]/30 bg-white transition-all duration-300 hover:border-[#D4A45E] hover:shadow-xl hover:shadow-[#D4A45E]/15">
      {/* ── Top Micro-Bar ── */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#F9F4EF] p-2.5 sm:p-3">
        {/* Ambient Top Micro Badges */}
        <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5 items-start">
          {product.sale ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#704638] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#F4DCD8] shadow-sm">
              Sale Offer
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/95 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-medium text-[#704638] border border-[#D4A45E]/30 shadow-sm">
              <Sparkles className="w-2.5 h-2.5 text-[#D4A45E]" />
              Authentic
            </span>
          )}
        </div>

        {/* Quick View Corner Action */}
        <Link
          href={`/collection/${product.slug}`}
          className="absolute right-3 top-3 z-10 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-white/95 text-[#704638] backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-[#704638] hover:text-white shadow-sm border border-[#D4A45E]/30"
          aria-label="View beauty product details"
        >
          <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </Link>

        {/* Product Image Container */}
        <Link
          href={`/collection/${product.slug}`}
          className="relative block h-full w-full overflow-hidden rounded-2xl bg-white shadow-inner"
        >
          {!imgLoaded && (
            <div className="absolute inset-0 z-0 bg-[#F4DCD8]/40 animate-pulse rounded-2xl flex items-center justify-center">
              <span className="text-[10px] font-mono text-[#8C5E50]">Loading...</span>
            </div>
          )}

          <Image
            src={imgSrc}
            alt={product.name || "ROSHÉ BEAUTY product"}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`object-cover transition-all duration-500 ease-out group-hover:scale-105 ${
              imgLoaded ? "opacity-100" : "opacity-0"
            }`}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            onError={() => {
              setImgSrc("/placeholder.svg");
              setImgLoaded(true);
            }}
          />
        </Link>
      </div>

      {/* ── Meta & Price Section ── */}
      <div className="flex flex-1 flex-col justify-between p-3.5 sm:p-4 bg-white">
        <div>
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-[#8C5E50] mb-1.5 uppercase tracking-wider">
            <span>Beauty // Radiance</span>
            <span className="text-[#704638] font-semibold flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D4A45E] animate-pulse" />
              In Stock
            </span>
          </div>

          <Link href={`/collection/${product.slug}`} className="block">
            <h3 className="line-clamp-2 text-xs sm:text-sm font-bold text-[#704638] group-hover:text-[#D4A45E] transition-colors leading-snug min-h-[2rem] sm:min-h-[2.5rem]">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Price & Action Button */}
        <div className="mt-3 pt-2.5 border-t border-[#F4DCD8] flex flex-col gap-2.5">
          {/* Price Container */}
          <div className="min-w-0">
            <div className="text-[10px] font-mono text-[#8C5E50] uppercase tracking-wider mb-0.5">
              Price
            </div>
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="text-sm sm:text-base font-extrabold text-[#704638] whitespace-nowrap">
                Rs {product.price.toLocaleString()}
              </span>
              {product.oldPrice && (
                <span className="text-[11px] sm:text-xs text-[#8C5E50] line-through font-mono whitespace-nowrap">
                  Rs {product.oldPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          {/* Action Button: Luxury Pill Shape */}
          <button
            type="button"
            onClick={handleAdd}
            className={`w-full shrink-0 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-full text-xs font-bold transition-all duration-200 active:scale-95 shadow-sm ${
              clicked
                ? "bg-emerald-600 text-white"
                : "bg-[#704638] text-white hover:bg-gradient-to-r hover:from-[#D4A45E] hover:to-[#B8893E] hover:text-[#704638] hover:shadow-md"
            }`}
            aria-label="Add to cart"
          >
            {clicked ? (
              <>
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span>Added to Bag</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 shrink-0" />
                <span>Add to Bag</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
