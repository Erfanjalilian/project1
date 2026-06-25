import { errorResponse, successResponse } from "@/lib/api/response";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const members = await prisma.teamMember.findMany({
      orderBy: { order: "asc" },
    });

    return successResponse(members);
  } catch (error) {
    console.error("[GET /api/team]", error);
    return errorResponse("Failed to fetch team members");
  }
}
