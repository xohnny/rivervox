import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { startOfDay, startOfWeek, startOfMonth, subDays, format, eachDayOfInterval, isWithinInterval } from 'date-fns';
import type { Database } from '@/integrations/supabase/types';

type OrderStatus = Database['public']['Enums']['order_status'];

interface SalesStats {
  todaySales: number;
  weeklySales: number;
  monthlySales: number;
  totalRevenue: number;
  todayChange: number;
  weeklyChange: number;
  monthlyChange: number;
}

interface OrderStats {
  total: number;
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
}

interface RecentOrder {
  id: string;
  order_number: string;
  customer_name: string;
  total: number;
  status: OrderStatus;
  created_at: string;
}

interface DailySales {
  date: string;
  sales: number;
  orders: number;
}

interface TopProduct {
  product_name: string;
  quantity: number;
  revenue: number;
}

interface DateRange {
  from: Date;
  to: Date;
}

export const useOrderAnalytics = (dateRange?: DateRange) => {
  const [salesStats, setSalesStats] = useState<SalesStats>({
    todaySales: 0,
    weeklySales: 0,
    monthlySales: 0,
    totalRevenue: 0,
    todayChange: 0,
    weeklyChange: 0,
    monthlyChange: 0,
  });
  const [orderStats, setOrderStats] = useState<OrderStats>({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [dailySales, setDailySales] = useState<DailySales[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const now = new Date();
      const todayStart = startOfDay(now);
      const weekStart = startOfWeek(now, { weekStartsOn: 0 });
      const monthStart = startOfMonth(now);
      const yesterdayStart = startOfDay(subDays(now, 1));
      const lastWeekStart = subDays(weekStart, 7);
      const lastMonthStart = subDays(monthStart, 30);

      // Fetch all orders
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      // Filter orders by date range if provided
      const filteredOrders = dateRange
        ? orders?.filter(o => {
            const orderDate = new Date(o.created_at);
            return isWithinInterval(orderDate, { start: dateRange.from, end: dateRange.to });
          })
        : orders;

      // Calculate sales stats (always based on current periods for comparison)
      const todayOrders = orders?.filter(o => new Date(o.created_at) >= todayStart) || [];
      const yesterdayOrders = orders?.filter(o => {
        const date = new Date(o.created_at);
        return date >= yesterdayStart && date < todayStart;
      }) || [];
      
      const weekOrders = orders?.filter(o => new Date(o.created_at) >= weekStart) || [];
      const lastWeekOrders = orders?.filter(o => {
        const date = new Date(o.created_at);
        return date >= lastWeekStart && date < weekStart;
      }) || [];
      
      const monthOrders = orders?.filter(o => new Date(o.created_at) >= monthStart) || [];
      const lastMonthOrders = orders?.filter(o => {
        const date = new Date(o.created_at);
        return date >= lastMonthStart && date < monthStart;
      }) || [];

      const sumTotal = (arr: typeof orders) => arr?.reduce((sum, o) => sum + Number(o.total), 0) || 0;

      const todaySales = sumTotal(todayOrders);
      const yesterdaySales = sumTotal(yesterdayOrders);
      const weeklySales = sumTotal(weekOrders);
      const lastWeekSales = sumTotal(lastWeekOrders);
      const monthlySales = sumTotal(monthOrders);
      const lastMonthSales = sumTotal(lastMonthOrders);
      const totalRevenue = sumTotal(filteredOrders);

      const calcChange = (current: number, previous: number) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return ((current - previous) / previous) * 100;
      };

      setSalesStats({
        todaySales,
        weeklySales,
        monthlySales,
        totalRevenue,
        todayChange: calcChange(todaySales, yesterdaySales),
        weeklyChange: calcChange(weeklySales, lastWeekSales),
        monthlyChange: calcChange(monthlySales, lastMonthSales),
      });

      // Calculate order stats by status (filtered)
      const statusCounts = {
        total: filteredOrders?.length || 0,
        pending: filteredOrders?.filter(o => o.status === 'pending').length || 0,
        processing: filteredOrders?.filter(o => o.status === 'processing').length || 0,
        shipped: filteredOrders?.filter(o => o.status === 'shipped').length || 0,
        delivered: filteredOrders?.filter(o => o.status === 'delivered').length || 0,
        cancelled: filteredOrders?.filter(o => o.status === 'cancelled').length || 0,
      };
      setOrderStats(statusCounts);

      // Get recent orders (last 5 from filtered)
      const recent = filteredOrders?.slice(0, 5).map(o => ({
        id: o.id,
        order_number: o.order_number,
        customer_name: o.customer_name,
        total: Number(o.total),
        status: o.status,
        created_at: o.created_at,
      })) || [];
      setRecentOrders(recent);

      // Calculate daily sales for the date range or last 7 days
      const rangeStart = dateRange?.from || subDays(now, 6);
      const rangeEnd = dateRange?.to || now;
      const days = eachDayOfInterval({ start: rangeStart, end: rangeEnd });
      
      const dailySalesData: DailySales[] = days.map(day => {
        const dayStart = startOfDay(day);
        const dayEnd = startOfDay(subDays(day, -1));
        
        const dayOrders = orders?.filter(o => {
          const date = new Date(o.created_at);
          return date >= dayStart && date < dayEnd;
        }) || [];

        return {
          date: format(day, 'MMM dd'),
          sales: sumTotal(dayOrders),
          orders: dayOrders.length,
        };
      });
      setDailySales(dailySalesData);

      // Fetch top products from order_items (filtered by order date range)
      const orderIds = filteredOrders?.map(o => o.id) || [];
      
      if (orderIds.length > 0) {
        const { data: orderItems, error: itemsError } = await supabase
          .from('order_items')
          .select('product_name, quantity, unit_price, order_id')
          .in('order_id', orderIds);

        if (itemsError) throw itemsError;

        // Aggregate by product name
        const productMap = new Map<string, { quantity: number; revenue: number }>();
        orderItems?.forEach(item => {
          const existing = productMap.get(item.product_name) || { quantity: 0, revenue: 0 };
          productMap.set(item.product_name, {
            quantity: existing.quantity + item.quantity,
            revenue: existing.revenue + (item.quantity * Number(item.unit_price)),
          });
        });

        const topProductsList = Array.from(productMap.entries())
          .map(([product_name, data]) => ({
            product_name,
            quantity: data.quantity,
            revenue: data.revenue,
          }))
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 5);

        setTopProducts(topProductsList);
      } else {
        setTopProducts([]);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  }, [dateRange?.from?.getTime(), dateRange?.to?.getTime()]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    salesStats,
    orderStats,
    recentOrders,
    dailySales,
    topProducts,
    loading,
    refetch: fetchAnalytics,
  };
};
