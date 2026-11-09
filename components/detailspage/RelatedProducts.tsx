"use client";

import { useCartStore } from "@/store";
import { toast } from "sonner";
import ProductCard from "@/components/common/product-card/ProductCard";
import { Zap } from "lucide-react";

export interface RelatedProduct {
  id: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  oldPrice?: number;
  rating?: number;
}

interface RelatedProductsProps {
  products: RelatedProduct[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  const addItem = useCartStore((s) => s.addItem);

  if (!products || !products.length) return null;

  const handleAddToCart = (product: {
    id: string | number;
    name: string;
    price: number;
    image: string;
  }) => {
    addItem({
      id: String(product.id),
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    });
    toast.success(`${product.name} added to cart`);
  };

  return (
    <section className="mt-20 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-neutral-200 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#d4af37] mb-1">
            <Zap className="w-3.5 h-3.5" />
            <span>Hardware Ecosystem</span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl text-neutral-900">
            Compatible & Related Units
          </h2>
        </div>
        <p className="text-xs text-neutral-500">
          Industrial equipment & accessories matched for this hardware.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.map((product) => {
          const isSale = product.oldPrice
            ? product.oldPrice > product.price
            : false;
          return (
            <ProductCard
              key={product.id}
              product={{
                id: product.id,
                slug: product.slug,
                name: product.name,
                image: product.image || "/placeholder.svg",
                price: product.price,
                oldPrice: product.oldPrice,
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
    </section>
  );
}
