import {
  DollarSign,
  ShoppingCart,
  Package,
  TrendingUp,
  Clock,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Truck,
  XCircle,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { useOrderAnalytics } from '@/hooks/useOrderAnalytics';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-amber-100 text-amber-700';
    case 'processing':
      return 'bg-blue-100 text-blue-700';
    case 'shipped':
      return 'bg-purple-100 text-purple-700';
    case 'delivered':
      return 'bg-emerald-100 text-emerald-700';
    case 'cancelled':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatChange = (change: number) => {
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(1)}%`;
};

const AdminDashboard = () => {
  const { isAdmin, loading: authLoading } = useAdminAuth();
  const { salesStats, orderStats, recentOrders, dailySales, topProducts, loading } = useOrderAnalytics();

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-display font-bold text-destructive">Access Denied</h2>
        <p className="text-muted-foreground mt-2">You don't have permission to view this page.</p>
      </div>
    );
  }

  const stats = [
    {
      title: "Today's Sales",
      value: formatCurrency(salesStats.todaySales),
      change: formatChange(salesStats.todayChange),
      trend: salesStats.todayChange >= 0 ? 'up' : 'down',
      icon: DollarSign,
      color: 'bg-emerald-100 text-emerald-600',
    },
    {
      title: 'Weekly Sales',
      value: formatCurrency(salesStats.weeklySales),
      change: formatChange(salesStats.weeklyChange),
      trend: salesStats.weeklyChange >= 0 ? 'up' : 'down',
      icon: TrendingUp,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Monthly Sales',
      value: formatCurrency(salesStats.monthlySales),
      change: formatChange(salesStats.monthlyChange),
      trend: salesStats.monthlyChange >= 0 ? 'up' : 'down',
      icon: DollarSign,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(salesStats.totalRevenue),
      change: '',
      trend: 'up',
      icon: DollarSign,
      color: 'bg-amber-100 text-amber-600',
    },
  ];

  const orderStatsList = [
    { title: 'Total Orders', value: orderStats.total, icon: ShoppingCart },
    { title: 'Pending', value: orderStats.pending, icon: Clock },
    { title: 'Processing', value: orderStats.processing, icon: Package },
    { title: 'Shipped', value: orderStats.shipped, icon: Truck },
    { title: 'Delivered', value: orderStats.delivered, icon: CheckCircle },
    { title: 'Cancelled', value: orderStats.cancelled, icon: XCircle },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-display font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here's your store overview.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Sales Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.title} className="stat-card">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', stat.color)}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                </div>
                {stat.change && (
                  <div className="flex items-center gap-1 mt-3 text-sm">
                    {stat.trend === 'up' ? (
                      <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-500" />
                    )}
                    <span className={stat.trend === 'up' ? 'text-emerald-500' : 'text-red-500'}>
                      {stat.change}
                    </span>
                    <span className="text-muted-foreground">vs last period</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Order Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {orderStatsList.map((stat) => (
              <div key={stat.title} className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sales Chart */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-lg font-display font-semibold mb-6">Sales Overview (Last 7 Days)</h2>
            <div className="h-64">
              {dailySales.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailySales}>
                    <defs>
                      <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="date" 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => [formatCurrency(value), 'Sales']}
                    />
                    <Area
                      type="monotone"
                      dataKey="sales"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      fill="url(#salesGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full bg-muted/50 rounded-lg flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No sales data yet</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Orders Chart */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-lg font-display font-semibold mb-6">Daily Orders (Last 7 Days)</h2>
            <div className="h-48">
              {dailySales.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailySales}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="date" 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12}
                      allowDecimals={false}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => [value, 'Orders']}
                    />
                    <Bar 
                      dataKey="orders" 
                      fill="hsl(var(--primary))" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full bg-muted/50 rounded-lg flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No orders yet</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Charts & Tables Row */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-display font-semibold">Recent Orders</h2>
                <Link to="/admin/orders" className="text-sm text-primary hover:underline">
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between py-3 border-b border-border last:border-0"
                    >
                      <div>
                        <p className="font-medium text-sm">{order.order_number}</p>
                        <p className="text-xs text-muted-foreground">{order.customer_name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm">{formatCurrency(order.total)}</p>
                        <span
                          className={cn(
                            'inline-block px-2 py-0.5 text-xs rounded-full capitalize mt-1',
                            getStatusColor(order.status)
                          )}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No orders yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-display font-semibold">Top Products</h2>
                <Link to="/admin/products" className="text-sm text-primary hover:underline">
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {topProducts.length > 0 ? (
                  topProducts.map((product, index) => (
                    <div
                      key={product.product_name}
                      className="flex items-center gap-4 py-3 border-b border-border last:border-0"
                    >
                      <span className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs font-bold text-primary">
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{product.product_name}</p>
                        <p className="text-xs text-muted-foreground">{product.quantity} sold</p>
                      </div>
                      <p className="font-semibold text-sm text-primary">{formatCurrency(product.revenue)}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No product sales yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
