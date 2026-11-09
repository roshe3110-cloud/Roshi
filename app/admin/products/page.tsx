"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllProductsAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStatus,
  addProductImage,
  deleteProductImagesByProductId,
} from "@/services/product.service";
import { getAllCategories } from "@/services/category.service";
import { deleteImage } from "@/components/common/image-upload/upload";
import { Pencil, Trash2, Package, Check, X, Sparkles, Clock } from "lucide-react";
import type { CreateProductInput } from "@/services/product.service";

import { DynamicForm, FormValues } from "@/components/common/form/DynamicForm";
import { productFields } from "@/components/common/form/categoryFields";

import {
  AdminModal,
  DeleteConfirmModal,
  AdminPageHeader,
  AdminSearchBar,
  AdminTable,
  AdminPagination,
  slugify,
  statusColors,
} from "@/components/common/admin";

// ─── Types ────────────────────────────────────────────────────
type Product = Awaited<ReturnType<typeof getAllProductsAdmin>>[number];

// ─── Product Form Modal ────────────────────────────────────────
function ProductFormModal({
  product,
  categories,
  onClose,
}: {
  product?: Product | null;
  categories: Array<{ id: string; name: string }>;
  onClose: () => void;
}) {
  const qc = useQueryClient();
  const isEdit = !!product;

  const initialImages =
    product?.product_images?.map((img) => img.image_url) ?? [];

  interface ProductFormData {
    [key: string]: string | number | boolean | null | undefined | string[];
    name: string;
    slug: string;
    category_id: string;
    description: string;
    price: number | string;
    compare_at_price?: number | string | null;
    stock: number;
    is_featured: boolean;
    is_upcoming: boolean;
    featured_sort_order: number;
  }

  const [formData, setFormData] = useState<ProductFormData>({
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    category_id: product?.category_id ?? "",
    description: product?.description ?? "",
    price: product?.price ?? "",
    compare_at_price: product?.compare_at_price ?? "",
    stock: product?.stock ?? 0,
    is_featured: product?.is_featured ?? false,
    is_upcoming: product?.is_upcoming ?? false,
    featured_sort_order: product?.featured_sort_order ?? 0,
    image: initialImages,
  });

  const [images, setImages] = useState<string[]>(initialImages);
  const [error, setError] = useState<string | null>(null);

  // Inject dynamic category options into the select field
  const fieldsWithCategories = productFields.map((field) => {
    if (field.name === "category_id") {
      return {
        ...field,
        options: categories.map((c) => ({ label: c.name, value: c.id })),
      };
    }
    return field;
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!formData.name?.trim()) {
        throw new Error("Product name is required.");
      }
      if (!formData.category_id) {
        throw new Error("Please select a category for this product.");
      }
      if (formData.price === "" || Number(formData.price) <= 0) {
        throw new Error("Please enter a valid price greater than 0 PKR.");
      }
      if (Number(formData.stock) < 0) {
        throw new Error("Stock quantity cannot be negative.");
      }
      if (!images.length) {
        throw new Error("Please upload at least 1 product image.");
      }
      if (images.length > 4) {
        throw new Error("Maximum 4 images allowed per product. Please delete excess images.");
      }

      const payload: CreateProductInput = {
        category_id: formData.category_id,
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        description: formData.description || undefined,
        compare_at_price: formData.compare_at_price
          ? Number(formData.compare_at_price)
          : null,
        price: Number(formData.price),
        stock: Number(formData.stock),
        is_active: product?.is_active ?? true,
        is_featured: Boolean(formData.is_featured),
        is_upcoming: Boolean(formData.is_upcoming),
        featured_sort_order: Number(formData.featured_sort_order || 0),
      };

      if (isEdit) {
        const updated = await updateProduct(product!.id, payload);

        // Remove deleted images from storage bucket
        const oldImages =
          product!.product_images?.map((img) => img.image_url) ?? [];
        const deletedImages = oldImages.filter((url) => !images.includes(url));
        for (const url of deletedImages) {
          await deleteImage(url, "product-images");
        }

        // Re-sync images in DB
        await deleteProductImagesByProductId(product!.id);
        for (let i = 0; i < images.length; i++) {
          await addProductImage(product!.id, images[i], i + 1);
        }
        return updated;
      } else {
        const created = await createProduct(payload);
        for (let i = 0; i < images.length; i++) {
          await addProductImage(created.id, images[i], i + 1);
        }
        return created;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "products"] });
      onClose();
    },
    onError: (e: unknown) =>
      setError(e instanceof Error ? e.message : "Save failed"),
  });

  const handleFormChange = (newValues: FormValues) => {
    const name = (newValues.name as string) ?? "";
    const updated: ProductFormData = {
      name,
      slug:
        !isEdit && name !== formData.name
          ? slugify(name)
          : ((newValues.slug as string) ?? ""),
      category_id: (newValues.category_id as string) ?? "",
      description: (newValues.description as string) ?? "",
      price: newValues.price as number | string,
      compare_at_price: newValues.compare_at_price as number | string,
      stock: Number(newValues.stock ?? 0),
      is_featured: Boolean(newValues.is_featured),
      is_upcoming: Boolean(newValues.is_upcoming),
      featured_sort_order: Number(newValues.featured_sort_order ?? 0),
      image: newValues.image as string[],
    };
    setFormData(updated);

    const imgUrl = newValues.image as string | string[] | undefined;
    if (imgUrl !== undefined) {
      if (Array.isArray(imgUrl)) {
        setImages(imgUrl);
      } else {
        setImages(imgUrl ? [imgUrl] : []);
      }
    }
  };

  return (
    <AdminModal
      title={isEdit ? "Edit Product" : "New Product"}
      onClose={onClose}
    >
      <DynamicForm
        fields={fieldsWithCategories}
        values={formData}
        onChange={handleFormChange}
      />

      {error && (
        <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          onClick={onClose}
          className="flex-1 py-2.5 rounded-xl text-sm text-[#666] border border-[rgba(255,255,255,0.08)] hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => saveMutation.mutate()}
          disabled={
            saveMutation.isPending ||
            !formData.name ||
            !formData.slug ||
            !formData.price ||
            !formData.category_id
          }
          className="flex-1 py-2.5 rounded-xl text-sm font-medium text-black transition-all disabled:opacity-50"
          style={{
            background: "linear-gradient(135deg,#d4af37,#b8941f)",
            boxShadow: "0 4px 16px rgba(212,175,55,0.3)",
          }}
        >
          {saveMutation.isPending
            ? "Saving…"
            : isEdit
              ? "Update Product"
              : "Create Product"}
        </button>
      </div>
    </AdminModal>
  );
}

// ─── Table Headers ────────────────────────────────────────────
const TABLE_HEADERS = ["Product", "Category", "Price", "Stock", "Badges", "Status", "Actions"];
const PAGE_SIZE = 8;

export default function AdminProductsPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["admin", "products"],
    queryFn: getAllProductsAdmin,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: getAllCategories,
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      updateProductStatus(id, active),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "products"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const prod = products.find((p) => p.id === id);
      if (prod?.product_images) {
        for (const img of prod.product_images) {
          await deleteImage(img.image_url, "product-images");
        }
      }
      return deleteProduct(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "products"] });
      setDeleteTarget(null);
    },
  });

  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.slug.toLowerCase().includes(q) ||
      (p as unknown as { categories?: { name: string } })?.categories?.name
        ?.toLowerCase()
        ?.includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <div>
      {(showForm || editProduct) && (
        <ProductFormModal
          product={editProduct}
          categories={categories}
          onClose={() => {
            setShowForm(false);
            setEditProduct(null);
          }}
        />
      )}
      {deleteTarget && (
        <DeleteConfirmModal
          entityName={deleteTarget.name}
          entityLabel="product"
          loading={deleteMutation.isPending}
          onConfirm={() => deleteMutation.mutate(deleteTarget.id)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <div className="space-y-6">
        <AdminPageHeader
          title="Products"
          subtitle={`${products.length} total products`}
          addLabel="Add Product"
          addButtonId="add-product-btn"
          onAdd={() => setShowForm(true)}
        />

        <AdminSearchBar
          value={search}
          onChange={(v) => {
            setSearch(v);
            setCurrentPage(1);
          }}
          placeholder="Search products…"
        />

        <AdminTable
          headers={TABLE_HEADERS}
          isLoading={isLoading}
          isEmpty={paginated.length === 0}
          emptyIcon={<Package size={32} />}
          emptyText="No products found"
        >
          {paginated.map((p, i) => {
            const c = statusColors[p.is_active ? "active" : "inactive"];
            const catName =
              (p as unknown as { categories?: { name: string } })?.categories
                ?.name ?? "—";
            return (
              <tr
                key={p.id}
                style={{
                  borderTop:
                    i > 0 ? "1px solid rgba(255,255,255,0.04)" : "none",
                }}
                className="hover:bg-white/[0.02] transition-colors"
              >
                <td className="px-5 py-4">
                  <p className="text-white font-medium leading-snug">
                    {p.name}
                  </p>
                  <p className="text-[#555] text-xs font-mono mt-0.5">
                    {p.slug}
                  </p>
                </td>
                <td className="px-5 py-4 text-[#888]">{catName}</td>
                <td className="px-5 py-4">
                  <p className="text-[#d4af37] font-medium">
                    PKR {Number(p.price).toLocaleString()}
                  </p>
                  {p.compare_at_price && (
                    <p className="text-[#555] text-xs line-through">
                      PKR {Number(p.compare_at_price).toLocaleString()}
                    </p>
                  )}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`font-medium ${
                      p.stock <= 3
                        ? "text-red-400"
                        : p.stock <= 10
                          ? "text-yellow-400"
                          : "text-white"
                    }`}
                  >
                    {p.stock}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-1">
                    {p.is_featured && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30">
                        <Sparkles className="w-2.5 h-2.5" />
                        Featured
                      </span>
                    )}
                    {p.is_upcoming && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                        <Clock className="w-2.5 h-2.5" />
                        Upcoming
                      </span>
                    )}
                    {!p.is_featured && !p.is_upcoming && (
                      <span className="text-[#444] text-xs">—</span>
                    )}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <button
                    onClick={() =>
                      toggleMutation.mutate({ id: p.id, active: !p.is_active })
                    }
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-opacity hover:opacity-75"
                    style={{ background: c.bg, color: c.text }}
                  >
                    {p.is_active ? <Check size={10} /> : <X size={10} />}
                    {p.is_active ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      id={`edit-product-${p.id}`}
                      onClick={() => setEditProduct(p)}
                      className="p-2 rounded-lg text-[#555] hover:text-[#d4af37] hover:bg-[rgba(212,175,55,0.1)] transition-all"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      id={`delete-product-${p.id}`}
                      onClick={() => setDeleteTarget(p)}
                      className="p-2 rounded-lg text-[#555] hover:text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </AdminTable>

        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
