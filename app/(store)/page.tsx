import Image from "next/image";
import { PageTransition } from "@/components/ui/PageTransition";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { getBestSellers, getNewArrivals, getDiscountedProducts } from "@/lib/api/products";
import ProductSection from "@/components/home/ProductSection";

export default async function HomePage() {
  const [best, newArrivals, discounts] = await Promise.all([
    getBestSellers(12),
    getNewArrivals(12),
    getDiscountedProducts(12),
  ]);

  return (
    <PageTransition>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=1800&q=80"
            alt="Luxury fashion studio background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/5 to-black/10" />
        </div>

        <Container className="relative z-10 flex min-h-[72vh] flex-col items-center justify-center py-20 text-center md:min-h-[80vh] md:py-28">
          <div className="glass-panel max-w-3xl rounded-3xl p-8 md:p-12">
            <p className="mb-4 text-xs uppercase tracking-[0.35em] text-champagne">
              Premium Contemporary Clothing
            </p>
            <h1 className="font-display max-w-4xl text-5xl font-light leading-tight text-obsidian md:text-7xl">
              Timeless elegance for the modern wardrobe
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-muted md:text-lg">
              ATELIER NOIR is being crafted section by section. The foundation,
              design system, database, and API architecture are now in place.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button href="/shop" size="lg">
                Explore Shop
              </Button>
              <Button href="/about" variant="outline" size="lg">
                Our Story
              </Button>
            </div>
          </div>
        </Container>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ivory to-transparent" />
      </section>

      <Container>
        <ProductSection title="Best Selling" products={best} />
        <ProductSection title="New Arrivals" products={newArrivals} />
        <ProductSection title="Special Discounts" products={discounts} />
      </Container>
    </PageTransition>
  );
}
