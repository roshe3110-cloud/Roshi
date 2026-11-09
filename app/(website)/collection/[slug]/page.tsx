import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductDetailsPage from "@/components/detailspage/ProductDetailsPage";
import {
  getProductBySlug,
  getRelatedProducts,
  getProducts,
  Product,
} from "@/services/product.service";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

function formatProduct(product: Product) {
  const sortedImages =
    product.product_images && product.product_images.length > 0
      ? product.product_images
          .sort((a, b) => a.position - b.position)
          .map((img) => ({
            id: img.id,
            url: img.image_url,
            alt: product.name,
          }))
      : [
          {
            id: "placeholder",
            url: "/placeholder.svg",
            alt: product.name,
          },
        ];

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    oldPrice: product.compare_at_price || undefined,
    description: product.description || "",
    rating: 4.8,
    reviews: 124,
    stock: product.stock,
    images: sortedImages,
  };
}

async function fetchRelated(
  categoryId: string | null | undefined,
  currentProductId: string
) {
  try {
    let related: Product[] = [];
    if (categoryId) {
      related = await getRelatedProducts(categoryId, currentProductId);
    }

    if (related.length < 4) {
      const allActive = await getProducts();
      const extras = allActive.filter(
        (p) => p.id !== currentProductId && !related.some((r) => r.id === p.id)
      );
      related = [...related, ...extras].slice(0, 4);
    }

    return related.map((p) => {
      const sortedImgs = (p.product_images || []).sort(
        (a, b) => a.position - b.position
      );
      return {
        id: p.id,
        slug: p.slug,
        name: p.name,
        image: sortedImgs[0]?.image_url || "/placeholder.svg",
        price: p.price,
        oldPrice: p.compare_at_price || undefined,
        rating: 4.8,
      };
    });
  } catch (err) {
    console.error("Error fetching related products:", err);
    return [];
  }
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const rawProduct = await getProductBySlug(slug);

  if (!rawProduct) {
    return {
      title: "Product Not Found | ROSHÉ BEAUTY",
    };
  }

  const product = formatProduct(rawProduct);

  return {
    title: `${product.name} | ROSHÉ BEAUTY`,
    description: product.description,
    openGraph: {
      title: `${product.name} | ROSHÉ BEAUTY`,
      description: product.description,
      images: [
        {
          url: product.images[0].url,
        },
      ],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const rawProduct = await getProductBySlug(slug);

  if (!rawProduct) {
    notFound();
  }

  const product = formatProduct(rawProduct);
  const relatedProducts = await fetchRelated(
    rawProduct.category_id,
    rawProduct.id
  );

  return (
    <ProductDetailsPage
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}

