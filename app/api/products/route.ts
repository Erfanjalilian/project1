import { NextRequest } from "next/server";
import { errorResponse, successResponse, badRequestResponse } from "@/lib/api/response";
import { writeData, readData, generateId } from "@/lib/jsonStore";
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body) return badRequestResponse("Missing request body");

    const products = await readData<any[]>("products.json", []);
    const id = generateId();
    const now = new Date().toISOString();
    const newProduct = { ...body, id, createdAt: now, updatedAt: now };
    products.push(newProduct);
    await writeData("products.json", products);

    return successResponse(newProduct, "Product created", 201);
  } catch (error) {
    console.error("[POST /api/products]", error);
    return errorResponse("Failed to create product");
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body?.id) return badRequestResponse("Missing product id");

    const products = await readData<any[]>("products.json", []);
    const idx = products.findIndex((p) => p.id === body.id);
    if (idx === -1) return badRequestResponse("Product not found");

    const updated = { ...products[idx], ...body, updatedAt: new Date().toISOString() };
    products[idx] = updated;
    await writeData("products.json", products);

    return successResponse(updated, "Product updated");
  } catch (error) {
    console.error("[PUT /api/products]", error);
    return errorResponse("Failed to update product");
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body?.id) return badRequestResponse("Missing product id");

    const products = await readData<any[]>("products.json", []);
    const filtered = products.filter((p) => p.id !== body.id);
    await writeData("products.json", filtered);

    return successResponse({ id: body.id }, "Product deleted");
  } catch (error) {
    console.error("[DELETE /api/products]", error);
    return errorResponse("Failed to delete product");
  }
}
