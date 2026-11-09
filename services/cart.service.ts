import { createClient } from "@/lib/supabase/client";

// ================================
// GET USER CART
// ================================

export async function getCart(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("carts")
    .select(
      `
        id,
        user_id,
        cart_items(
          id,
          quantity,
          product_id,
          products(
            id,
            name,
            slug,
            price,
            stock,
            product_images(
              image_url,
              position
            )
          )
        )
      `,
    )
    .eq("user_id", userId)
    .single();

  if (error) throw error;

  return data;
}

// ================================
// GET OR CREATE CART
// ================================

export async function getOrCreateCart(userId: string) {
  const supabase = createClient();
  const { data: cart } = await supabase
    .from("carts")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (cart) return cart;

  const { data, error } = await supabase
    .from("carts")
    .insert({
      user_id: userId,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}

// ================================
// ADD ITEM TO DATABASE CART
// ================================

export async function addCartItem(
  userId: string,
  productId: string,
  quantity: number,
) {
  const supabase = createClient();
  const cart = await getOrCreateCart(userId);

  const { data: existingItem } = await supabase
    .from("cart_items")
    .select("*")
    .eq("cart_id", cart.id)
    .eq("product_id", productId)
    .maybeSingle();

  if (existingItem) {
    const { data, error } = await supabase
      .from("cart_items")
      .update({
        quantity: existingItem.quantity + quantity,
      })
      .eq("id", existingItem.id)
      .select()
      .single();

    if (error) throw error;

    return data;
  }

  const { data, error } = await supabase
    .from("cart_items")
    .insert({
      cart_id: cart.id,

      product_id: productId,

      quantity,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}

// ================================
// REMOVE ITEM
// ================================

export async function removeCartItem(itemId: string) {
  const supabase = createClient();
  const { error } = await supabase.from("cart_items").delete().eq("id", itemId);

  if (error) throw error;

  return true;
}

// ================================
// CLEAR CART AFTER ORDER
// ================================

export async function clearCart(cartId: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("cart_id", cartId);

  if (error) throw error;

  return true;
}
