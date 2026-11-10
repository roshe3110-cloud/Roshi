import type { Metadata } from "next";
import { Suspense } from "react";
import CollectionFilters from "./ReusableFilter";
import { Sparkles } from "lucide-react";

import { getFilteredProducts, Product } from "@/services/product.service";
import ProductCardWithCart from "./ProductCardWithCart";

export const revalidate = 60;

export function generateStaticParams() {
  return [];
}

export const metadata: Metadata = {
  title: "Beauty & Jewelry Collection | ROSHÉ BEAUTY & JEWELRY",
  description:
    "Browse our full collection of luxury skincare, velvet matte cosmetics, and 18K gold-plated waterproof fine jewelry. Free nationwide shipping across Pakistan.",
  alternates: { canonical: "/collection" },
  openGraph: {
    url: "/collection",
    title: "Beauty & Jewelry Collection | ROSHÉ BEAUTY & JEWELRY",
    description:
      "Browse premium luxury skincare, cosmetics, and 18K gold-plated waterproof jewelry at ROSHÉ BEAUTY & JEWELRY.",
  },
};

interface Props {
  searchParams: Promise<{
    category?: string;
    min?: string;
    max?: string;
    page?: string;
    search?: string;
    sale?: string;
    tag?: string;
  }>;
}

const PRODUCTS_PER_PAGE = 12;

const fallbackCollectionPlaceholder = [
  {
    id: "fb-col-1",
    slug: "radiant-vitamin-c-glow-serum",
    name: "Radiant Rose Gold Vitamin C Glow Serum 30ml",
    image: "/categories/skincare-serums.svg",
    price: 4850,
    oldPrice: 5500,
    sale: true,
  },
  {
    id: "fb-col-2",
    slug: "18k-gold-plated-waterproof-herringbone-necklace",
    name: "18K Gold-Plated Waterproof Herringbone Snake Chain",
    image: "/categories/fine-jewelry.svg",
    price: 3650,
    oldPrice: 4200,
    sale: true,
  },
  {
    id: "fb-col-3",
    slug: "velvet-matte-luxe-lipstick",
    name: "Velvet Matte Luxe Hydrating Lipstick — Rose Nude",
    image: "/categories/lip-eye-care.svg",
    price: 2950,
    oldPrice: 3500,
    sale: false,
  },
  {
    id: "fb-col-4",
    slug: "sparkling-zirconia-eternity-band-ring",
    name: "Sparkling Zirconia Waterproof Eternity Band (18K PVD)",
    image: "/categories/fine-jewelry.svg",
    price: 2850,
    oldPrice: 3400,
    sale: true,
  },
  {
    id: "fb-col-5",
    slug: "silver-simple-keepsake-jewelry-box",
    name: "ROSHÉ Silver Simple Keepsake Travel Jewelry Box",
    image: "/categories/jewelry-boxes.svg",
    price: 3200,
    oldPrice: 3800,
    sale: true,
  },
  {
    id: "fb-col-6",
    slug: "botanical-barrier-restoration-cream",
    name: "Botanical Barrier Deep Restoration Moisture Cream",
    image: "/categories/skincare-serums.svg",
    price: 3800,
    oldPrice: 4400,
    sale: false,
  },
  {
    id: "fb-col-7",
    slug: "roman-numeral-waterproof-cuff-bangle",
    name: "Roman Dial Minimalist Waterproof Cuff Bangle (Gold)",
    image: "/categories/fine-jewelry.svg",
    price: 4200,
    oldPrice: 4950,
    sale: true,
  },
  {
    id: "fb-col-8",
    slug: "matte-lip-gloss-velvet-rose",
    name: "Soft Matte Liquid Lip Gloss — Velvet Rose",
    image: "/categories/lip-eye-care.svg",
    price: 2450,
    oldPrice: 2900,
    sale: true,
  },
  {
    id: "fb-col-9",
    slug: "precision-waterproof-eyeliner",
    name: "Precision Jet-Black Waterproof Liquid Eyeliner",
    image: "/categories/luxury-cosmetics.svg",
    price: 2100,
    oldPrice: 2500,
    sale: false,
  },
];

// ── Filter skeleton shown while CollectionFilters hydrates ────────────────────
function FilterSkeleton() {
  return (
    <div className="w-full animate-pulse space-y-4">
      <div className="flex gap-2 overflow-hidden py-1">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-9 w-24 rounded-full bg-[#EBD5C5]/60 shrink-0" />
        ))}
      </div>
      <div className="h-14 rounded-2xl bg-white/70 border border-[#D4A45E]/20" />
    </div>
  );
}

export default async function CollectionPage({ searchParams }: Props) {
  const params = await searchParams;
  const category = params.category;
  const minPrice = Number(params.min) || undefined;
  const maxPrice = Number(params.max) || undefined;
  const page = Number(params.page) || 1;
  const search = params.search;
  const isSale = params.sale === "true";
  const tag = params.tag;

  let filteredData: {
    products: Product[];
    total: number | null;
    page: number;
    limit: number;
  } = { products: [], total: 0, page, limit: PRODUCTS_PER_PAGE };

  try {
    filteredData = await getFilteredProducts({
      category_id: category,
      min_price: minPrice,
      max_price: maxPrice,
      search,
      page,
      limit: PRODUCTS_PER_PAGE,
      sale: isSale,
      tag,
    });
  } catch {
    // ignore error in server component context
  }

  const mappedProducts = filteredData.products.map((p: Product) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    image: p.product_images?.[0]?.image_url || "/placeholder.svg",
    price: p.price,
    oldPrice: p.compare_at_price || undefined,
    sale: p.compare_at_price ? p.compare_at_price > p.price : false,
  }));

  const hasFilter = Boolean(category || search || minPrice || maxPrice || isSale || tag);
  const displayedProducts =
    mappedProducts.length > 0
      ? mappedProducts
      : hasFilter
        ? []
        : fallbackCollectionPlaceholder;

  const totalCount =
    filteredData.total != null && filteredData.total > 0
      ? filteredData.total
      : displayedProducts.length;

  const totalPages = Math.ceil(totalCount / PRODUCTS_PER_PAGE);

  const paginationBase = [
    category ? `category=${category}` : "",
    minPrice ? `min=${minPrice}` : "",
    maxPrice ? `max=${maxPrice}` : "",
    search ? `search=${encodeURIComponent(search)}` : "",
    isSale ? "sale=true" : "",
    tag ? `tag=${encodeURIComponent(tag)}` : "",
  ]
    .filter(Boolean)
    .join("&");

  return (
    <div className="w-full overflow-x-hidden">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ── Page heading ─────────────────────────────────────────────── */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-[#D4A45E]/20 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-[#F4DCD8] text-[#704638] border border-[#D4A45E]/30 mb-2 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#D4A45E]" />
              <span>Curated Beauty & Jewelry Catalog</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-[#704638]">
              The Collection
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-[#8C5E50]">
              Discover radiant skincare formulations, velvet pigments, and 18K gold-plated waterproof fine jewelry.
            </p>
          </div>

          {totalCount > 0 && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#D4A45E]/30 text-xs font-mono font-semibold text-[#704638] shadow-xs">
              <span className="h-2 w-2 rounded-full bg-[#D4A45E] animate-pulse" />
              <span>
                {totalCount} {totalCount === 1 ? "Product" : "Products"} Available
              </span>
            </div>
          )}
        </div>

        {/* ── Top Filters Bar ───────────────────────────────────────────── */}
        <div className="mb-8 w-full">
          <Suspense fallback={<FilterSkeleton />}>
            <CollectionFilters />
          </Suspense>
        </div>

        {/* ── Full Width Products Grid ─────────────────────────────────── */}
        <div className="w-full">
          {displayedProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-2 gap-3.5 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
                {displayedProducts.map((product) => (
                  <ProductCardWithCart
                    key={String(product.id)}
                    product={product}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <nav
                  aria-label="Pagination"
                  className="mt-12 flex flex-wrap justify-center gap-2"
                >
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const pageNum = i + 1;
                    const href = `/collection?page=${pageNum}${paginationBase ? `&${paginationBase}` : ""}`;
                    return (
                      <a
                        key={pageNum}
                        href={href}
                        aria-label={`Page ${pageNum}`}
                        aria-current={page === pageNum ? "page" : undefined}
                        className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold transition-all duration-200 shadow-sm ${
                          page === pageNum
                            ? "bg-[#704638] text-white border border-[#D4A45E] shadow-md shadow-[#704638]/20"
                            : "border border-[#D4A45E]/30 bg-white text-[#704638] hover:border-[#D4A45E] hover:bg-[#F4DCD8]/30"
                        }`}
                      >
                        {pageNum}
                      </a>
                    );
                  })}
                </nav>
              )}
            </>
          ) : (
            <div className="rounded-3xl border border-[#D4A45E]/30 bg-white p-8 sm:p-14 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F4DCD8] text-[#704638]">
                <Sparkles className="h-8 w-8 text-[#D4A45E]" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-[#704638]">
                No Products Found
              </h3>
              <p className="mx-auto max-w-sm text-sm text-[#8C5E50] mb-6">
                We couldn&apos;t find any beauty or jewelry items matching your selection. Try selecting a different category or clearing your search.
              </p>
              <a
                href="/collection"
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#704638] text-white hover:bg-[#D4A45E] hover:text-[#704638] transition-colors shadow-sm"
              >
                View All Products
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
