import { errorResponse, successResponse } from "@/lib/api/response";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true },
    });

    return successResponse(categories);
  } catch (error) {
    console.error("[GET /api/categories]", error);
    return errorResponse("Failed to fetch categories");
  }
}
