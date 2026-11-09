import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createOrderFromCart,
  getAllOrders,
  getOrderById,
  getOrderByNumber,
  getOrdersByStatus,
  getUserOrders,
  updateOrderStatus,
  cancelOrder,
  deleteOrder,
  type Order,
  type OrderStatus,
} from "@/services/order.service";
import type { OrderCustomerInfo, OrderItem } from "@/types/database.types";
import { createClient } from "@/lib/supabase/client";


// =======================================
// EMAIL HELPER
// =======================================

async function sendOrderEmail(
  order: Order,
  status: OrderStatus,
  isAdminNotification = false,
) {
  if (!order || !order.customer_info) return;
  if (!isAdminNotification && !order.customer_info.email) return;

  try {
    await fetch("/api/send-order-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: order.customer_info.email || "",
        customerName: order.customer_info.name || "Customer",
        orderId: order.order_number,
        items: order.items || [],
        status,
        isAdminNotification,
      }),
    });
  } catch (error) {
    console.error(error);
  }
}

// =======================================
// QUERY KEYS
// =======================================

export const orderKeys = {
  all: ["orders"] as const,

  lists: () => [...orderKeys.all, "list"] as const,

  user: (userId: string) => [...orderKeys.all, "user", userId] as const,

  detail: (orderId: string) => [...orderKeys.all, "detail", orderId] as const,

  byNumber: (orderNumber: string) =>
    [...orderKeys.all, "number", orderNumber] as const,

  status: (status: OrderStatus) =>
    [...orderKeys.all, "status", status] as const,
};

// =======================================
// USER ORDERS
// =======================================

export function useUserOrders(userId: string) {
  return useQuery({
    queryKey: orderKeys.user(userId),
    queryFn: () => getUserOrders(userId),
    enabled: !!userId,
  });
}

// =======================================
// SINGLE ORDER
// =======================================

export function useOrder(orderId: string) {
  return useQuery({
    queryKey: orderKeys.detail(orderId),
    queryFn: () => getOrderById(orderId),
    enabled: !!orderId,
  });
}

// =======================================
// ORDER BY ORDER NUMBER
// =======================================

export function useOrderByNumber(orderNumber: string) {
  return useQuery({
    queryKey: orderKeys.byNumber(orderNumber),
    queryFn: () => getOrderByNumber(orderNumber),
    enabled: !!orderNumber,
  });
}

// =======================================
// ALL ORDERS (ADMIN)
// =======================================

export function useOrders() {
  return useQuery({
    queryKey: orderKeys.all,
    queryFn: getAllOrders,
  });
}

// =======================================
// ORDERS BY STATUS
// =======================================

export function useOrdersByStatus(status: OrderStatus) {
  return useQuery({
    queryKey: orderKeys.status(status),
    queryFn: () => getOrdersByStatus(status),
    enabled: !!status,
  });
}

// =======================================
// CREATE ORDER
// =======================================

interface CreateOrderInput {
  userId: string;
  customer: OrderCustomerInfo;
  shippingAddress: string;
  shippingCost?: number;
  paymentMethod?: string;
  notes?: string;
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      customer,
      shippingAddress,
      shippingCost,
      paymentMethod,
      notes,
    }: CreateOrderInput) =>
      createOrderFromCart(
        userId,
        customer,
        shippingAddress,
        shippingCost,
        paymentMethod,
        notes,
      ),

    onSuccess: (order, { userId }) => {
      // Send emails
      sendOrderEmail(order, "pending", false);
      sendOrderEmail(order, "pending", true);

      queryClient.invalidateQueries({
        queryKey: orderKeys.user(userId),
      });

      queryClient.invalidateQueries({
        queryKey: orderKeys.all,
      });
    },
  });
}

// =======================================
// CREATE ORDER DIRECT (without cart)
// =======================================

interface CreateOrderDirectInput {
  customer: OrderCustomerInfo;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  shippingAddress: string;
  paymentMethod?: string;
  notes?: string;
}

async function createOrderDirect(input: CreateOrderDirectInput) {
  const supabase = createClient();

  // Generate order number
  const timestampPart = Date.now().toString(36).toUpperCase();
  const randomPart = Math.random().toString(36).slice(2, 6).toUpperCase();
  const orderNumber = `ORD-${timestampPart}-${randomPart}`;

  // Use a guest user ID for anonymous orders
  const guestUserId = null;

  // Parse shipping address to extract components
  const addressParts = input.shippingAddress
    .split(",")
    .map((part) => part.trim());
  const address = addressParts[0] || "";
  const city = addressParts[1] || "";
  const state = addressParts[2]?.replace(/[()]/g, "") || "";
  const postcode = addressParts[3]?.replace(/[()]/g, "") || "";

  const orderData = {
    user_id: guestUserId,
    order_number: orderNumber,
    status: "pending" as const,
    customer_info: {
      ...input.customer,
      address,
      city,
      state,
      postcode,
    },
    items: input.items,
    subtotal: input.subtotal,
    shipping: input.shipping,
    total: input.total,
    payment_method: input.paymentMethod || "Bank Transfer / WhatsApp Slip Verification",
    notes: input.notes ?? null,
  };

  const { error: orderError } = await supabase.from("orders").insert(orderData);

  if (orderError) throw orderError;

  return {
    ...orderData,
    id: "temp-id-" + Date.now(),
    created_at: new Date().toISOString(),
  } as Order;
}

export function useCreateOrderDirect() {
  return useMutation({
    mutationFn: createOrderDirect,
    onSuccess: (order) => {
      // Send emails
      sendOrderEmail(order, "pending", false);
      sendOrderEmail(order, "pending", true);
    },
  });
}

// =======================================
// UPDATE ORDER STATUS
// =======================================

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      status,
    }: {
      orderId: string;
      status: OrderStatus;
    }) => updateOrderStatus(orderId, status),

    onSuccess: (order, variables) => {
      // Send email
      sendOrderEmail(order, variables.status, false);

      queryClient.invalidateQueries({
        queryKey: orderKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: orderKeys.detail(variables.orderId),
      });

      // Invalidate all status-filtered order queries
      queryClient.invalidateQueries({
        queryKey: orderKeys.lists(),
      });
    },
  });
}

// =======================================
// CANCEL ORDER
// =======================================

export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId }: { orderId: string; userId?: string }) =>
      cancelOrder(orderId),

    onSuccess: (order, variables) => {
      // Send email
      sendOrderEmail(order, "cancelled", false);

      queryClient.invalidateQueries({
        queryKey: orderKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: orderKeys.detail(variables.orderId),
      });

      if (variables.userId) {
        queryClient.invalidateQueries({
          queryKey: orderKeys.user(variables.userId),
        });
      }
    },
  });
}

// =======================================
// DELETE ORDER
// =======================================

export function useDeleteOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId }: { orderId: string; userId?: string }) =>
      deleteOrder(orderId),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: orderKeys.all,
      });

      if (variables.userId) {
        queryClient.invalidateQueries({
          queryKey: orderKeys.user(variables.userId),
        });
      }

      queryClient.removeQueries({
        queryKey: orderKeys.detail(variables.orderId),
      });
    },
  });
}
