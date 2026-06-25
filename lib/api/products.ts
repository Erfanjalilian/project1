import type { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import {
  serializeProduct,
  serializeProductSummary,
} from "@/lib/api/serializers";
import type { ProductFilters } from "@/types/product";

const productInclude = {
  brand: true,
  category: true,
  images: { orderBy: { order: "asc" as const } },
  colors: true,
  sizes: true,
} satisfies Prisma.ProductInclude;

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

  const where: Prisma.ProductWhereInput = {};

  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search } },
      { description: { contains: filters.search } },
    ];
  }

  if (filters.brand) {
    where.brand = { slug: filters.brand };
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.price = {
      ...(filters.minPrice !== undefined ? { gte: filters.minPrice } : {}),
      ...(filters.maxPrice !== undefined ? { lte: filters.maxPrice } : {}),
    };
  }

  if (filters.bestSelling) {
    where.isBestSeller = true;
  }

  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };

  switch (filters.sort) {
    case "price-asc":
      orderBy = { price: "asc" };
      break;
    case "price-desc":
      orderBy = { price: "desc" };
      break;
    case "discount":
      orderBy = { discountPercent: "desc" };
      break;
    case "bestselling":
      orderBy = { isBestSeller: "desc" };
      break;
    case "newest":
    default:
      if (filters.highestDiscount) {
        orderBy = { discountPercent: "desc" };
      } else {
        orderBy = { createdAt: "desc" };
      }
      break;
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: productInclude,
      orderBy,
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products: products.map(serializeProductSummary),
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
  const product = await prisma.product.findUnique({
    where: { slug },
    include: productInclude,
  });

  return product ? serializeProduct(product) : null;
}

export async function getRelatedProducts(
  productId: string,
  categoryId: string,
  limit = 4,
) {
  const products = await prisma.product.findMany({
    where: {
      categoryId,
      NOT: { id: productId },
    },
    include: productInclude,
    orderBy: { isBestSeller: "desc" },
    take: limit,
  });

  return products.map(serializeProductSummary);
}

export async function getBestSellers(limit = 8) {
  const products = await prisma.product.findMany({
    where: { isBestSeller: true },
    include: productInclude,
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return products.map(serializeProductSummary);
}

export async function getNewArrivals(limit = 8) {
  const products = await prisma.product.findMany({
    where: { isNewArrival: true },
    include: productInclude,
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return products.map(serializeProductSummary);
}

export async function getDiscountedProducts(limit = 8) {
  const products = await prisma.product.findMany({
    where: { discountPercent: { gt: 0 } },
    include: productInclude,
    orderBy: { discountPercent: "desc" },
    take: limit,
  });

  return products.map(serializeProductSummary);
}

export async function getFeaturedProducts(limit = 8) {
  const products = await prisma.product.findMany({
    where: { isFeatured: true },
    include: productInclude,
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return products.map(serializeProductSummary);
}
