"use client";

import { memo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { CollectionItem } from "./types";

interface Props {
  item: CollectionItem;
  index: number;
}

function CollectionCard({ item, index }: Props) {
  const prefersReducedMotion = useReducedMotion();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState(item.image || "/placeholder.svg");

  return (
    <motion.div
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
      whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px" }}
      transition={prefersReducedMotion ? {} : { duration: 0.5, delay: index * 0.08 }}
      className="snap-center shrink-0 w-[80vw] sm:w-[45vw] lg:w-full"
    >
      <Link
        href={item.href}
        className="group relative block overflow-hidden rounded-t-[48px] sm:rounded-t-[64px] rounded-b-3xl aspect-[4/5] border border-[#D4A45E]/40 bg-neutral-900 shadow-lg transition-all duration-500 hover:border-[#D4A45E] hover:shadow-2xl hover:shadow-[#D4A45E]/20"
      >
        {/* Placeholder skeleton */}
        {!imgLoaded && (
          <div className="absolute inset-0 z-0 bg-neutral-800 animate-pulse" />
        )}

        {/* Category Image */}
        <Image
          src={imgSrc}
          alt={item.title}
          fill
          sizes="(max-width: 640px) 80vw, (max-width: 1024px) 45vw, 25vw"
          quality={85}
          className={`object-cover object-center transition-all duration-700 ease-out group-hover:scale-108 ${
            imgLoaded ? "opacity-100" : "opacity-0"
          }`}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          onError={() => {
            setImgSrc("/placeholder.svg");
            setImgLoaded(true);
          }}
        />

        {/* Multi-layer Dark Gradient for Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300 group-hover:opacity-95" />

        {/* Content pinned to bottom */}
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 text-left flex flex-col justify-end">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[#D4A45E]/20 text-[#D4A45E] border border-[#D4A45E]/40 backdrop-blur-md mb-2 w-fit shadow-sm">
            <span>Category</span>
          </div>

          <h3 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-white mb-3 leading-snug group-hover:text-[#D4A45E] transition-colors">
            {item.title}
          </h3>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-white/90 border border-white/20 backdrop-blur-md text-xs font-semibold transition-all duration-300 group-hover:bg-[#D4A45E] group-hover:text-[#704638] group-hover:border-[#D4A45E] w-fit">
            <span>Explore Range</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default memo(CollectionCard);
