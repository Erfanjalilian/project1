import {
  errorResponse,
  notFoundResponse,
  successResponse,
  badRequestResponse,
} from "@/lib/api/response";
import { readData, writeData } from "@/lib/jsonStore";

export async function GET() {
  try {
    const content = await readData<any>("about.json", null as any);

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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body) return badRequestResponse("Missing request body");

    await writeData("about.json", body);
    return successResponse(body, "About content saved", 201);
  } catch (err) {
    console.error("[POST /api/about]", err);
    return errorResponse("Failed to save about content");
  }
}

export async function DELETE() {
  try {
    await writeData("about.json", null as any);
    return successResponse(null, "About content deleted");
  } catch (err) {
    console.error("[DELETE /api/about]", err);
    return errorResponse("Failed to delete about content");
  }
}
