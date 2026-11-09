export interface Product {
  id: string | number;
  slug: string;
  name: string;
  image: string;
  price: number;
  oldPrice?: number | null;
  sale?: boolean;
}
