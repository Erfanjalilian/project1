import {
  errorResponse,
  notFoundResponse,
  successResponse,
} from "@/lib/api/response";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const content = await prisma.aboutContent.findFirst();

    if (!content) {
      return notFoundResponse("About content not found");
    }

    return successResponse({
      introduction: content.introduction,
      story: content.story,
      mission: content.mission,
      vision: content.vision,
    });
  } catch (error) {
    console.error("[GET /api/about]", error);
    return errorResponse("Failed to fetch about content");
  }
}
