import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://roshebeauty.com";

  const staticRoutes = [
    "",
    "/collection",
    "/about",
    "/contact",
    "/privacy-policy",
    "/shipping-policy",
    "/refund-policy",
    "/terms-of-service",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  const categoryRoutes = [
    "skincare-serums",
    "luxury-cosmetics",
    "lip-eye-care",
    "fragrance-glow",
  ].map((slug) => ({
    url: `${baseUrl}/product-category/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const tagRoutes = [
    "luxury-skincare",
    "face-serums",
    "velvet-lipstick",
    "radiant-glow",
    "botanical-beauty",
    "clean-cosmetics",
  ].map((slug) => ({
    url: `${baseUrl}/product-tag/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...categoryRoutes, ...tagRoutes];
}
