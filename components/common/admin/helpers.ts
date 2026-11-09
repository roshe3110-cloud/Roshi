// ─── Admin Shared Helpers ─────────────────────────────────────

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const statusColors: Record<string, { bg: string; text: string }> = {
  active: { bg: "rgba(34,197,94,0.12)", text: "#22c55e" },
  inactive: { bg: "rgba(239,68,68,0.12)", text: "#ef4444" },
};
