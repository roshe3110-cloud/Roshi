import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database.types";

export type Banner = Database["public"]["Tables"]["banners"]["Row"];
export type CreateBannerInput =
  Database["public"]["Tables"]["banners"]["Insert"];
export type UpdateBannerInput =
  Database["public"]["Tables"]["banners"]["Update"];

// =================================
// GET ACTIVE BANNERS (public, max 3)
// =================================
export async function getBanners(): Promise<Banner[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("banners")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .limit(3);

  if (error) throw error;

  return data as Banner[];
}

// =================================
// GET ALL BANNERS (admin)
// =================================
export async function getAllBannersAdmin(): Promise<Banner[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("banners")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;

  return data as Banner[];
}

// =================================
// CREATE BANNER
// =================================
export async function createBanner(input: CreateBannerInput): Promise<Banner> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("banners")
    .insert(input)
    .select()
    .single();

  if (error) throw error;

  return data as Banner;
}

// =================================
// UPDATE BANNER
// =================================
export async function updateBanner(
  id: string,
  updates: UpdateBannerInput,
): Promise<Banner> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("banners")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data as Banner;
}

// =================================
// DELETE BANNER
// =================================
export async function deleteBanner(id: string): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase.from("banners").delete().eq("id", id);

  if (error) throw error;

  return true;
}

// =================================
// UPDATE BANNER STATUS
// =================================
export async function updateBannerStatus(
  id: string,
  is_active: boolean,
): Promise<Banner> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("banners")
    .update({ is_active })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data as Banner;
}

