"use client";

import React from "react";

interface AdminTableProps {
  /** Column header labels */
  headers: string[];
  isLoading: boolean;
  /** True when data is loaded but the (filtered) result is empty */
  isEmpty: boolean;
  /** Icon shown in the empty state */
  emptyIcon: React.ReactNode;
  emptyText: string;
  children: React.ReactNode;
}

/**
 * Shared admin table shell: dark rounded border, themed thead, loading row, empty state row.
 * Pass `<tr>` elements as children for the tbody.
 */
export function AdminTable({
  headers,
  isLoading,
  isEmpty,
  emptyIcon,
  emptyText,
  children,
}: AdminTableProps) {
  const colSpan = headers.length;

  return (
    <div
      className="rounded-2xl overflow-x-auto"
      style={{ border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <table className="w-full min-w-[650px] text-sm">
        <thead>
          <tr style={{ background: "rgba(255,255,255,0.03)" }}>
            {headers.map((h) => (
              <th
                key={h}
                className="text-left px-5 py-3.5 text-[#555] text-xs uppercase tracking-widest font-medium"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr>
              <td
                colSpan={colSpan}
                className="text-center text-[#555] py-16 text-sm"
              >
                Loading…
              </td>
            </tr>
          )}
          {!isLoading && isEmpty && (
            <tr>
              <td colSpan={colSpan} className="text-center py-16">
                <div className="flex flex-col items-center gap-3">
                  <span className="text-[#333]">{emptyIcon}</span>
                  <p className="text-[#555] text-sm">{emptyText}</p>
                </div>
              </td>
            </tr>
          )}
          {!isLoading && !isEmpty && children}
        </tbody>
      </table>
    </div>
  );
}
