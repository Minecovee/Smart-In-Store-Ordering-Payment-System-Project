import { createContext, useContext, useState } from "react";
import type { FoodItems } from "../components/Foods";

type CartItem = FoodItems & { qty: number };

type CartContextType = {
  cart: CartItem[];
  addToCart: (food: FoodItems) => void;
};

const CartController = createContext<CartContextType | null>(null);

export const useCart = () => {
  const ctx = useContext(CartController);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (food: FoodItems) => {
    setCart((prev) => {
      const exist = prev.find((item) => item.id === food.id);
      if (exist) {
        return prev.map((item) =>
          item.id === food.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...food, qty: 1 }];
    });
  };

  return (
    <CartController.Provider value={{ cart, addToCart }}>
      {children}
    </CartController.Provider>
  );
}
