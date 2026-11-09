import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
  type CreateProductInput,
} from "@/services/product.service";

// ================================
// QUERY KEYS
// ================================

export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  detail: (id: string) => [...productKeys.all, "detail", id] as const,
  slug: (slug: string) => [...productKeys.all, "slug", slug] as const,
  category: (categoryId: string) => [...productKeys.all, "category", categoryId] as const,
  search: (query: string) => [...productKeys.all, "search", query] as const,
  filtered: (filters: object) => [...productKeys.all, "filtered", filters] as const,
  latest: (limit: number) => [...productKeys.all, "latest", limit] as const,
};

// ================================
// GET PRODUCTS
// ================================

export function useProducts() {
  return useQuery({
    queryKey: productKeys.lists(),
    queryFn: getProducts,
  });
}

// ================================
// CREATE PRODUCT
// ================================

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (product: CreateProductInput) => createProduct(product),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: productKeys.all,
      });
    },
  });
}

// ================================
// UPDATE PRODUCT
// ================================

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: CreateProductInput;
    }) => updateProduct(id, updates),

    onSuccess: (_, { id }) => {
      // Invalidate the broad list and the specific item detail
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(id) });
    },
  });
}

// ================================
// DELETE PRODUCT
// ================================

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: productKeys.all,
      });
    },
  });
}
