import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export async function uploadImage(
  file: File,
  bucket: string,
  folder?: string
) {
  const extension = file.name.split(".").pop() || "webp";

  const path = folder
    ? `${folder}/${crypto.randomUUID()}.${extension}`
    : `${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      contentType: file.type || "image/webp",
      cacheControl: "31536000",
      upsert: true,
    });

  if (error) throw error;

  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return data.publicUrl;
}

export async function deleteImage(url: string, bucket: string) {
  // Extract path from the public URL
  // The URL format is generally: https://<project>.supabase.co/storage/v1/object/public/<bucket>/<path>
  const bucketUrlPart = `/storage/v1/object/public/${bucket}/`;
  const index = url.indexOf(bucketUrlPart);
  if (index === -1) return false;

  const path = url.substring(index + bucketUrlPart.length);

  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);

  if (error) {
    console.error("Error deleting image from bucket:", error);
    return false;
  }
  return true;
}
