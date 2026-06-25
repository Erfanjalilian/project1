import type { ApiResponse } from "@/types/api";

export function successResponse<T>(
  data: T,
  message = "Success",
  status = 200,
): Response {
  const body: ApiResponse<T> = {
    success: true,
    message,
    data,
  };

  return Response.json(body, { status });
}

export function errorResponse(
  message: string,
  status = 500,
  errors?: Record<string, string[]>,
): Response {
  const body: ApiResponse<null> = {
    success: false,
    message,
    data: null,
    errors,
  };

  return Response.json(body, { status });
}

export function notFoundResponse(message = "Resource not found"): Response {
  return errorResponse(message, 404);
}

export function badRequestResponse(
  message = "Invalid request",
  errors?: Record<string, string[]>,
): Response {
  return errorResponse(message, 400, errors);
}
