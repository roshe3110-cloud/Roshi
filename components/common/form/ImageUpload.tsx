// "use client";

// import React, { useState } from "react";
// import Image from "next/image";
// import { createClient } from "@/lib/supabase/client";

// interface ImageUploadProps {
//   bucket: string;
//   folder?: string;
//   multiple?: boolean;
//   maxFiles?: number;
//   value: string | string[];
//   onChange: (url: string | string[]) => void;
// }

// const supabase = createClient();

// // ─── Compression config ────────────────────────────────────────────────────
// const MAX_DIMENSION = 1600; // longest side, px — only resized if larger than this
// const WEBP_QUALITY = 0.8; // 80%

// /**
//  * Always converts an image to WebP for consistent storage savings.
//  * Resizes only if the image exceeds MAX_DIMENSION on its longest side.
//  * Falls back to the original file if canvas/encoding isn't available
//  * or if the "compressed" result is somehow larger than the original.
//  */
// async function compressImage(file: File): Promise<File> {
//   // GIFs may be animated — converting to WebP via canvas would flatten
//   // them to a single frame, so skip compression for these.
//   if (file.type === "image/gif") return file;

//   let imageBitmap: ImageBitmap;
//   try {
//     imageBitmap = await createImageBitmap(file);
//   } catch {
//     return file; // unsupported/corrupt image, upload original
//   }

//   let { width, height } = imageBitmap;

//   // Only resize if needed, preserving aspect ratio
//   if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
//     if (width > height) {
//       height = Math.round((height / width) * MAX_DIMENSION);
//       width = MAX_DIMENSION;
//     } else {
//       width = Math.round((width / height) * MAX_DIMENSION);
//       height = MAX_DIMENSION;
//     }
//   }

//   const canvas = document.createElement("canvas");
//   canvas.width = width;
//   canvas.height = height;

//   const ctx = canvas.getContext("2d");
//   if (!ctx) {
//     imageBitmap.close();
//     return file; // fallback: canvas unsupported, upload original
//   }

//   ctx.drawImage(imageBitmap, 0, 0, width, height);
//   imageBitmap.close();

//   const blob: Blob | null = await new Promise((resolve) =>
//     canvas.toBlob(resolve, "image/webp", WEBP_QUALITY),
//   );

//   if (!blob) return file; // fallback: encoding failed, upload original

//   // If re-encoding somehow produced a larger file (rare edge case),
//   // just keep the original instead.
//   if (blob.size >= file.size) return file;

//   const newName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
//   return new File([blob], newName, { type: "image/webp" });
// }

// export const ImageUpload: React.FC<ImageUploadProps> = ({
//   bucket,
//   folder,
//   multiple,
//   maxFiles,
//   value,
//   onChange,
// }) => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (!files || files.length === 0) return;

//     if (multiple && maxFiles) {
//       const currentUrls = Array.isArray(value) ? value : value ? [value] : [];
//       const allowedSpace = maxFiles - currentUrls.length;
//       if (allowedSpace <= 0) {
//         setError(`You can only upload a maximum of ${maxFiles} images.`);
//         return;
//       }
//       if (files.length > allowedSpace) {
//         setError(`You can only select up to ${allowedSpace} more image(s).`);
//         return;
//       }
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       const newUrls: string[] = [];
//       for (let i = 0; i < files.length; i++) {
//         const originalFile = files[i];

//         let file: File;
//         try {
//           file = await compressImage(originalFile);
//         } catch (compressErr) {
//           console.warn("Compression failed, uploading original:", compressErr);
//           file = originalFile; // fallback so upload still succeeds
//         }

//         const ext = file.name.split(".").pop();
//         const randomId = crypto.randomUUID();
//         const fileName = folder
//           ? `${folder}/${randomId}.${ext}`
//           : `${randomId}.${ext}`;

//         const { error: uploadError } = await supabase.storage
//           .from(bucket)
//           .upload(fileName, file, {
//             cacheControl: "3600",
//             upsert: false,
//             contentType: file.type,
//           });

//         if (uploadError) throw uploadError;

//         const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
//         newUrls.push(data.publicUrl);
//       }

//       if (multiple) {
//         const currentUrls = Array.isArray(value) ? value : value ? [value] : [];
//         onChange([...currentUrls, ...newUrls]);
//       } else {
//         onChange(newUrls[0]);
//       }
//     } catch (err: unknown) {
//       console.error(err);
//       setError(err instanceof Error ? err.message : "Upload failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const images = Array.isArray(value) ? value : value ? [value] : [];

//   return (
//     <div className="space-y-3">
//       <input
//         type="file"
//         accept="image/*"
//         multiple={multiple}
//         onChange={handleUpload}
//         disabled={loading}
//         className="block w-full text-sm text-[#888]
//           file:mr-4 file:py-2 file:px-4
//           file:rounded-xl file:border-0
//           file:text-sm file:font-semibold
//           file:bg-[rgba(212,175,55,0.1)] file:text-[#d4af37]
//           hover:file:bg-[rgba(212,175,55,0.15)]
//           disabled:opacity-50 cursor-pointer"
//       />
//       {loading && (
//         <p className="text-xs text-[#888]">Compressing & uploading...</p>
//       )}
//       {error && <p className="text-xs text-red-400">{error}</p>}
//       {images.length > 0 && (
//         <div className="flex flex-wrap gap-2 mt-2">
//           {images.map((url, i) => (
//             <div
//               key={i}
//               className="relative h-24 w-24 rounded-lg overflow-hidden border border-white/10"
//             >
//               <button
//                 type="button"
//                 className="absolute top-1 right-1 z-10 bg-red-500 text-white rounded-full p-1 opacity-75 hover:opacity-100"
//                 onClick={() => {
//                   if (multiple) {
//                     onChange(images.filter((_, index) => index !== i));
//                   } else {
//                     onChange("");
//                   }
//                 }}
//               >
//                 &times;
//               </button>
//               <Image
//                 src={url}
//                 alt="Uploaded Preview"
//                 fill
//                 sizes="96px"
//                 className="object-cover"
//               />
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

export {};
