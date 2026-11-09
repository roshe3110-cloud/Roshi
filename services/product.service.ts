import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database.types";

export type Product = Database["public"]["Tables"]["products"]["Row"] & {
  categories?: Database["public"]["Tables"]["categories"]["Row"] | null;
  product_images?: Database["public"]["Tables"]["product_images"]["Row"][];
};

export interface CreateProductInput {
  category_id?: string | null;
  name: string;
  slug: string;
  description?: string;
  price: number;
  compare_at_price?: number | null;
  stock?: number;
  is_active?: boolean;
  is_featured?: boolean;
  is_upcoming?: boolean;
  featured_sort_order?: number;
}

export type UpdateProductInput = Partial<CreateProductInput>;

// ================================
// GET ALL ACTIVE PRODUCTS
// ================================
export async function getProducts() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      categories(
        id,
        name,
        slug
      ),
      product_images(
        id,
        image_url,
        position
      )
    `,
    )
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data as unknown as Product[];
}

// ================================
// GET ALL PRODUCTS (ADMIN â€” no active filter)
// ================================
export async function getAllProductsAdmin() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      categories(
        id,
        name,
        slug
      ),
      product_images(
        id,
        image_url,
        position
      )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data as unknown as Product[];
}

// ================================
// GET PRODUCT BY ID
// ================================
export async function getProductById(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      categories(
        id,
        name,
        slug
      ),
      product_images(
        id,
        image_url,
        position
      )
    `,
    )
    .eq("id", id)
    .single();

  if (error) throw error;

  return data as unknown as Product;
}

// ================================
// GET PRODUCT BY SLUG
// ================================
export async function getProductBySlug(slug: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      categories(
        id,
        name,
        slug
      ),
      product_images(
        id,
        image_url,
        position
      )
    `,
    )
    .eq("slug", slug)
    .single();

  if (error) throw error;

  return data as unknown as Product;
}

// ================================
// CREATE PRODUCT
// ================================
export async function createProduct(product: CreateProductInput) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .insert(product)
    .select()
    .single();

  if (error) throw error;

  return data;
}

// ================================
// UPDATE PRODUCT
// ================================
export async function updateProduct(id: string, updates: UpdateProductInput) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

// ================================
// DELETE PRODUCT
// ================================
export async function deleteProduct(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) throw error;

  return true;
}

// ================================
// PRODUCTS BY CATEGORY
// ================================
export async function getProductsByCategory(categoryId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      product_images(
        image_url,
        position
      )
    `,
    )
    .eq("category_id", categoryId)
    .eq("is_active", true)
    .order("created_at", {
      ascending: false,
    });

  if (error) throw error;

  return data as unknown as Product[];
}

// ================================
// SEARCH PRODUCTS
// ================================
export async function searchProducts(search: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      product_images(
        image_url,
        position
      )
    `,
    )
    .or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    .eq("is_active", true);

  if (error) throw error;

  return data as unknown as Product[];
}

// ================================
// FILTERED PRODUCTS
// ================================
export async function getFilteredProducts(filters: {
  category_id?: string;
  min_price?: number;
  max_price?: number;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const supabase = createClient();
  const {
    category_id,
    min_price,
    max_price,
    search,
    page = 1,
    limit = 12,
  } = filters;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("products")
    .select(
      `
      *,
      categories(
        id,
        name,
        slug
      ),
      product_images(
        id,
        image_url,
        position
      )
    `,
      { count: "exact" },
    )
    .eq("is_active", true);

  if (category_id) {
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        category_id,
      );
    if (isUuid) {
      query = query.eq("category_id", category_id);
    } else {
      // Look up category by slug or name for SEO-friendly URLs
      const { data: cat } = await supabase
        .from("categories")
        .select("id")
        .or(`slug.eq.${category_id},name.ilike.%${category_id.replace(/-/g, " ")}%`)
        .maybeSingle();

      if (cat?.id) {
        query = query.eq("category_id", cat.id);
      } else {
        query = query.eq("category_id", category_id);
      }
    }
  }

  if (min_price !== undefined) {
    query = query.gte("price", min_price);
  }

  if (max_price !== undefined) {
    query = query.lte("price", max_price);
  }

  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
  }

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;

  return {
    products: data as unknown as Product[],
    total: count,
    page,
    limit,
  };
}

// ================================
// PAGINATION
// ================================
export async function getProductsPaginated(page: number, limit: number) {
  const supabase = createClient();
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabase
    .from("products")
    .select(
      `
      *,
      product_images(
        image_url,
        position
      )
      `,
      {
        count: "exact",
      },
    )
    .eq("is_active", true)
    .range(from, to);

  if (error) throw error;

  return {
    products: data as unknown as Product[],
    total: count,
    page,
    limit,
  };
}

// ================================
// UPDATE STOCK
// ================================
export async function updateProductStock(id: string, stock: number) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .update({
      stock,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

// ================================
// CHANGE ACTIVE STATUS
// ================================
export async function updateProductStatus(id: string, is_active: boolean) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .update({
      is_active,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

// ================================
// LATEST PRODUCTS
// ================================
export async function getLatestProducts(limit = 8) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      product_images(
      id,
        image_url,
        position
      )
    `,
    )
    .eq("is_active", true)
    .order("created_at", {
      ascending: false,
    })
    .limit(limit);

  if (error) throw error;

  return (data ?? []) as Product[];
}

// ================================
// RELATED PRODUCTS
// ================================
export async function getRelatedProducts(
  categoryId: string,
  productId: string,
) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      product_images(
        image_url,
        position
      )
    `,
    )
    .eq("category_id", categoryId)
    .neq("id", productId)
    .eq("is_active", true)
    .limit(4);

  if (error) throw error;

  return data as unknown as Product[];
}

// ================================
// LOW STOCK PRODUCTS
// ================================
export async function getLowStockProducts(limit = 5) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .lte("stock", limit)
    .order("stock", {
      ascending: true,
    });

  if (error) throw error;

  return data as unknown as Product[];
}

// ================================
// CHECK SLUG EXISTS
// ================================
export async function checkProductSlug(slug: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;

  return !!data;
}

// ================================
// PRODUCT IMAGES
// ================================
export async function addProductImage(
  product_id: string,
  image_url: string,
  position: number,
) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("product_images")
    .insert({
      product_id,
      image_url,
      position,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function getProductImages(productId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("product_images")
    .select("*")
    .eq("product_id", productId)
    .order("position");

  if (error) throw error;

  return data;
}

export async function deleteProductImage(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("product_images").delete().eq("id", id);

  if (error) throw error;

  return true;
}

export async function deleteProductImagesByProductId(productId: string) {
  const supabase = createClient();
  const { error } = await supabase.from("product_images").delete().eq("product_id", productId);

  if (error) throw error;

  return true;
}


// ================================
// FEATURED PRODUCTS
// ================================
export async function getFeaturedProducts(limit = 6) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      categories(
        id,
        name,
        slug
      ),
      product_images(
        id,
        image_url,
        position
      )
    `)
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("featured_sort_order", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as Product[];
}

// ================================
// UPCOMING / COMING SOON PRODUCTS
// ================================
export async function getUpcomingProducts(limit = 6) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      categories(
        id,
        name,
        slug
      ),
      product_images(
        id,
        image_url,
        position
      )
    `)
    .eq("is_active", true)
    .eq("is_upcoming", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as Product[];
}