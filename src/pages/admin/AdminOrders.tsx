import { useState } from 'react';
import { Search, Eye, Package, Truck, CheckCircle, Clock, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
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
import { useAdminOrders, type AdminOrder } from '@/hooks/useAdminOrders';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import type { Database } from '@/integrations/supabase/types';

type OrderStatus = Database['public']['Enums']['order_status'];

const statusOptions = [
  { value: 'pending', label: 'Pending', icon: Clock, color: 'bg-amber-100 text-amber-700', triggerColor: 'border-amber-400 bg-amber-50' },
  { value: 'processing', label: 'Processing', icon: Package, color: 'bg-blue-100 text-blue-700', triggerColor: 'border-blue-400 bg-blue-50' },
  { value: 'shipped', label: 'Shipped', icon: Truck, color: 'bg-purple-100 text-purple-700', triggerColor: 'border-purple-400 bg-purple-50' },
  { value: 'delivered', label: 'Delivered', icon: CheckCircle, color: 'bg-emerald-100 text-emerald-700', triggerColor: 'border-emerald-400 bg-emerald-50' },
  { value: 'cancelled', label: 'Cancelled', icon: XCircle, color: 'bg-red-100 text-red-700', triggerColor: 'border-red-400 bg-red-50' },
];

const AdminOrders = () => {
  const { isAdmin, loading: authLoading } = useAdminAuth();
  const { orders, loading: ordersLoading, updateOrderStatus } = useAdminOrders();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_phone.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    const success = await updateOrderStatus(orderId, newStatus);
    if (success && selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const getStatusConfig = (status: string) => {
    return statusOptions.find((s) => s.value === status) || statusOptions[0];
  };

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
            placeholder="Search by order ID, customer name or phone..."
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
        {ordersLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
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
                        <span className="font-mono font-medium">{order.order_number}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium">{order.customer_name}</p>
                          <p className="text-xs text-muted-foreground">{order.customer_phone}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm">
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold">${Number(order.total).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </td>
                      <td className="px-6 py-4">
                        <Select
                          value={order.status}
                          onValueChange={(value) =>
                            handleStatusUpdate(order.id, value as OrderStatus)
                          }
                        >
                          <SelectTrigger className={cn('w-[140px] h-8', statusConfig.triggerColor)}>
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
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(order.created_at), 'MMM dd, yyyy')}
                        </span>
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
        )}

        {!ordersLoading && filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No orders found</p>
          </div>
        )}
      </div>

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">
              Order {selectedOrder?.order_number}
            </DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6 mt-4">
              {/* Customer Info */}
              <div>
                <h4 className="font-semibold text-sm mb-2">Customer Details</h4>
                <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
                  <p><span className="text-muted-foreground">Name:</span> {selectedOrder.customer_name}</p>
                  <p><span className="text-muted-foreground">Phone:</span> {selectedOrder.customer_phone}</p>
                  {selectedOrder.customer_email && (
                    <p><span className="text-muted-foreground">Email:</span> {selectedOrder.customer_email}</p>
                  )}
                  <p><span className="text-muted-foreground">Address:</span> {selectedOrder.shipping_address}</p>
                  <p><span className="text-muted-foreground">City:</span> {selectedOrder.shipping_city}</p>
                  <p><span className="text-muted-foreground">Country:</span> {selectedOrder.shipping_country}</p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-semibold text-sm mb-2">Order Items</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 py-2 border-b border-border last:border-0"
                    >
                      {item.product_image && (
                        <img 
                          src={item.product_image} 
                          alt={item.product_name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.product_name}</p>
                        <p className="text-xs text-muted-foreground">
                          Size: {item.selected_size} • Color: {item.selected_color_name}
                        </p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold">${(item.unit_price * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="space-y-2 pt-4 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${Number(selectedOrder.subtotal).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>${Number(selectedOrder.shipping_cost).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-border">
                  <span className="font-semibold">Total</span>
                  <span className="text-xl font-bold text-primary">${Number(selectedOrder.total).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div>
                  <h4 className="font-semibold text-sm mb-2">Notes</h4>
                  <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
                    {selectedOrder.notes}
                  </p>
                </div>
              )}

              {/* Status Update */}
              <div>
                <h4 className="font-semibold text-sm mb-2">Update Status</h4>
                <Select
                  value={selectedOrder.status}
                  onValueChange={(value) =>
                    handleStatusUpdate(selectedOrder.id, value as OrderStatus)
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

              {/* Order Meta */}
              <div className="text-xs text-muted-foreground space-y-1 pt-4 border-t border-border">
                <p>Created: {format(new Date(selectedOrder.created_at), 'PPpp')}</p>
                <p>Updated: {format(new Date(selectedOrder.updated_at), 'PPpp')}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrders;
