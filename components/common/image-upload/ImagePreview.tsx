"use client";

import Image from "next/image";
import { Trash2, RefreshCw } from "lucide-react";

interface Props {
  images: string[];
  multiple?: boolean;
  onDelete(index: number): void;
  onReplace?(index: number): void;
}

export default function ImagePreview({
  images,
  multiple = false,
  onDelete,
  onReplace,
}: Props) {
  if (!images.length) return null;

  return (
    <div
      className={
        multiple
          ? "grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3"
          : "relative max-w-sm rounded-2xl overflow-hidden border border-neutral-700/60 bg-neutral-900/40 p-2 mt-3"
      }
    >
      {images.map((url, index) => (
        <div
          key={`${url}-${index}`}
          className="group relative rounded-xl overflow-hidden border border-neutral-700/60 bg-neutral-900/50"
        >
          {/* Main / Primary badge for multiple */}
          {multiple && index === 0 && (
            <span className="absolute top-2 left-2 z-10 rounded-md bg-[#d4af37] px-2 py-0.5 text-[10px] font-bold text-black uppercase tracking-wider shadow">
              Primary
            </span>
          )}

          <div className="relative aspect-square w-full overflow-hidden bg-neutral-950 flex items-center justify-center">
            <Image
              src={url}
              alt={`Uploaded ${index + 1}`}
              width={300}
              height={300}
              unoptimized
              sizes="300px"
              className="aspect-square object-contain w-full h-full p-2 transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          {/* Action Overlay */}
          <div className="p-2 bg-neutral-900/90 border-t border-neutral-800 flex items-center justify-between gap-2">
            {onReplace && (
              <button
                type="button"
                onClick={() => onReplace(index)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium transition cursor-pointer"
                title="Replace this image"
              >
                <RefreshCw size={13} className="text-[#d4af37]" />
                <span>Replace</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onDelete(index)}
              className="inline-flex items-center justify-center p-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/30 text-red-400 hover:text-red-300 transition cursor-pointer"
              title="Delete this image"
              aria-label="Delete image"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
