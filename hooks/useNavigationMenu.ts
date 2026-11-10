import { useMemo } from "react";
import { useCategories } from "./useCategories";
import type { MenuItem } from "@/components/headers/types";
import { getCategorySlug } from "@/lib/utils";

// ── Complete ROSHÉ 3 Major Pillars & Subcategories Definition ──────────────────
export interface CategoryDefinition {
  title: string;
  slug: string;
  group: "makeup" | "jewelry" | "beauty";
  description: string;
  image: string;
}

export const ROSHE_ALL_CATEGORIES: CategoryDefinition[] = [
  // ── 1. Major Category: Makeup ──
  {
    title: "Lipsticks & Lip Care",
    slug: "lipsticks",
    group: "makeup",
    description: "Color Your Confidence — Lipsticks, lip pencils, lip tints and lip glosses.",
    image: "/categories/lip-eye-care.svg",
  },
  {
    title: "Eye Makeup & Palettes",
    slug: "eye-makeup",
    group: "makeup",
    description: "Define Your Look — Eyeshadow palettes, eyeliners, eye pencils and mascaras.",
    image: "/categories/luxury-cosmetics.svg",
  },
  {
    title: "Face & Complexion",
    slug: "face-makeup",
    group: "makeup",
    description: "Flawless Base — Foundations, primers and setting sprays.",
    image: "/categories/luxury-cosmetics.svg",
  },
  {
    title: "Mini Beauty Collection",
    slug: "mini-beauty",
    group: "makeup",
    description: "Beauty in Miniature — Mini lipsticks and mini eyeshadow palettes.",
    image: "/categories/mini-beauty.svg",
  },

  // ── 2. Major Category: Jewelry & Accessories ──
  {
    title: "Artificial Jewelry",
    slug: "artificial-jewelry",
    group: "jewelry",
    description: "Style Your Shine — Beautiful artificial fashion jewelry for everyday wear and special occasions.",
    image: "/categories/artificial-jewelry.svg",
  },
  {
    title: "Silver-Tone Jewelry",
    slug: "silver-jewelry",
    group: "jewelry",
    description: "Timeless Elegance — Beautiful silver-look fashion jewelry, rings, earrings and necklaces.",
    image: "/categories/silver-jewelry.svg",
  },
  {
    title: "Necklaces & Chains",
    slug: "necklaces-chains",
    group: "jewelry",
    description: "Elegant Details — Fashion necklaces, chains and pendants.",
    image: "/categories/necklaces.svg",
  },
  {
    title: "Earrings",
    slug: "earrings",
    group: "jewelry",
    description: "Everyday Glamour — Studs, hoops and statement earrings.",
    image: "/categories/earrings.svg",
  },
  {
    title: "Rings",
    slug: "rings",
    group: "jewelry",
    description: "Little Details, Big Style — Fashion rings and statement rings.",
    image: "/categories/rings.svg",
  },
  {
    title: "Bracelets & Bangles",
    slug: "bracelets-bangles",
    group: "jewelry",
    description: "Shine Your Way — Fashion bracelets and elegant bangles.",
    image: "/categories/bracelets.svg",
  },
  {
    title: "Hair Accessories",
    slug: "hair-accessories",
    group: "jewelry",
    description: "Finishing Touches — Stylish clips, pins and hair accessories.",
    image: "/categories/hair-accessories.svg",
  },
  {
    title: "Jewelry Boxes & Organizers",
    slug: "jewelry-boxes",
    group: "jewelry",
    description: "Store Your Shine — Elegant jewelry boxes, organizers and travel cases.",
    image: "/categories/jewelry-boxes.svg",
  },

  // ── 3. Major Category: Beauty & Skincare ──
  {
    title: "Skincare & Hand Creams",
    slug: "skincare",
    group: "beauty",
    description: "Soft & Nourished Glow — Hand creams, serums and skincare essentials.",
    image: "/categories/skincare-serums.svg",
  },
  {
    title: "Pencil Perfumes & Fragrance",
    slug: "fragrance",
    group: "beauty",
    description: "Fragrance on the Go — Elegant pocket perfumes and fragrances.",
    image: "/categories/fragrance-glow.svg",
  },
];

export function useNavigationMenu(): MenuItem[] {
  const { data: dbCategories } = useCategories();

  return useMemo(() => {
    // Dynamic grouping into the 3 Major Pillars
    const makeupList: MenuItem[] = [];
    const jewelryList: MenuItem[] = [];
    const beautyList: MenuItem[] = [];

    if (dbCategories && dbCategories.length > 0) {
      dbCategories.forEach((cat) => {
        const slug = (cat.slug || "").toLowerCase();
        const name = (cat.name || "").toLowerCase();
        const item: MenuItem = {
          title: cat.name,
          href: `/collection?category=${getCategorySlug(cat)}`,
        };

        const isJewelry =
          slug.includes("jewel") ||
          slug.includes("silver") ||
          slug.includes("gold") ||
          slug.includes("necklace") ||
          slug.includes("ring") ||
          slug.includes("bracelet") ||
          slug.includes("bangle") ||
          slug.includes("earring") ||
          slug.includes("box") ||
          slug.includes("chain") ||
          slug.includes("anklet") ||
          slug.includes("hair") ||
          slug.includes("set") ||
          name.includes("jewel") ||
          name.includes("ring") ||
          name.includes("earring") ||
          name.includes("necklace") ||
          name.includes("bracelet") ||
          name.includes("bangle") ||
          name.includes("anklet") ||
          name.includes("silver");

        const isBeauty =
          slug.includes("skin") ||
          slug.includes("cream") ||
          slug.includes("serum") ||
          slug.includes("fragrance") ||
          slug.includes("perfume") ||
          name.includes("skin") ||
          name.includes("cream") ||
          name.includes("serum") ||
          name.includes("fragrance") ||
          name.includes("perfume");

        if (isJewelry) {
          jewelryList.push(item);
        } else if (isBeauty) {
          beautyList.push(item);
        } else {
          // Lips, eyes, face, palettes, shades, and cosmetics
          makeupList.push(item);
        }
      });
    } else {
      // Hardcoded fallback list
      ROSHE_ALL_CATEGORIES.forEach((cat) => {
        const item: MenuItem = {
          title: cat.title,
          href: `/collection?category=${cat.slug}`,
        };
        if (cat.group === "jewelry") {
          jewelryList.push(item);
        } else if (cat.group === "beauty") {
          beautyList.push(item);
        } else {
          makeupList.push(item);
        }
      });
    }

    // Recommended Menu Structure with 3 Major Pillars:
    // * Home
    // * Makeup (Major 1)
    // * Jewelry (Major 2)
    // * Beauty & Skincare (Major 3)
    // * New Arrivals
    // * Best Sellers
    // * Sale
    // * Contact Us
    return [
      {
        title: "Home",
        href: "/",
      },
      {
        title: "Makeup",
        href: "/collection?category=makeup",
        children: [
          { title: "All Makeup & Shades", href: "/collection?category=makeup" },
          ...makeupList,
        ],
      },
      {
        title: "Jewelry",
        href: "/collection?category=jewelry",
        children: [
          { title: "All Jewelry & Accessories", href: "/collection?category=jewelry" },
          ...jewelryList,
        ],
      },
      {
        title: "Beauty & Skincare",
        href: "/collection?category=beauty",
        children: [
          { title: "All Beauty & Skincare", href: "/collection?category=beauty" },
          ...beautyList,
        ],
      },
      {
        title: "New Arrivals",
        href: "/collection?tag=new-arrivals",
      },
      {
        title: "Best Sellers",
        href: "/collection?tag=best-sellers",
      },
      {
        title: "Sale",
        href: "/collection?sale=true",
      },
      {
        title: "Contact Us",
        href: "/contact",
      },
    ];
  }, [dbCategories]);
}
