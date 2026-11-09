"use client";

import { useEffect } from "react";
import { useProductStore } from "@/store/product-store";
import type { Product } from "@/components/common/product-card/types";

interface ProductsHydratorProps {
  products: Product[];
}

/**
 * Pumps server-fetched products directly into the Zustand store.
 * Runs synchronously on first render — no network request, zero delay.
 */
export default function ProductsHydrator({ products }: ProductsHydratorProps) {
  const setProducts = useProductStore((s) => s.setProducts);

  useEffect(() => {
    setProducts(products);
  }, [products, setProducts]);

  return null;
}
