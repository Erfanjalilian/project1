import Link from "next/link";
import { formatPrice } from "@/lib/utils/format";

type ProductSummary = {
  id: string;
  name: string;
  slug: string;
  price: number;
  discountPercent?: number;
  brand: { name: string; slug: string };
  category: { name: string; slug: string };
  images: Array<{ id: string; url: string; alt: string }>;
};

export function ProductCard({ product }: { product: ProductSummary }) {
  const finalPrice = product.price * (1 - (product.discountPercent ?? 0) / 100);

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="rounded-2xl overflow-hidden border border-border bg-white/40 transition-shadow duration-300 hover:glow-champagne">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-white/30">
          <img
            src={product.images?.[0]?.url ?? "/placeholder.png"}
            alt={product.images?.[0]?.alt ?? product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {product.discountPercent && product.discountPercent > 0 && (
            <span className="absolute top-3 left-3 rounded-full bg-red-500/90 px-3 py-1 text-xs font-semibold text-white">
              -{product.discountPercent}%
            </span>
          )}
        </div>

        <div className="p-4">
          <p className="text-xs text-muted">{product.brand.name}</p>
          <h3 className="mt-2 text-sm font-semibold text-obsidian">{product.name}</h3>
          <div className="mt-2 flex items-baseline gap-3">
            <span className="text-sm font-semibold text-obsidian">{formatPrice(finalPrice)}</span>
            {product.discountPercent && product.discountPercent > 0 && (
              <span className="text-xs text-muted line-through">{formatPrice(product.price)}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
