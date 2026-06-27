import type { Product } from "@/types/product";

type PrismaProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPercent: number;
  isBestSeller: boolean;
  isNewArrival: boolean;
  isFeatured: boolean;
  stock: number;
  brand: { id: string; name: string; slug: string };
  category: { id: string; name: string; slug: string };
  images: Array<{ id: string; url: string; alt: string; order: number }>;
  colors: Array<{ id: string; name: string; hex: string }>;
  sizes: Array<{ id: string; name: string }>;
  createdAt: Date;
  updatedAt: Date;
};

export function serializeProduct(product: PrismaProduct): Product {
  return {
    ...product,
    createdAt:
      typeof product.createdAt === "string"
        ? product.createdAt
        : product.createdAt.toISOString(),
    updatedAt:
      typeof product.updatedAt === "string"
        ? product.updatedAt
        : product.updatedAt.toISOString(),
  };
}

export function serializeProductSummary(product: PrismaProduct) {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    discountPercent: product.discountPercent,
    isBestSeller: product.isBestSeller,
    isNewArrival: product.isNewArrival,
    isFeatured: product.isFeatured,
    brand: product.brand,
    category: product.category,
    images: product.images,
  };
}
