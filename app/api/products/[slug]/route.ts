import { NextRequest } from "next/server";
import {
  errorResponse,
  notFoundResponse,
  successResponse,
} from "@/lib/api/response";
import { getProductBySlug, getRelatedProducts } from "@/lib/api/products";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const product = await getProductBySlug(slug);

    if (!product) {
      return notFoundResponse("Product not found");
    }

    const includeRelated = request.nextUrl.searchParams.get("related") === "true";

    if (includeRelated) {
      const relatedProducts = await getRelatedProducts(
        product.id,
        product.category.id,
      );
      return successResponse({ product, relatedProducts });
    }

    return successResponse(product);
  } catch (error) {
    console.error("[GET /api/products/[slug]]", error);
    return errorResponse("Failed to fetch product");
  }
}
