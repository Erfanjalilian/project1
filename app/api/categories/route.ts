import { errorResponse, successResponse, badRequestResponse } from "@/lib/api/response";
import { readData, writeData, generateId } from "@/lib/jsonStore";

export async function GET() {
  try {
    const categories = await readData<any[]>("categories.json", []);
    const sorted = categories
      .map((c) => ({ id: c.id, name: c.name, slug: c.slug }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return successResponse(sorted);
  } catch (error) {
    console.error("[GET /api/categories]", error);
    return errorResponse("Failed to fetch categories");
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body?.name) return badRequestResponse("Missing category name");

    const categories = await readData<any[]>("categories.json", []);
    const id = generateId();
    const newCat = { id, name: body.name, slug: body.slug ?? body.name.toLowerCase().replace(/\s+/g, "-") };
    categories.push(newCat);
    await writeData("categories.json", categories);

    return successResponse(newCat, "Category created", 201);
  } catch (err) {
    console.error("[POST /api/categories]", err);
    return errorResponse("Failed to create category");
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body?.id) return badRequestResponse("Missing category id");

    const categories = await readData<any[]>("categories.json", []);
    const idx = categories.findIndex((c) => c.id === body.id);
    if (idx === -1) return badRequestResponse("Category not found");

    categories[idx] = { ...categories[idx], ...body };
    await writeData("categories.json", categories);

    return successResponse(categories[idx], "Category updated");
  } catch (err) {
    console.error("[PUT /api/categories]", err);
    return errorResponse("Failed to update category");
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    if (!body?.id) return badRequestResponse("Missing category id");

    const categories = await readData<any[]>("categories.json", []);
    const filtered = categories.filter((c) => c.id !== body.id);
    await writeData("categories.json", filtered);

    return successResponse({ id: body.id }, "Category deleted");
  } catch (err) {
    console.error("[DELETE /api/categories]", err);
    return errorResponse("Failed to delete category");
  }
}
