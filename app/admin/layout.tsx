"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, getCurrentUser } from "@/services/auth";
import {
  LayoutDashboard,
  Package,
  Tag,
  ShoppingBag,
  Image as ImageIcon,
  LogOut,
  ChevronRight,
  Menu,
  X,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: Tag },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Banners", href: "/admin/banners", icon: ImageIcon },
  { label: "Popups & Deals", href: "/admin/popups", icon: Sparkles },
];

function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await signOut();
      router.push("/login");
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          style={{ backdropFilter: "blur(4px)" }}
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 w-64 flex flex-col z-40 transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
        style={{
          background: "#0d0d0d",
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-3 px-6 py-5"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#b8941f] shadow-lg shadow-[#d4af37]/20 shrink-0">
            <div className="inline-flex items-center justify-center w-30 h-30 rounded-2xl bg-gradient-to-br from-[#d4af37] to-[#b8941f] mb-4 shadow-lg shadow-[#d4af37]/20">
              <Image src="/logo.png" alt="Logo" width={150} height={150} unoptimized />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold leading-none">
              ROSHÉ 
            </p>
            <p className="text-[#555] text-[11px] mt-0.5">Admin Panel</p>
          </div>
          {/* Close button — mobile only */}
          <button
            onClick={onClose}
            className="lg:hidden text-[#555] hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 group"
                style={{
                  background: active ? "rgba(212,175,55,0.1)" : "transparent",
                  color: active ? "#d4af37" : "#888",
                  border: active
                    ? "1px solid rgba(212,175,55,0.2)"
                    : "1px solid transparent",
                }}
              >
                <Icon
                  size={16}
                  className="shrink-0"
                  style={{ color: active ? "#d4af37" : "#555" }}
                />
                <span className="flex-1">{item.label}</span>
                {active && (
                  <ChevronRight size={12} style={{ color: "#d4af37" }} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Store Link & Sign out */}
        <div
          className="px-3 py-4 space-y-1"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-xs transition-all duration-150 text-[#888] hover:text-[#d4af37] hover:bg-white/5"
          >
            <ExternalLink size={14} className="shrink-0" />
            <span>View Live Store</span>
          </Link>

          <button
            id="admin-signout-btn"
            onClick={handleSignOut}
            disabled={signingOut}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-xs transition-all duration-150 text-[#666] hover:text-red-400 hover:bg-red-500/10 disabled:opacity-50"
          >
            <LogOut size={14} className="shrink-0" />
            {signingOut ? "Signing out…" : "Sign Out"}
          </button>
        </div>
      </aside>
    </>
  );
}

function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    getCurrentUser()
      .then((u) => setEmail(u?.email ?? null))
      .catch(() => setEmail(null));
  }, []);

  // Derive a readable page title from pathname
  const pageTitle = (() => {
    const match = navItems.find(
      (n) => pathname === n.href || pathname.startsWith(n.href + "/"),
    );
    return match?.label ?? "Admin";
  })();

  const initials = email ? email.slice(0, 2).toUpperCase() : "A";

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8 py-4"
      style={{
        background: "rgba(10,10,10,0.8)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(16px)",
      }}
    >
      <div className="flex items-center gap-3">
        {/* Hamburger — mobile only */}
        <button
          id="admin-menu-btn"
          onClick={onMenuClick}
          className="lg:hidden text-[#666] hover:text-white transition-colors p-1 -ml-1"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <p className="text-white text-sm font-medium">{pageTitle}</p>
      </div>
      <div className="flex items-center gap-3">
        <Link
          href="/"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#aaa] hover:text-white bg-white/5 hover:bg-white/10 transition border border-white/5"
        >
          <ExternalLink size={12} />
          <span>View Store</span>
        </Link>
        <span className="text-[#555] text-xs hidden md:block">
          {email ?? ""}
        </span>
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-black shrink-0"
          style={{ background: "linear-gradient(135deg,#d4af37,#b8941f)" }}
        >
          {initials}
        </div>
      </div>
    </header>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: "#0a0a0a" }}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {/* lg:ml-64 pushes content right on desktop; on mobile it uses full width */}
      <div className="lg:ml-64 min-h-screen">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
