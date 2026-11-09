"use client";

import React, { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";

const emptySubscribe = () => () => {};

/**
 * 🌸 Mobile-Optimized Background Flower & Ambient Glow for ROSHÉ BEAUTY
 *
 * Crash & Lag Prevention Engineering:
 * 1. Zero Dynamic Blurs: Removed all heavy `blur-3xl` scaling divs that cause mobile GPU panic/crashes (Jetsam OOM).
 *    Ambient light now uses a native static radial gradient with 0 memory overhead.
 * 2. Zero drop-shadow filters on animated SVGs: Prevents software CPU rasterization on mobile WebKit.
 * 3. Mobile Performance Guard: On mobile screens (<768px), all heavy multi-bloom SVGs and lights are disabled;
 *    only 3 lightweight, single-path petals drift softly at a rock-solid 60/120 FPS.
 * 4. Checkout & Admin Exemption: Completely unmounted on `/checkout` and `/admin` routes to prevent keyboard
 *    input latency and ensure 100% checkout stability.
 */

// Desktop-only multi-petal blooming flowers
const DESKTOP_BLOOMS = [
  { id: "bloom-1", left: "6%", size: 44, anim: "flower-run-grow-up-1", delay: "-4s", dur: "22s" },
  { id: "bloom-2", left: "88%", size: 50, anim: "flower-run-grow-up-2", delay: "-11s", dur: "25s" },
  { id: "bloom-3", left: "20%", size: 36, anim: "flower-run-grow-down", delay: "-7s", dur: "23s" },
  { id: "bloom-4", left: "76%", size: 44, anim: "flower-run-grow-up-1", delay: "-15s", dur: "27s" },
  { id: "bloom-5", left: "48%", size: 38, anim: "flower-run-grow-down", delay: "-2s", dur: "24s" },
];

// Single organic petals (ultra-lightweight: safe for mobile & desktop)
const PETALS = [
  // Mobile-safe (only these 3 render on mobile)
  { id: "petal-1", left: "14%", size: 20, anim: "petal-flutter-run-down", delay: "-3s", dur: "18s", mobile: true },
  { id: "petal-2", left: "82%", size: 22, anim: "petal-flutter-run-up", delay: "-9s", dur: "21s", mobile: true },
  { id: "petal-3", left: "46%", size: 18, anim: "petal-flutter-run-down", delay: "-14s", dur: "19s", mobile: true },

  // Desktop-only additional petals
  { id: "petal-4", left: "68%", size: 22, anim: "petal-flutter-run-up", delay: "-6s", dur: "22s", mobile: false },
  { id: "petal-5", left: "94%", size: 20, anim: "petal-flutter-run-down", delay: "-1s", dur: "20s", mobile: false },
];

// Desktop-only gentle light dust
const DESKTOP_LIGHTS = [
  { id: "light-1", left: "18%", size: 8, delay: "-3s", dur: "16s" },
  { id: "light-2", left: "80%", size: 10, delay: "-8s", dur: "19s" },
  { id: "light-3", left: "54%", size: 8, delay: "-13s", dur: "17s" },
];

export default function FlowerBackground() {
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const pathname = usePathname();

  // 1. Immediately return null on checkout, admin, or before mount
  if (!mounted) return null;
  if (pathname?.startsWith("/checkout") || pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      {/* ── Layer 1: Zero-GPU Ambient Glow (Static Native Radial Gradient, NO blur-3xl) ── */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none opacity-40"
        style={{
          contain: "strict",
          backgroundImage:
            "radial-gradient(circle at 8% 18%, rgba(244,220,216,0.35) 0%, transparent 40%), radial-gradient(circle at 92% 45%, rgba(212,164,94,0.14) 0%, transparent 40%), radial-gradient(circle at 30% 85%, rgba(235,213,197,0.25) 0%, transparent 40%)",
        }}
      />

      {/* ── Layer 2: Floating Petals & Blooms (Z-20 non-blocking overlay) ── */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-20 overflow-hidden select-none"
        style={{ contain: "strict" }}
      >
        {/* Desktop-only: Multi-Petal Blooming Flowers */}
        {DESKTOP_BLOOMS.map((fl) => (
          <div
            key={fl.id}
            className={`hidden md:block absolute pointer-events-none will-change-transform ${fl.anim}`}
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

        {/* Floating Petals: 3 safe on mobile, 5 on desktop */}
        {PETALS.map((pt) => (
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

        {/* Desktop-only: Subtle Golden Light Dust */}
        {DESKTOP_LIGHTS.map((sp) => (
          <div
            key={sp.id}
            className="hidden md:block absolute pointer-events-none light-particle-drift will-change-transform"
            style={{
              left: sp.left,
              width: sp.size,
              height: sp.size,
              animationDelay: sp.delay,
              animationDuration: sp.dur,
            }}
          >
            <div className="w-full h-full rounded-full bg-[#D4A45E]/50" />
          </div>
        ))}
      </div>
    </>
  );
}

/**
 * Clean SVG Flower without CPU-heavy drop-shadow filters
 */
function FlowerSVG({ id }: { id: string }) {
  const gradId = `grad-flower-${id}`;
  const glowId = `glow-flower-${id}`;

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full opacity-55"
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

      {/* Luminous Inner Core */}
      <circle cx="50" cy="50" r="20" fill={`url(#${glowId})`} />

      {/* Petals */}
      <path d="M50 14 C43 27 43 35 50 42 C57 35 57 27 50 14 Z" fill={`url(#${gradId})`} />
      <path d="M50 86 C43 73 43 65 50 58 C57 65 57 73 50 86 Z" fill={`url(#${gradId})`} />
      <path d="M14 50 C27 43 35 43 42 50 C35 57 27 57 14 50 Z" fill={`url(#${gradId})`} />
      <path d="M86 50 C73 43 65 43 58 50 C65 57 73 57 86 50 Z" fill={`url(#${gradId})`} />

      {/* Diagonal Petals */}
      <path d="M24 24 C35 32 39 38 43 44 C38 40 32 36 24 24 Z" fill={`url(#${gradId})`} opacity="0.8" />
      <path d="M76 76 C65 68 61 62 57 56 C62 60 68 64 76 76 Z" fill={`url(#${gradId})`} opacity="0.8" />
      <path d="M76 24 C68 35 62 39 56 43 C60 38 64 32 76 24 Z" fill={`url(#${gradId})`} opacity="0.8" />
      <path d="M24 76 C32 65 36 61 44 57 C39 62 35 68 24 76 Z" fill={`url(#${gradId})`} opacity="0.8" />

      {/* Center Pistil */}
      <circle cx="50" cy="50" r="4.5" fill="#D4A45E" />
    </svg>
  );
}

/**
 * Lightweight Fluttering Petal SVG (Zero complex filters, 1 simple path)
 */
function PetalSVG({ id }: { id: string }) {
  const gradId = `petal-grad-${id}`;

  return (
    <svg
      viewBox="0 0 40 54"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full opacity-50"
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
        strokeWidth="0.5"
        strokeOpacity="0.3"
      />
    </svg>
  );
}
