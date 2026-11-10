import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getCategoryBySlug } from "@/services/category.service";

interface Props {
  params: Promise<{
    slug: string[];
  }>;
  searchParams: Promise<{
    category?: string;
    min?: string;
    max?: string;
    page?: string;
    search?: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const rawSlug = slug[slug.length - 1];
  let title = rawSlug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  try {
    const cat = await getCategoryBySlug(rawSlug);
    if (cat?.name) {
      title = cat.name;
    }
  } catch {
    // fallback
  }

  const categorySlug = slug.join("/");

  return {
    title: `${title} - Collection | ROSHÉ BEAUTY & JEWELRY`,
    description: `Shop ${title} at ROSHÉ BEAUTY & JEWELRY. Explore luxury skincare, radiant cosmetics, and 18K gold-plated waterproof jewelry.`,
    alternates: {
      canonical: `/product-category/${categorySlug}`,
    },
  };
}

export default async function ProductCategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const rawSlug = slug[slug.length - 1];
  const sp = await searchParams;

  let categoryId = sp.category;

  if (!categoryId) {
    try {
      const cat = await getCategoryBySlug(rawSlug);
      if (cat?.id) {
        categoryId = cat.id;
      }
    } catch {
      // fallback
    }
  }

  const query = new URLSearchParams();
  if (categoryId) {
    query.set("category", categoryId);
  }
  if (sp.min) query.set("min", sp.min);
  if (sp.max) query.set("max", sp.max);
  if (sp.page) query.set("page", sp.page);
  if (sp.search) query.set("search", sp.search);

  const queryString = query.toString();
  redirect(`/collection${queryString ? `?${queryString}` : ""}`);
}
