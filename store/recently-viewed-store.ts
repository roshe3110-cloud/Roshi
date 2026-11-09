import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface RecentlyViewedProduct {
  id: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  oldPrice?: number;
  sale?: boolean;
  viewedAt?: number;
}

interface RecentlyViewedStore {
  items: RecentlyViewedProduct[];
  addItem: (item: Omit<RecentlyViewedProduct, "viewedAt">) => void;
  clearItems: () => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const filtered = state.items.filter(
            (i) => i.id !== item.id && i.slug !== item.slug
          );
          return {
            items: [{ ...item, viewedAt: Date.now() }, ...filtered].slice(0, 10),
          };
        }),
      clearItems: () => set({ items: [] }),
    }),
    {
      name: "roshe-recently-viewed",
    }
  )
);

