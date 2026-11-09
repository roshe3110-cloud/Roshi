"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface MarqueeProps {
  items: string[];
  speed?: number;
  icon?: boolean;
  pauseOnHover?: boolean;
  className?: string;
}

function Marquee({
  items,
  speed = 30,
  icon = true,
  pauseOnHover = true,
  className,
}: MarqueeProps) {
  const content = [...items, ...items];

  return (
    <section
      aria-label="Promotional Marquee"
      className={cn(
        "relative overflow-hidden border-y border-border bg-background",
        className
      )}
    >
      {/* Left Fade - Desktop only */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 hidden h-full w-24 bg-gradient-to-r from-background to-transparent md:block" />

      {/* Right Fade - Desktop only */}
      <div className="pointer-events-none absolute right-0 top-0 z-10 hidden h-full w-24 bg-gradient-to-l from-background to-transparent md:block" />

      {/* Animated marquee for desktop */}
      <div
        className={cn(
          "hidden w-max items-center py-5 will-change-transform md:flex",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
        style={{
          animation: `marquee ${speed}s linear infinite`,
        }}
      >
        {content.map((text, index) => (
          <div
            key={index}
            className="mx-10 flex items-center gap-6 whitespace-nowrap"
          >
            {icon && (
              <Sparkles
                className="h-5 w-5 text-primary"
                strokeWidth={1.5}
              />
            )}

            <span
              className="
                text-sm
                font-semibold
                uppercase
                tracking-[0.35em]
                text-foreground/90
                md:text-lg
                lg:text-xl
              "
            >
              {text}
            </span>
          </div>
        ))}
      </div>

      {/* Static scrollable marquee for mobile */}
      <div className="flex items-center overflow-x-auto py-5 md:hidden scrollbar-none gap-8">
        {items.map((text, index) => (
          <div
            key={index}
            className="flex items-center gap-4 whitespace-nowrap shrink-0"
          >
            {icon && (
              <Sparkles
                className="h-4 w-4 text-primary"
                strokeWidth={1.5}
              />
            )}

            <span
              className="
                text-xs
                font-semibold
                uppercase
                tracking-[0.35em]
                text-foreground/90
              "
            >
              {text}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default memo(Marquee);
