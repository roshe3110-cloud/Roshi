import { create } from "zustand";

interface UIStore {
  mobileMenu: boolean;

  cartDrawer: boolean;

  searchModal: boolean;

  toggleMobileMenu: () => void;

  toggleCartDrawer: () => void;

  toggleSearchModal: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  mobileMenu: false,

  cartDrawer: false,

  searchModal: false,

  toggleMobileMenu: () =>
    set((state) => ({
      mobileMenu: !state.mobileMenu,
    })),

  toggleCartDrawer: () =>
    set((state) => ({
      cartDrawer: !state.cartDrawer,
    })),

  toggleSearchModal: () =>
    set((state) => ({
      searchModal: !state.searchModal,
    })),
}));

export { useCartStore } from "./cart-store";
export { useProductStore } from "./product-store";
