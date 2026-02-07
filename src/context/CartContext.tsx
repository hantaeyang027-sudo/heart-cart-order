import React, { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Product } from "@/data/products";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (product: Product, qty?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clear: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (product: Product, qty = 1) => {
    setItems((prev) => {
      const found = prev.find((p) => p.product.id === product.id);
      if (found) {
        return prev.map((p) =>
          p.product.id === product.id ? { ...p, quantity: p.quantity + qty } : p
        );
      }
      return [...prev, { product, quantity: qty }];
    });
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((p) => p.product.id !== productId));
  };

  const updateQuantity = (productId: string, qty: number) => {
    if (qty <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) => prev.map((p) => (p.product.id === productId ? { ...p, quantity: qty } : p)));
  };

  const clear = () => setItems([]);

  const { totalItems, totalPrice } = useMemo(() => {
    const totalItems = items.reduce((s, it) => s + it.quantity, 0);
    const totalPrice = items.reduce((s, it) => s + it.quantity * (it.product.price || 0), 0);
    return { totalItems, totalPrice };
  }, [items]);

  const value: CartContextValue = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clear,
    totalItems,
    totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export default CartContext;


