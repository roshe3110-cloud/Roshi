import { FormField } from "./Form";

export const categoryFields: FormField[] = [
  {
    name: "name",
    label: "Category Name",
    type: "text",
    required: true,
    placeholder: "e.g. Skincare & Serums, Luxury Cosmetics",
  },
  {
    name: "slug",
    label: "Slug",
    type: "text",
    required: true,
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
  },
  {
    name: "image_url",
    label: "Category Image",
    type: "image",
    bucket: "category-images",
    folder: "categories",
  },
  {
    name: "sort_order",
    label: "Sort Order",
    type: "number",
  },
  {
    name: "is_active",
    label: "Active",
    type: "switch",
  },
];

export const productFields: FormField[] = [
  {
    name: "name",
    label: "Product Name",
    type: "text",
    required: true,
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
  },
  {
    name: "price",
    label: "Price (PKR)",
    type: "number",
    required: true,
  },
  {
    name: "compare_at_price",
    label: "Compare at Price (Original Price)",
    type: "number",
  },
  {
    name: "stock",
    label: "Stock Quantity",
    type: "number",
    required: true,
  },
  {
    name: "category_id",
    label: "Category",
    type: "select",
    required: true,
    options: [], // populated dynamically
  },
  {
    name: "is_featured",
    label: "Featured Product (Spotlight on Homepage)",
    type: "switch",
  },
  {
    name: "is_upcoming",
    label: "Upcoming Project / Coming Soon Sneak Peek",
    type: "switch",
  },
  {
    name: "featured_sort_order",
    label: "Featured Priority (0 = default)",
    type: "number",
  },
  {
    name: "image",
    label: "Images (Max 4, auto-converted to WebP — Replace/Delete anytime)",
    type: "image",
    bucket: "product-images",
    folder: "products",
    multiple: true,
    maxFiles: 4,
  },
];
