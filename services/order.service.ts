import { createClient } from "@/lib/supabase/client";
import type { Database, OrderCustomerInfo, OrderItem } from "@/types/database.types";

// ================================
// TYPES
// ================================

export type OrderStatus =
  | "pending"
  | "paid"
  | "shipped"
  | "delivered"
  | "cancelled";

type OrderInsert = Database["public"]["Tables"]["orders"]["Insert"];
export type Order = Database["public"]["Tables"]["orders"]["Row"];

type Product = Database["public"]["Tables"]["products"]["Row"];
type CartProduct = Product;

interface CartItem {
  quantity: number;
  product_id: string;
  products: CartProduct;
}

interface UserCart {
  id: string;
  cart_items: CartItem[];
}

// =================================
// HELPERS
// =================================

/**
 * Generates a unique, human-readable order number.
 * Format: ORD-<timestamp base36>-<random 4 chars>
 * e.g. ORD-M3K2P1-A9F2
 */
function generateOrderNumber(): string {
  const timestampPart = Date.now().toString(36).toUpperCase();
  const randomPart = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `ORD-${timestampPart}-${randomPart}`;
}

// =================================
// CREATE ORDER FROM CART
// =================================

export async function createOrderFromCart(
  userId: string,
  customer: OrderCustomerInfo,
  shippingAddress: string,
  shippingCost = 0,
  paymentMethod = "Bank Transfer / WhatsApp Slip Verification",
  notes?: string,
) {
  const supabase = createClient();
  const { data, error: cartError } = await supabase
    .from("carts")
    .select(
      `
        id,
        cart_items(
          quantity,
          product_id,
          products!cart_items_product_id_fkey(
            id,
            name,
            price,
            stock
          )
        )
      `,
    )
    .eq("user_id", userId)
    .single();

  if (cartError) throw cartError;

  const cart = data as UserCart;

  if (!cart.cart_items.length) {
    throw new Error("Cart is empty");
  }

  // Check stock
  for (const item of cart.cart_items) {
    const product = item.products;

    if (item.quantity > product.stock) {
      throw new Error(`${product.name} is out of stock`);
    }
  }

  // Build items jsonb array
  const items: OrderItem[] = cart.cart_items.map((item) => ({
    product_id: item.product_id,
    product_name: item.products.name,
    unit_price: item.products.price,
    quantity: item.quantity,
  }));

  // Calculate totals
  const subtotal = cart.cart_items.reduce(
    (sum, item) => sum + item.quantity * item.products.price,
    0,
  );
  const total = subtotal + shippingCost;

  // Create order
  const orderData: OrderInsert = {
    user_id: userId,
    order_number: generateOrderNumber(),
    status: "pending",
    customer_info: customer,
    items,
    subtotal,
    shipping: shippingCost,
    total,
    payment_method: paymentMethod,
    notes: notes ?? null,
  };

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert(orderData)
    .select()
    .single();

  if (orderError) throw orderError;

  // Update product stock
  for (const item of cart.cart_items) {
    const { error: stockError } = await supabase
      .from("products")
      .update({
        stock: item.products.stock - item.quantity,
      })
      .eq("id", item.product_id);

    if (stockError) throw stockError;
  }

  // Empty cart
  const { error: clearError } = await supabase
    .from("cart_items")
    .delete()
    .eq("cart_id", cart.id);

  if (clearError) throw clearError;

  return order;
}

// =================================
// GET USER ORDERS
// =================================

export async function getUserOrders(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data as Order[];
}

// =================================
// GET SINGLE ORDER
// =================================

export async function getOrderById(orderId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (error) throw error;

  return data as Order;
}

// =================================
// GET ORDER BY ORDER NUMBER
// =================================

export async function getOrderByNumber(orderNumber: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("order_number", orderNumber)
    .single();

  if (error) throw error;

  return data as Order;
}

// =================================
// ADMIN ALL ORDERS
// =================================

export async function getAllOrders() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data as Order[];
}

// =================================
// UPDATE STATUS
// =================================

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId)
    .select()
    .single();

  if (error) throw error;

  return data;
}

// =================================
// CANCEL ORDER
// =================================

export async function cancelOrder(orderId: string) {
  return updateOrderStatus(orderId, "cancelled");
}

// =================================
// DELETE ORDER
// =================================

export async function deleteOrder(orderId: string) {
  const supabase = createClient();
  const { error } = await supabase.from("orders").delete().eq("id", orderId);

  if (error) throw error;

  return true;
}

// =================================
// ORDERS BY STATUS
// =================================

export async function getOrdersByStatus(status: OrderStatus) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("status", status)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data as Order[];
}

// =================================
// ORDER COUNT
// =================================

export async function getOrderCount() {
  const supabase = createClient();
  const { count, error } = await supabase.from("orders").select("id", {
    count: "exact",
    head: true,
  });

  if (error) throw error;

  return count ?? 0;
}

// =================================
// TOTAL SALES
// =================================

export async function getTotalSales() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("total")
    .neq("status", "cancelled");

  if (error) throw error;

  return data.reduce((sum, order) => sum + Number(order.total), 0);
}
