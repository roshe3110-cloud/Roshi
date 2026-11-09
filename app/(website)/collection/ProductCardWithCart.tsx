"use client";

import { toast } from "sonner";
import ProductCard from "@/components/common/product-card/ProductCard";
import { useCartStore, useUIStore } from "@/store";
import type { Product } from "@/components/common/product-card/types";

interface Props {
  product: Product;
}

export default function ProductCardWithCart({ product }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const isCartOpen = useUIStore((s) => s.cartDrawer);
  const toggleCartDrawer = useUIStore((s) => s.toggleCartDrawer);

  const handleAddToCart = () => {
    addItem({
      id: String(product.id),
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    });
    if (!isCartOpen) toggleCartDrawer();
    toast.success("Product added to cart", { duration: 2000 });
  };

  return <ProductCard product={product} onAddToCart={handleAddToCart} />;
}
