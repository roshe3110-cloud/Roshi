"use client";

import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { useNavigationMenu } from "@/hooks/useNavigationMenu";
import type { MenuItem } from "./types";
import { GlowingSocialButton } from "@/components/common/SocialIcons";

function Dropdown({ items }: { items: MenuItem[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.98 }}
      transition={{
        duration: 0.22,
        ease: "easeOut",
      }}
      className="absolute left-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-2xl border border-[#D4A45E]/30 bg-white shadow-2xl"
    >
      <div className="p-3">
        {items.map((item) =>
          item.children ? (
            <NestedItem key={item.title} item={item} />
          ) : (
            <Link
              key={item.title}
              href={item.href!}
              className="flex items-center justify-between rounded-xl px-4 py-3 text-sm text-[#704638] font-medium transition-all duration-200 hover:bg-[#F4DCD8]/60 hover:text-[#704638]"
            >
              <span>{item.title}</span>
            </Link>
          ),
        )}
      </div>
    </motion.div>
  );
}

function NestedItem({ item }: { item: MenuItem }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm text-[#704638] font-medium transition hover:bg-[#F4DCD8]/60"
        aria-expanded={open}
      >
        <span>{item.title}</span>
        <ChevronRight size={16} className="text-[#D4A45E]" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.18 }}
            className="absolute left-full top-0 z-50 ml-2 w-64 rounded-2xl border border-[#D4A45E]/30 bg-white p-3 shadow-2xl"
          >
            {item.children?.map((child) => (
              <Link
                key={child.title}
                href={child.href!}
                className="block rounded-xl px-4 py-3 text-sm text-[#704638] font-medium transition hover:bg-[#F4DCD8]/60"
              >
                {child.title}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function DesktopNav() {
  const [active, setActive] = useState<string | null>(null);
  const menu = useNavigationMenu();

  return (
    <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
      {menu.map((item: MenuItem) => (
        <div
          key={item.title}
          className="relative"
          onMouseEnter={() => setActive(item.title)}
          onMouseLeave={() => setActive(null)}
        >
          {item.href ? (
            <Link
              href={item.href}
              className="group relative flex items-center gap-1.5 py-2 text-sm font-semibold text-[#704638] hover:text-[#D4A45E] transition-colors"
            >
              {item.icon && <item.icon className="w-4 h-4 text-[#D4A45E]" />}
              <span>{item.title}</span>

              <motion.span
                className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-[#D4A45E]"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.25 }}
              />
            </Link>
          ) : (
            <button
              type="button"
              className="group relative flex items-center gap-1.5 py-2 text-sm font-semibold text-[#704638] hover:text-[#D4A45E] transition-colors"
              onFocus={() => setActive(item.title)}
              onBlur={() => setActive(null)}
              aria-expanded={active === item.title}
            >
              {item.icon && <item.icon className="w-4 h-4 text-[#D4A45E]" />}
              <span>{item.title}</span>

              <motion.div
                animate={{
                  rotate: active === item.title ? 180 : 0,
                }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={16} />
              </motion.div>

              <motion.span
                className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-[#D4A45E]"
                animate={{
                  scaleX: active === item.title ? 1 : 0,
                }}
                transition={{ duration: 0.2 }}
              />
            </button>
          )}

          <AnimatePresence>
            {item.children && active === item.title && (
              <Dropdown items={item.children} />
            )}
          </AnimatePresence>
        </div>
      ))}

      {/* Subtle vertical separator */}
      <div className="h-5 w-[1px] bg-[#D4A45E]/30" aria-hidden="true" />

      {/* Glowing Social Channels on Desktop Navigation */}
      <div className="flex items-center gap-2">
        <GlowingSocialButton platform="instagram" variant="icon-only" size="sm" />
        <GlowingSocialButton platform="facebook" variant="icon-only" size="sm" />
        <GlowingSocialButton platform="whatsapp" variant="icon-only" size="sm" />
      </div>
    </nav>
  );
}
