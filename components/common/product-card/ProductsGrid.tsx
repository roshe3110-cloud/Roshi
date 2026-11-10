"use client";

import { toast } from "sonner";
import ProductCard from "./ProductCard";
import { Product } from "./types";
import { useCartStore, useUIStore } from "@/store";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

interface ProductsGridProps {
  products: Product[];
}

export default function ProductsGrid({ products }: ProductsGridProps) {
  const addItem = useCartStore((state) => state.addItem);
  const toggleCartDrawer = useUIStore((state) => state.toggleCartDrawer);
  const isCartOpen = useUIStore((state) => state.cartDrawer);

  const handleAddToCart = (product: Product) => {
    addItem({
      id: String(product.id),
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    });
    if (!isCartOpen) {
      toggleCartDrawer();
    }
    toast.success(`${product.name} added to cart`, {
      position: "top-right",
      duration: 2000,
    });
  };

  return (
    <section className="container mx-auto py-10 px-4 sm:px-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 border-b border-[#D4A45E]/30 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#D4A45E] mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Luxury Inventory</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#704638] font-heading">
            New Beauty &amp; Jewelry Arrivals
          </h2>
        </div>

        <Link
          href="/collection"
          className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#704638] hover:text-[#D4A45E] transition-colors"
        >
          <span>View Entire Collection</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div
        tabIndex={0}
        onKeyDown={(e) => {
          const el = e.currentTarget;

          if (e.key === "ArrowRight") {
            e.preventDefault();
            el.scrollBy({ left: 300, behavior: "smooth" });
          }

          if (e.key === "ArrowLeft") {
            e.preventDefault();
            el.scrollBy({ left: -300, behavior: "smooth" });
          }

          if (e.key === "Home") {
            e.preventDefault();
            el.scrollTo({ left: 0, behavior: "smooth" });
          }

          if (e.key === "End") {
            e.preventDefault();
            el.scrollTo({ left: el.scrollWidth, behavior: "smooth" });
          }
        }}
        className="
          flex flex-row gap-4 sm:gap-6
          overflow-x-auto
          snap-x snap-mandatory
          pb-4
          focus:outline-none
          focus-visible:ring-2 focus-visible:ring-[#D4A45E]
          [&>div]:shrink-0
          [&>div]:snap-start
          [&>div]:w-[180px]
          sm:[&>div]:w-[240px]
          lg:[&>div]:w-[280px]
        "
      >
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </section>
  );
}
