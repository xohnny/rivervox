import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type OrderStatus = Database['public']['Enums']['order_status'];

export interface AdminOrder {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  shipping_address: string;
  shipping_city: string;
  shipping_country: string;
  subtotal: number;
  shipping_cost: number;
  total: number;
  status: OrderStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
  items: {
    id: string;
    product_name: string;
    product_image: string | null;
    quantity: number;
    unit_price: number;
    selected_size: string;
    selected_color_name: string;
    selected_color_hex: string;
  }[];
}

export const useAdminOrders = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      // Fetch orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      // Fetch all order items for these orders
      const orderIds = ordersData?.map(o => o.id) || [];
      
      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .in('order_id', orderIds);

      if (itemsError) throw itemsError;

      // Combine orders with their items
      const ordersWithItems: AdminOrder[] = (ordersData || []).map(order => ({
        ...order,
        items: (itemsData || [])
          .filter(item => item.order_id === order.id)
          .map(item => ({
            id: item.id,
            product_name: item.product_name,
            product_image: item.product_image,
            quantity: item.quantity,
            unit_price: item.unit_price,
            selected_size: item.selected_size,
            selected_color_name: item.selected_color_name,
            selected_color_hex: item.selected_color_hex,
          })),
      }));

      setOrders(ordersWithItems);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: 'Error',
        description: 'Failed to load orders',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw error;

      // Update local state
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      toast({
        title: 'Status Updated',
        description: `Order status changed to ${newStatus}`,
      });

      return true;
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update order status',
        variant: 'destructive',
      });
      return false;
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return { orders, loading, updateOrderStatus, refetch: fetchOrders };
};
