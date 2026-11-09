"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllOrders, getTotalSales, getOrderCount } from "@/services/order.service";
import { getProducts, getLowStockProducts } from "@/services/product.service";
import { getAllCategories } from "@/services/category.service";
import { getAllBannersAdmin } from "@/services/banner.service";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  Package,
  ShoppingBag,
  Tag,
  AlertTriangle,
  KeyRound,
  Image as ImageIcon,
} from "lucide-react";
import { format } from "date-fns";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

// ─── Stat Card ───────────────────────────────────────────────
function StatCard({
  label,
  value,
  icon: Icon,
  sub,
  accent = false,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div
      className="rounded-2xl p-6 relative overflow-hidden"
      style={{
        background: accent
          ? "linear-gradient(135deg,rgba(212,175,55,0.15),rgba(184,148,31,0.08))"
          : "rgba(255,255,255,0.03)",
        border: accent
          ? "1px solid rgba(212,175,55,0.25)"
          : "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[#666] text-xs uppercase tracking-widest mb-2">{label}</p>
          <p
            className="text-3xl font-semibold"
            style={{ color: accent ? "#d4af37" : "#fff" }}
          >
            {value}
          </p>
          {sub && <p className="text-[#555] text-xs mt-1">{sub}</p>}
        </div>
        <div
          className="p-2.5 rounded-xl"
          style={{
            background: accent
              ? "rgba(212,175,55,0.15)"
              : "rgba(255,255,255,0.05)",
          }}
        >
          <Icon
            size={18}
            style={{ color: accent ? "#d4af37" : "#666" }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Order status badge ───────────────────────────────────────
const statusColors: Record<string, { bg: string; text: string }> = {
  pending:   { bg: "rgba(234,179,8,0.15)",   text: "#eab308" },
  paid:      { bg: "rgba(34,197,94,0.15)",   text: "#22c55e" },
  shipped:   { bg: "rgba(59,130,246,0.15)",  text: "#3b82f6" },
  delivered: { bg: "rgba(168,85,247,0.15)",  text: "#a855f7" },
  cancelled: { bg: "rgba(239,68,68,0.15)",   text: "#ef4444" },
};

function StatusBadge({ status }: { status: string }) {
  const c = statusColors[status] ?? { bg: "rgba(255,255,255,0.1)", text: "#888" };
  return (
    <span
      className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium capitalize"
      style={{ background: c.bg, color: c.text }}
    >
      {status}
    </span>
  );
}

// ─── Custom tooltip for chart ─────────────────────────────────
function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl px-4 py-3 text-sm shadow-xl"
      style={{
        background: "#1a1a1a",
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <p className="text-[#888] text-xs mb-1">{label}</p>
      <p className="text-[#d4af37] font-semibold">
        PKR {payload[0].value.toLocaleString()}
      </p>
    </div>
  );
}

// ─── Change Password Section ──────────────────────────────────
function ChangePasswordSection() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      // Re-authenticate with current password first
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user?.email) throw new Error("Not authenticated");

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });
      if (signInError) throw new Error("Current password is incorrect.");

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;

      toast.success("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to change password.",
      );
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
  };

  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div className="flex items-center gap-3 mb-5">
        <div
          className="p-2 rounded-xl"
          style={{ background: "rgba(212,175,55,0.1)" }}
        >
          <KeyRound size={16} style={{ color: "#d4af37" }} />
        </div>
        <div>
          <p className="text-white text-sm font-medium">Change Password</p>
          <p className="text-[#555] text-xs mt-0.5">
            Update your admin account password
          </p>
        </div>
      </div>

      <form onSubmit={handleChangePassword} className="space-y-4 max-w-sm">
        {/* Current password */}
        <div>
          <label className="block text-xs font-medium text-[#888] uppercase tracking-widest mb-1.5">
            Current Password
          </label>
          <input
            type="password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#444] outline-none transition-all"
            style={inputStyle}
            onFocus={(e) =>
              (e.currentTarget.style.borderColor = "rgba(212,175,55,0.5)")
            }
            onBlur={(e) =>
              (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")
            }
          />
        </div>

        {/* New password */}
        <div>
          <label className="block text-xs font-medium text-[#888] uppercase tracking-widest mb-1.5">
            New Password
          </label>
          <input
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#444] outline-none transition-all"
            style={inputStyle}
            onFocus={(e) =>
              (e.currentTarget.style.borderColor = "rgba(212,175,55,0.5)")
            }
            onBlur={(e) =>
              (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")
            }
          />
        </div>

        {/* Confirm new password */}
        <div>
          <label className="block text-xs font-medium text-[#888] uppercase tracking-widest mb-1.5">
            Confirm New Password
          </label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#444] outline-none transition-all"
            style={inputStyle}
            onFocus={(e) =>
              (e.currentTarget.style.borderColor = "rgba(212,175,55,0.5)")
            }
            onBlur={(e) =>
              (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")
            }
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="py-2.5 px-6 rounded-xl text-sm font-medium text-black disabled:opacity-50 transition-all"
          style={{
            background: "linear-gradient(135deg,#d4af37,#b8941f)",
            boxShadow: "0 4px 16px rgba(212,175,55,0.3)",
          }}
        >
          {loading ? "Updating…" : "Update Password"}
        </button>
      </form>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────
export default function AdminDashboardPage() {
  const { data: orders = [] } = useQuery({
    queryKey: ["admin", "orders"],
    queryFn: getAllOrders,
  });
  const { data: totalSales = 0 } = useQuery({
    queryKey: ["admin", "totalSales"],
    queryFn: getTotalSales,
  });
  const { data: orderCount = 0 } = useQuery({
    queryKey: ["admin", "orderCount"],
    queryFn: getOrderCount,
  });
  const { data: products = [] } = useQuery({
    queryKey: ["admin", "products"],
    queryFn: getProducts,
  });
  const { data: categories = [] } = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: getAllCategories,
  });
  const { data: banners = [] } = useQuery({
    queryKey: ["admin", "banners"],
    queryFn: getAllBannersAdmin,
  });
  const { data: lowStock = [] } = useQuery({
    queryKey: ["admin", "lowStock"],
    queryFn: () => getLowStockProducts(5),
  });

  // Build revenue chart data from orders (last 7 days)
  const chartData = (() => {
    const days: Record<string, number> = {};
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      days[format(d, "MMM d")] = 0;
    }
    orders.forEach((o) => {
      if (o.status === "cancelled") return;
      const label = format(new Date(o.created_at), "MMM d");
      if (label in days) days[label] += Number(o.total);
    });
    return Object.entries(days).map(([date, revenue]) => ({ date, revenue }));
  })();

  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .slice(0, 8);

  return (
    <div className="space-y-8">
      {/* Page title */}
      <div>
        <h1 className="text-white text-2xl font-semibold">Dashboard</h1>
        <p className="text-[#555] text-sm mt-1">
          Welcome back — here&apos;s what&apos;s happening today
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        <StatCard
          label="Total Revenue"
          value={`PKR ${totalSales.toLocaleString()}`}
          icon={TrendingUp}
          accent
        />
        <StatCard
          label="Total Orders"
          value={orderCount}
          icon={ShoppingBag}
          sub={`${orders.filter((o) => o.status === "pending").length} pending`}
        />
        <StatCard
          label="Total Products"
          value={products.length}
          icon={Package}
          sub={`${products.filter((p) => p.is_active).length} active (Max 4 imgs/item)`}
        />
        <StatCard
          label="Solutions"
          value={categories.length}
          icon={Tag}
          sub="Active categories"
        />
        <StatCard
          label="Hero Banners"
          value={`${banners.length} / 5`}
          icon={ImageIcon}
          sub={`${banners.filter((b) => b.is_active).length} active (Max 5)`}
        />
      </div>

      {/* Low stock alert */}
      {lowStock.length > 0 && (
        <div
          className="rounded-2xl px-5 py-4 flex items-start gap-3"
          style={{
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.2)",
          }}
        >
          <AlertTriangle size={16} className="text-red-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-red-400 text-sm font-medium">Low Stock Alert</p>
            <p className="text-[#888] text-xs mt-0.5">
              {lowStock.map((p) => `${p.name} (${p.stock} left)`).join(" · ")}
            </p>
          </div>
        </div>
      )}

      {/* Chart + Recent orders */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Revenue chart */}
        <div
          className="xl:col-span-3 rounded-2xl p-6"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <p className="text-white text-sm font-medium mb-1">Revenue (7 days)</p>
          <p className="text-[#555] text-xs mb-6">Daily order revenue excluding cancelled</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d4af37" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#d4af37" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fill: "#555", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#555", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<ChartTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#d4af37"
                strokeWidth={2}
                fill="url(#goldGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recent orders */}
        <div
          className="xl:col-span-2 rounded-2xl p-6"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <p className="text-white text-sm font-medium mb-5">Recent Orders</p>
          <div className="space-y-3">
            {recentOrders.length === 0 && (
              <p className="text-[#555] text-sm">No orders yet.</p>
            )}
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between"
              >
                <div className="min-w-0">
                  <p className="text-white text-xs font-mono truncate">
                    #{order.id.slice(0, 8)}
                  </p>
                  <p className="text-[#555] text-[11px]">
                    {format(new Date(order.created_at), "MMM d, h:mm a")}
                  </p>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <p className="text-[#d4af37] text-xs font-medium">
                    PKR {Number(order.total).toLocaleString()}
                  </p>
                  <StatusBadge status={order.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Change Password */}
      <ChangePasswordSection />
    </div>
  );
}
