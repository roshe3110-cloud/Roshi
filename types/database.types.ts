export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Order-related types (matching the service interfaces)
export interface OrderCustomerInfo {
  name: string;
  email?: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  postcode?: string;
  [key: string]: unknown;
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  unit_price: number;
  quantity: number;
}

export interface Database {
  public: {
    Tables: {
      // ==========================
      // CATEGORIES
      // ==========================
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          image_url: string | null;
          is_active: boolean;
          sort_order: number;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };

        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          image_url?: string | null;
          is_active?: boolean;
          sort_order?: number;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };

        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          image_url?: string | null;
          is_active?: boolean;
          sort_order?: number;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };

        Relationships: [];
      };

      // ==========================
      // PRODUCTS
      // ==========================
      products: {
        Row: {
          id: string;
          category_id: string | null;
          name: string;
          slug: string;
          description: string | null;
          price: number;
          compare_at_price: number | null;
          stock: number;
          is_active: boolean;
          is_featured: boolean;
          is_upcoming: boolean;
          featured_sort_order: number;
          created_by: string | null;
          created_at: string;
          updated_at: string;
          search_vector: unknown | null;
        };

        Insert: {
          id?: string;
          category_id?: string | null;
          name: string;
          slug: string;
          description?: string | null;
          price: number;
          compare_at_price?: number | null;
          stock?: number;
          is_active?: boolean;
          is_featured?: boolean;
          is_upcoming?: boolean;
          featured_sort_order?: number;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
          search_vector?: unknown | null;
        };

        Update: {
          id?: string;
          category_id?: string | null;
          name?: string;
          slug?: string;
          description?: string | null;
          price?: number;
          compare_at_price?: number | null;
          stock?: number;
          is_active?: boolean;
          is_featured?: boolean;
          is_upcoming?: boolean;
          featured_sort_order?: number;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
          search_vector?: unknown | null;
        };

        Relationships: [];
      };

      // ==========================
      // PRODUCT IMAGES
      // ==========================
      product_images: {
        Row: {
          id: string;
          product_id: string;
          image_url: string;
          position: number;
          created_at: string;
        };

        Insert: {
          id?: string;
          product_id: string;
          image_url: string;
          position: number;
          created_at?: string;
        };

        Update: {
          id?: string;
          product_id?: string;
          image_url?: string;
          position?: number;
          created_at?: string;
        };

        Relationships: [];
      };

      // ==========================
      // CARTS
      // ==========================
      carts: {
        Row: {
          id: string;
          user_id: string;
          created_at: string;
        };

        Insert: {
          id?: string;
          user_id: string;
          created_at?: string;
        };

        Update: {
          id?: string;
          user_id?: string;
          created_at?: string;
        };

        Relationships: [];
      };

      // ==========================
      // CART ITEMS
      // ==========================
      cart_items: {
        Row: {
          id: string;
          cart_id: string;
          product_id: string;
          quantity: number;
          created_at: string;
        };

        Insert: {
          id?: string;
          cart_id: string;
          product_id: string;
          quantity: number;
          created_at?: string;
        };

        Update: {
          id?: string;
          cart_id?: string;
          product_id?: string;
          quantity?: number;
          created_at?: string;
        };

        Relationships: [];
      };

      // ==========================
      // ORDERS
      // ==========================
      orders: {
        Row: {
          id: string;
          user_id: string | null;
          order_number: string;
          status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
          customer_info: OrderCustomerInfo;
          items: OrderItem[];
          subtotal: number;
          shipping: number;
          total: number;
          payment_method: string;
          notes: string | null;
          created_at: string;
        };

        Insert: {
          id?: string;
          user_id?: string | null;
          order_number: string;
          status?: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
          customer_info: OrderCustomerInfo;
          items: OrderItem[];
          subtotal: number;
          shipping: number;
          total?: number;
          payment_method: string;
          notes?: string | null;
          created_at?: string;
        };

        Update: {
          id?: string;
          user_id?: string | null;
          order_number?: string;
          status?: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
          customer_info?: OrderCustomerInfo;
          items?: OrderItem[];
          subtotal?: number;
          shipping?: number;
          total?: number;
          payment_method?: string;
          notes?: string | null;
          created_at?: string;
        };

        Relationships: [];
      };

      // ==========================
      // ORDER ITEMS
      // ==========================
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          product_name: string;
          unit_price: number;
          quantity: number;
        };

        Insert: {
          id?: string;
          order_id: string;
          product_id?: string | null;
          product_name: string;
          unit_price: number;
          quantity: number;
        };

        Update: {
          id?: string;
          order_id?: string;
          product_id?: string | null;
          product_name?: string;
          unit_price?: number;
          quantity?: number;
        };

        Relationships: [];
      };

      // ==========================
      // BANNERS
      // ==========================
      banners: {
        Row: {
          id: string;
          title: string;
          subtitle: string | null;
          image_url: string;
          link_href: string | null;
          link_label: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
        };

        Insert: {
          id?: string;
          title: string;
          subtitle?: string | null;
          image_url: string;
          link_href?: string | null;
          link_label?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
        };

        Update: {
          id?: string;
          title?: string;
          subtitle?: string | null;
          image_url?: string;
          link_href?: string | null;
          link_label?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
        };

        Relationships: [];
      };
      // ==========================
      // WEBSITE VISITS
      // ==========================
      website_visits: {
        Row: {
          id: string;
          session_id: string;
          page_path: string;
          device_type: string;
          created_at: string;
        };

        Insert: {
          id?: string;
          session_id: string;
          page_path: string;
          device_type: string;
          created_at?: string;
        };

        Update: {
          id?: string;
          session_id?: string;
          page_path?: string;
          device_type?: string;
          created_at?: string;
        };

        Relationships: [];
      };

      // ==========================
      // LOGIN ATTEMPTS
      // ==========================
      login_attempts: {
        Row: {
          id: string;
          email: string;
          ip_address: string | null;
          attempt_count: number;
          is_locked: boolean;
          locked_until: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          ip_address?: string | null;
          attempt_count?: number;
          is_locked?: boolean;
          locked_until?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          ip_address?: string | null;
          attempt_count?: number;
          is_locked?: boolean;
          locked_until?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      // ==========================
      // POPUP ADS
      // ==========================
      popup_ads: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          image_url: string | null;
          popup_type: "promotional" | "announcement" | "newsletter" | "discount" | "new_arrival";
          link_href: string | null;
          link_label: string | null;
          discount_code: string | null;
          is_active: boolean;
          start_date: string | null;
          end_date: string | null;
          show_delay_ms: number;
          show_once_per_session: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          image_url?: string | null;
          popup_type?: "promotional" | "announcement" | "newsletter" | "discount" | "new_arrival";
          link_href?: string | null;
          link_label?: string | null;
          discount_code?: string | null;
          is_active?: boolean;
          start_date?: string | null;
          end_date?: string | null;
          show_delay_ms?: number;
          show_once_per_session?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          image_url?: string | null;
          popup_type?: "promotional" | "announcement" | "newsletter" | "discount" | "new_arrival";
          link_href?: string | null;
          link_label?: string | null;
          discount_code?: string | null;
          is_active?: boolean;
          start_date?: string | null;
          end_date?: string | null;
          show_delay_ms?: number;
          show_once_per_session?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      // ==========================
      // PRODUCT TAGS
      // ==========================
      product_tags: {
        Row: {
          id: string;
          product_id: string;
          tag: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          tag: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          tag?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };

    // ==========================
    // VIEWS
    // ==========================
    Views: {
      [key: string]: never;
    };

    // ==========================
    // FUNCTIONS
    // ==========================
    Functions: {
      [key: string]: never;
    };

    // ==========================
    // ENUMS
    // ==========================
    Enums: {
      [key: string]: never;
    };

    // ==========================
    // COMPOSITE TYPES
    // ==========================
    CompositeTypes: {
      [key: string]: never;
    };
  };
}
