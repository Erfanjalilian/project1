import { NextRequest } from "next/server";
import { errorResponse, successResponse } from "@/lib/api/response";
import {
  getBestSellers,
  getDiscountedProducts,
  getFeaturedProducts,
  getNewArrivals,
  getProducts,
  parseProductFilters,
} from "@/lib/api/products";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = parseProductFilters(searchParams);
    const section = searchParams.get("section");

    if (section === "best-sellers") {
      const limit = Number(searchParams.get("limit") ?? 8);
      return successResponse(await getBestSellers(limit));
    }

    if (section === "new-arrivals") {
      const limit = Number(searchParams.get("limit") ?? 8);
      return successResponse(await getNewArrivals(limit));
    }

    if (section === "discounts") {
      const limit = Number(searchParams.get("limit") ?? 8);
      return successResponse(await getDiscountedProducts(limit));
    }

    if (section === "featured") {
      const limit = Number(searchParams.get("limit") ?? 8);
      return successResponse(await getFeaturedProducts(limit));
    }

    const result = await getProducts(filters);

    return Response.json({
      success: true,
      message: "Products fetched successfully",
      data: result.products,
      meta: result.meta,
    });
  } catch (error) {
    console.error("[GET /api/products]", error);
    return errorResponse("Failed to fetch products");
  }
}
