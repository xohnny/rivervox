import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CartItem, Product, ProductColor } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { products } from '@/data/products';

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  loading: boolean;
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
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Listen for auth changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUserId(session?.user?.id ?? null);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load cart from database when user logs in
  useEffect(() => {
    if (userId) {
      loadCartFromDb();
    } else {
      setItems([]);
    }
  }, [userId]);

  const loadCartFromDb = async () => {
    if (!userId) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', userId);

    if (!error && data) {
      const cartItems: CartItem[] = data
        .map((item) => {
          const product = products.find((p) => p.id === item.product_id);
          if (!product) return null;
          return {
            product,
            quantity: item.quantity,
            selectedSize: item.selected_size,
            selectedColor: {
              name: item.selected_color_name,
              hex: item.selected_color_hex,
            },
          };
        })
        .filter(Boolean) as CartItem[];
      setItems(cartItems);
    }
    setLoading(false);
  };

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addToCart = useCallback(async (
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

    // Persist to database if logged in
    if (userId) {
      const { data: existing } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', userId)
        .eq('product_id', product.id)
        .eq('selected_size', size)
        .eq('selected_color_name', color.name)
        .maybeSingle();

      if (existing) {
        await supabase
          .from('cart_items')
          .update({ quantity: existing.quantity + quantity })
          .eq('id', existing.id);
      } else {
        await supabase.from('cart_items').insert({
          user_id: userId,
          product_id: product.id,
          quantity,
          selected_size: size,
          selected_color_name: color.name,
          selected_color_hex: color.hex,
        });
      }
    }
  }, [userId]);

  const removeFromCart = useCallback(async (productId: string, size: string, colorName: string) => {
    setItems((prevItems) =>
      prevItems.filter(
        (item) =>
          !(item.product.id === productId &&
            item.selectedSize === size &&
            item.selectedColor.name === colorName)
      )
    );

    if (userId) {
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', productId)
        .eq('selected_size', size)
        .eq('selected_color_name', colorName);
    }
  }, [userId]);

  const updateQuantity = useCallback(async (
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

    if (userId) {
      await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('user_id', userId)
        .eq('product_id', productId)
        .eq('selected_size', size)
        .eq('selected_color_name', colorName);
    }
  }, [userId]);

  const clearCart = useCallback(async () => {
    setItems([]);

    if (userId) {
      await supabase.from('cart_items').delete().eq('user_id', userId);
    }
  }, [userId]);

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
        loading,
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
