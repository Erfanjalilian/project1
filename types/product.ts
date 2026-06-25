export type ProductColor = {
  id: string;
  name: string;
  hex: string;
};

export type ProductSize = {
  id: string;
  name: string;
};

export type ProductImage = {
  id: string;
  url: string;
  alt: string;
  order: number;
};

export type ProductBrand = {
  id: string;
  name: string;
  slug: string;
};

export type ProductCategory = {
  id: string;
  name: string;
  slug: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPercent: number;
  isBestSeller: boolean;
  isNewArrival: boolean;
  isFeatured: boolean;
  stock: number;
  brand: ProductBrand;
  category: ProductCategory;
  images: ProductImage[];
  colors: ProductColor[];
  sizes: ProductSize[];
  createdAt: string;
  updatedAt: string;
};

export type ProductSummary = Pick<
  Product,
  | "id"
  | "name"
  | "slug"
  | "price"
  | "discountPercent"
  | "isBestSeller"
  | "isNewArrival"
  | "isFeatured"
  | "brand"
  | "category"
  | "images"
>;

export type ProductFilters = {
  search?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  bestSelling?: boolean;
  highestDiscount?: boolean;
  sort?: "newest" | "price-asc" | "price-desc" | "discount" | "bestselling";
  page?: number;
  limit?: number;
};

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  discountPercent: number;
  color: ProductColor;
  size: ProductSize;
  quantity: number;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  order: number;
};

export type Banner = {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  imageUrl: string;
  linkUrl: string | null;
  order: number;
};

export type AboutContent = {
  introduction: string;
  story: string;
  mission: string;
  vision: string;
};

export type ContactInfo = {
  officeAddress: string;
  telephone: string;
  mobile: string;
  email: string;
};

export type Brand = {
  id: string;
  name: string;
  slug: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
};
