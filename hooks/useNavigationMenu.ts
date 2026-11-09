import { useMemo } from "react";
import { useCategories } from "./useCategories";
import type { MenuItem } from "@/components/headers/types";
import { getCategorySlug } from "@/lib/utils";

// Stable SEO-friendly defaults for ROSHÉ BEAUTY
const DEFAULT_CATEGORIES: { title: string; slug: string }[] = [
  {
    title: "Skincare & Serums",
    slug: "skincare-serums",
  },
  {
    title: "Luxury Cosmetics",
    slug: "luxury-cosmetics",
  },
  {
    title: "Lip & Eye Care",
    slug: "lip-eye-care",
  },
  {
    title: "Fragrance & Glow",
    slug: "fragrance-glow",
  },
];

export function useNavigationMenu(): MenuItem[] {
  const { data: categories } = useCategories();

  return useMemo(() => {
    const shopChildren: MenuItem[] = [
      {
        title: "All Beauty Products",
        href: "/collection",
      },
    ];

    if (categories && categories.length > 0) {
      categories.forEach((cat) => {
        shopChildren.push({
          title: cat.name,
          href: `/collection?category=${getCategorySlug(cat)}`,
        });
      });
    } else {
      DEFAULT_CATEGORIES.forEach((cat) => {
        shopChildren.push({
          title: cat.title,
          href: `/collection?category=${cat.slug}`,
        });
      });
    }

    const skincareCat = categories?.find(
      (c) =>
        c.slug?.includes("skin") ||
        c.name?.toLowerCase().includes("skin") ||
        c.slug?.includes("serum"),
    );

    const cosmeticsCat = categories?.find(
      (c) =>
        c.slug?.includes("cosmetic") ||
        c.name?.toLowerCase().includes("cosmetic") ||
        c.slug?.includes("makeup"),
    );

    const skincareHref = skincareCat
      ? `/collection?category=${getCategorySlug(skincareCat)}`
      : "/collection?category=skincare-serums";

    const cosmeticsHref = cosmeticsCat
      ? `/collection?category=${getCategorySlug(cosmeticsCat)}`
      : "/collection?category=luxury-cosmetics";

    return [
      {
        title: "Home",
        href: "/",
      },
      {
        title: "Collection",
        href: "/collection",
      },
      {
        title: "Categories",
        children: shopChildren,
      },
      {
        title: "Skincare",
        href: skincareHref,
      },
      {
        title: "Cosmetics",
        href: cosmeticsHref,
      },
      {
        title: "About Us",
        href: "/about",
      },
      {
        title: "Contact",
        href: "/contact",
      },
    ];
  }, [categories]);
}
