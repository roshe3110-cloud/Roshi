"use client";

import { Heart, ShieldCheck, Truck, Star, Sparkles, MessageCircle, Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";
import QuantitySelector from "./QuantitySelector";
import { useState } from "react";
import AddToCartButton from "./AddCardBtn";
import { STORE_CONTACT } from "@/components/common/SocialIcons";

interface ProductInfoProps {
  product: {
    id: string;
    name: string;
    price: number;
    oldPrice?: number;
    description: string;
    rating?: number;
    reviews?: number;
    stock?: number;
    image?: string;
  };
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState(false);

  const discount =
    product.oldPrice &&
    Math.round(
      ((product.oldPrice - product.price) / product.oldPrice) * 100
    );

  const inStock = product.stock === undefined || product.stock > 0;

  return (
    <div className="flex flex-col space-y-7 animate-in fade-in slide-in-from-right-5 duration-700">
      {/* Micro-Badges & Status */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {inStock ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600" />
              </span>
              In Stock · Fast Dispatch
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-600">
              Out of Stock · Backorder Available
            </span>
          )}

          <span className="inline-flex items-center gap-1 rounded-full border border-[#D4A45E]/30 bg-[#F4DCD8]/60 px-3 py-1 text-xs font-medium text-[#704638]">
            <Sparkles className="w-3 h-3 text-[#D4A45E]" />
            100% Authentic Quality
          </span>

          {discount && (
            <span className="inline-flex items-center rounded-full bg-[#704638] px-3 py-1 text-xs font-mono font-bold text-[#F4DCD8]">
              {discount}% OFF
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#704638] leading-tight font-heading">
          {product.name}
        </h1>

        {/* Rating & Beauty Verification */}
        <div className="flex items-center gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.round(product.rating || 5)
                    ? "fill-[#D4A45E] text-[#D4A45E]"
                    : "text-neutral-200"
                }`}
              />
            ))}
          </div>

          <span className="font-semibold text-[#704638]">
            {product.rating || "5.0"}
          </span>
          <span className="text-[#8C5E50]/40">·</span>
          <span className="text-[#8C5E50]">
            ({product.reviews || 24} verified customer reviews)
          </span>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3 rounded-2xl border border-[#D4A45E]/30 bg-white p-4 shadow-sm">
        <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#704638]">
          Rs {product.price.toLocaleString()}
        </span>

        {product.oldPrice && (
          <span className="text-base sm:text-lg text-[#8C5E50] line-through font-mono">
            Rs {product.oldPrice.toLocaleString()}
          </span>
        )}

        <span className="ml-auto text-xs font-mono font-semibold uppercase tracking-wider text-[#704638] bg-[#F4DCD8] px-2.5 py-1 rounded-md border border-[#D4A45E]/30">
          PKR · Dispatch on Slip Verification
        </span>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#8C5E50]">
          Product Overview &amp; Details
        </h3>

        <p className="text-sm leading-relaxed text-[#704638]">
          {product.description}
        </p>
      </div>

      {/* Actions */}
      <div className="space-y-3.5">
        <div className="flex items-center gap-3">
          <QuantitySelector value={quantity} onChange={setQuantity} />

          <Button
            variant="outline"
            size="icon"
            onClick={() => setLiked(!liked)}
            className="h-12 w-12 rounded-xl border-[#D4A45E]/40 transition-all hover:border-[#704638] active:scale-95 bg-white"
            aria-label="Wishlist"
          >
            <Heart
              className={`h-5 w-5 transition-colors ${
                liked ? "fill-red-500 text-red-500" : "text-[#704638]"
              }`}
            />
          </Button>

          <a
            href={`https://wa.me/${STORE_CONTACT.whatsappNumber}?text=${encodeURIComponent(
              `Hi ROSHÉ BEAUTY & JEWELRY! I would like personal advice & details for: ${product.name} (Qty: ${quantity})`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-[#D4A45E]/40 bg-white px-4 text-xs sm:text-sm font-semibold text-[#704638] transition-all hover:border-[#704638] hover:bg-[#F4DCD8]/40 active:scale-95 shadow-sm"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>Consult on WhatsApp</span>
          </a>
        </div>

        <AddToCartButton
          product={{
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
          }}
          quantity={quantity}
        />
      </div>

      {/* Beauty Assurances */}
      <div className="grid gap-3 pt-6 border-t border-[#D4A45E]/30 sm:grid-cols-3">
        <Feature
          icon={<ShieldCheck className="w-5 h-5 text-[#D4A45E]" />}
          title="100% Authentic"
          text="Pure skincare formulas & 18K gold waterproof craftsmanship"
        />

        <Feature
          icon={<Truck className="w-5 h-5 text-[#D4A45E]" />}
          title="Careful Transit"
          text="Luxury unboxing packaging & fast dispatch across Pakistan"
        />

        <Feature
          icon={<Droplets className="w-5 h-5 text-[#D4A45E]" />}
          title="VIP Concierge"
          text={`Routine, shade & jewelry sizing support at ${STORE_CONTACT.phoneFormatted}`}
        />
      </div>
    </div>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-[#D4A45E]/30 bg-white p-3.5 transition-all duration-200 hover:border-[#D4A45E] shadow-sm">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#704638] text-white">
        {icon}
      </div>
      <div>
        <h4 className="text-xs font-bold text-[#704638]">{title}</h4>
        <p className="mt-0.5 text-[11px] leading-relaxed text-[#8C5E50]">
          {text}
        </p>
      </div>
    </div>
  );
}
