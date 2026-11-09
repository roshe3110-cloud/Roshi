"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const STORE_CONTACT = {
  brandName: "ROSHÉ BEAUTY",
  phone: "+92 317 4880517",
  phoneFormatted: "+92 317 4880517",
  whatsappNumber: "+92 317 4880517",
  whatsappUrl: "https://wa.me/923174880517",
  address: "Lahore Pakistan",
  city: "Lahore",
  instagram: "https://www.instagram.com/rosh.e21?xtok=MTR3bXRjNWhleXlwaw==",
  facebook: "https://www.facebook.com/share/1Jb7p7Vi9g/",
  email: "[EMAIL_ADDRESS]",
  tiktok: "https://www.instagram.com/rosh.e21?xtok=MTR3bXRjNWhleXlwaw==",
};

// ── BRAND SVG ICONS ──────────────────────────────────────────────────────────

export function InstagramIcon({
  className = "w-5 h-5",
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.77 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.428.047 1.023.06 1.378.06 3.808s-.013 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.77c-.508.508-1.116.892-1.77 1.154-.636.247-1.363.416-2.428.465-1.024.047-1.379.06-3.808.06s-2.784-.013-3.808-.06c-1.064-.049-1.791-.218-2.428-.465a4.902 4.902 0 01-1.77-1.153 4.902 4.902 0 01-1.154-1.77c-.247-.637-.416-1.364-.465-2.428C2.013 15.099 2 14.745 2 12.315s.013-2.784.06-3.808c.049-1.064.218-1.791.465-2.428a4.902 4.902 0 011.154-1.77 4.902 4.902 0 011.77-1.153c.637-.247 1.364-.416 2.428-.465C9.531 2.013 9.885 2 12.315 2zm-.071 2.163c-2.404 0-2.686.01-3.641.053-.88.041-1.36.188-1.682.312a2.738 2.738 0 00-1.012.658 2.738 2.738 0 00-.658 1.012c-.124.322-.271.802-.312 1.682-.044.955-.053 1.237-.053 3.641s.01 2.686.053 3.641c.041.88.188 1.36.312 1.682.176.455.426.852.658 1.012.232.16.557.41.658.658.322.124.802.271 1.682.312.955.044 1.237.053 3.641.053s2.686-.01 3.641-.053c.88-.041 1.36-.188 1.682-.312.455-.176.852-.426 1.012-.658.16-.232.41-.557.658-.658.124-.322.271-.802.312-1.682.044-.955.053-1.237.053-3.641s-.01-2.686-.053-3.641c-.041-.88-.188-1.36-.312-1.682a2.738 2.738 0 00-.658-1.012 2.738 2.738 0 00-1.012-.658c-.322-.124-.802-.271-1.682-.312-.955-.044-1.237-.053-3.641-.053zm0 3.749a6.402 6.402 0 110 12.804 6.402 6.402 0 010-12.804zm0 2.163a4.239 4.239 0 100 8.478 4.239 4.239 0 000-8.478zm6.406-4.761a1.496 1.496 0 11-2.992 0 1.496 1.496 0 012.992 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function FacebookIcon({
  className = "w-5 h-5",
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function WhatsAppIcon({
  className = "w-5 h-5",
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm0 18.15c-1.5 0-2.97-.4-4.26-1.16l-.31-.18-3.16.83.84-3.08-.2-.32a8.17 8.17 0 0 1-1.25-4.33c0-4.52 3.68-8.19 8.2-8.19 2.19 0 4.25.85 5.8 2.4 1.55 1.55 2.4 3.61 2.4 5.8 0 4.52-3.68 8.19-8.06 8.23zm4.5-6.14c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.84-.86 2.05 0 1.21.88 2.38 1 2.54.12.17 1.74 2.66 4.21 3.73.59.25 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.12-.23-.19-.48-.31z" />
    </svg>
  );
}

export function TikTokIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.69 6.34 6.34 0 0 0 9.34 22a6.34 6.34 0 0 0 6.32-6.33V9.17a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.6z" />
    </svg>
  );
}

// ── PARTICLE BURST LIGHT ANIMATION ──────────────────────────────────────────

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
}

interface BurstInstance {
  id: number;
  particles: Particle[];
  shockColor: string;
  flashColor: string;
}

const PLATFORM_CONFIGS = {
  instagram: {
    name: "Instagram",
    href: STORE_CONTACT.instagram,
    primaryColor: "#E1306C",
    secondaryColor: "#D4A45E",
    accentGlow: "rgba(225, 48, 108, 0.45)",
    particleColors: [
      "#E1306C",
      "#D4A45E",
      "#F77737",
      "#C13584",
      "#F4DCD8",
      "#FFFFFF",
      "#EBD5C5",
      "#704638",
    ],
    bgClass:
      "bg-gradient-to-r from-[#E1306C] via-[#C13584] to-[#833AB4] text-white border-pink-400/30",
    idleGlowStyle: {
      boxShadow:
        "0 0 14px rgba(225, 48, 108, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2)",
    },
    hoverGlowStyle: {
      boxShadow:
        "0 0 26px rgba(225, 48, 108, 0.8), 0 0 14px rgba(212, 164, 94, 0.8), 0 0 35px rgba(131, 58, 180, 0.5)",
    },
  },
  facebook: {
    name: "Facebook",
    href: STORE_CONTACT.facebook,
    primaryColor: "#1877F2",
    secondaryColor: "#60A5FA",
    accentGlow: "rgba(24, 119, 242, 0.55)",
    particleColors: [
      "#1877F2",
      "#3B82F6",
      "#60A5FA",
      "#D4A45E",
      "#FFFFFF",
      "#F4DCD8",
      "#38BDF8",
      "#FFFFFF",
    ],
    bgClass: "bg-[#1877F2] border-blue-400/40 text-white",
    idleGlowStyle: {
      boxShadow:
        "0 0 14px rgba(24, 119, 242, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2)",
    },
    hoverGlowStyle: {
      boxShadow:
        "0 0 26px rgba(24, 119, 242, 0.8), 0 0 12px rgba(96, 165, 250, 0.9), 0 0 35px rgba(24, 119, 242, 0.4)",
    },
  },
  whatsapp: {
    name: "WhatsApp",
    href: STORE_CONTACT.whatsappUrl,
    primaryColor: "#25D366",
    secondaryColor: "#34D399",
    accentGlow: "rgba(37, 211, 102, 0.55)",
    particleColors: [
      "#25D366",
      "#10B981",
      "#34D399",
      "#D4A45E",
      "#FFFFFF",
      "#059669",
      "#F4DCD8",
      "#FFFFFF",
    ],
    bgClass: "bg-[#25D366] border-emerald-300/40 text-white",
    idleGlowStyle: {
      boxShadow:
        "0 0 14px rgba(37, 211, 102, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2)",
    },
    hoverGlowStyle: {
      boxShadow:
        "0 0 26px rgba(37, 211, 102, 0.85), 0 0 12px rgba(52, 211, 153, 0.9), 0 0 35px rgba(37, 211, 102, 0.4)",
    },
  },
  tiktok: {
    name: "TikTok",
    href: STORE_CONTACT.tiktok,
    primaryColor: "#25F4EE",
    secondaryColor: "#FE2C55",
    accentGlow: "rgba(37, 244, 238, 0.4)",
    particleColors: [
      "#25F4EE",
      "#FE2C55",
      "#00F2FE",
      "#D4A45E",
      "#FFFFFF",
      "#25F4EE",
      "#FE2C55",
      "#FFFFFF",
    ],
    bgClass: "bg-neutral-900 border-neutral-700 text-white",
    idleGlowStyle: {
      boxShadow:
        "-2px -2px 14px rgba(37, 244, 238, 0.35), 2px 2px 14px rgba(254, 44, 85, 0.4)",
    },
    hoverGlowStyle: {
      boxShadow:
        "-3px -3px 24px rgba(37, 244, 238, 0.7), 3px 3px 24px rgba(254, 44, 85, 0.75), 0 0 12px rgba(255, 255, 255, 0.5)",
    },
  },
};

export type SocialPlatform = keyof typeof PLATFORM_CONFIGS;

export interface GlowingSocialButtonProps {
  platform: SocialPlatform;
  variant?: "icon-only" | "pill" | "banner";
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
  showLightsOnClick?: boolean;
}

export function GlowingSocialButton({
  platform,
  variant = "pill",
  size = "md",
  label,
  className = "",
  showLightsOnClick = true,
}: GlowingSocialButtonProps) {
  const [bursts, setBursts] = useState<BurstInstance[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const config = PLATFORM_CONFIGS[platform];

  const handleClick = () => {
    if (!showLightsOnClick) return;

    // Generate radial light sparks
    const particleCount = 12;
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const angle = (i * 360) / particleCount + (Math.random() * 20 - 10);
      const rad = (angle * Math.PI) / 180;
      const distance = 40 + Math.random() * 35;
      const color = config.particleColors[i % config.particleColors.length];

      particles.push({
        id: i,
        x: Math.cos(rad) * distance,
        y: Math.sin(rad) * distance,
        size: Math.random() > 0.4 ? 5 : 7,
        color,
      });
    }

    const newBurst: BurstInstance = {
      id: Date.now() + Math.random(),
      particles,
      shockColor: config.primaryColor,
      flashColor: config.secondaryColor,
    };

    setBursts((prev) => [...prev, newBurst]);

    setTimeout(() => {
      setBursts((prev) => prev.filter((b) => b.id !== newBurst.id));
    }, 750);
  };

  const sizeClasses = {
    sm:
      variant === "icon-only"
        ? "w-8 h-8 rounded-lg"
        : "px-3 py-1.5 text-xs rounded-xl gap-1.5",
    md:
      variant === "icon-only"
        ? "w-10 h-10 rounded-xl"
        : "px-4 py-2.5 text-xs sm:text-sm rounded-xl gap-2",
    lg:
      variant === "icon-only"
        ? "w-12 h-12 rounded-2xl"
        : "px-5 py-3 text-sm font-semibold rounded-2xl gap-2.5",
  };

  const iconSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const IconComponent =
    platform === "instagram"
      ? InstagramIcon
      : platform === "facebook"
        ? FacebookIcon
        : platform === "whatsapp"
          ? WhatsAppIcon
          : TikTokIcon;

  const defaultLabel =
    label ??
    (platform === "instagram"
      ? "Instagram Profile"
      : platform === "facebook"
        ? "Facebook Page"
        : platform === "whatsapp"
          ? "WhatsApp Order & Care"
          : "TikTok");

  return (
    <div className="relative inline-flex items-center justify-center">
      {/* ── AMBIENT BREATHING GLOW ── */}
      <motion.div
        animate={{
          opacity: isHovered ? 0.9 : 0.45,
          scale: isHovered ? 1.08 : 1,
        }}
        transition={{ duration: 0.3 }}
        style={isHovered ? config.hoverGlowStyle : config.idleGlowStyle}
        className="absolute inset-0 rounded-2xl pointer-events-none transition-all duration-300"
      />

      {/* ── THE INTERACTIVE BUTTON ── */}
      <motion.a
        href={config.href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.93 }}
        transition={{ type: "spring", stiffness: 450, damping: 22 }}
        className={`relative z-10 inline-flex items-center justify-center font-bold tracking-wide select-none border transition-all duration-300 overflow-visible group ${config.bgClass} ${sizeClasses[size]} ${className}`}
        aria-label={`${config.name} Official Channel`}
      >
        {/* Shimmer Sheen on Hover */}
        <span className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
          <span className="absolute -inset-full bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
        </span>

        {/* Icon & Label */}
        <span className="relative z-10 flex items-center justify-center drop-shadow-md">
          <IconComponent className={iconSizes[size]} />
        </span>

        {variant !== "icon-only" && (
          <span className="relative z-10 truncate drop-shadow-sm font-semibold">
            {defaultLabel}
          </span>
        )}
      </motion.a>

      {/* ── LIGHTS BURST ANIMATION ON CLICK ── */}
      <AnimatePresence>
        {bursts.map((burst) => (
          <React.Fragment key={burst.id}>
            <motion.span
              initial={{ scale: 0.8, opacity: 0.95 }}
              animate={{ scale: 1.8, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              style={{
                background: `radial-gradient(circle, ${burst.flashColor} 0%, rgba(255,255,255,0.8) 40%, transparent 70%)`,
              }}
              className="absolute inset-0 pointer-events-none rounded-2xl z-20"
            />

            <motion.span
              initial={{ scale: 0.6, opacity: 1 }}
              animate={{ scale: 2.3, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              style={{
                borderColor: burst.shockColor,
                boxShadow: `0 0 20px ${burst.shockColor}, inset 0 0 15px ${burst.shockColor}`,
              }}
              className="absolute inset-0 rounded-2xl border-2 pointer-events-none z-20"
            />

            {burst.particles.map((p) => (
              <motion.span
                key={p.id}
                initial={{ x: 0, y: 0, scale: 1.2, opacity: 1 }}
                animate={{
                  x: p.x,
                  y: p.y,
                  scale: [1.2, 1.6, 0],
                  opacity: [1, 0.9, 0],
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.65,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  width: p.size,
                  height: p.size,
                  backgroundColor: p.color,
                  boxShadow: `0 0 8px ${p.color}, 0 0 16px ${p.color}`,
                }}
                className="absolute pointer-events-none rounded-full z-30 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              />
            ))}
          </React.Fragment>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ── REUSABLE GLOWING SOCIAL CHANNELS SECTION ─────────────────────────────────

export interface GlowingSocialSectionProps {
  className?: string;
  variant?: "compact" | "cards" | "banner";
  showTitle?: boolean;
}

export function GlowingSocialSection({
  className = "",
  variant = "cards",
  showTitle = true,
}: GlowingSocialSectionProps) {
  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-2.5 ${className}`}>
        <GlowingSocialButton
          platform="instagram"
          variant="icon-only"
          size="md"
        />
        <GlowingSocialButton
          platform="facebook"
          variant="icon-only"
          size="md"
        />
        <GlowingSocialButton
          platform="whatsapp"
          variant="icon-only"
          size="md"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-[#D4A45E]/30 bg-gradient-to-b from-[#FFFFFF] via-[#F9F4EF] to-[#F4DCD8]/60 p-6 sm:p-8 text-center shadow-lg ${className}`}
    >
      {/* Ambient background light bursts */}
      <div className="absolute -left-20 -top-20 h-56 w-56 rounded-full bg-[#F4DCD8]/80 blur-3xl pointer-events-none" />
      <div className="absolute -right-20 -bottom-20 h-56 w-56 rounded-full bg-[#EBD5C5]/80 blur-3xl pointer-events-none" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-[#D4A45E]/15 blur-3xl pointer-events-none" />

      {showTitle && (
        <div className="relative z-10 mb-6 max-w-lg mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#F4DCD8] text-[#704638] border border-[#D4A45E]/40 mb-2.5 shadow-sm">
            <span>Official Community & Live Radiance</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#704638] tracking-tight">
            Connect With ROSHÉ
          </h3>
          <p className="mt-1.5 text-xs sm:text-sm text-[#8C5E50] leading-relaxed">
            Follow our verified channels for beauty routine tutorials, luxury
            cosmetic swatches, and instant WhatsApp beauty care consultations.
          </p>
        </div>
      )}

      {/* Glowing Action Buttons */}
      <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
        <GlowingSocialButton platform="instagram" variant="pill" size="md" />
        <GlowingSocialButton platform="facebook" variant="pill" size="md" />
        <GlowingSocialButton platform="whatsapp" variant="pill" size="md" />
      </div>

      <p className="relative z-10 mt-4 text-[11px] text-[#8C5E50] font-mono">
        Click any channel to test the light sparks &amp; open our official page
      </p>
    </div>
  );
}
