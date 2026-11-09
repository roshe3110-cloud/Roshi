import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";
import type { Database } from "@/types/database.types";

export type Category = Database["public"]["Tables"]["categories"]["Row"] & {
  products?: {
    id: string;
    name?: string;
    slug?: string;
    price?: number;
    stock?: number;
  }[];
};

export interface CreateCategoryInput {
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  is_active?: boolean;
  sort_order?: number;
}

export type UpdateCategoryInput = Partial<CreateCategoryInput>;

// =================================
// GET ALL ACTIVE CATEGORIES
// =================================
export async function getCategories() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("categories")
    .select(
      `
      *,
      products(
        id,
        name,
        slug,
        price,
        stock
      )
    `,
    )
    .eq("is_active", true)
    .order("sort_order", {
      ascending: true,
    });

  if (error) throw error;

  return data as unknown as Category[];
}

// =================================
// GET ALL CATEGORIES ADMIN
// =================================
export async function getAllCategories() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("categories")
    .select(
      `
      *,
      products(
        id
      )
    `,
    )
    .order("created_at", {
      ascending: false,
    });

  if (error) throw error;

  return data as unknown as Category[];
}

// =================================
// GET CATEGORY BY ID
// =================================
export async function getCategoryById(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("categories")
    .select(
      `
      *,
      products(
        *,
        product_images(
          image_url,
          position
        )
      )
    `,
    )
    .eq("id", id)
    .single();

  if (error) throw error;

  return data as unknown as Category;
}

// =================================
// GET CATEGORY BY SLUG
// =================================
export async function getCategoryBySlug(slug: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("categories")
    .select(
      `
      *,
      products(
        *,
        product_images(
          image_url,
          position
        )
      )
    `,
    )
    .eq("slug", slug)
    .single();

  if (error) throw error;

  return data as unknown as Category;
}

// =================================
// CREATE CATEGORY
// =================================
export async function createCategory(category: CreateCategoryInput) {
  const supabase = createClient();
  const slug =
    category.slug && category.slug.trim()
      ? category.slug.trim()
      : slugify(category.name);

  const { data, error } = await supabase
    .from("categories")
    .insert({ ...category, slug })
    .select()
    .single();

  if (error) throw error;

  return data;
}

// =================================
// UPDATE CATEGORY
// =================================
export async function updateCategory(id: string, updates: UpdateCategoryInput) {
  const supabase = createClient();
  const payload = { ...updates };
  if (payload.name && (!payload.slug || !payload.slug.trim())) {
    payload.slug = slugify(payload.name);
  }

  const { data, error } = await supabase
    .from("categories")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

// =================================
// DELETE CATEGORY
// =================================
export async function deleteCategory(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) throw error;

  return true;
}

// =================================
// CHANGE CATEGORY STATUS
// =================================
export async function updateCategoryStatus(id: string, is_active: boolean) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("categories")
    .update({
      is_active,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

// =================================
// UPDATE CATEGORY SORT ORDER
// =================================
export async function updateCategorySort(id: string, sort_order: number) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("categories")
    .update({
      sort_order,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

// =================================
// SEARCH CATEGORIES
// =================================
export async function searchCategories(search: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    .eq("is_active", true);

  if (error) throw error;

  return data;
}

// =================================
// CHECK CATEGORY SLUG
// =================================
export async function checkCategorySlug(slug: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;

  return !!data;
}

// =================================
// CHECK CATEGORY NAME
// =================================
export async function checkCategoryName(name: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id")
    .eq("name", name)
    .maybeSingle();

  if (error) throw error;

  return !!data;
}

// =================================
// GET CATEGORY PRODUCT COUNT
// =================================
export async function getCategoryProductCount(categoryId: string) {
  const supabase = createClient();
  const { count, error } = await supabase
    .from("products")
    .select("id", {
      count: "exact",
      head: true,
    })
    .eq("category_id", categoryId);

  if (error) throw error;

  return count ?? 0;
}



// upload 

export async function uploadCategoryImage(file: File) {
  const supabase = createClient();
  const ext = file.name.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from("category-images")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) throw error;

  const { data } = supabase.storage
    .from("category-images")
    .getPublicUrl(fileName);

  return data.publicUrl;
}