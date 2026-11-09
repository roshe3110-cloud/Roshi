"use client";

import { memo, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { HeroSlide } from "./types";

interface HeroVideoProps {
  slide: HeroSlide;
}

function HeroVideo({ slide }: HeroVideoProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  return (
    <section
      aria-label="Hero Banner"
      className="relative w-full h-[95vh] overflow-hidden bg-black  lg:h-screen"
    >
      {/* Preload the poster image for LCP improvement */}
      {slide.poster && (
        <link
          rel="preload"
          as="image"
          href={slide.poster}
          fetchPriority="high"
        />
      )}

      {/* Video */}
      <video
        key={`${slide.video}-${isMobile ? "mobile" : "desktop"}`}
        className="absolute inset-0 h-full h-[90vh] w-full object-cover object-center scale-[1.02] p-3"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={slide.poster}
        disablePictureInPicture
      >
        <source
          src={isMobile ? "/mb.mp4" : slide.video}
          type={isMobile ? "video/mp4" : "video/webm"}
        />
      </video>

      {/* Premium cinematic overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />

      {/* Content */}
      <div className="relative z-10 flex h-full items-center justify-center px-6 text-center text-white">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.18 },
            },
          }}
          className="max-w-5xl"
        >
          {/* Eyebrow */}
          {slide.eyebrow && (
            <motion.p
              variants={{
                hidden: {
                  opacity: 0,
                  y: 30,
                },
                show: {
                  opacity: 1,
                  y: 0,
                },
              }}
              transition={{
                duration: 1,
                ease: "easeOut",
              }}
              className="mb-6 text-3xl font-medium uppercase text-white/90"
            >
              {slide.eyebrow} <br />
              {slide.title}
            </motion.p>
          )}

          {/* Title */}
          {/* <motion.h1
            variants={{
              hidden: {
                opacity: 0,
                y: 60,
              },
              show: {
                opacity: 1,
                y: 0,
              },
            }}
            transition={{
              duration: 1,
              ease: "easeOut",
            }}
            className="font-heading text-5xl font-semibold uppercase leading-[0.95] tracking-tight  "
          >
            {slide.title}
          </motion.h1> */}

          {/* Description */}
          {slide.description && (
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.8 }}
              className="mx-auto mt-7 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base"
            >
              {slide.description}
            </motion.p>
          )}

          {/* Buttons */}
          {slide.buttons && slide.buttons.length > 0 && (
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 40 },
                show: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.8 }}
              className="mt-10 flex flex-wrap justify-center sm:gap-4 gap-8 "
            >
              {slide.buttons.map((button) => (
                <motion.div
                  key={button.label}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.96 }}
                >
                  <Link
                    href={button.href}
                    className="group relative overflow-hidden rounded-full border border-white/70 bg-white px-9 py-3.5 text-xs font-medium uppercase tracking-[0.25em] text-black transition-all duration-500 hover:bg-transparent hover:text-white "
                  >
                    <span className="relative z-10">{button.label}</span>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Bottom scroll indicator */}
      {/* <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{
          repeat: Infinity,
          duration: 2,
        }}
        className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 text-xs uppercase tracking-[0.4em] text-white/70"
      >
        Quality That Speaks For Itself
      </motion.div> */}
    </section>
  );
}

export default memo(HeroVideo);
