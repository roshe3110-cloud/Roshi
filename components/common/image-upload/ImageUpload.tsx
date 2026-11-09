"use client";

import React, { useState, useRef } from "react";
import { Upload, AlertCircle, CheckCircle2 } from "lucide-react";
import CropDialog from "./CropDialog";
import ImagePreview from "./ImagePreview";
import type { ImageUploadProps } from "./types";
import { compressImage, getCroppedImg } from "./image-utils";
import { uploadImage } from "./upload";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export default function ImageUpload({
  bucket,
  folder,
  value,
  onChange,
  multiple = false,
  maxFiles = 4,
  aspect = 1,
}: ImageUploadProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cropImage, setCropImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [replaceIndex, setReplaceIndex] = useState<number | null>(null);

  const mainInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  const images = Array.isArray(value) ? value.filter(Boolean) : value ? [value] : [];
  const isMaxReached = multiple && images.length >= maxFiles;

  function handleRemove(index: number) {
    setError(null);
    const updated = images.filter((_, i) => i !== index);
    if (multiple) {
      onChange(updated);
    } else {
      onChange("");
    }
  }

  function handleTriggerReplace(index: number) {
    setError(null);
    setReplaceIndex(index);
    if (replaceInputRef.current) {
      replaceInputRef.current.value = "";
      replaceInputRef.current.click();
    }
  }

  function validateFile(file: File): string | null {
    const isHeic = file.name.toLowerCase().endsWith(".heic");
    if (!file.type.startsWith("image/") && !isHeic) {
      return `"${file.name}" is not an image. Please upload JPG, PNG, WEBP, or SVG files.`;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      const mb = (file.size / (1024 * 1024)).toFixed(1);
      return `"${file.name}" is too large (${mb}MB). Maximum allowed file size is 5MB.`;
    }
    return null;
  }

  async function handleFile(file: File) {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = () => {
      setCropImage(reader.result as string);
      setSelectedFile(file);
    };
    reader.readAsDataURL(file);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;

    const selectedFiles = Array.from(files);

    if (multiple) {
      const availableSlots = maxFiles - images.length;
      if (selectedFiles.length > availableSlots) {
        setError(
          `Cannot add ${selectedFiles.length} images. Only ${availableSlots} more allowed (Max ${maxFiles}).`
        );
        e.target.value = "";
        return;
      }
    }

    setPendingFiles(selectedFiles);
    await handleFile(selectedFiles[0]);
    e.target.value = "";
  }

  async function handleReplaceFile(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;
    const file = files[0];

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      e.target.value = "";
      return;
    }

    setPendingFiles([file]);
    await handleFile(file);
    e.target.value = "";
  }

  function processNextFile() {
    if (pendingFiles.length > 1) {
      const remaining = pendingFiles.slice(1);
      setPendingFiles(remaining);
      handleFile(remaining[0]);
    } else {
      setPendingFiles([]);
    }
  }

  async function handleCropSave(crop: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) {
    if (!cropImage || !selectedFile) return;

    try {
      setLoading(true);
      setError(null);

      const croppedFile = await getCroppedImg(cropImage, crop);
      const url = await uploadImage(croppedFile, bucket, folder);

      if (replaceIndex !== null) {
        // Replacing a specific slot
        if (multiple) {
          const updated = [...images];
          updated[replaceIndex] = url;
          onChange(updated);
        } else {
          onChange(url);
        }
        setReplaceIndex(null);
      } else if (multiple) {
        // Appending to multiple list
        onChange([...images, url]);
      } else {
        // Single upload
        onChange(url);
      }

      setCropImage(null);
      setSelectedFile(null);
      processNextFile();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  // Determine whether to show upload box
  const showUploadZone = multiple ? !isMaxReached : images.length === 0;

  return (
    <div className="space-y-3">
      {/* Hidden file input for Replace action */}
      <input
        ref={replaceInputRef}
        type="file"
        hidden
        accept="image/*,.heic,.HEIC"
        onChange={handleReplaceFile}
      />

      {/* Upload Zone (hidden when max images reached) */}
      {showUploadZone && (
        <label
          className={`
            flex flex-col items-center justify-center
            gap-2.5
            border-2 border-dashed
            rounded-2xl
            p-6
            cursor-pointer
            transition-all duration-200
            ${
              loading
                ? "opacity-50 cursor-not-allowed border-neutral-700 bg-neutral-900/30"
                : "border-neutral-700/80 bg-neutral-900/40 hover:border-[#d4af37] hover:bg-neutral-900/80"
            }
          `}
        >
          <Upload className="w-6 h-6 text-[#d4af37]" />

          <div className="text-center">
            <p className="font-semibold text-xs sm:text-sm text-neutral-200">
              {multiple
                ? `Click to Add Images (${images.length}/${maxFiles})`
                : "Click to Upload Image"}
            </p>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              Auto-converts to WebP · Max 5MB (JPG, PNG, WEBP, SVG)
            </p>
          </div>

          <input
            ref={mainInputRef}
            type="file"
            hidden
            accept="image/*,.heic,.HEIC"
            multiple={multiple}
            disabled={loading}
            onChange={handleUpload}
          />
        </label>
      )}

      {/* Max Files Reached Notice */}
      {isMaxReached && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-neutral-900/80 border border-[#d4af37]/40 text-xs text-[#d4af37]">
          <CheckCircle2 size={16} className="shrink-0 text-[#d4af37]" />
          <span>
            Maximum capacity reached ({images.length}/{maxFiles} images). You can Replace or Delete existing images below.
          </span>
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="text-xs text-center text-neutral-400 flex items-center justify-center gap-2 py-1">
          <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-ping" />
          <span>Processing and optimizing image to WebP...</span>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="flex items-start gap-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3">
          <AlertCircle size={15} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Preview Section with Replace & Delete Actions */}
      <ImagePreview
        images={images}
        multiple={multiple}
        onDelete={handleRemove}
        onReplace={handleTriggerReplace}
      />

      {/* Crop Modal */}
      {cropImage && (
        <CropDialog
          open={true}
          image={cropImage}
          aspect={aspect}
          loading={loading}
          onCancel={() => {
            setCropImage(null);
            setSelectedFile(null);
            setReplaceIndex(null);
            processNextFile();
          }}
          onSave={handleCropSave}
        />
      )}
    </div>
  );
}
