"use client";

import { memo, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import CollectionCard from "./CollectionCard";
import type { CollectionItem } from "./types";

interface Props {
  items: CollectionItem[];
}

function CollectionShowcase({ items }: Props) {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = useCallback((direction: "left" | "right") => {
    if (!sliderRef.current) return;
    sliderRef.current.scrollBy({
      left: direction === "left" ? -320 : 320,
      behavior: "smooth",
    });
  }, []);

  if (!items || items.length === 0) return null;

  return (
    <section className="border-y border-[#D4A45E]/30 bg-[#F4DCD8]/35 py-16 sm:py-20 my-10">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        {/* Heading */}
        <div className="mb-10 text-center sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/80 text-[#704638] border border-[#D4A45E]/30 mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#D4A45E]" />
            <span>Curated Categories</span>
          </div>
          <h2 className="font-heading text-3xl font-extrabold tracking-tight text-[#704638] sm:text-4xl lg:text-5xl">
            Explore Beauty &amp; Jewelry Categories
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#8C5E50] max-w-md mx-auto">
            Indulge in radiant skincare rituals, luxurious cosmetics, and 18K gold-plated waterproof fine jewelry.
          </p>
        </div>

        {/* Slider wrapper */}
        <div className="relative">
          {/* Left arrow */}
          <button
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className="absolute -left-3 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-2xl border border-[#D4A45E]/30 bg-white/95 text-[#704638] shadow-md backdrop-blur transition-all hover:bg-[#704638] hover:text-white sm:flex lg:hidden"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Right arrow */}
          <button
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className="absolute -right-3 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-2xl border border-[#D4A45E]/30 bg-white/95 text-[#704638] shadow-md backdrop-blur transition-all hover:bg-[#704638] hover:text-white sm:flex lg:hidden"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Responsive 4-Column Grid on Desktop, Smooth Snap Slider on Mobile */}
          <div
            ref={sliderRef}
            className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 scrollbar-none sm:gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-4 lg:overflow-visible"
          >
            {items.map((item, index) => (
              <CollectionCard key={item.id} item={item} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(CollectionShowcase);
