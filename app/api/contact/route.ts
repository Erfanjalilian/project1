import {
  errorResponse,
  notFoundResponse,
  successResponse,
} from "@/lib/api/response";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const contact = await prisma.contactInfo.findFirst();

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
