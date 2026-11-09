"use client";

import { motion } from "framer-motion";
import type { Feature } from "./types";
import { featureIcons } from "./Icon";

interface Props {
  feature: Feature;
  index: number;
}

export default function FeatureCard({ feature, index }: Props) {
  const Icon = featureIcons[feature.icon];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      whileHover={{ y: -6 }}
      className="group relative overflow-hidden rounded-3xl border border-neutral-200/80 bg-white p-7 text-center shadow-sm transition-all duration-300 hover:border-[#d4af37]/50 hover:shadow-xl"
    >
      {/* Subtle Gold Aura Glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/8 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />

      {/* Floating Icon */}
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        className="relative mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-950 text-[#d4af37] shadow-sm transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-[#d4af37] group-hover:to-[#b8941f] group-hover:text-black group-hover:scale-105"
      >
        <Icon className="h-7 w-7 transition-colors duration-300" strokeWidth={1.75} />
      </motion.div>

      {/* Content */}
      <div className="relative z-10">
        <h3 className="mb-2 text-base font-bold text-neutral-900 group-hover:text-neutral-950 transition-colors">
          {feature.title}
        </h3>

        <p className="text-xs leading-relaxed text-neutral-500">
          {feature.description}
        </p>
      </div>
    </motion.div>
  );
}
