"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllBannersAdmin,
  createBanner,
  updateBanner,
  deleteBanner,
  updateBannerStatus,
  type Banner,
  type CreateBannerInput,
} from "@/services/banner.service";
import ImageUpload from "@/components/common/image-upload/ImageUpload";
import { deleteImage } from "@/components/common/image-upload/upload";
import { Pencil, Trash2, Image as ImageIcon, Check, X, AlertCircle } from "lucide-react";

import {
  AdminModal,
  DeleteConfirmModal,
  AdminPageHeader,
  AdminTable,
  AdminPagination,
  statusColors,
} from "@/components/common/admin";

const MAX_BANNERS = 5;

// ─── Banner Form Modal ────────────────────────────────────────
function BannerFormModal({
  banner,
  onClose,
}: {
  banner?: Banner | null;
  totalCount: number;
  onClose: () => void;
}) {
  const qc = useQueryClient();
  const isEdit = !!banner;

  const [formData, setFormData] = useState({
    title: banner?.title ?? "",
    subtitle: banner?.subtitle ?? "",
    image_url: banner?.image_url ?? "",
    link_href: banner?.link_href ?? "",
    link_label: banner?.link_label ?? "",
    sort_order: banner?.sort_order ?? 0,
    is_active: banner?.is_active ?? true,
  });

  const [error, setError] = useState<string | null>(null);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!formData.title.trim()) {
        throw new Error("Banner title is required.");
      }
      if (!formData.image_url.trim()) {
        throw new Error("Banner image is required. Please upload an image.");
      }

      const payload: CreateBannerInput = {
        title: formData.title.trim(),
        subtitle: formData.subtitle?.trim() || null,
        image_url: formData.image_url.trim(),
        link_href: formData.link_href?.trim() || null,
        link_label: formData.link_label?.trim() || null,
        sort_order: Number(formData.sort_order),
        is_active: formData.is_active,
      };

      if (isEdit) {
        // If image was changed, cleanup previous image
        if (banner?.image_url && banner.image_url !== formData.image_url) {
          await deleteImage(banner.image_url, "banner-images");
        }
        return updateBanner(banner!.id, payload);
      } else {
        return createBanner(payload);
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "banners"] });
      onClose();
    },
    onError: (e: unknown) =>
      setError(e instanceof Error ? e.message : "Save failed"),
  });

  const inputCls =
    "w-full rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#444] outline-none transition-all";
  const inputStyle = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
  };

  function focusBorder(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    e.currentTarget.style.borderColor = "rgba(212,175,55,0.5)";
  }
  function blurBorder(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
  }

  return (
    <AdminModal
      title={isEdit ? "Edit Banner" : "New Banner"}
      onClose={onClose}
      maxWidth="max-w-lg"
    >
      <div className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-medium text-[#888] uppercase tracking-widest mb-1.5">
            Title *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
            placeholder="e.g. New Arrivals – Premium Audio"
            className={inputCls}
            style={inputStyle}
            onFocus={focusBorder}
            onBlur={blurBorder}
          />
        </div>

        {/* Subtitle */}
        <div>
          <label className="block text-xs font-medium text-[#888] uppercase tracking-widest mb-1.5">
            Subtitle
          </label>
          <input
            type="text"
            value={formData.subtitle}
            onChange={(e) => setFormData((p) => ({ ...p, subtitle: e.target.value }))}
            placeholder="Optional short description or tagline"
            className={inputCls}
            style={inputStyle}
            onFocus={focusBorder}
            onBlur={blurBorder}
          />
        </div>

        {/* Image Upload with WebP conversion */}
        <div>
          <label className="block text-xs font-medium text-[#888] uppercase tracking-widest mb-2">
            Banner Image (Auto WebP Crop & Upload) *
          </label>
          <ImageUpload
            bucket="banner-images"
            folder="banners"
            value={formData.image_url}
            onChange={(url) => {
              const finalUrl = Array.isArray(url) ? url[0] || "" : url;
              setFormData((p) => ({ ...p, image_url: finalUrl }));
            }}
          />
          {/* Optional manual URL override */}
          <div className="mt-2">
            <input
              type="text"
              value={formData.image_url}
              onChange={(e) =>
                setFormData((p) => ({ ...p, image_url: e.target.value }))
              }
              placeholder="Or paste external image URL (https://…)"
              className={`${inputCls} text-xs`}
              style={inputStyle}
              onFocus={focusBorder}
              onBlur={blurBorder}
            />
          </div>
        </div>

        {/* Link */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#888] uppercase tracking-widest mb-1.5">
              Link URL
            </label>
            <input
              type="text"
              value={formData.link_href}
              onChange={(e) => setFormData((p) => ({ ...p, link_href: e.target.value }))}
              placeholder="/collection"
              className={inputCls}
              style={inputStyle}
              onFocus={focusBorder}
              onBlur={blurBorder}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#888] uppercase tracking-widest mb-1.5">
              Link Label
            </label>
            <input
              type="text"
              value={formData.link_label}
              onChange={(e) => setFormData((p) => ({ ...p, link_label: e.target.value }))}
              placeholder="Shop Now"
              className={inputCls}
              style={inputStyle}
              onFocus={focusBorder}
              onBlur={blurBorder}
            />
          </div>
        </div>

        {/* Sort order & Active */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#888] uppercase tracking-widest mb-1.5">
              Sort Order
            </label>
            <input
              type="number"
              value={formData.sort_order}
              onChange={(e) =>
                setFormData((p) => ({ ...p, sort_order: Number(e.target.value) }))
              }
              className={inputCls}
              style={inputStyle}
              onFocus={focusBorder}
              onBlur={blurBorder}
            />
          </div>
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <div
                onClick={() =>
                  setFormData((p) => ({ ...p, is_active: !p.is_active }))
                }
                className="relative w-10 h-5 rounded-full transition-all cursor-pointer"
                style={{
                  background: formData.is_active
                    ? "rgba(212,175,55,0.6)"
                    : "rgba(255,255,255,0.1)",
                }}
              >
                <div
                  className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
                  style={{ left: formData.is_active ? "calc(100% - 18px)" : 2 }}
                />
              </div>
              <span className="text-xs text-[#888]">Active</span>
            </label>
          </div>
        </div>

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
            disabled={saveMutation.isPending || !formData.title || !formData.image_url}
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
                : "Create Banner"}
          </button>
        </div>
      </div>
    </AdminModal>
  );
}

// ─── Main page ────────────────────────────────────────────────
export default function AdminBannersPage() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editBanner, setEditBanner] = useState<Banner | null>(null);
  const [deleteBannerItem, setDeleteBannerItem] = useState<Banner | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: banners = [], isLoading } = useQuery({
    queryKey: ["admin", "banners"],
    queryFn: getAllBannersAdmin,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const bannerToDelete = banners.find((b) => b.id === id);
      if (bannerToDelete?.image_url) {
        await deleteImage(bannerToDelete.image_url, "banner-images");
      }
      return deleteBanner(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "banners"] });
      setDeleteBannerItem(null);
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      updateBannerStatus(id, active),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "banners"] }),
  });

  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(banners.length / ITEMS_PER_PAGE);
  const paginated = banners.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const canAdd = banners.length < MAX_BANNERS;
  const TABLE_HEADERS = ["Banner", "Link", "Sort", "Status", "Actions"];

  return (
    <div className="space-y-6">
      {/* Modals */}
      {(showForm || editBanner) && (
        <BannerFormModal
          banner={editBanner}
          totalCount={banners.length}
          onClose={() => {
            setShowForm(false);
            setEditBanner(null);
          }}
        />
      )}
      {deleteBannerItem && (
        <DeleteConfirmModal
          entityName={deleteBannerItem.title}
          entityLabel="banner"
          loading={deleteMutation.isPending}
          onConfirm={() => deleteMutation.mutate(deleteBannerItem.id)}
          onCancel={() => setDeleteBannerItem(null)}
        />
      )}

      <div className="space-y-6">
        <AdminPageHeader
          title="Banners"
          subtitle={`${banners.length} / ${MAX_BANNERS} banners`}
          addLabel="Add Banner"
          addButtonId="add-banner-btn"
          onAdd={() => {
            if (canAdd) setShowForm(true);
          }}
        />

        {/* Max banners warning */}
        {!canAdd && (
          <div
            className="flex items-start gap-3 rounded-2xl px-5 py-4"
            style={{
              background: "rgba(234,179,8,0.08)",
              border: "1px solid rgba(234,179,8,0.2)",
            }}
          >
            <AlertCircle size={16} className="text-yellow-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-yellow-400 text-sm font-medium">
                Maximum banners reached
              </p>
              <p className="text-[#888] text-xs mt-0.5">
                You can display a maximum of {MAX_BANNERS} banners. Delete one to
                add another.
              </p>
            </div>
          </div>
        )}

        <AdminTable
          headers={TABLE_HEADERS}
          isLoading={isLoading}
          isEmpty={paginated.length === 0}
          emptyIcon={<ImageIcon size={32} />}
          emptyText="No banners yet — add your first banner"
        >
          {paginated.map((b, i) => {
            const c = statusColors[b.is_active ? "active" : "inactive"];
            return (
              <tr
                key={b.id}
                style={{
                  borderTop: i > 0 ? "1px solid rgba(255,255,255,0.04)" : "none",
                }}
                className="hover:bg-white/[0.02] transition-colors"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    {/* Thumbnail */}
                    {b.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={b.image_url}
                        alt={b.title}
                        className="w-16 h-9 rounded-lg object-cover shrink-0"
                        style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                      />
                    ) : (
                      <div
                        className="w-16 h-9 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: "rgba(212,175,55,0.1)" }}
                      >
                        <ImageIcon size={14} className="text-[#d4af37]" />
                      </div>
                    )}
                    <div>
                      <p className="text-white font-medium text-sm">{b.title}</p>
                      {b.subtitle && (
                        <p className="text-[#555] text-xs truncate max-w-[200px]">
                          {b.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-[#666] font-mono text-xs">
                  {b.link_href ? (
                    <span>
                      {b.link_href}
                      {b.link_label && (
                        <span className="text-[#444] ml-1">({b.link_label})</span>
                      )}
                    </span>
                  ) : (
                    <span className="text-[#444]">—</span>
                  )}
                </td>
                <td className="px-5 py-4 text-[#888]">{b.sort_order}</td>
                <td className="px-5 py-4">
                  <button
                    onClick={() =>
                      toggleMutation.mutate({ id: b.id, active: !b.is_active })
                    }
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-opacity hover:opacity-75"
                    style={{ background: c.bg, color: c.text }}
                  >
                    {b.is_active ? <Check size={10} /> : <X size={10} />}
                    {b.is_active ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditBanner(b)}
                      className="p-2 rounded-lg text-[#555] hover:text-[#d4af37] hover:bg-[rgba(212,175,55,0.1)] transition-all"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteBannerItem(b)}
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
