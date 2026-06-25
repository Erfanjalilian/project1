"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PageTransition } from "@/components/ui/PageTransition";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { fetchProducts, fetchBrands, fetchCategories } from "@/lib/api/client";
import { formatPrice } from "@/lib/utils/format";
import type { Product, ProductBrand, ProductCategory } from "@/types/product";

function ShopContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<ProductBrand[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    brand: searchParams.get("brand") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    sort: searchParams.get("sort") || "newest",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const searchParams = new URLSearchParams();
        searchParams.set("page", page.toString());
        searchParams.set("limit", "12");

        if (filters.search) searchParams.set("search", filters.search);
        if (filters.brand) searchParams.set("brand", filters.brand);
        if (filters.minPrice) searchParams.set("minPrice", filters.minPrice);
        if (filters.maxPrice) searchParams.set("maxPrice", filters.maxPrice);
        if (filters.sort) searchParams.set("sort", filters.sort);

        const [productsRes, brandsRes, categoriesRes] = await Promise.all([
          fetchProducts(Object.fromEntries(searchParams)),
          fetchBrands(),
          fetchCategories(),
        ]);

        if (productsRes.success) {
          setProducts(productsRes.data);
          if (productsRes.meta) {
            setTotalPages(productsRes.meta.totalPages);
          }
        } else {
          setError("Failed to load products");
        }

        if (brandsRes.success) {
          setBrands(brandsRes.data);
        }

        if (categoriesRes.success) {
          setCategories(categoriesRes.data);
        }
      } catch (err) {
        console.error("Error loading shop data:", err);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [filters, page]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      brand: "",
      minPrice: "",
      maxPrice: "",
      sort: "newest",
    });
    setPage(1);
  };

  const mobileFilterPanel = (
    <div className="space-y-6">
      <div>
        <label className="text-xs uppercase tracking-wider text-muted">
          Search
        </label>
        <input
          type="text"
          placeholder="Search products..."
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          className="mt-2 w-full rounded-2xl border border-champagne/20 bg-transparent px-4 py-3 text-sm text-obsidian placeholder-muted focus:border-champagne focus:outline-none"
        />
      </div>

      <div>
        <label className="text-xs uppercase tracking-wider text-muted">
          Brand
        </label>
        <select
          value={filters.brand}
          onChange={(e) => handleFilterChange("brand", e.target.value)}
          className="mt-2 w-full rounded-2xl border border-champagne/20 bg-transparent px-4 py-3 text-sm text-obsidian focus:border-champagne focus:outline-none"
        >
          <option value="">All Brands</option>
          {brands.map((brand) => (
            <option key={brand.id} value={brand.slug}>
              {brand.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs uppercase tracking-wider text-muted">
          Category
        </label>
        <select
          value={filters.sort}
          onChange={(e) => handleFilterChange("sort", e.target.value)}
          className="mt-2 w-full rounded-2xl border border-champagne/20 bg-transparent px-4 py-3 text-sm text-obsidian focus:border-champagne focus:outline-none"
        >
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="discount">Best Discount</option>
          <option value="bestselling">Best Selling</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs uppercase tracking-wider text-muted">
            Min Price
          </label>
          <input
            type="number"
            min="0"
            placeholder="0"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange("minPrice", e.target.value)}
            className="mt-2 w-full rounded-2xl border border-champagne/20 bg-transparent px-4 py-3 text-sm text-obsidian focus:border-champagne focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-muted">
            Max Price
          </label>
          <input
            type="number"
            min="0"
            placeholder="999"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
            className="mt-2 w-full rounded-2xl border border-champagne/20 bg-transparent px-4 py-3 text-sm text-obsidian focus:border-champagne focus:outline-none"
          />
        </div>
      </div>
    </div>
  );

  const desktopFilterPanel = (
    <div className="grid gap-6 md:grid-cols-[1.6fr_1fr_1fr_1fr] md:items-end">
      <div>
        <label className="text-xs uppercase tracking-wider text-muted">
          Search
        </label>
        <input
          type="text"
          placeholder="Search products..."
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          className="mt-2 w-full rounded-2xl border border-champagne/20 bg-transparent px-4 py-3 text-sm text-obsidian placeholder-muted focus:border-champagne focus:outline-none"
        />
      </div>

      <div>
        <label className="text-xs uppercase tracking-wider text-muted">
          Brand
        </label>
        <select
          value={filters.brand}
          onChange={(e) => handleFilterChange("brand", e.target.value)}
          className="mt-2 w-full rounded-2xl border border-champagne/20 bg-transparent px-4 py-3 text-sm text-obsidian focus:border-champagne focus:outline-none"
        >
          <option value="">All Brands</option>
          {brands.map((brand) => (
            <option key={brand.id} value={brand.slug}>
              {brand.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs uppercase tracking-wider text-muted">
          Category
        </label>
        <select
          value={filters.sort}
          onChange={(e) => handleFilterChange("sort", e.target.value)}
          className="mt-2 w-full rounded-2xl border border-champagne/20 bg-transparent px-4 py-3 text-sm text-obsidian focus:border-champagne focus:outline-none"
        >
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="discount">Best Discount</option>
          <option value="bestselling">Best Selling</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs uppercase tracking-wider text-muted">
            Min Price
          </label>
          <input
            type="number"
            min="0"
            placeholder="0"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange("minPrice", e.target.value)}
            className="mt-2 w-full rounded-2xl border border-champagne/20 bg-transparent px-4 py-3 text-sm text-obsidian focus:border-champagne focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-muted">
            Max Price
          </label>
          <input
            type="number"
            min="0"
            placeholder="999"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
            className="mt-2 w-full rounded-2xl border border-champagne/20 bg-transparent px-4 py-3 text-sm text-obsidian focus:border-champagne focus:outline-none"
          />
        </div>
      </div>
    </div>
  );

  const desktopActions = (
    <div className="mt-6 hidden items-center gap-3 md:flex">
      <Button onClick={resetFilters} variant="outline">
        Clear Filters
      </Button>
      <Button onClick={() => setIsFilterOpen(false)}>
        Apply
      </Button>
    </div>
  );

  return (
    <PageTransition>
      <Container className="py-20 md:py-28">
        <p className="text-xs uppercase tracking-[0.28em] text-champagne">
          Collections
        </p>
        <h1 className="font-display mt-4 text-4xl font-light text-obsidian md:text-5xl">
          Shop
        </h1>
        <p className="mt-4 max-w-2xl text-muted">
          Explore our curated selection of premium pieces from ATELIER NOIR.
        </p>

        <div className="mt-10 flex flex-col gap-4 md:hidden">
          <Button onClick={() => setIsFilterOpen(true)} variant="outline" className="w-full">
            Filter Products
          </Button>
        </div>

        <div className="mt-10 hidden md:block">
          {desktopFilterPanel}
          {desktopActions}
        </div>

        {isFilterOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
              onClick={() => setIsFilterOpen(false)}
            />
            <div className="relative z-50 flex h-full w-[min(92vw,420px)] flex-col overflow-y-auto bg-white/95 p-6 shadow-2xl backdrop-blur-2xl transition-transform duration-300 md:hidden">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-champagne">
                    Filters
                  </p>
                  <h2 className="font-display text-2xl font-light text-obsidian">
                    Refine results
                  </h2>
                </div>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="rounded-full bg-black/10 px-3 py-2 text-sm text-obsidian transition hover:bg-black/15"
                  aria-label="Close filter panel"
                >
                  Close
                </button>
              </div>
              {mobileFilterPanel}
            </div>
          </div>
        )}

        {loading && (
          <div className="mt-12 text-center">
            <p className="text-muted">Loading products...</p>
          </div>
        )}

        {error && !loading && (
          <div className="glass-panel mt-12 rounded-2xl p-8 text-center text-red-500">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="glass-panel mt-12 rounded-2xl p-12 text-center">
            <p className="text-muted">No products found matching your criteria.</p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <>
            <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  className="group"
                >
                  <div className="glass-panel relative overflow-hidden rounded-2xl">
                    {product.images.length > 0 && (
                      <img
                        src={product.images[0].url}
                        alt={product.images[0].alt}
                        className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    )}
                    {product.isBestSeller && (
                      <div className="absolute right-4 top-4 rounded-full bg-champagne px-3 py-1 text-xs font-semibold text-obsidian">
                        Best Seller
                      </div>
                    )}
                    {product.discountPercent > 0 && (
                      <div className="absolute left-4 top-4 rounded-full bg-red-500/90 px-3 py-1 text-xs font-semibold text-white">
                        -{product.discountPercent}%
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <p className="text-xs uppercase tracking-wider text-champagne">
                      {product.brand.name}
                    </p>
                    <h3 className="font-display mt-1 text-lg text-obsidian group-hover:text-champagne">
                      {product.name}
                    </h3>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-sm font-semibold text-obsidian">
                        {formatPrice(product.price * (1 - product.discountPercent / 100))}
                      </span>
                      {product.discountPercent > 0 && (
                        <span className="text-xs text-muted line-through">
                          {formatPrice(product.price)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-4">
                <Button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  variant="outline"
                >
                  Previous
                </Button>
                <span className="text-sm text-muted">
                  Page {page} of {totalPages}
                </span>
                <Button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  variant="outline"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </Container>
    </PageTransition>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ShopContent />
    </Suspense>
  );
}
