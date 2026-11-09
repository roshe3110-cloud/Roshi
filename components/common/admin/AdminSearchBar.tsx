"use client";

import { Search, X } from "lucide-react";

interface AdminSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/**
 * Admin search bar with icon and clear button.
 */
export function AdminSearchBar({
  value,
  onChange,
  placeholder = "Search…",
}: AdminSearchBarProps) {
  return (
    <div
      className="flex items-center gap-3 rounded-xl px-4 py-3"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <Search size={15} className="text-[#555]" />
      <input
        className="flex-1 bg-transparent text-white text-sm outline-none placeholder-[#444]"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button onClick={() => onChange("")}>
          <X size={14} className="text-[#555]" />
        </button>
      )}
    </div>
  );
}
