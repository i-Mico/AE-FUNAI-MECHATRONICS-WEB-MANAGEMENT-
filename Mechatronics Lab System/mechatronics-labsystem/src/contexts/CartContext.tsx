import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Keep cart quantities inside the available stock so the UI cannot create
  // an impossible order while we are still using client-side mock data.
  const addToCart = (product: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    setItems(prev => {
      const amount = Math.max(1, product.quantity ?? 1);
      const existing = prev.find(item => item.id === product.id);

      if (existing) {
        const nextQuantity = Math.min(existing.quantity + amount, existing.stock);
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: nextQuantity } : item
        );
      }

      return [...prev, { ...product, quantity: Math.min(amount, product.stock) }];
    });
  };

  const removeFromCart = (id: string) =>
    setItems(prev => prev.filter(item => item.id !== id));

  const updateQuantity = (id: string, quantity: number) => {
    // A non-positive quantity means the item should leave the cart.
    setItems(prev =>
      prev.flatMap(item => {
        if (item.id !== id) return [item];
        if (quantity <= 0) return [];
        return [{ ...item, quantity: Math.min(quantity, item.stock) }];
      })
    );
  };

  // These derived values keep totals consistent for every cart consumer.
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
