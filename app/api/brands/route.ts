import { errorResponse, successResponse, badRequestResponse } from "@/lib/api/response";
import { readData, writeData, generateId } from "@/lib/jsonStore";

export async function GET() {
  try {
    const brands = await readData<any[]>("brands.json", []);
    const sorted = brands
      .map((b) => ({ id: b.id, name: b.name, slug: b.slug }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return successResponse(sorted);
  } catch (error) {
    console.error("[GET /api/brands]", error);
    return errorResponse("Failed to fetch brands");
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body?.name) return badRequestResponse("Missing brand name");

    const brands = await readData<any[]>("brands.json", []);
    const id = generateId();
    const newBrand = { id, name: body.name, slug: body.slug ?? body.name.toLowerCase().replace(/\s+/g, "-") };
    brands.push(newBrand);
    await writeData("brands.json", brands);

    return successResponse(newBrand, "Brand created", 201);
  } catch (err) {
    console.error("[POST /api/brands]", err);
    return errorResponse("Failed to create brand");
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body?.id) return badRequestResponse("Missing brand id");

    const brands = await readData<any[]>("brands.json", []);
    const idx = brands.findIndex((b) => b.id === body.id);
    if (idx === -1) return badRequestResponse("Brand not found");

    brands[idx] = { ...brands[idx], ...body };
    await writeData("brands.json", brands);

    return successResponse(brands[idx], "Brand updated");
  } catch (err) {
    console.error("[PUT /api/brands]", err);
    return errorResponse("Failed to update brand");
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    if (!body?.id) return badRequestResponse("Missing brand id");

    const brands = await readData<any[]>("brands.json", []);
    const filtered = brands.filter((b) => b.id !== body.id);
    await writeData("brands.json", filtered);

    return successResponse({ id: body.id }, "Brand deleted");
  } catch (err) {
    console.error("[DELETE /api/brands]", err);
    return errorResponse("Failed to delete brand");
  }
}
