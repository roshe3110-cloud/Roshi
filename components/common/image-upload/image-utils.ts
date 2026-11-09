export interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const MAX_DIMENSION = 1600;
export const WEBP_QUALITY = 0.8; // 80% quality delivers 70-85% file size reduction with visual parity

/**
 * Compresses an uncropped image file:
 * - Downscales resolution to maximum 1600px preserving aspect ratio
 * - High-quality bicubic smoothing
 * - Encodes to modern lossy WebP at 80% quality
 */
export async function compressImage(file: File): Promise<File> {
  if (file.type === "image/gif") return file;

  const bitmap = await createImageBitmap(file);

  let width = bitmap.width;
  let height = bitmap.height;

  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    if (width > height) {
      height = Math.round((height * MAX_DIMENSION) / width);
      width = MAX_DIMENSION;
    } else {
      width = Math.round((width * MAX_DIMENSION) / height);
      height = MAX_DIMENSION;
    }
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) return file;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bitmap, 0, 0, width, height);

  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", WEBP_QUALITY),
  );

  if (!blob) return file;

  return new File([blob], file.name.replace(/\.[^/.]+$/, ".webp"), {
    type: "image/webp",
  });
}

/**
 * Crops and optimizes image in a single pass:
 * - Crops selected area
 * - Bounds dimensions to MAX_DIMENSION (1600px)
 * - Anti-aliasing with high smoothing quality
 * - Encodes directly into WebP (80% quality)
 */
export async function getCroppedImg(
  imageSrc: string,
  crop: Area
): Promise<File> {
  const image = new Image();
  image.src = imageSrc;

  await new Promise((resolve, reject) => {
    image.onload = resolve;
    image.onerror = () => reject(new Error("Failed to load image for cropping"));
  });

  // Calculate scaled target dimensions capped at MAX_DIMENSION
  let targetWidth = Math.round(crop.width);
  let targetHeight = Math.round(crop.height);

  if (targetWidth > MAX_DIMENSION || targetHeight > MAX_DIMENSION) {
    if (targetWidth > targetHeight) {
      targetHeight = Math.round((targetHeight * MAX_DIMENSION) / targetWidth);
      targetWidth = MAX_DIMENSION;
    } else {
      targetWidth = Math.round((targetWidth * MAX_DIMENSION) / targetHeight);
      targetHeight = MAX_DIMENSION;
    }
  }

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not initialize 2D canvas context.");

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    targetWidth,
    targetHeight
  );

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", WEBP_QUALITY)
  );

  if (!blob) {
    throw new Error("Unable to encode cropped image to WebP format.");
  }

  return new File(
    [blob],
    `${crypto.randomUUID()}.webp`,
    {
      type: "image/webp",
    }
  );
}
