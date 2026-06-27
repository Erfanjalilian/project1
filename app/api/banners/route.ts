import { errorResponse, successResponse, badRequestResponse } from "@/lib/api/response";
import { readData, writeData, generateId } from "@/lib/jsonStore";

export async function GET() {
  try {
    const banners = await readData<any[]>("banners.json", []);
    const active = banners.filter((b) => b.isActive).sort((a, b) => (a.order || 0) - (b.order || 0));
    return successResponse(active);
  } catch (error) {
    console.error("[GET /api/banners]", error);
    return errorResponse("Failed to fetch banners");
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body?.title) return badRequestResponse("Missing banner title");

    const banners = await readData<any[]>("banners.json", []);
    const id = generateId();
    const order = body.order ?? (banners.length + 1);
    const newBanner = { id, ...body, order };
    banners.push(newBanner);
    await writeData("banners.json", banners);

    return successResponse(newBanner, "Banner created", 201);
  } catch (err) {
    console.error("[POST /api/banners]", err);
    return errorResponse("Failed to create banner");
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body?.id) return badRequestResponse("Missing banner id");

    const banners = await readData<any[]>("banners.json", []);
    const idx = banners.findIndex((b) => b.id === body.id);
    if (idx === -1) return badRequestResponse("Banner not found");

    banners[idx] = { ...banners[idx], ...body };
    await writeData("banners.json", banners);

    return successResponse(banners[idx], "Banner updated");
  } catch (err) {
    console.error("[PUT /api/banners]", err);
    return errorResponse("Failed to update banner");
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    if (!body?.id) return badRequestResponse("Missing banner id");

    const banners = await readData<any[]>("banners.json", []);
    const filtered = banners.filter((b) => b.id !== body.id);
    await writeData("banners.json", filtered);

    return successResponse({ id: body.id }, "Banner deleted");
  } catch (err) {
    console.error("[DELETE /api/banners]", err);
    return errorResponse("Failed to delete banner");
  }
}
