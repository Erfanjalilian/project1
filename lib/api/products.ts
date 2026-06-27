import { readData } from "@/lib/jsonStore";
import {
  serializeProduct,
  serializeProductSummary,
} from "@/lib/api/serializers";
import type { ProductFilters } from "@/types/product";

// productInclude removed: using JSON file storage instead of Prisma

export function parseProductFilters(searchParams: URLSearchParams): ProductFilters {
  return {
    search: searchParams.get("search") ?? undefined,
    brand: searchParams.get("brand") ?? undefined,
    minPrice: searchParams.get("minPrice")
      ? Number(searchParams.get("minPrice"))
      : undefined,
    maxPrice: searchParams.get("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : undefined,
    bestSelling: searchParams.get("bestSelling") === "true",
    highestDiscount: searchParams.get("highestDiscount") === "true",
    sort: (searchParams.get("sort") as ProductFilters["sort"]) ?? undefined,
    page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
    limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : 12,
  };
}

export async function getProducts(filters: ProductFilters) {
  const page = Math.max(filters.page ?? 1, 1);
  const limit = Math.min(Math.max(filters.limit ?? 12, 1), 48);
  const skip = (page - 1) * limit;
  // Read products from JSON store
  const products = await readData<any[]>("products.json", []);

  let results = products.slice();

  if (filters.search) {
    const q = filters.search.toLowerCase();
    results = results.filter(
      (p) =>
        String(p.name).toLowerCase().includes(q) ||
        String(p.description).toLowerCase().includes(q),
    );
  }

  if (filters.brand) {
    results = results.filter((p) => p.brand?.slug === filters.brand);
  }

  if (filters.minPrice !== undefined) {
    results = results.filter((p) => p.price >= filters.minPrice!);
  }

  if (filters.maxPrice !== undefined) {
    results = results.filter((p) => p.price <= filters.maxPrice!);
  }

  if (filters.bestSelling) {
    results = results.filter((p) => p.isBestSeller === true);
  }

  switch (filters.sort) {
    case "price-asc":
      results.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      results.sort((a, b) => b.price - a.price);
      break;
    case "discount":
      results.sort((a, b) => b.discountPercent - a.discountPercent);
      break;
    case "bestselling":
      results.sort((a, b) => (b.isBestSeller === true ? 1 : 0) - (a.isBestSeller === true ? 1 : 0));
      break;
    case "newest":
    default:
      if (filters.highestDiscount) {
        results.sort((a, b) => b.discountPercent - a.discountPercent);
      } else {
        results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
      break;
  }

  const total = results.length;
  const paginated = results.slice(skip, skip + limit);

  return {
    products: paginated.map(serializeProductSummary),
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    },
  };
}

export async function getProductBySlug(slug: string) {
  const products = await readData<any[]>("products.json", []);
  const product = products.find((p) => p.slug === slug);

  return product ? serializeProduct(product) : null;
}

export async function getRelatedProducts(
  productId: string,
  categoryId: string,
  limit = 4,
) {
  const products = await readData<any[]>("products.json", []);
  const results = products
    .filter((p) => p.category?.id === categoryId && p.id !== productId)
    .sort((a, b) => (b.isBestSeller === true ? 1 : 0) - (a.isBestSeller === true ? 1 : 0))
    .slice(0, limit);

  return results.map(serializeProductSummary);
}

export async function getBestSellers(limit = 8) {
  const products = await readData<any[]>("products.json", []);
  return products
    .filter((p) => p.isBestSeller === true)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit)
    .map(serializeProductSummary);
}

export async function getNewArrivals(limit = 8) {
  const products = await readData<any[]>("products.json", []);
  return products
    .filter((p) => p.isNewArrival === true)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit)
    .map(serializeProductSummary);
}

export async function getDiscountedProducts(limit = 8) {
  const products = await readData<any[]>("products.json", []);
  return products
    .filter((p) => Number(p.discountPercent) > 0)
    .sort((a, b) => b.discountPercent - a.discountPercent)
    .slice(0, limit)
    .map(serializeProductSummary);
}

export async function getFeaturedProducts(limit = 8) {
  const products = await readData<any[]>("products.json", []);
  return products
    .filter((p) => p.isFeatured === true)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit)
    .map(serializeProductSummary);
}
