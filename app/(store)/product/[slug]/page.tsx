"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PageTransition } from "@/components/ui/PageTransition";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/home/ProductCard";
import { fetchProductBySlug } from "@/lib/api/client";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils/format";
import type { Product, ProductColor, ProductSize, ProductSummary } from "@/types/product";

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { addItem } = useCart();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchProductBySlug(slug, true);

        if (response.success) {
          const payload = response.data;
          const productData =
            typeof payload === "object" && payload && "product" in payload
              ? payload.product
              : payload;
          const related =
            typeof payload === "object" && payload && "relatedProducts" in payload
              ? payload.relatedProducts
              : [];

          setProduct(productData);
          setRelatedProducts(related);

          if (productData.colors.length > 0) {
            setSelectedColor(productData.colors[0]);
          }
          if (productData.sizes.length > 0) {
            setSelectedSize(productData.sizes[0]);
          }
        } else {
          setError("Product not found");
        }
      } catch (err) {
        console.error("Error loading product:", err);
        setError("Failed to load product. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadProduct();
    }
  }, [slug]);

  const handleAddToCart = () => {
    if (!product || !selectedColor || !selectedSize) return;

    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      originalPrice: product.price,
      discountPercent: product.discountPercent,
      quantity,
      color: selectedColor,
      size: selectedSize,
      image:
        product.images.length > 0
          ? product.images[0].url
          : "/placeholder.png",
    });

    alert("Added to cart!");
    setQuantity(1);
  };

  if (loading) {
    return (
      <PageTransition>
        <Container className="py-20 md:py-28">
          <p className="text-center text-muted">Loading product...</p>
        </Container>
      </PageTransition>
    );
  }

  if (error || !product) {
    return (
      <PageTransition>
        <Container className="py-20 md:py-28">
          <div className="glass-panel rounded-2xl p-8 text-center">
            <p className="text-red-500">{error || "Product not found"}</p>
            <Button href="/shop" className="mt-4">
              Back to Shop
            </Button>
          </div>
        </Container>
      </PageTransition>
    );
  }

  const finalPrice = product.price * (1 - product.discountPercent / 100);

  return (
    <PageTransition>
      <Container className="py-12 md:py-20">
        {/* Breadcrumb */}
        <div className="mb-8 flex gap-2 text-sm text-muted">
          <Link href="/shop" className="hover:text-champagne">
            Shop
          </Link>
          <span>/</span>
          <Link href={`/shop?brand=${product.brand.slug}`} className="hover:text-champagne">
            {product.brand.name}
          </Link>
          <span>/</span>
          <span className="text-champagne">{product.name}</span>
        </div>

        <div className="grid gap-12 md:grid-cols-2 lg:gap-16">
          {/* Image Gallery */}
          <div>
            <div className="glass-panel mb-4 overflow-hidden rounded-3xl">
              {product.images.length > 0 && (
                <img
                  src={product.images[currentImageIndex].url}
                  alt={product.images[currentImageIndex].alt}
                  className="aspect-square w-full object-cover"
                />
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto">
                {product.images.map((image, idx) => (
                  <button
                    key={image.id}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`glass-panel rounded-2xl overflow-hidden transition-opacity ${
                      currentImageIndex === idx ? "opacity-100" : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="h-24 w-24 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-champagne">
              {product.category.name}
            </p>
            <h1 className="font-display mt-4 text-4xl font-light text-obsidian md:text-5xl">
              {product.name}
            </h1>

            {/* Pricing */}
            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-3xl font-semibold text-obsidian">
                {formatPrice(finalPrice)}
              </span>
              {product.discountPercent > 0 && (
                <>
                  <span className="text-lg text-muted line-through">
                    {formatPrice(product.price)}
                  </span>
                  <span className="rounded-full bg-red-500/90 px-3 py-1 text-sm font-semibold text-white">
                    Save {product.discountPercent}%
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="mt-6 text-muted">{product.description}</p>

            {/* Stock Status */}
            <div className="mt-4 text-sm">
              {product.stock > 0 ? (
                <span className="text-green-500">In Stock ({product.stock} items)</span>
              ) : (
                <span className="text-red-500">Out of Stock</span>
              )}
            </div>

            {/* Color Selection */}
            {product.colors.length > 0 && (
              <div className="mt-8">
                <p className="text-sm font-semibold text-obsidian">Color</p>
                <div className="mt-3 flex gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColor(color)}
                      className={`group relative h-10 w-10 rounded-full border-2 transition-all ${
                        selectedColor?.id === color.id
                          ? "border-champagne"
                          : "border-champagne/20 hover:border-champagne"
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-muted opacity-0 group-hover:opacity-100">
                        {color.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes.length > 0 && (
              <div className="mt-8">
                <p className="text-sm font-semibold text-obsidian">Size</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => setSelectedSize(size)}
                      className={`rounded-lg border-2 px-4 py-2 text-sm font-medium transition-all ${
                        selectedSize?.id === size.id
                          ? "border-champagne bg-champagne/10 text-obsidian"
                          : "border-champagne/20 text-muted hover:border-champagne"
                      }`}
                    >
                      {size.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mt-8">
              <p className="text-sm font-semibold text-obsidian">Quantity</p>
              <div className="mt-3 flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="rounded-lg border border-champagne/20 px-4 py-2 text-obsidian hover:border-champagne"
                >
                  −
                </button>
                <span className="w-8 text-center text-lg font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="rounded-lg border border-champagne/20 px-4 py-2 text-obsidian hover:border-champagne"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              disabled={!selectedColor || !selectedSize || product.stock === 0}
              className="mt-10 w-full"
            >
              Add to Cart
            </Button>

            {/* Product Meta */}
            <div className="mt-12 space-y-4 border-t border-champagne/10 pt-8">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted">Brand</p>
                <p className="mt-2 text-obsidian">{product.brand.name}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted">Category</p>
                <p className="mt-2 text-obsidian">{product.category.name}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted">SKU</p>
                <p className="mt-2 text-obsidian">{product.id}</p>
              </div>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <section className="mt-16 border-t border-champagne/10 pt-12">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-champagne">
                  You may also like
                </p>
                <h2 className="mt-2 font-display text-3xl font-light text-obsidian">
                  Similar Products
                </h2>
              </div>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {relatedProducts.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}
      </Container>
    </PageTransition>
  );
}
