import type { ApiResponse, PaginatedResponse } from "@/types/api";
import type { Product, ProductCategory, ProductBrand } from "@/types/product";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const url = `${BASE_URL}/api${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch ${endpoint}:`, error);
    throw error;
  }
}

export async function fetchProducts(
  searchParams?: Record<string, string | number | boolean>
): Promise<PaginatedResponse<Product[]>> {
  const params = new URLSearchParams();

  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
  }

  const query = params.toString() ? `?${params.toString()}` : "";
  return fetchApi<Product[]>(`/products${query}`);
}

export async function fetchProductBySlug(slug: string): Promise<ApiResponse<Product>> {
  return fetchApi<Product>(`/products/${slug}`);
}

export async function fetchCategories(): Promise<ApiResponse<ProductCategory[]>> {
  return fetchApi<ProductCategory[]>("/categories");
}

export async function fetchBrands(): Promise<ApiResponse<ProductBrand[]>> {
  return fetchApi<ProductBrand[]>("/brands");
}

export async function fetchAbout(): Promise<
  ApiResponse<{
    id: string;
    introduction: string;
    story: string;
    mission: string;
    vision: string;
  }>
> {
  return fetchApi("/about");
}

export async function fetchTeam(): Promise<
  ApiResponse<
    Array<{
      id: string;
      name: string;
      role: string;
      image: string;
      order: number;
    }>
  >
> {
  return fetchApi("/team");
}

export async function fetchContact(): Promise<
  ApiResponse<{
    id: string;
    address: string;
    telephone: string;
    mobile: string;
    email: string;
  }>
> {
  return fetchApi("/contact");
}

export async function fetchBanners(): Promise<
  ApiResponse<
    Array<{
      id: string;
      title: string;
      subtitle: string;
      ctaText: string;
      ctaLink: string;
      image: string;
      order: number;
      isActive: boolean;
    }>
  >
> {
  return fetchApi("/banners");
}
