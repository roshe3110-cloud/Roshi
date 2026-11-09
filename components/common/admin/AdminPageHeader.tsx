"use client";

import { Plus } from "lucide-react";

interface AdminPageHeaderProps {
  title: string;
  subtitle: string;
  addLabel: string;
  onAdd: () => void;
  addButtonId?: string;
}

/**
 * Standard admin page header: title + subtitle on the left, gold "Add" button on the right.
 */
export function AdminPageHeader({
  title,
  subtitle,
  addLabel,
  onAdd,
  addButtonId,
}: AdminPageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-white text-2xl font-semibold">{title}</h1>
        <p className="text-[#555] text-sm mt-1">{subtitle}</p>
      </div>
      <button
        id={addButtonId}
        onClick={onAdd}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-black"
        style={{
          background: "linear-gradient(135deg,#d4af37,#b8941f)",
          boxShadow: "0 4px 16px rgba(212,175,55,0.3)",
        }}
      >
        <Plus size={15} />
        {addLabel}
      </button>
    </div>
  );
}
