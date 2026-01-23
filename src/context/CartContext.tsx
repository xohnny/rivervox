import React, { createContext, useContext, useState, useCallback } from 'react';
import { CartItem, Product, ProductColor } from '@/types';

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product, size: string, color: ProductColor, quantity?: number) => void;
  removeFromCart: (productId: string, size: string, colorName: string) => void;
  updateQuantity: (productId: string, size: string, colorName: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addToCart = useCallback((
    product: Product,
    size: string,
    color: ProductColor,
    quantity: number = 1
  ) => {
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === size &&
          item.selectedColor.name === color.name
      );

      if (existingIndex > -1) {
        const newItems = [...prevItems];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + quantity,
        };
        return newItems;
      }

      return [...prevItems, { product, quantity, selectedSize: size, selectedColor: color }];
    });
    setIsOpen(true);
  }, []);

  const removeFromCart = useCallback((productId: string, size: string, colorName: string) => {
    setItems((prevItems) =>
      prevItems.filter(
        (item) =>
          !(item.product.id === productId &&
            item.selectedSize === size &&
            item.selectedColor.name === colorName)
      )
    );
  }, []);

  const updateQuantity = useCallback((
    productId: string,
    size: string,
    colorName: string,
    quantity: number
  ) => {
    if (quantity < 1) return;
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId &&
        item.selectedSize === size &&
        item.selectedColor.name === colorName
          ? { ...item, quantity }
          : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
