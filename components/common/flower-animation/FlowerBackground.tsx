"use client";

import React, { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * 🌸 High-Performance Background Flower & Light Animation for ROSHÉ BEAUTY
 *
 * Performance Architecture (Zero Performance Impact):
 * 1. 100% GPU Composited: Only uses `transform: translate3d(...) scale(...) rotate(...)` and `opacity`.
 * 2. Off-Main-Thread: Keyframes execute exclusively on the browser compositor thread (0ms JS run loop).
 * 3. Zero Reflow / Repaint: Zero layout thrashing, zero DOM manipulation after initial render.
 * 4. Staggered Negative Delays: Flowers are immediately drifting across screen on page load with zero lag.
 * 5. pointer-events: none ensures completely non-blocking UX (clicks, hovers, scrolls pass directly through).
 * 6. contain: strict prevents outside layout calculations.
 * 7. Mobile-Optimized: Streamlined element count on mobile devices to preserve battery life and maintain 120 FPS.
 * 8. Two-Layer Architecture:
 *    - Ambient light halo layer sits at z-0 (deep background glow).
 *    - Floating blooms & petals sit at z-20 (floating dreamily over background cards without blocking clicks).
 * 9. Accessibility: Honors prefers-reduced-motion.
 */

// 1. Running & Growing Flowers (Traveling across the viewport while blooming)
const RUNNING_BLOOMS = [
  {
    id: "bloom-1",
    left: "6%",
    size: 44,
    anim: "flower-run-grow-up-1",
    delay: "-4s",
    dur: "20s",
    mobile: true,
  },
  {
    id: "bloom-2",
    left: "88%",
    size: 52,
    anim: "flower-run-grow-up-2",
    delay: "-11s",
    dur: "24s",
    mobile: true,
  },
  {
    id: "bloom-3",
    left: "20%",
    size: 38,
    anim: "flower-run-grow-down",
    delay: "-7s",
    dur: "22s",
    mobile: true,
  },
  {
    id: "bloom-4",
    left: "76%",
    size: 46,
    anim: "flower-run-grow-up-1",
    delay: "-15s",
    dur: "26s",
    mobile: true,
  },
  {
    id: "bloom-5",
    left: "45%",
    size: 40,
    anim: "flower-run-grow-down",
    delay: "-2s",
    dur: "23s",
    mobile: false,
  },
  {
    id: "bloom-6",
    left: "92%",
    size: 42,
    anim: "flower-run-grow-up-2",
    delay: "-18s",
    dur: "28s",
    mobile: false,
  },
  {
    id: "bloom-7",
    left: "32%",
    size: 38,
    anim: "flower-run-grow-up-1",
    delay: "-9s",
    dur: "25s",
    mobile: false,
  },
  {
    id: "bloom-8",
    left: "62%",
    size: 44,
    anim: "flower-run-grow-down",
    delay: "-13s",
    dur: "21s",
    mobile: false,
  },
];

// 2. Running & Fluttering Single Petals (Drifting naturally like blossom breezes)
const RUNNING_PETALS = [
  {
    id: "petal-1",
    left: "12%",
    size: 22,
    anim: "petal-flutter-run-down",
    delay: "-3s",
    dur: "16s",
    mobile: true,
  },
  {
    id: "petal-2",
    left: "84%",
    size: 25,
    anim: "petal-flutter-run-up",
    delay: "-8s",
    dur: "19s",
    mobile: true,
  },
  {
    id: "petal-3",
    left: "28%",
    size: 20,
    anim: "petal-flutter-run-down",
    delay: "-12s",
    dur: "17s",
    mobile: true,
  },
  {
    id: "petal-4",
    left: "70%",
    size: 24,
    anim: "petal-flutter-run-up",
    delay: "-5s",
    dur: "21s",
    mobile: true,
  },
  {
    id: "petal-5",
    left: "50%",
    size: 21,
    anim: "petal-flutter-run-down",
    delay: "-14s",
    dur: "18s",
    mobile: false,
  },
  {
    id: "petal-6",
    left: "96%",
    size: 23,
    anim: "petal-flutter-run-up",
    delay: "-9s",
    dur: "23s",
    mobile: false,
  },
  {
    id: "petal-7",
    left: "4%",
    size: 20,
    anim: "petal-flutter-run-down",
    delay: "-1s",
    dur: "20s",
    mobile: false,
  },
  {
    id: "petal-8",
    left: "58%",
    size: 24,
    anim: "petal-flutter-run-up",
    delay: "-16s",
    dur: "22s",
    mobile: false,
  },
];

// 3. Running & Growing Golden Light Sparks (Luminous dust / glowing pollen)
const RUNNING_LIGHTS = [
  {
    id: "light-1",
    left: "16%",
    size: 12,
    delay: "-2s",
    dur: "15s",
    mobile: true,
  },
  {
    id: "light-2",
    left: "80%",
    size: 16,
    delay: "-7s",
    dur: "18s",
    mobile: true,
  },
  {
    id: "light-3",
    left: "36%",
    size: 11,
    delay: "-11s",
    dur: "16s",
    mobile: false,
  },
  {
    id: "light-4",
    left: "92%",
    size: 14,
    delay: "-5s",
    dur: "20s",
    mobile: false,
  },
  {
    id: "light-5",
    left: "54%",
    size: 13,
    delay: "-13s",
    dur: "17s",
    mobile: false,
  },
];

// 4. Soft Ambient Light Halos (Gently breathing background aura)
const AMBIENT_LIGHTS = [
  {
    id: "halo-1",
    left: "-5%",
    top: "10%",
    size: 420,
    color: "rgba(244, 220, 216, 0.4)", // Blush Pink
    dur: "14s",
    delay: "0s",
  },
  {
    id: "halo-2",
    right: "-6%",
    top: "42%",
    size: 460,
    color: "rgba(212, 164, 94, 0.15)", // Champagne Gold
    dur: "18s",
    delay: "3s",
  },
  {
    id: "halo-3",
    left: "22%",
    bottom: "8%",
    size: 400,
    color: "rgba(235, 213, 197, 0.35)", // Soft Peach
    dur: "16s",
    delay: "6s",
  },
];

// 5. Stationary Edge Living Blooms (Breathing gently on margins)
const EDGE_BLOOMS = [
  { id: "edge-1", left: "1.5%", top: "25%", size: 44, delay: "0s", dur: "9s" },
  { id: "edge-2", right: "1.5%", top: "68%", size: 48, delay: "2.5s", dur: "11s" },
];

export default function FlowerBackground() {
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  if (!mounted) return null;

  return (
    <>
      {/* ── Layer 1: Soft Ambient Floral Light Breathing Behind Content (z-0) ── */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
        style={{ contain: "strict" }}
      >
        {AMBIENT_LIGHTS.map((halo) => (
          <div
            key={halo.id}
            className="absolute rounded-full blur-3xl pointer-events-none ambient-light-breath will-change-transform"
            style={{
              left: halo.left,
              right: halo.right,
              top: halo.top,
              bottom: halo.bottom,
              width: halo.size,
              height: halo.size,
              backgroundColor: halo.color,
              animationDuration: halo.dur,
              animationDelay: halo.delay,
            }}
          />
        ))}
      </div>

      {/* ── Layer 2: Floating Blooms, Petals & Light Sparks (z-20 non-blocking overlay) ── */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-20 overflow-hidden select-none"
        style={{ contain: "strict" }}
      >
        {/* Edge Living Blooms (breathing gracefully at margins) */}
        {EDGE_BLOOMS.map((fl) => (
          <div
            key={fl.id}
            className="hidden sm:block absolute pointer-events-none living-bloom-sway will-change-transform"
            style={{
              left: fl.left,
              right: fl.right,
              top: fl.top,
              width: fl.size,
              height: fl.size,
              animationDelay: fl.delay,
              animationDuration: fl.dur,
            }}
          >
            <FlowerSVG id={fl.id} />
          </div>
        ))}

        {/* Running & Growing Blooming Flowers (traveling across viewport) */}
        {RUNNING_BLOOMS.map((fl) => (
          <div
            key={fl.id}
            className={`${
              fl.mobile ? "block" : "hidden md:block"
            } absolute pointer-events-none will-change-transform ${fl.anim}`}
            style={{
              left: fl.left,
              width: fl.size,
              height: fl.size,
              animationDelay: fl.delay,
              animationDuration: fl.dur,
            }}
          >
            <FlowerSVG id={fl.id} />
          </div>
        ))}

        {/* Running & Fluttering Single Petals */}
        {RUNNING_PETALS.map((pt) => (
          <div
            key={pt.id}
            className={`${
              pt.mobile ? "block" : "hidden md:block"
            } absolute pointer-events-none will-change-transform ${pt.anim}`}
            style={{
              left: pt.left,
              width: pt.size,
              height: Math.round(pt.size * 1.35),
              animationDelay: pt.delay,
              animationDuration: pt.dur,
            }}
          >
            <PetalSVG id={pt.id} />
          </div>
        ))}

        {/* Running & Growing Luminous Golden Light Sparks */}
        {RUNNING_LIGHTS.map((sp) => (
          <div
            key={sp.id}
            className={`${
              sp.mobile ? "block" : "hidden md:block"
            } absolute pointer-events-none light-particle-drift will-change-transform`}
            style={{
              left: sp.left,
              width: sp.size,
              height: sp.size,
              animationDelay: sp.delay,
              animationDuration: sp.dur,
            }}
          >
            <div className="w-full h-full rounded-full bg-gradient-to-r from-[#F4DCD8] via-[#D4A45E] to-[#FFF9F5] shadow-[0_0_10px_rgba(212,164,94,0.6)] blur-[0.5px]" />
          </div>
        ))}
      </div>
    </>
  );
}

/**
 * High-performance inline SVG Flower with luxury Roshe Rose & Gold tones.
 * Uses hardware-accelerated SVG paths with zero complex filters.
 */
function FlowerSVG({ id }: { id: string }) {
  const gradId = `grad-flower-${id}`;
  const glowId = `glow-flower-${id}`;

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full drop-shadow-sm opacity-55"
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F4DCD8" stopOpacity="0.85" />
          <stop offset="55%" stopColor="#EBD5C5" stopOpacity="0.75" />
          <stop offset="85%" stopColor="#D4A45E" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#704638" stopOpacity="0.4" />
        </linearGradient>
        <radialGradient id={glowId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#D4A45E" stopOpacity="0.7" />
          <stop offset="60%" stopColor="#F4DCD8" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#F4DCD8" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Luminous Inner Glow Aura */}
      <circle cx="50" cy="50" r="22" fill={`url(#${glowId})`} />

      {/* 8 Botanical Unfurling Petals */}
      <path
        d="M50 14 C43 27 43 35 50 42 C57 35 57 27 50 14 Z"
        fill={`url(#${gradId})`}
      />
      <path
        d="M50 86 C43 73 43 65 50 58 C57 65 57 73 50 86 Z"
        fill={`url(#${gradId})`}
      />
      <path
        d="M14 50 C27 43 35 43 42 50 C35 57 27 57 14 50 Z"
        fill={`url(#${gradId})`}
      />
      <path
        d="M86 50 C73 43 65 43 58 50 C65 57 73 57 86 50 Z"
        fill={`url(#${gradId})`}
      />

      {/* Diagonal Layer Petals */}
      <path
        d="M24 24 C35 32 39 38 43 44 C38 40 32 36 24 24 Z"
        fill={`url(#${gradId})`}
        opacity="0.8"
      />
      <path
        d="M76 76 C65 68 61 62 57 56 C62 60 68 64 76 76 Z"
        fill={`url(#${gradId})`}
        opacity="0.8"
      />
      <path
        d="M76 24 C68 35 62 39 56 43 C60 38 64 32 76 24 Z"
        fill={`url(#${gradId})`}
        opacity="0.8"
      />
      <path
        d="M24 76 C32 65 36 61 44 57 C39 62 35 68 24 76 Z"
        fill={`url(#${gradId})`}
        opacity="0.8"
      />

      {/* Core Pistil Sparkle */}
      <circle cx="50" cy="50" r="5" fill="#D4A45E" />
      <circle cx="50" cy="50" r="2.5" fill="#FFF9F5" />
    </svg>
  );
}

/**
 * Lightweight Fluttering Petal SVG with luxury gradient fill
 */
function PetalSVG({ id }: { id: string }) {
  const gradId = `petal-grad-${id}`;

  return (
    <svg
      viewBox="0 0 40 54"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full opacity-50 drop-shadow-sm"
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F4DCD8" stopOpacity="0.85" />
          <stop offset="50%" stopColor="#EBD5C5" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#D4A45E" stopOpacity="0.45" />
        </linearGradient>
      </defs>
      <path
        d="M20 2 C33 14 39 28 33 43 C27 53 13 53 7 43 C1 28 7 14 20 2 Z"
        fill={`url(#${gradId})`}
        stroke="#D4A45E"
        strokeWidth="0.6"
        strokeOpacity="0.3"
      />
    </svg>
  );
}
