"use client";

import { useRef, useState, useEffect } from "react";
import { ProductCard } from "@/components/home/ProductCard";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

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

export function ProductSection({ title, products }: { title: string; products: ProductSummary[] }) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const update = () => {
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(el.scrollWidth > el.clientWidth + el.scrollLeft + 1);
    };

    update();
    el.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [products]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = Math.round(el.clientWidth * 0.75);
    const target = direction === "left" ? el.scrollLeft - amount : el.scrollLeft + amount;
    el.scrollTo({ left: target, behavior: "smooth" });
  };

  return (
    <section className="py-12 md:py-16">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-2xl font-light text-obsidian">{title}</h2>
        <div className="hidden items-center gap-2 sm:flex">
          <button
            onClick={() => scroll("left")}
            aria-label={`Scroll ${title} left`}
            className={cn(
              "rounded-full bg-white/60 p-2 shadow transition-opacity duration-200 hover:opacity-90",
              !canScrollLeft && "opacity-40 pointer-events-none",
            )}
          >
            ‹
          </button>
          <button
            onClick={() => scroll("right")}
            aria-label={`Scroll ${title} right`}
            className={cn(
              "rounded-full bg-white/60 p-2 shadow transition-opacity duration-200 hover:opacity-90",
              !canScrollRight && "opacity-40 pointer-events-none",
            )}
          >
            ›
          </button>
        </div>
      </div>

      <div className="relative">
        <div
          ref={scrollerRef}
          className="no-scrollbar flex gap-4 overflow-x-auto pb-2 pr-4 scroll-smooth snap-x snap-mandatory"
          role="list"
        >
          {products.map((p) => (
            <div key={p.id} className="snap-start min-w-[220px] sm:min-w-[240px] md:min-w-[260px] lg:min-w-[280px]">
              <ProductCard product={p} />
            </div>
          ))}
        </div>

        {/* Mobile arrows overlay */}
        <div className="absolute right-3 top-1/2 hidden -translate-y-1/2 transform sm:block">
          <button
            onClick={() => scroll("right")}
            aria-label={`Scroll ${title} right`}
            className="rounded-full bg-white/60 p-2 shadow transition-opacity duration-200 hover:opacity-90"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}

export default ProductSection;
