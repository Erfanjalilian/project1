import { errorResponse, successResponse } from "@/lib/api/response";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });

    return successResponse(banners);
  } catch (error) {
    console.error("[GET /api/banners]", error);
    return errorResponse("Failed to fetch banners");
  }
}
