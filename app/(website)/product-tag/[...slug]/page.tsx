import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getCategories } from "@/services/category.service";

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
  const tagSlug = slug.join("/");
  const title = tagSlug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    title: `${title} - Tag | The 960 Club`,
    description: `Browse items tagged with ${title} at The 960 Club. Premium waterproof stainless steel jewelry and accessories.`,
    alternates: {
      canonical: `/product-tag/${tagSlug}`,
    },
  };
}

export default async function ProductTagPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const tagSlug = slug[slug.length - 1];
  const sp = await searchParams;

  const query = new URLSearchParams();

  // Try to match tag words (e.g. "luxury-bracelet" or "mens-bracelet") to a category ID
  const tagWords = tagSlug.split("-").map((w) => w.toLowerCase());
  let matchedCategoryId: string | null = null;

  try {
    const categories = await getCategories();
    for (const cat of categories) {
      const catName = cat.name.toLowerCase();
      const catSlug = cat.slug.toLowerCase();

      // Check if tag slug matches category slug/name
      if (
        tagWords.some((word) => catName.includes(word) || catSlug.includes(word)) ||
        catName.split(" ").some((word) => tagSlug.toLowerCase().includes(word))
      ) {
        matchedCategoryId = cat.id;
        break;
      }
    }
  } catch {
    // fallback
  }

  if (matchedCategoryId) {
    query.set("category", matchedCategoryId);
  } else {
    const searchTerm = sp.search || tagSlug.replace(/-/g, " ");
    query.set("search", searchTerm);
  }

  if (sp.min) query.set("min", sp.min);
  if (sp.max) query.set("max", sp.max);
  if (sp.page) query.set("page", sp.page);

  redirect(`/collection?${query.toString()}`);
}
