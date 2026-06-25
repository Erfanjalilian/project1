import { errorResponse, successResponse } from "@/lib/api/response";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true },
    });

    return successResponse(brands);
  } catch (error) {
    console.error("[GET /api/brands]", error);
    return errorResponse("Failed to fetch brands");
  }
}
