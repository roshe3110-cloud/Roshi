"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  updateCategoryStatus,
} from "@/services/category.service";
import { deleteImage } from "@/components/common/image-upload/upload";
import { Pencil, Trash2, Tag, Check, X } from "lucide-react";
import type { CreateCategoryInput } from "@/services/category.service";

import { DynamicForm, FormValues } from "@/components/common/form/DynamicForm";
import { categoryFields } from "@/components/common/form/categoryFields";

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
type Category = Awaited<ReturnType<typeof getAllCategories>>[number];

// ─── Category Form Modal ──────────────────────────────────────
function CategoryFormModal({
  category,
  onClose,
}: {
  category?: Category | null;
  onClose: () => void;
}) {
  const qc = useQueryClient();
  const isEdit = !!category;

  interface CategoryFormData {
    [key: string]: string | number | boolean | null | undefined;
    name: string;
    slug: string;
    description: string;
    image_url: string;
    sort_order: number;
    is_active: boolean;
  }

  const [formData, setFormData] = useState<CategoryFormData>({
    name: category?.name ?? "",
    slug: category?.slug ?? "",
    description: category?.description ?? "",
    image_url: category?.image_url ?? "",
    sort_order: category?.sort_order ?? 0,
    is_active: category?.is_active ?? true,
  });

  const [error, setError] = useState<string | null>(null);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!formData.name.trim()) {
        throw new Error("Category name is required.");
      }
      if (!formData.slug.trim()) {
        throw new Error("Category slug is required.");
      }

      const payload: CreateCategoryInput = {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        description: formData.description?.trim() || undefined,
        image_url: formData.image_url?.trim() || undefined,
        sort_order: Number(formData.sort_order),
        is_active: formData.is_active,
      };

      if (isEdit) {
        if (category!.image_url && category!.image_url !== formData.image_url) {
          await deleteImage(category!.image_url, "category-images");
        }
        return updateCategory(category!.id, payload);
      } else {
        return createCategory(payload);
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "categories"] });
      onClose();
    },
    onError: (e: unknown) =>
      setError(e instanceof Error ? e.message : "Save failed"),
  });

  const handleFormChange = (newValues: FormValues) => {
    const name = (newValues.name as string) ?? "";
    const updated: CategoryFormData = {
      name,
      slug:
        !isEdit && name !== formData.name
          ? slugify(name)
          : ((newValues.slug as string) ?? ""),
      description: (newValues.description as string) ?? "",
      image_url: (newValues.image_url as string) ?? "",
      sort_order: Number(newValues.sort_order ?? 0),
      is_active: Boolean(newValues.is_active ?? true),
    };
    setFormData(updated);
  };

  return (
    <AdminModal
      title={isEdit ? "Edit Category" : "New Category"}
      onClose={onClose}
      maxWidth="max-w-lg"
    >
      {/* Quick Slug Suggestions */}
      <div className="mb-4 p-3 rounded-xl bg-neutral-900/60 border border-white/5">
        <p className="text-[11px] text-[#888] uppercase tracking-wider mb-2 font-medium">
          Suggested Simple Slugs:
        </p>
        <div className="flex flex-wrap gap-1.5">
          {[
            { name: "Skincare & Serums", slug: "skincare-serums" },
            { name: "Luxury Cosmetics", slug: "luxury-cosmetics" },
            { name: "Lip & Eye Care", slug: "lip-eye-care" },
            { name: "Fragrance & Glow", slug: "fragrance-glow" },
          ].map((s) => (
            <button
              key={s.slug}
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  name: prev.name || s.name,
                  slug: s.slug,
                }))
              }
              className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-[#d4af37]/20 hover:border-[#d4af37]/40 border border-white/10 text-xs text-neutral-300 font-mono transition cursor-pointer"
            >
              {s.slug}
            </button>
          ))}
        </div>
      </div>

      <DynamicForm
        fields={categoryFields}
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
            saveMutation.isPending || !formData.name || !formData.slug
          }
          className="flex-1 py-2.5 rounded-xl text-sm font-medium text-black disabled:opacity-50"
          style={{
            background: "linear-gradient(135deg,#d4af37,#b8941f)",
            boxShadow: "0 4px 16px rgba(212,175,55,0.3)",
          }}
        >
          {saveMutation.isPending
            ? "Saving…"
            : isEdit
              ? "Save Changes"
              : "Create Category"}
        </button>
      </div>
    </AdminModal>
  );
}

// ─── Main page ────────────────────────────────────────────────
export default function AdminCategoriesPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editCat, setEditCat] = useState<Category | null>(null);
  const [deleteCat, setDeleteCat] = useState<Category | null>(null);

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: getAllCategories,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const target = categories.find((c) => c.id === id);
      if (target?.image_url) {
        await deleteImage(target.image_url, "category-images");
      }
      return deleteCategory(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "categories"] });
      setDeleteCat(null);
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      updateCategoryStatus(id, active),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["admin", "categories"] }),
  });

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const TABLE_HEADERS = ["Category", "Slug", "Products", "Sort", "Status", "Actions"];

  return (
    <div className="space-y-6">
      {/* Modals */}
      {(showForm || editCat) && (
        <CategoryFormModal
          category={editCat}
          onClose={() => {
            setShowForm(false);
            setEditCat(null);
          }}
        />
      )}
      {deleteCat && (
        <DeleteConfirmModal
          entityName={deleteCat.name}
          entityLabel="category"
          loading={deleteMutation.isPending}
          onConfirm={() => deleteMutation.mutate(deleteCat.id)}
          onCancel={() => setDeleteCat(null)}
        />
      )}

      <div className="space-y-6">
        <AdminPageHeader
          title="Categories"
          subtitle={`${categories.length} total`}
          addLabel="Add Category"
          addButtonId="add-category-btn"
          onAdd={() => setShowForm(true)}
        />

        <AdminSearchBar
          value={search}
          onChange={(v) => {
            setSearch(v);
            setCurrentPage(1);
          }}
          placeholder="Search categories…"
        />

        <AdminTable
          headers={TABLE_HEADERS}
          isLoading={isLoading}
          isEmpty={paginated.length === 0}
          emptyIcon={<Tag size={32} />}
          emptyText="No categories found"
        >
          {paginated.map((cat, i) => {
            const c = statusColors[cat.is_active ? "active" : "inactive"];
            const productCount =
              (cat as unknown as { products?: unknown[] })?.products?.length ??
              0;
            return (
              <tr
                key={cat.id}
                style={{
                  borderTop:
                    i > 0 ? "1px solid rgba(255,255,255,0.04)" : "none",
                }}
                className="hover:bg-white/[0.02] transition-colors"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    {cat.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={cat.image_url}
                        alt={cat.name}
                        className="w-9 h-9 rounded-lg object-cover shrink-0"
                        style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                      />
                    ) : (
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: "rgba(212,175,55,0.1)" }}
                      >
                        <Tag size={14} className="text-[#d4af37]" />
                      </div>
                    )}
                    <div>
                      <p className="text-white font-medium">{cat.name}</p>
                      {cat.description && (
                        <p className="text-[#555] text-xs truncate max-w-[180px]">
                          {cat.description}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-[#666] font-mono text-xs">
                  {cat.slug}
                </td>
                <td className="px-5 py-4 text-[#888]">{productCount}</td>
                <td className="px-5 py-4 text-[#888]">{cat.sort_order}</td>
                <td className="px-5 py-4">
                  <button
                    onClick={() =>
                      toggleMutation.mutate({ id: cat.id, active: !cat.is_active })
                    }
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-opacity hover:opacity-75"
                    style={{ background: c.bg, color: c.text }}
                  >
                    {cat.is_active ? <Check size={10} /> : <X size={10} />}
                    {cat.is_active ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      id={`edit-cat-${cat.id}`}
                      onClick={() => setEditCat(cat)}
                      className="p-2 rounded-lg text-[#555] hover:text-[#d4af37] hover:bg-[rgba(212,175,55,0.1)] transition-all"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      id={`delete-cat-${cat.id}`}
                      onClick={() => setDeleteCat(cat)}
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
