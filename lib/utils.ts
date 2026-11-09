import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getCategorySlug(cat: {
  id: string;
  name?: string | null;
  slug?: string | null;
}): string {
  if (cat.slug && cat.slug.trim()) {
    return cat.slug.trim();
  }
  if (cat.name && cat.name.trim()) {
    return slugify(cat.name);
  }
  return cat.id;
}
