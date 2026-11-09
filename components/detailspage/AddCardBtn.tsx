"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart, Loader2 } from "lucide-react";
import { useState } from "react";
import { useCartStore, useUIStore } from "@/store";
import { toast } from "sonner";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    image?: string;
  };
  quantity: number;
}

export default function AddToCartButton({
  product,
  quantity,
}: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const toggleCartDrawer = useUIStore((state) => state.toggleCartDrawer);
  const isCartOpen = useUIStore((state) => state.cartDrawer);

  const handleClick = async () => {
    try {
      setLoading(true);

      // Simulate a small delay for premium feels
      await new Promise((resolve) => setTimeout(resolve, 300));

      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: product.image,
      });

      if (!isCartOpen) {
        toggleCartDrawer();
      }

      setAdded(true);

      setTimeout(() => {
        toast.success("Product added to cart", {
          position: "top-right",
          duration: 2000,
        });
        setAdded(false);
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      size="lg"
      onClick={handleClick}
      disabled={loading}
      className="
        group relative w-full overflow-hidden
        rounded-xl
        bg-gradient-to-r from-[#d4af37] to-[#b8941f] text-black font-bold
        transition-all duration-300
        hover:brightness-110 shadow-lg shadow-[#d4af37]/20
        hover:scale-[1.02]
        active:scale-95
      "
    >
      <span
        className="
          absolute inset-0
          translate-y-full
          bg-white/10
          transition-transform duration-500
          group-hover:translate-y-0
        "
      />

      <span className="relative flex items-center justify-center gap-2">
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Adding...
          </>
        ) : added ? (
          <>✓ Added To Cart</>
        ) : (
          <>
            <ShoppingCart className="h-5 w-5 transition-transform group-hover:-translate-y-1" />
            Add To Cart
          </>
        )}
      </span>
    </Button>
  );
}
