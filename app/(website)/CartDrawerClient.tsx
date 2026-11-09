"use client";

import dynamic from "next/dynamic";

// CartDrawer has Framer Motion + Zustand state — lazy-load it client-side only
// so it never blocks the initial server render.
const CartDrawer = dynamic(() => import("@/components/common/CartDrawer"), {
  ssr: false,
});

export default function CartDrawerClient() {
  return <CartDrawer />;
}
