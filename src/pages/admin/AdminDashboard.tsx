import {
  DollarSign,
  ShoppingCart,
  Package,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const stats = [
  {
    title: "Today's Sales",
    value: '$1,247',
    change: '+12.5%',
    trend: 'up',
    icon: DollarSign,
    color: 'bg-emerald-100 text-emerald-600',
  },
  {
    title: 'Weekly Sales',
    value: '$8,439',
    change: '+8.2%',
    trend: 'up',
    icon: TrendingUp,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    title: 'Monthly Sales',
    value: '$42,580',
    change: '+23.1%',
    trend: 'up',
    icon: DollarSign,
    color: 'bg-purple-100 text-purple-600',
  },
  {
    title: 'Total Revenue',
    value: '$284,532',
    change: '+15.3%',
    trend: 'up',
    icon: DollarSign,
    color: 'bg-amber-100 text-amber-600',
  },
];

const orderStats = [
  { title: 'Total Orders', value: '1,284', icon: ShoppingCart },
  { title: 'Pending', value: '23', icon: Clock },
  { title: 'Processing', value: '45', icon: Package },
  { title: 'Completed', value: '1,216', icon: CheckCircle },
];

const recentOrders = [
  { id: 'RV-001234', customer: 'Ahmed Hassan', amount: '$189', status: 'pending' },
  { id: 'RV-001233', customer: 'Sarah Ahmed', amount: '$459', status: 'processing' },
  { id: 'RV-001232', customer: 'Omar Ali', amount: '$129', status: 'shipped' },
  { id: 'RV-001231', customer: 'Fatima Khan', amount: '$349', status: 'delivered' },
  { id: 'RV-001230', customer: 'Mohammed Saeed', amount: '$89', status: 'delivered' },
];

const topProducts = [
  { name: 'Emerald Silk Thobe', sales: 145, revenue: '$27,405' },
  { name: 'Royal Abaya Collection', sales: 128, revenue: '$20,352' },
  { name: 'Classic Kurta Set', sales: 112, revenue: '$14,448' },
  { name: 'Modest Hijab Premium', sales: 98, revenue: '$3,822' },
  { name: 'Executive Bisht', sales: 67, revenue: '$20,033' },
];

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
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const AdminDashboard = () => {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-display font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here's your store overview.</p>
      </div>

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
          </div>
        ))}
      </div>

      {/* Order Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {orderStats.map((stat) => (
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

      {/* Charts & Tables Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-display font-semibold">Recent Orders</h2>
            <a href="/admin/orders" className="text-sm text-primary hover:underline">
              View All
            </a>
          </div>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between py-3 border-b border-border last:border-0"
              >
                <div>
                  <p className="font-medium text-sm">{order.id}</p>
                  <p className="text-xs text-muted-foreground">{order.customer}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">{order.amount}</p>
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
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-display font-semibold">Top Products</h2>
            <a href="/admin/products" className="text-sm text-primary hover:underline">
              View All
            </a>
          </div>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div
                key={product.name}
                className="flex items-center gap-4 py-3 border-b border-border last:border-0"
              >
                <span className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs font-bold text-primary">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.sales} sold</p>
                </div>
                <p className="font-semibold text-sm text-primary">{product.revenue}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sales Chart Placeholder */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-lg font-display font-semibold mb-6">Sales Overview</h2>
        <div className="h-64 bg-muted/50 rounded-lg flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Sales Chart</p>
            <p className="text-sm">Connect to backend for real data</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
