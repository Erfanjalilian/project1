import { errorResponse, successResponse, badRequestResponse } from "@/lib/api/response";
import { readData, writeData, generateId } from "@/lib/jsonStore";

export async function GET() {
  try {
    const members = await readData<any[]>("team.json", []);
    const sorted = members.sort((a, b) => (a.order || 0) - (b.order || 0));
    return successResponse(sorted);
  } catch (error) {
    console.error("[GET /api/team]", error);
    return errorResponse("Failed to fetch team members");
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body?.name) return badRequestResponse("Missing member name");

    const members = await readData<any[]>("team.json", []);
    const id = generateId();
    const order = body.order ?? (members.length + 1);
    const newMember = { id, ...body, order };
    members.push(newMember);
    await writeData("team.json", members);

    return successResponse(newMember, "Team member created", 201);
  } catch (err) {
    console.error("[POST /api/team]", err);
    return errorResponse("Failed to create team member");
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body?.id) return badRequestResponse("Missing member id");

    const members = await readData<any[]>("team.json", []);
    const idx = members.findIndex((m) => m.id === body.id);
    if (idx === -1) return badRequestResponse("Team member not found");

    members[idx] = { ...members[idx], ...body };
    await writeData("team.json", members);

    return successResponse(members[idx], "Team member updated");
  } catch (err) {
    console.error("[PUT /api/team]", err);
    return errorResponse("Failed to update team member");
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    if (!body?.id) return badRequestResponse("Missing member id");

    const members = await readData<any[]>("team.json", []);
    const filtered = members.filter((m) => m.id !== body.id);
    await writeData("team.json", filtered);

    return successResponse({ id: body.id }, "Team member deleted");
  } catch (err) {
    console.error("[DELETE /api/team]", err);
    return errorResponse("Failed to delete team member");
  }
}
