"use client";

import { Trash2 } from "lucide-react";

interface DeleteConfirmModalProps {
  /** The name/title of the entity being deleted — shown in the message */
  entityName: string;
  /** Label shown in the heading e.g. "product", "category". Defaults to "item" */
  entityLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}

/**
 * Reusable delete-confirmation dialog shared by all admin pages.
 */
export function DeleteConfirmModal({
  entityName,
  entityLabel = "item",
  onConfirm,
  onCancel,
  loading,
}: DeleteConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
        onClick={onCancel}
      />
      <div
        className="relative rounded-2xl p-7 w-full max-w-sm text-center"
        style={{
          background: "#111",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="w-12 h-12 rounded-full bg-red-500/15 flex items-center justify-center mx-auto mb-4">
          <Trash2 size={20} className="text-red-400" />
        </div>
        <p className="text-white font-medium mb-1 capitalize">
          Delete {entityLabel}?
        </p>
        <p className="text-[#666] text-sm mb-6">
          &quot;{entityName}&quot; will be permanently removed.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl text-sm text-[#666] border border-[rgba(255,255,255,0.08)] hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white bg-red-600 hover:bg-red-500 disabled:opacity-50 transition-colors"
          >
            {loading ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
