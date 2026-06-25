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
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored) as CartItem[]);
      }
    } catch {
      setItems([]);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, isHydrated]);

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
      items.reduce(
        (sum, item) =>
          sum +
          calculateDiscountedPrice(item.price, item.discountPercent) *
            item.quantity,
        0,
      ),
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
