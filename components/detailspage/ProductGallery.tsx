"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductImage {
  id: string;
  url: string;
  alt?: string;
}

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export default function ProductGallery({
  images,
  productName,
}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [failedImgs, setFailedImgs] = useState<Record<string, boolean>>({});

  const activeImage = images[activeIndex];

  const nextImage = () => {
    setImgLoaded(false);
    setActiveIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const previousImage = () => {
    setImgLoaded(false);
    setActiveIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  if (!images.length || !activeImage) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-3xl bg-neutral-100 border text-neutral-400 text-sm">
        No image available
      </div>
    );
  }

  const activeSrc = failedImgs[activeImage.id]
    ? "/placeholder.svg"
    : activeImage.url;

  return (
    <div className="space-y-5">
      {/* Main Image */}
      <div
        className="
          group relative overflow-hidden
          rounded-3xl
          bg-neutral-100
          aspect-square
          border border-neutral-200/80
        "
      >
        {/* Placeholder skeleton */}
        {!imgLoaded && (
          <div className="absolute inset-0 z-0 bg-neutral-200 animate-pulse rounded-3xl" />
        )}

        <Image
          key={activeImage.id}
          src={activeSrc}
          alt={activeImage.alt || productName}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
          onLoad={() => setImgLoaded(true)}
          onError={() => {
            setFailedImgs((prev) => ({ ...prev, [activeImage.id]: true }));
            setImgLoaded(true);
          }}
          className={`
            object-contain
            transition-all duration-700
            ease-out
            ${imgLoaded ? "opacity-100" : "opacity-0"}
            ${
              zoom
                ? "scale-125 cursor-zoom-out"
                : "scale-100 cursor-zoom-in"
            }
          `}
          onClick={() => setZoom(!zoom)}
        />

        {/* Overlay */}
        <div
          className="
            absolute inset-0
            bg-black/0
            transition-colors duration-300
            group-hover:bg-black/5
            pointer-events-none
          "
        />

        {/* Zoom Button */}
        <Button
          size="icon"
          variant="secondary"
          onClick={() => setZoom(!zoom)}
          className="
            absolute right-4 top-4
            rounded-full
            opacity-0
            transition-all duration-300
            group-hover:opacity-100
          "
        >
          <ZoomIn className="h-5 w-5" />
        </Button>

        {/* Navigation */}
        {images.length > 1 && (
          <>
            <Button
              size="icon"
              variant="secondary"
              onClick={previousImage}
              className="
                absolute left-4 top-1/2
                -translate-y-1/2
                rounded-full
                opacity-0
                transition-all duration-300
                group-hover:opacity-100
              "
            >
              <ChevronLeft />
            </Button>

            <Button
              size="icon"
              variant="secondary"
              onClick={nextImage}
              className="
                absolute right-4 top-1/2
                -translate-y-1/2
                rounded-full
                opacity-0
                transition-all duration-300
                group-hover:opacity-100
              "
            >
              <ChevronRight />
            </Button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div
          className="
            flex gap-3
            overflow-x-auto
            pb-2
            scrollbar-none
          "
        >
          {images.map((image, index) => {
            const thumbSrc = failedImgs[image.id]
              ? "/placeholder.svg"
              : image.url;
            return (
              <button
                key={image.id}
                onClick={() => {
                  setImgLoaded(false);
                  setActiveIndex(index);
                  setZoom(false);
                }}
                className={`
                  relative
                  h-20 w-20
                  shrink-0
                  overflow-hidden
                  rounded-xl
                  border-2
                  transition-all duration-300
                  ${
                    activeIndex === index
                      ? "border-black scale-105"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }
                `}
              >
                <Image
                  src={thumbSrc}
                  alt={image.alt || productName}
                  width={80}
                  height={80}
                  className="
                    object-cover w-full h-full
                    transition-transform duration-300
                    hover:scale-110
                  "
                  onError={() =>
                    setFailedImgs((prev) => ({ ...prev, [image.id]: true }))
                  }
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
