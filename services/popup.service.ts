import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database.types";

export type PopupAd = Database["public"]["Tables"]["popup_ads"]["Row"];
export type CreatePopupAdInput = Database["public"]["Tables"]["popup_ads"]["Insert"];
export type UpdatePopupAdInput = Database["public"]["Tables"]["popup_ads"]["Update"];

// =================================
// GET ACTIVE POPUPS (public — respects date range)
// =================================
export async function getActivePopups(): Promise<PopupAd[]> {
  const supabase = createClient();
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("popup_ads")
    .select("*")
    .eq("is_active", true)
    .or(`start_date.is.null,start_date.lte.${now}`)
    .or(`end_date.is.null,end_date.gte.${now}`)
    .order("sort_order", { ascending: true });

  if (error) throw error;

  return data as PopupAd[];
}

// =================================
// GET ALL POPUPS (admin)
// =================================
export async function getAllPopupsAdmin(): Promise<PopupAd[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("popup_ads")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;

  return data as PopupAd[];
}

// =================================
// CREATE POPUP
// =================================
export async function createPopupAd(input: CreatePopupAdInput): Promise<PopupAd> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("popup_ads")
    .insert(input)
    .select()
    .single();

  if (error) throw error;

  return data as PopupAd;
}

// =================================
// UPDATE POPUP
// =================================
export async function updatePopupAd(
  id: string,
  updates: UpdatePopupAdInput,
): Promise<PopupAd> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("popup_ads")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data as PopupAd;
}

// =================================
// DELETE POPUP
// =================================
export async function deletePopupAd(id: string): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase.from("popup_ads").delete().eq("id", id);

  if (error) throw error;

  return true;
}

// =================================
// TOGGLE POPUP STATUS
// =================================
export async function updatePopupAdStatus(
  id: string,
  is_active: boolean,
): Promise<PopupAd> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("popup_ads")
    .update({ is_active })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data as PopupAd;
}

