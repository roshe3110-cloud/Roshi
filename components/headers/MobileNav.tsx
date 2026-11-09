"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  User,
  Search,
  ShoppingBag,
  X,
  Phone,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useNavigationMenu } from "@/hooks/useNavigationMenu";
import { useCartStore, useUIStore } from "@/store";
import {
  STORE_CONTACT,
  GlowingSocialButton,
} from "@/components/common/SocialIcons";

interface MenuItem {
  title: string;
  href?: string;
  children?: MenuItem[];
}

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileNav({ open, onClose }: MobileNavProps) {
  const router = useRouter();
  const menu = useNavigationMenu();

  const toggleCartDrawer = useUIStore((state) => state.toggleCartDrawer);

  const items = useCartStore((state) => state.items);
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const [stack, setStack] = useState<MenuItem[][]>([]);
  const [titles, setTitles] = useState<string[]>(["Menu"]);
  const [searchQuery, setSearchQuery] = useState("");

  const searchInputRef = useRef<HTMLInputElement>(null);

  const current = stack.length > 0 ? stack[stack.length - 1] : menu;
  const currentTitle = titles[titles.length - 1] || "Menu";

  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => {
        setStack([]);
        setTitles(["Menu"]);
        setSearchQuery("");
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();

    const query = searchQuery.trim();

    if (!query) return;

    router.push(`/collection?search=${encodeURIComponent(query)}`);

    setSearchQuery("");
    onClose();
  }

  function openChildren(item: MenuItem) {
    if (!item.children) return;

    setStack((prev) => [...prev, item.children!]);
    setTitles((prev) => [...prev, item.title]);
  }

  function goBack() {
    if (stack.length === 0) return;

    setStack((prev) => prev.slice(0, -1));
    setTitles((prev) => prev.slice(0, -1));
  }

  function handleCartClick() {
    onClose();
    toggleCartDrawer();
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.aside
            className="fixed inset-y-0 left-0 z-50 flex w-[85%] max-w-sm flex-col bg-[#F9F4EF] text-[#704638] shadow-2xl border-r border-[#D4A45E]/30"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.28, ease: "easeInOut" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#F4DCD8] px-5 py-4 bg-white/70">
              <span className="font-heading text-lg font-extrabold tracking-wider text-[#704638]">
                ROSHÉ 
              </span>

              <button
                onClick={onClose}
                aria-label="Close menu"
                className="rounded-lg p-1.5 text-[#704638]/70 transition-colors hover:bg-[#F4DCD8] hover:text-[#704638]"
              >
                <X size={20} />
              </button>
            </div>

            {/* Back button */}
            {stack.length > 0 && (
              <button
                onClick={goBack}
                className="flex items-center gap-2 border-b border-[#F4DCD8] px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#704638]/80 transition-colors hover:bg-[#F4DCD8] hover:text-[#704638]"
              >
                <ChevronLeft size={16} />
                <span>Back to {titles[titles.length - 2]}</span>
              </button>
            )}

            {/* Title */}
            <div className="border-b border-[#F4DCD8] px-5 py-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#D4A45E]">
                {currentTitle}
              </span>
            </div>

            {/* Menu List */}
            <motion.div
              key={currentTitle}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.18 }}
              className="flex-1 overflow-y-auto px-3 py-3"
            >
              <ul className="space-y-1">
                {current?.map((item) => (
                  <motion.li
                    key={item.title}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.1 }}
                  >
                    {item.children ? (
                      <button
                        onClick={() => openChildren(item)}
                        className="flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-sm font-semibold text-[#704638] transition-colors hover:bg-[#F4DCD8]/60 hover:text-[#704638]"
                      >
                        <span>{item.title}</span>
                        <ChevronRight size={16} className="text-[#D4A45E]" />
                      </button>
                    ) : (
                      <Link
                        href={item.href!}
                        onClick={onClose}
                        className="block rounded-xl px-4 py-3.5 text-sm font-semibold text-[#704638] transition-colors hover:bg-[#F4DCD8]/60 hover:text-[#704638]"
                      >
                        {item.title}
                      </Link>
                    )}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Search */}
            <form onSubmit={handleSearchSubmit} className="px-5 pb-3">
              <div className="flex items-center gap-2.5 rounded-xl border border-[#D4A45E]/40 bg-white px-3.5 py-2.5 transition-colors focus-within:border-[#704638] shadow-sm">
                <Search size={16} className="flex-shrink-0 text-[#8C5E50]" />

                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search skincare, serums, lipsticks…"
                  className="flex-1 bg-transparent text-sm text-[#704638] outline-none placeholder:text-[#8C5E50]/60"
                />
              </div>
            </form>

            {/* Contact & Social Strip */}
            <div className="px-5 py-3 border-t border-[#F4DCD8] bg-[#F4DCD8]/30">
              <div className="flex items-center justify-between text-xs">
                <a
                  href={`tel:${STORE_CONTACT.phone}`}
                  className="text-xs font-mono font-bold text-[#704638] hover:text-[#D4A45E] flex items-center gap-1.5 transition"
                >
                  <Phone size={13} className="text-[#D4A45E]" />
                  <span>{STORE_CONTACT.phoneFormatted}</span>
                </a>
                <div className="flex items-center gap-1.5">
                  <GlowingSocialButton platform="instagram" variant="icon-only" size="sm" />
                  <GlowingSocialButton platform="facebook" variant="icon-only" size="sm" />
                  <GlowingSocialButton platform="whatsapp" variant="icon-only" size="sm" />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-[#F4DCD8] p-4 bg-white/70">
              <div className="flex justify-around">
                <Link
                  href="/login"
                  onClick={onClose}
                  className="flex flex-col items-center gap-1.5 text-xs font-semibold text-[#704638] transition-colors hover:text-[#D4A45E]"
                >
                  <User size={20} />
                  <span>Account</span>
                </Link>

                <button
                  onClick={() => searchInputRef.current?.focus()}
                  className="flex flex-col items-center gap-1.5 text-xs font-semibold text-[#704638] transition-colors hover:text-[#D4A45E]"
                >
                  <Search size={20} />
                  <span>Search</span>
                </button>

                <button
                  onClick={handleCartClick}
                  className="relative flex flex-col items-center gap-1.5 text-xs font-semibold text-[#704638] transition-colors hover:text-[#D4A45E]"
                >
                  <div className="relative">
                    <ShoppingBag size={20} />
                    {cartCount > 0 && (
                      <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gradient-to-r from-[#D4A45E] to-[#B8893E] px-1 text-[9px] font-extrabold text-white shadow-sm">
                        {cartCount}
                      </span>
                    )}
                  </div>
                  <span>Cart</span>
                </button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
