"use client";

import Link from "next/link";
import { PageTransition } from "@/components/ui/PageTransition";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";
import { calculateDiscountedPrice, formatPrice } from "@/lib/utils/format";

export default function CartPage() {
  const { items, subtotal, total, totalItems } = useCart();

  return (
    <PageTransition>
      <Container className="py-20 md:py-28">
        <p className="text-xs uppercase tracking-[0.28em] text-champagne">
          Shopping Cart
        </p>
        <h1 className="font-display mt-4 text-4xl font-light text-obsidian md:text-5xl">
          Your Selection
        </h1>

        {items.length === 0 ? (
          <div className="glass-panel mt-10 rounded-[2rem] p-10 text-center">
            <p className="text-muted">Your cart is currently empty.</p>
            <Button href="/shop" className="mt-6">
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="mt-10 space-y-4">
            {items.map((item) => {
              const unitPrice = calculateDiscountedPrice(
                item.originalPrice ?? item.price,
                item.discountPercent,
              );
              const lineTotal = unitPrice * item.quantity;

              return (
                <div
                  key={`${item.productId}-${item.color.id}-${item.size.id}`}
                  className="glass-panel rounded-3xl p-6"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-4">
                      <img
                        src={item.image || "/placeholder.png"}
                        alt={item.name}
                        className="h-24 w-24 rounded-2xl object-cover"
                      />
                      <div>
                        <Link
                          href={`/product/${item.slug}`}
                          className="font-display text-2xl text-obsidian hover:text-champagne"
                        >
                          {item.name}
                        </Link>
                        <p className="mt-1 text-sm text-muted">
                          {item.color.name} · Size {item.size.name} · Qty {item.quantity}
                        </p>
                        <p className="mt-2 text-sm text-obsidian">
                          {formatPrice(unitPrice)} each
                        </p>
                      </div>
                    </div>
                    <p className="text-lg font-semibold text-obsidian">
                      {formatPrice(lineTotal)}
                    </p>
                  </div>
                </div>
              );
            })}

            <div className="glass-panel rounded-[2rem] p-8">
              <div className="flex items-center justify-between text-sm text-muted">
                <span>Items</span>
                <span>{totalItems}</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-lg text-obsidian">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
              <p className="mt-2 text-sm text-muted">
                Subtotal: {formatPrice(subtotal)}
              </p>
            </div>
          </div>
        )}
      </Container>
    </PageTransition>
  );
}
