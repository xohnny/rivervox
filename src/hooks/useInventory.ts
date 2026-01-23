import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface InventoryProduct {
  id: string;
  name: string;
  description: string | null;
  price: number;
  original_price: number | null;
  category: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
  images: string[];
  stock: number;
  low_stock_threshold: number;
  featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface StockAlert {
  id: string;
  product_id: string;
  product_name?: string;
  alert_type: string;
  current_stock: number;
  threshold: number;
  is_acknowledged: boolean;
  acknowledged_at: string | null;
  created_at: string;
}

export interface InventoryStats {
  totalProducts: number;
  lowStockCount: number;
  outOfStockCount: number;
  activeAlerts: number;
}

export const useInventory = () => {
  const [products, setProducts] = useState<InventoryProduct[]>([]);
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [stats, setStats] = useState<InventoryStats>({
    totalProducts: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
    activeAlerts: 0,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProducts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');

      if (error) throw error;

      const formattedProducts: InventoryProduct[] = (data || []).map((p) => ({
        ...p,
        colors: Array.isArray(p.colors) ? p.colors : JSON.parse(p.colors as string || '[]'),
      }));

      setProducts(formattedProducts);

      // Calculate stats
      const lowStock = formattedProducts.filter(
        (p) => p.stock > 0 && p.stock <= p.low_stock_threshold
      ).length;
      const outOfStock = formattedProducts.filter((p) => p.stock === 0).length;

      setStats((prev) => ({
        ...prev,
        totalProducts: formattedProducts.length,
        lowStockCount: lowStock,
        outOfStockCount: outOfStock,
      }));
    } catch (error: any) {
      console.error('Error fetching products:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch products',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const fetchAlerts = useCallback(async () => {
    try {
      const { data: alertsData, error: alertsError } = await supabase
        .from('stock_alerts')
        .select('*')
        .eq('is_acknowledged', false)
        .order('created_at', { ascending: false });

      if (alertsError) throw alertsError;

      // Get product names for alerts
      const productIds = [...new Set((alertsData || []).map((a) => a.product_id))];
      
      if (productIds.length > 0) {
        const { data: productsData } = await supabase
          .from('products')
          .select('id, name')
          .in('id', productIds);

        const productMap = new Map((productsData || []).map((p) => [p.id, p.name]));

        const alertsWithNames = (alertsData || []).map((alert) => ({
          ...alert,
          product_name: productMap.get(alert.product_id) || 'Unknown Product',
        }));

        setAlerts(alertsWithNames);
        setStats((prev) => ({ ...prev, activeAlerts: alertsWithNames.length }));
      } else {
        setAlerts([]);
        setStats((prev) => ({ ...prev, activeAlerts: 0 }));
      }
    } catch (error: any) {
      console.error('Error fetching alerts:', error);
    }
  }, []);

  const updateStock = async (productId: string, newStock: number) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ stock: newStock })
        .eq('id', productId);

      if (error) throw error;

      toast({
        title: 'Stock Updated',
        description: 'Product stock has been updated successfully',
      });

      await fetchProducts();
      await fetchAlerts();
    } catch (error: any) {
      console.error('Error updating stock:', error);
      toast({
        title: 'Error',
        description: 'Failed to update stock',
        variant: 'destructive',
      });
    }
  };

  const updateThreshold = async (productId: string, newThreshold: number) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ low_stock_threshold: newThreshold })
        .eq('id', productId);

      if (error) throw error;

      toast({
        title: 'Threshold Updated',
        description: 'Low stock threshold has been updated',
      });

      await fetchProducts();
    } catch (error: any) {
      console.error('Error updating threshold:', error);
      toast({
        title: 'Error',
        description: 'Failed to update threshold',
        variant: 'destructive',
      });
    }
  };

  const acknowledgeAlert = async (alertId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('stock_alerts')
        .update({
          is_acknowledged: true,
          acknowledged_at: new Date().toISOString(),
          acknowledged_by: user?.id,
        })
        .eq('id', alertId);

      if (error) throw error;

      toast({
        title: 'Alert Acknowledged',
        description: 'The alert has been marked as acknowledged',
      });

      await fetchAlerts();
    } catch (error: any) {
      console.error('Error acknowledging alert:', error);
      toast({
        title: 'Error',
        description: 'Failed to acknowledge alert',
        variant: 'destructive',
      });
    }
  };

  const addProduct = async (product: Omit<InventoryProduct, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase
        .from('products')
        .insert({
          name: product.name,
          description: product.description,
          price: product.price,
          original_price: product.original_price,
          category: product.category,
          sizes: product.sizes,
          colors: product.colors,
          images: product.images,
          stock: product.stock,
          low_stock_threshold: product.low_stock_threshold,
          featured: product.featured,
          is_active: product.is_active,
        });

      if (error) throw error;

      toast({
        title: 'Product Added',
        description: 'New product has been added successfully',
      });

      await fetchProducts();
      return true;
    } catch (error: any) {
      console.error('Error adding product:', error);
      toast({
        title: 'Error',
        description: 'Failed to add product',
        variant: 'destructive',
      });
      return false;
    }
  };

  const updateProduct = async (productId: string, product: Partial<InventoryProduct>) => {
    try {
      const updateData: Record<string, any> = {};
      if (product.name !== undefined) updateData.name = product.name;
      if (product.description !== undefined) updateData.description = product.description;
      if (product.price !== undefined) updateData.price = product.price;
      if (product.original_price !== undefined) updateData.original_price = product.original_price;
      if (product.category !== undefined) updateData.category = product.category;
      if (product.sizes !== undefined) updateData.sizes = product.sizes;
      if (product.colors !== undefined) updateData.colors = product.colors;
      if (product.images !== undefined) updateData.images = product.images;
      if (product.stock !== undefined) updateData.stock = product.stock;
      if (product.low_stock_threshold !== undefined) updateData.low_stock_threshold = product.low_stock_threshold;
      if (product.featured !== undefined) updateData.featured = product.featured;
      if (product.is_active !== undefined) updateData.is_active = product.is_active;

      const { error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', productId);

      if (error) throw error;

      toast({
        title: 'Product Updated',
        description: 'Product has been updated successfully',
      });

      await fetchProducts();
      return true;
    } catch (error: any) {
      console.error('Error updating product:', error);
      toast({
        title: 'Error',
        description: 'Failed to update product',
        variant: 'destructive',
      });
      return false;
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      toast({
        title: 'Product Deleted',
        description: 'Product has been removed',
      });

      await fetchProducts();
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete product',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchProducts(), fetchAlerts()]);
      setLoading(false);
    };
    loadData();
  }, [fetchProducts, fetchAlerts]);

  return {
    products,
    alerts,
    stats,
    loading,
    updateStock,
    updateThreshold,
    acknowledgeAlert,
    addProduct,
    updateProduct,
    deleteProduct,
    refetch: () => Promise.all([fetchProducts(), fetchAlerts()]),
  };
};
