"use client";

import { useUIStore } from "@/store";
import { useCartStore } from "@/store/cart-store";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartDrawer() {
  const isOpen = useUIStore((state) => state.cartDrawer);
  const toggleCartDrawer = useUIStore((state) => state.toggleCartDrawer);
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  // Avoid hydration issues by waiting until mounted
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCartDrawer}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35, ease: "easeOut" }}
            className="fixed inset-y-0 right-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl border-l border-neutral-100"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-5">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-[#d4af37]" />
                <h2 className="text-lg font-semibold text-neutral-900">Your Cart</h2>
                <span className="rounded-full bg-[#d4af37]/15 px-2.5 py-0.5 text-xs font-bold text-[#d4af37]">
                  {items.length}
                </span>
              </div>
              <button
                onClick={toggleCartDrawer}
                className="rounded-full p-1.5 text-neutral-400 hover:bg-neutral-50 hover:text-neutral-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Item List */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="rounded-full bg-neutral-50 p-6 text-neutral-300 mb-4">
                    <ShoppingBag className="h-12 w-12" />
                  </div>
                  <p className="text-base font-medium text-neutral-900">Your cart is empty</p>
                  <p className="mt-1 text-sm text-neutral-400">Add items to get started.</p>
                  <button
                    onClick={toggleCartDrawer}
                    className="mt-6 rounded-xl bg-black px-6 py-2.5 text-sm font-medium text-white transition-transform hover:scale-105 active:scale-95"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-neutral-100">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 py-4.5">
                      {/* Product Image */}
                      {item.image && (
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-neutral-100 bg-neutral-50">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={80}
                            height={80}
                            
                            className="object-cover"
                          />
                        </div>
                      )}

                      {/* Product details */}
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <div className="flex justify-between gap-2">
                            <h3 className="line-clamp-2 text-sm font-medium text-neutral-800">
                              {item.name}
                            </h3>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-neutral-400 hover:text-red-500 transition-colors shrink-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          {/* Quantity Selector */}
                          <div className="flex items-center gap-1.5 rounded-lg border border-neutral-200 p-0.5">
                            <button
                              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              className="rounded p-1 text-neutral-500 hover:bg-neutral-50 active:scale-95"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-6 text-center text-xs font-medium text-neutral-800">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="rounded p-1 text-neutral-500 hover:bg-neutral-50 active:scale-95"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          {/* Price */}
                          <span className="text-sm font-semibold text-neutral-900">
                            Rs {(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-neutral-100 px-6 py-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-500 font-medium">Subtotal</span>
                  <span className="text-lg font-bold text-neutral-900">
                    Rs {subtotal.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-neutral-400">
                  Shipping, taxes, and discounts calculated at checkout.
                </p>

                <div className="flex flex-col gap-2 pt-2">
                  <Link
                    href="/checkout"
                    onClick={toggleCartDrawer}
                    className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b8941f] py-3 text-sm font-bold text-black transition-all hover:opacity-95 shadow-lg shadow-[#d4af37]/20 active:scale-98"
                  >
                    Proceed to Checkout
                  </Link>
                  <button
                    onClick={toggleCartDrawer}
                    className="flex w-full items-center justify-center rounded-xl border border-neutral-200 py-3 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
