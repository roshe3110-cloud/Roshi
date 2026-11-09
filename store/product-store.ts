import { create } from "zustand";
import type { Product } from "@/components/common/product-card/types";

interface ProductStore {
  products: Product[];
  isHydrated: boolean;
  setProducts: (products: Product[]) => void;
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  isHydrated: false,
  setProducts: (products) => set({ products, isHydrated: true }),
}));
