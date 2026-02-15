import { useState } from 'react';

const formatPrice = (price: number) => {
  return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};
import { Search, Eye, ShoppingBag, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  orders: number;
  totalSpent: number;
  lastOrder: string;
  orderHistory: {
    id: string;
    date: string;
    total: number;
    status: string;
  }[];
}

const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Ahmed Hassan',
    email: 'ahmed.hassan@email.com',
    phone: '+971 50 123 4567',
    orders: 8,
    totalSpent: 2450,
    lastOrder: '2024-01-23',
    orderHistory: [
      { id: 'RV-001234', date: '2024-01-23', total: 267, status: 'pending' },
      { id: 'RV-001198', date: '2024-01-15', total: 189, status: 'delivered' },
      { id: 'RV-001145', date: '2024-01-02', total: 349, status: 'delivered' },
    ],
  },
  {
    id: '2',
    name: 'Sarah Ahmed',
    email: 'sarah.ahmed@email.com',
    phone: '+971 55 987 6543',
    orders: 5,
    totalSpent: 1890,
    lastOrder: '2024-01-22',
    orderHistory: [
      { id: 'RV-001233', date: '2024-01-22', total: 458, status: 'processing' },
      { id: 'RV-001187', date: '2024-01-10', total: 159, status: 'delivered' },
    ],
  },
  {
    id: '3',
    name: 'Omar Ali',
    email: 'omar.ali@email.com',
    phone: '+971 52 111 2222',
    orders: 12,
    totalSpent: 4280,
    lastOrder: '2024-01-21',
    orderHistory: [
      { id: 'RV-001232', date: '2024-01-21', total: 258, status: 'shipped' },
      { id: 'RV-001200', date: '2024-01-18', total: 129, status: 'delivered' },
    ],
  },
  {
    id: '4',
    name: 'Fatima Khan',
    email: 'fatima.khan@email.com',
    phone: '+971 50 333 4444',
    orders: 3,
    totalSpent: 645,
    lastOrder: '2024-01-20',
    orderHistory: [
      { id: 'RV-001231', date: '2024-01-20', total: 217, status: 'delivered' },
    ],
  },
  {
    id: '5',
    name: 'Mohammed Saeed',
    email: 'm.saeed@email.com',
    phone: '+971 56 555 6666',
    orders: 15,
    totalSpent: 5670,
    lastOrder: '2024-01-19',
    orderHistory: [
      { id: 'RV-001230', date: '2024-01-19', total: 89, status: 'delivered' },
      { id: 'RV-001215', date: '2024-01-14', total: 459, status: 'delivered' },
    ],
  },
];

const AdminCustomers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filteredCustomers = mockCustomers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-display font-bold">Customers</h1>
        <p className="text-muted-foreground mt-1">View and manage your customer base</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-2xl font-bold">{mockCustomers.length}</p>
          <p className="text-sm text-muted-foreground">Total Customers</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-2xl font-bold">
            {mockCustomers.reduce((sum, c) => sum + c.orders, 0)}
          </p>
          <p className="text-sm text-muted-foreground">Total Orders</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-2xl font-bold">
            {formatPrice(mockCustomers.reduce((sum, c) => sum + c.totalSpent, 0))}
          </p>
          <p className="text-sm text-muted-foreground">Total Revenue</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-2xl font-bold">
            {formatPrice(Math.round(
              mockCustomers.reduce((sum, c) => sum + c.totalSpent, 0) /
                mockCustomers.reduce((sum, c) => sum + c.orders, 0)
            ))}
          </p>
          <p className="text-sm text-muted-foreground">Avg. Order Value</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search customers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Customers Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold">Customer</th>
                <th className="text-left px-6 py-4 text-sm font-semibold">Contact</th>
                <th className="text-left px-6 py-4 text-sm font-semibold">Orders</th>
                <th className="text-left px-6 py-4 text-sm font-semibold">Total Spent</th>
                <th className="text-left px-6 py-4 text-sm font-semibold">Last Order</th>
                <th className="text-right px-6 py-4 text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="font-semibold text-primary">
                          {customer.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-xs text-muted-foreground">ID: {customer.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="text-sm flex items-center gap-1">
                        <Mail className="w-3 h-3 text-muted-foreground" />
                        {customer.email}
                      </p>
                      <p className="text-sm flex items-center gap-1">
                        <Phone className="w-3 h-3 text-muted-foreground" />
                        {customer.phone}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-muted-foreground" />
                      <span>{customer.orders}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-primary">
                      {formatPrice(customer.totalSpent)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-muted-foreground">{customer.lastOrder}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedCustomer(customer)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No customers found</p>
          </div>
        )}
      </div>

      {/* Customer Details Dialog */}
      <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">Customer Details</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-6 mt-4">
              {/* Customer Info */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">
                    {selectedCustomer.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{selectedCustomer.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedCustomer.email}</p>
                  <p className="text-sm text-muted-foreground">{selectedCustomer.phone}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <p className="text-lg font-bold">{selectedCustomer.orders}</p>
                  <p className="text-xs text-muted-foreground">Orders</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <p className="text-lg font-bold text-primary">
                    {formatPrice(selectedCustomer.totalSpent)}
                  </p>
                  <p className="text-xs text-muted-foreground">Total Spent</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <p className="text-lg font-bold">
                    {formatPrice(Math.round(selectedCustomer.totalSpent / selectedCustomer.orders))}
                  </p>
                  <p className="text-xs text-muted-foreground">Avg. Order</p>
                </div>
              </div>

              {/* Order History */}
              <div>
                <h4 className="font-semibold text-sm mb-3">Recent Orders</h4>
                <div className="space-y-2">
                  {selectedCustomer.orderHistory.map((order) => (
                    <div
                      key={order.id}
                      className="flex justify-between items-center py-2 border-b border-border last:border-0"
                    >
                      <div>
                        <p className="font-mono text-sm font-medium">{order.id}</p>
                        <p className="text-xs text-muted-foreground">{order.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatPrice(order.total)}</p>
                        <span className="text-xs capitalize text-muted-foreground">
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCustomers;
