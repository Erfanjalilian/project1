"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CartItem, ProductColor, ProductSize } from "@/types/product";
import { calculateDiscountedPrice } from "@/lib/utils/format";

type AddToCartPayload = {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  discountPercent: number;
  color: ProductColor;
  size: ProductSize;
  quantity?: number;
};

type CartContextValue = {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  total: number;
  addItem: (payload: AddToCartPayload) => void;
  removeItem: (productId: string, colorId: string, sizeId: string) => void;
  updateQuantity: (
    productId: string,
    colorId: string,
    sizeId: string,
    quantity: number,
  ) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);
const STORAGE_KEY = "atelier-noir-cart";

function getItemKey(productId: string, colorId: string, sizeId: string) {
  return `${productId}:${colorId}:${sizeId}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) return;

      const parsed = JSON.parse(stored) as Array<CartItem & { originalPrice?: number }>;
      const normalizedItems = parsed.map((item) => {
        const inferredOriginalPrice =
          typeof item.originalPrice === "number" && item.originalPrice > 0
            ? item.originalPrice
            : item.discountPercent > 0 && item.price > 0
              ? item.price / (1 - item.discountPercent / 100)
              : item.price;

        return {
          ...item,
          price: inferredOriginalPrice,
          originalPrice: inferredOriginalPrice,
        };
      });

      setItems(normalizedItems);
    } catch {
      setItems([]);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((payload: AddToCartPayload) => {
    setItems((current) => {
      const key = getItemKey(
        payload.productId,
        payload.color.id,
        payload.size.id,
      );
      const existingIndex = current.findIndex(
        (item) =>
          getItemKey(item.productId, item.color.id, item.size.id) === key,
      );

      if (existingIndex >= 0) {
        return current.map((item, index) =>
          index === existingIndex
            ? {
                ...item,
                quantity: item.quantity + (payload.quantity ?? 1),
              }
            : item,
        );
      }

      return [
        ...current,
        {
          productId: payload.productId,
          slug: payload.slug,
          name: payload.name,
          image: payload.image,
          price: payload.price,
          originalPrice: payload.originalPrice ?? payload.price,
          discountPercent: payload.discountPercent,
          color: payload.color,
          size: payload.size,
          quantity: payload.quantity ?? 1,
        },
      ];
    });
  }, []);

  const removeItem = useCallback(
    (productId: string, colorId: string, sizeId: string) => {
      setItems((current) =>
        current.filter(
          (item) =>
            getItemKey(item.productId, item.color.id, item.size.id) !==
            getItemKey(productId, colorId, sizeId),
        ),
      );
    },
    [],
  );

  const updateQuantity = useCallback(
    (
      productId: string,
      colorId: string,
      sizeId: string,
      quantity: number,
    ) => {
      if (quantity <= 0) {
        removeItem(productId, colorId, sizeId);
        return;
      }

      setItems((current) =>
        current.map((item) =>
          getItemKey(item.productId, item.color.id, item.size.id) ===
          getItemKey(productId, colorId, sizeId)
            ? { ...item, quantity }
            : item,
        ),
      );
    },
    [removeItem],
  );

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const subtotal = useMemo(
    () =>
      items.reduce((sum, item) => {
        const unitPrice = calculateDiscountedPrice(
          item.originalPrice ?? item.price,
          item.discountPercent,
        );
        return sum + unitPrice * item.quantity;
      }, 0),
    [items],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      totalItems,
      subtotal,
      total: subtotal,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }),
    [
      items,
      totalItems,
      subtotal,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
