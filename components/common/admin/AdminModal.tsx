"use client";

import React from "react";
import { X } from "lucide-react";

interface AdminModalProps {
  title: string;
  onClose: () => void;
  maxWidth?: string;
  children: React.ReactNode;
}

/**
 * Generic dark glassmorphic modal shell used across all admin pages.
 */
export function AdminModal({
  title,
  onClose,
  maxWidth = "max-w-xl",
  children,
}: AdminModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
        onClick={onClose}
      />

      {/* Card */}
      <div
        className={`relative w-full ${maxWidth} rounded-2xl p-7 overflow-y-auto max-h-[90vh]`}
        style={{
          background: "#111",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-[#555] hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">{children}</div>
      </div>
    </div>
  );
}
