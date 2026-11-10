"use client";

import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Search, ShoppingBag, User, X, LogIn } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import MobileNav from "./MobileNav";
import DesktopNav from "./DesktopNav";
import { useUIStore, useCartStore } from "@/store";

export default function Header() {
  const mobileOpen = useUIStore((state) => state.mobileMenu);
  const toggleMobileMenu = useUIStore((state) => state.toggleMobileMenu);
  const toggleCartDrawer = useUIStore((state) => state.toggleCartDrawer);

  const items = useCartStore((state) => state.items);
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const listener = () => {
      setScrolled(window.scrollY > 20);
    };
    listener();
    window.addEventListener("scroll", listener);
    return () => window.removeEventListener("scroll", listener);
  }, []);

  // Close search and user menu on outside click or Escape
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setSearchOpen(false);
        setSearchQuery("");
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setSearchQuery("");
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Auto-focus search input when opened
  useEffect(() => {
    if (searchOpen) {
      searchInputRef.current?.focus();
    }
  }, [searchOpen]);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(
        `/collection?search=${encodeURIComponent(searchQuery.trim())}`,
      );
      setSearchOpen(false);
      setSearchQuery("");
    }
  }

  function toggleSearch() {
    setSearchOpen((prev) => !prev);
    if (searchOpen) setSearchQuery("");
  }

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "backdrop-blur-2xl bg-[#F9F4EF]/90 border-b border-[#D4A45E]/30 shadow-md"
            : "bg-[#F9F4EF] border-b border-[#F4DCD8]"
        }`}
      >
        <div className="mx-auto flex h-24 sm:h-28 max-w-7xl items-center justify-between sm:px-6 px-4">
          <button
            onClick={toggleMobileMenu}
            aria-label="Toggle navigation menu"
            className="lg:hidden text-[#704638] hover:text-[#D4A45E] transition-colors"
          >
            <Menu className="h-7 w-7" />
          </button>

          {/* ── Logo ── */}
          <motion.div
            animate={{
              opacity: searchOpen ? 0 : 1,
              scale: searchOpen ? 0.9 : 1,
            }}
            transition={{ duration: 0.15 }}
            className={searchOpen ? "hidden sm:block" : "block"}
          >
            <Link
              href="/"
              className="flex items-center gap-2 group"
            >
              <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-2xl overflow-hidden p-1 bg-white border border-[#D4A45E]/30 shadow-sm transition-transform group-hover:scale-105 flex items-center justify-center">
                <Image
                  unoptimized
                  src="/logo.png"
                  alt="ROSHÉ BEAUTY &amp; JEWELRY Logo"
                  width={80}
                  height={80}
                  priority
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-extrabold text-lg sm:text-2xl tracking-wider text-[#704638] group-hover:text-[#D4A45E] transition-colors">
                  ROSHÉ 
                </span>
                <span className="text-[10px] font-medium tracking-widest text-[#D4A45E] uppercase -mt-1 hidden sm:block">
                  Beauty &amp; Jewelry
                </span>
              </div>
            </Link>
          </motion.div>

          {/* ── Desktop Navigation & Social Glowing Icons ── */}
          <DesktopNav />

          <div className="flex items-center sm:gap-4 gap-3">
            {/* ── Inline Search ── */}
            <div
              ref={searchContainerRef}
              className="relative flex items-center"
            >
              <AnimatePresence>
                {searchOpen && (
                  <motion.form
                    key="search-bar"
                    onSubmit={handleSearchSubmit}
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 230, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 28 }}
                    className="overflow-hidden mr-2"
                  >
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search skincare, cosmetics, jewelry…"
                      className="w-full rounded-full border border-[#D4A45E]/40 bg-white px-4 py-2 text-xs sm:text-sm text-[#704638] outline-none ring-0 focus:border-[#704638] transition-colors placeholder:text-[#8C5E50]/60 shadow-sm"
                    />
                  </motion.form>
                )}
              </AnimatePresence>

              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={toggleSearch}
                aria-label="Toggle search"
                type="button"
                className="flex-shrink-0 text-[#704638] hover:text-[#D4A45E] transition-colors"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {searchOpen ? (
                    <motion.span
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <X className="h-5 w-5" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="search"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Search className="h-6 w-6 sm:h-7 sm:w-7" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>

            {/* ── User Menu ── */}
            <div ref={userMenuRef} className="relative sm:block hidden">
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={() => setUserMenuOpen((prev) => !prev)}
                aria-label="Account menu"
                type="button"
                className="text-[#704638] hover:text-[#D4A45E] transition-colors"
              >
                <User className="h-6 w-6 sm:h-7 sm:w-7" />
              </motion.button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-3 w-44 rounded-2xl border border-[#D4A45E]/30 bg-white shadow-xl overflow-hidden z-50"
                  >
                    <Link
                      href="/login"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#704638] hover:bg-[#F4DCD8]/50 transition-colors"
                    >
                      <LogIn size={15} className="text-[#D4A45E]" /> Sign In
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Cart ── */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={toggleCartDrawer}
              className={`relative text-[#704638] hover:text-[#D4A45E] transition-colors ${
                searchOpen ? "hidden sm:block" : "block"
              }`}
              aria-label="Open cart"
            >
              <ShoppingBag className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-[#D4A45E] to-[#B8893E] text-[11px] font-bold text-white shadow-md shadow-[#D4A45E]/30 animate-in zoom-in duration-300">
                  {cartCount}
                </span>
              )}
            </motion.button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <MobileNav open={mobileOpen} onClose={toggleMobileMenu} />
        )}
      </AnimatePresence>
    </>
  );
}
