"use client";

import { useRef, useState } from "react";
import ReactCrop, { type Crop, type PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface CropDialogProps {
  open: boolean;
  image: string;
  aspect?: number;
  loading?: boolean;
  onCancel: () => void;
  onSave: (crop: Area) => void;
}

export default function CropDialog({
  open,
  image,
  aspect = 1,
  loading = false,
  onCancel,
  onSave,
}: CropDialogProps) {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-full">
        {/* Header */}
        <div className="border-b px-6 py-4 shrink-0">
          <h2 className="text-lg font-semibold">
            Crop Image
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Drag the edges of the box to resize your crop before uploading.
          </p>
        </div>

        {/* Cropper */}
        <div className="relative bg-black flex-1 overflow-auto flex items-center justify-center min-h-[300px] max-h-[60vh]">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={image}
              alt="Crop me"
              style={{ maxHeight: "60vh", objectFit: "contain" }}
              onLoad={(e) => {
                const { width, height } = e.currentTarget;
                // Center crop initially
                const cropWidthInPercent = (Math.min(width, height) / width) * 100;
                const cropHeightInPercent = (Math.min(width, height) / height) * 100;
                setCrop({
                  unit: '%',
                  width: aspect ? cropHeightInPercent * aspect : cropWidthInPercent,
                  height: cropHeightInPercent,
                  x: (100 - (aspect ? cropHeightInPercent * aspect : cropWidthInPercent)) / 2,
                  y: (100 - cropHeightInPercent) / 2
                });
              }}
            />
          </ReactCrop>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-5 border-t shrink-0">
          <button
            onClick={onCancel}
            className="px-5 py-2 rounded-lg border hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            disabled={loading || !completedCrop}
            onClick={() => {
              if (!completedCrop || !imgRef.current) return;
              
              const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
              const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

              const actualCrop = {
                x: completedCrop.x * scaleX,
                y: completedCrop.y * scaleY,
                width: completedCrop.width * scaleX,
                height: completedCrop.height * scaleY,
              };

              onSave(actualCrop);
            }}
            className="px-5 py-2 rounded-lg bg-black text-white hover:bg-gray-900 disabled:opacity-60"
          >
            {loading ? "Saving..." : "Crop & Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}