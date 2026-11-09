"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllOrders,
  updateOrderStatus,
} from "@/services/order.service";
import type { OrderStatus } from "@/services/order.service";
import {
  ShoppingBag,
  ChevronDown,
  ChevronUp,
  X,
  Search,
} from "lucide-react";
import { format } from "date-fns";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type Order = Awaited<ReturnType<typeof getAllOrders>>[number];

// ─── Status config ────────────────────────────────────────────
const STATUS_OPTIONS: OrderStatus[] = [
  "pending",
  "paid",
  "shipped",
  "delivered",
  "cancelled",
];

const statusColors: Record<OrderStatus, { bg: string; text: string; border: string }> = {
  pending:   { bg: "rgba(234,179,8,0.12)",   text: "#eab308",  border: "rgba(234,179,8,0.3)"  },
  paid:      { bg: "rgba(34,197,94,0.12)",   text: "#22c55e",  border: "rgba(34,197,94,0.3)"  },
  shipped:   { bg: "rgba(59,130,246,0.12)",  text: "#3b82f6",  border: "rgba(59,130,246,0.3)" },
  delivered: { bg: "rgba(168,85,247,0.12)",  text: "#a855f7",  border: "rgba(168,85,247,0.3)" },
  cancelled: { bg: "rgba(239,68,68,0.12)",   text: "#ef4444",  border: "rgba(239,68,68,0.3)"  },
};

// ─── Status dropdown ──────────────────────────────────────────
function StatusDropdown({
  orderId,
  current,
}: {
  orderId: string;
  current: OrderStatus;
}) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: (status: OrderStatus) => updateOrderStatus(orderId, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "orders"] });
      setOpen(false);
    },
  });

  const c = statusColors[current];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium capitalize"
        style={{
          background: c.bg,
          color: c.text,
          border: `1px solid ${c.border}`,
        }}
      >
        {current}
        <ChevronDown size={10} />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
          <div
            className="absolute top-full mt-1.5 left-0 z-20 rounded-xl py-1 min-w-[140px]"
            style={{
              background: "#1a1a1a",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
            }}
          >
            {STATUS_OPTIONS.map((s) => {
              const sc = statusColors[s];
              return (
                <button
                  key={s}
                  onClick={() => mutation.mutate(s)}
                  disabled={s === current || mutation.isPending}
                  className="flex items-center gap-2 w-full px-3 py-2 text-xs capitalize hover:bg-white/5 disabled:opacity-40 transition-colors"
                  style={{ color: sc.text }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: sc.text }}
                  />
                  {s}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Order items expand ────────────────────────────────────────
function OrderItems({ order }: { order: Order }) {
  const items = (order as unknown as { items?: Array<{ product_id: string; product_name: string; quantity: number; unit_price: number }> })
    ?.items ?? [];

  if (!items.length)
    return <p className="text-[#555] text-xs">No items</p>;

  return (
    <div className="space-y-1.5">
      {items.map((item, index) => (
        <div key={`${item.product_id}-${index}`} className="flex items-center justify-between text-xs">
          <span className="text-[#888]">
            {item.product_name} × {item.quantity}
          </span>
          <span className="text-[#d4af37]">
            PKR {(Number(item.unit_price) * item.quantity).toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Order row ─────────────────────────────────────────────────
function OrderRow({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false);
  const items = (order as unknown as { items?: unknown[] })?.items ?? [];
  const customerInfo = (order as unknown as { customer_info?: { name: string; email?: string; phone: string; address?: string; city?: string; state?: string; postcode?: string } })
    ?.customer_info;

  return (
    <>
      <tr
        className="hover:bg-white/[0.02] transition-colors cursor-pointer"
        onClick={() => setExpanded((v) => !v)}
        style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
      >
        <td className="px-5 py-4">
          <p className="text-white text-xs font-mono">#{(order as unknown as { order_number?: string })?.order_number || order.id.slice(0, 8)}</p>
          <p className="text-[#555] text-[11px] mt-0.5">
            {format(new Date(order.created_at), "MMM d, yyyy")}
          </p>
        </td>
        <td className="px-5 py-4 text-[#888] text-xs font-mono">
          {order.user_id ? `${order.user_id.slice(0, 8)}…` : "Guest"}
        </td>
        <td className="px-5 py-4">
          <p className="text-[#d4af37] font-medium text-sm">
            PKR {Number(order.total).toLocaleString()}
          </p>
        </td>
        <td className="px-5 py-4">
          <span className="text-[#888] text-xs">{items.length} item{items.length !== 1 ? "s" : ""}</span>
        </td>
        <td className="px-5 py-4">
          <StatusDropdown orderId={order.id} current={order.status as OrderStatus} />
        </td>
        <td className="px-5 py-4">
          <button
            className="text-[#555] hover:text-white transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded((v) => !v);
            }}
          >
            {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
        </td>
      </tr>

      {/* Expanded order items */}
      {expanded && (
        <tr style={{ borderTop: "none" }}>
          <td
            colSpan={6}
            className="px-5 pb-4 pt-0"
            style={{
              background: "rgba(212,175,55,0.03)",
              borderBottom: "1px solid rgba(255,255,255,0.04)",
            }}
          >
            <div
              className="rounded-xl p-4 mt-2"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div className="grid grid-cols-2 gap-6">
                {/* Items */}
                <div>
                  <p className="text-[#666] text-[11px] uppercase tracking-widest mb-2">
                    Order Items
                  </p>
                  <OrderItems order={order} />
                </div>
                {/* Customer Info */}
                <div>
                  <p className="text-[#666] text-[11px] uppercase tracking-widest mb-2">
                    Customer Information
                  </p>
                  {customerInfo ? (
                    <div className="text-[#888] text-xs leading-relaxed space-y-1">
                      <p><span className="text-[#666]">Name:</span> {customerInfo.name}</p>
                      <p><span className="text-[#666]">Phone:</span> {customerInfo.phone}</p>
                      {customerInfo.email && <p><span className="text-[#666]">Email:</span> {customerInfo.email}</p>}
                      {customerInfo.address && (
                        <p><span className="text-[#666]">Address:</span> {customerInfo.address}, {customerInfo.city} {customerInfo.state} ({customerInfo.postcode})</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-[#555] text-xs">No customer info on file</p>
                  )}
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ─── Main page ────────────────────────────────────────────────
const TABS: { label: string; value: "all" | OrderStatus }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Paid", value: "paid" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

export default function AdminOrdersPage() {
  const [tab, setTab] = useState<"all" | OrderStatus>("all");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: allOrders = [], isLoading } = useQuery({
    queryKey: ["admin", "orders"],
    queryFn: getAllOrders,
  });

  // Filter client-side — no extra network call needed
  const orders = tab === "all"
    ? allOrders
    : allOrders.filter((o) => o.status === tab);

  const displayed = orders.filter((o) =>
    o.id.toLowerCase().includes(search.toLowerCase()),
  );

  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(displayed.length / ITEMS_PER_PAGE);
  const paginated = displayed.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Tab counts
  const counts: Record<string, number> = { all: allOrders.length };
  STATUS_OPTIONS.forEach((s) => {
    counts[s] = allOrders.filter((o) => o.status === s).length;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-white text-2xl font-semibold">Orders</h1>
        <p className="text-[#555] text-sm mt-1">
          {allOrders.length} total orders
        </p>
      </div>

      {/* Status tabs */}
      <div
        className="flex gap-1 p-1 rounded-xl overflow-x-auto max-w-full"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        {TABS.map((t) => {
          const active = tab === t.value;
          const sc = t.value !== "all" ? statusColors[t.value] : null;
          return (
            <button
              key={t.value}
              onClick={() => {
                setTab(t.value);
                setCurrentPage(1);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0"
              style={{
                background: active
                  ? sc
                    ? sc.bg
                    : "rgba(255,255,255,0.08)"
                  : "transparent",
                color: active ? (sc ? sc.text : "#fff") : "#666",
                border: active && sc
                  ? `1px solid ${sc.border}`
                  : "1px solid transparent",
              }}
            >
              {t.label}
              <span
                className="text-[10px] px-1.5 rounded-full"
                style={{
                  background: active ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.06)",
                  color: active ? "inherit" : "#555",
                }}
              >
                {counts[t.value] ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search */}
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
          placeholder="Search by order ID…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
        {search && (
          <button onClick={() => {
            setSearch("");
            setCurrentPage(1);
          }}>
            <X size={14} className="text-[#555]" />
          </button>
        )}
      </div>

      {/* Table */}
      <div
        className="rounded-2xl overflow-x-auto"
        style={{ border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <table className="w-full min-w-[600px] text-sm">
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.03)" }}>
              {["Order ID", "Customer", "Total", "Items", "Status", ""].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left px-5 py-3.5 text-[#555] text-xs uppercase tracking-widest font-medium"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={6} className="text-center text-[#555] py-16 text-sm">
                  Loading…
                </td>
              </tr>
            )}
            {!isLoading && paginated.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-16">
                  <ShoppingBag size={32} className="text-[#333] mx-auto mb-3" />
                  <p className="text-[#555] text-sm">No orders found</p>
                </td>
              </tr>
            )}
            {paginated.map((order) => (
              <OrderRow key={order.id} order={order} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="py-2">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  aria-disabled={currentPage === 1}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    onClick={() => setCurrentPage(i + 1)}
                    isActive={currentPage === i + 1}
                    className="cursor-pointer"
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  aria-disabled={currentPage === totalPages}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Summary footer */}
      {displayed.length > 0 && (
        <div className="flex items-center justify-between text-xs text-[#555] px-1">
          <span>Showing {displayed.length} orders</span>
          <span>
            Total:{" "}
            <span className="text-[#d4af37]">
              PKR{" "}
              {displayed
                .filter((o) => o.status !== "cancelled")
                .reduce((s, o) => s + Number(o.total), 0)
                .toLocaleString()}
            </span>
          </span>
        </div>
      )}
    </div>
  );
}
