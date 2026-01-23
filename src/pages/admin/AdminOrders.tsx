import { useState } from 'react';
import { Search, Eye, Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Order {
  id: string;
  customer: string;
  phone: string;
  address: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: string;
}

const mockOrders: Order[] = [
  {
    id: 'RV-001234',
    customer: 'Ahmed Hassan',
    phone: '+971 50 123 4567',
    address: 'Dubai Mall, Level 2, Dubai, UAE',
    items: [
      { name: 'Emerald Silk Thobe', quantity: 1, price: 189 },
      { name: 'Modest Hijab Premium', quantity: 2, price: 39 },
    ],
    total: 267,
    status: 'pending',
    createdAt: '2024-01-23',
  },
  {
    id: 'RV-001233',
    customer: 'Sarah Ahmed',
    phone: '+971 55 987 6543',
    address: 'Abu Dhabi, Marina Village',
    items: [
      { name: 'Royal Abaya Collection', quantity: 1, price: 159 },
      { name: 'Executive Bisht', quantity: 1, price: 299 },
    ],
    total: 458,
    status: 'processing',
    createdAt: '2024-01-22',
  },
  {
    id: 'RV-001232',
    customer: 'Omar Ali',
    phone: '+971 52 111 2222',
    address: 'Sharjah City Center',
    items: [{ name: 'Classic Kurta Set', quantity: 2, price: 129 }],
    total: 258,
    status: 'shipped',
    createdAt: '2024-01-21',
  },
  {
    id: 'RV-001231',
    customer: 'Fatima Khan',
    phone: '+971 50 333 4444',
    address: 'Ajman, Corniche Road',
    items: [
      { name: 'Little Prince Thobe', quantity: 2, price: 69 },
      { name: 'Princess Abaya Set', quantity: 1, price: 79 },
    ],
    total: 217,
    status: 'delivered',
    createdAt: '2024-01-20',
  },
];

const statusOptions = [
  { value: 'pending', label: 'Pending', icon: Clock, color: 'bg-amber-100 text-amber-700' },
  { value: 'processing', label: 'Processing', icon: Package, color: 'bg-blue-100 text-blue-700' },
  { value: 'shipped', label: 'Shipped', icon: Truck, color: 'bg-purple-100 text-purple-700' },
  { value: 'delivered', label: 'Delivered', icon: CheckCircle, color: 'bg-emerald-100 text-emerald-700' },
];

const AdminOrders = () => {
  const [orders, setOrders] = useState(mockOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const getStatusConfig = (status: string) => {
    return statusOptions.find((s) => s.value === status) || statusOptions[0];
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-display font-bold">Orders</h1>
        <p className="text-muted-foreground mt-1">Manage and track customer orders</p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by order ID or customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {statusOptions.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold">Order ID</th>
                <th className="text-left px-6 py-4 text-sm font-semibold">Customer</th>
                <th className="text-left px-6 py-4 text-sm font-semibold">Items</th>
                <th className="text-left px-6 py-4 text-sm font-semibold">Total</th>
                <th className="text-left px-6 py-4 text-sm font-semibold">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold">Date</th>
                <th className="text-right px-6 py-4 text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredOrders.map((order) => {
                const statusConfig = getStatusConfig(order.status);
                return (
                  <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono font-medium">{order.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">{order.customer}</p>
                        <p className="text-xs text-muted-foreground">{order.phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm">
                        {order.items.length} item{order.items.length > 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold">${order.total}</span>
                    </td>
                    <td className="px-6 py-4">
                      <Select
                        value={order.status}
                        onValueChange={(value) =>
                          updateOrderStatus(order.id, value as Order['status'])
                        }
                      >
                        <SelectTrigger className="w-[130px] h-8">
                          <span
                            className={cn(
                              'inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-full',
                              statusConfig.color
                            )}
                          >
                            <statusConfig.icon className="w-3 h-3" />
                            {statusConfig.label}
                          </span>
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              <div className="flex items-center gap-2">
                                <status.icon className="w-4 h-4" />
                                {status.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-muted-foreground">{order.createdAt}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No orders found</p>
          </div>
        )}
      </div>

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">
              Order {selectedOrder?.id}
            </DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6 mt-4">
              {/* Customer Info */}
              <div>
                <h4 className="font-semibold text-sm mb-2">Customer Details</h4>
                <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
                  <p><span className="text-muted-foreground">Name:</span> {selectedOrder.customer}</p>
                  <p><span className="text-muted-foreground">Phone:</span> {selectedOrder.phone}</p>
                  <p><span className="text-muted-foreground">Address:</span> {selectedOrder.address}</p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-semibold text-sm mb-2">Order Items</h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2 border-b border-border last:border-0"
                    >
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold">${item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center pt-4 border-t border-border">
                <span className="font-semibold">Total</span>
                <span className="text-xl font-bold text-primary">${selectedOrder.total}</span>
              </div>

              {/* Status Update */}
              <div>
                <h4 className="font-semibold text-sm mb-2">Update Status</h4>
                <Select
                  value={selectedOrder.status}
                  onValueChange={(value) =>
                    updateOrderStatus(selectedOrder.id, value as Order['status'])
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        <div className="flex items-center gap-2">
                          <status.icon className="w-4 h-4" />
                          {status.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrders;
