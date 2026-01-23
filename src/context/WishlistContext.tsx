import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Product } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { products } from '@/data/products';

interface WishlistContextType {
  items: Product[];
  loading: boolean;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => void;
  clearWishlist: () => void;
  totalItems: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Product[]>([]);
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

  // Load wishlist from database when user logs in
  useEffect(() => {
    if (userId) {
      loadWishlistFromDb();
    } else {
      setItems([]);
    }
  }, [userId]);

  const loadWishlistFromDb = async () => {
    if (!userId) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('wishlists')
      .select('product_id')
      .eq('user_id', userId);

    if (!error && data) {
      const wishlistProducts = data
        .map((item) => products.find((p) => p.id === item.product_id))
        .filter(Boolean) as Product[];
      setItems(wishlistProducts);
    }
    setLoading(false);
  };

  const addToWishlist = useCallback(async (product: Product) => {
    setItems((prevItems) => {
      if (prevItems.find((item) => item.id === product.id)) {
        return prevItems;
      }
      return [...prevItems, product];
    });

    if (userId) {
      await supabase.from('wishlists').insert({
        user_id: userId,
        product_id: product.id,
      });
    }
  }, [userId]);

  const removeFromWishlist = useCallback(async (productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== productId));

    if (userId) {
      await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', productId);
    }
  }, [userId]);

  const isInWishlist = useCallback(
    (productId: string) => items.some((item) => item.id === productId),
    [items]
  );

  const toggleWishlist = useCallback(async (product: Product) => {
    const isCurrentlyInWishlist = items.some((item) => item.id === product.id);
    
    if (isCurrentlyInWishlist) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product);
    }
  }, [items, addToWishlist, removeFromWishlist]);

  const clearWishlist = useCallback(async () => {
    setItems([]);

    if (userId) {
      await supabase.from('wishlists').delete().eq('user_id', userId);
    }
  }, [userId]);

  const totalItems = items.length;

  return (
    <WishlistContext.Provider
      value={{
        items,
        loading,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist,
        clearWishlist,
        totalItems,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
