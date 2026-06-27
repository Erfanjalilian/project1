import {
  errorResponse,
  notFoundResponse,
  successResponse,
  badRequestResponse,
} from "@/lib/api/response";
import { readData, writeData } from "@/lib/jsonStore";

export async function GET() {
  try {
    const contact = await readData<any>("contact.json", null as any);

    if (!contact) {
      return notFoundResponse("Contact information not found");
    }

    return successResponse({
      officeAddress: contact.officeAddress,
      telephone: contact.telephone,
      mobile: contact.mobile,
      email: contact.email,
    });
  } catch (error) {
    console.error("[GET /api/contact]", error);
    return errorResponse("Failed to fetch contact information");
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body) return badRequestResponse("Missing request body");

    await writeData("contact.json", body);
    return successResponse(body, "Contact saved", 201);
  } catch (err) {
    console.error("[POST /api/contact]", err);
    return errorResponse("Failed to save contact information");
  }
}

export async function DELETE() {
  try {
    await writeData("contact.json", null as any);
    return successResponse(null, "Contact deleted");
  } catch (err) {
    console.error("[DELETE /api/contact]", err);
    return errorResponse("Failed to delete contact information");
  }
}
