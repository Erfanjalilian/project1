"use client";

import Link from "next/link";
import { PageTransition } from "@/components/ui/PageTransition";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils/format";

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
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.color.id}-${item.size.id}`}
                className="glass-panel rounded-3xl p-6"
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <Link
                      href={`/product/${item.slug}`}
                      className="font-display text-2xl text-obsidian hover:text-champagne"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-1 text-sm text-muted">
                      {item.color.name} · Size {item.size.name} · Qty{" "}
                      {item.quantity}
                    </p>
                  </div>
                  <p className="text-lg text-obsidian">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}

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
