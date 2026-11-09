"use client";

import { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AnnouncementBarProps } from "./types";

export default function AnnouncementBar({
  items,
  interval = 4000,
  autoPlay = true,
}: AnnouncementBarProps) {
  const [current, setCurrent] = useState(0);
  const length = items.length;

  const nextAnnouncement = useCallback(() => {
    setCurrent((prev) => (prev === length - 1 ? 0 : prev + 1));
  }, [length]);

  const previousAnnouncement = useCallback(() => {
    setCurrent((prev) => (prev === 0 ? length - 1 : prev - 1));
  }, [length]);

  useEffect(() => {
    if (!autoPlay || length <= 1) return;
    const timer = setInterval(nextAnnouncement, interval);
    return () => clearInterval(timer);
  }, [nextAnnouncement, interval, autoPlay, length]);

  if (!items.length) return null;

  return (
    <div className="relative z-30 w-full border-b border-[#D4A45E]/30 bg-[#704638] text-[#F9F4EF]">
      <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Previous Button */}
        <button
          onClick={previousAnnouncement}
          aria-label="Previous announcement"
          className="flex h-7 w-7 items-center justify-center rounded-full text-[#F9F4EF]/80 hover:text-[#D4A45E] hover:bg-white/10 transition"
        >
          <ChevronLeft size={14} />
        </button>

        {/* Announcement Text */}
        <div className="relative flex-1 overflow-hidden text-center text-xs font-medium tracking-wide">
          <AnimatePresence mode="wait">
            <motion.p
              key={items[current].id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="truncate"
            >
              {items[current].text}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Next Button */}
        <button
          onClick={nextAnnouncement}
          aria-label="Next announcement"
          className="flex h-7 w-7 items-center justify-center rounded-full text-[#F9F4EF]/80 hover:text-[#D4A45E] hover:bg-white/10 transition"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
