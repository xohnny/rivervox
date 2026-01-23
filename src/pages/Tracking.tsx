import { useState } from 'react';
import { Search, Package, Truck, CheckCircle, Clock, MapPin } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface TrackingResult {
  orderId: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  items: { name: string; quantity: number }[];
  estimatedDelivery: string;
  shippingAddress: string;
  timeline: {
    status: string;
    date: string;
    completed: boolean;
  }[];
}

// Mock tracking data
const mockOrders: Record<string, TrackingResult> = {
  'RV-001234': {
    orderId: 'RV-001234',
    status: 'shipped',
    items: [
      { name: 'Emerald Silk Thobe', quantity: 1 },
      { name: 'Modest Hijab Premium', quantity: 2 },
    ],
    estimatedDelivery: 'January 25, 2024',
    shippingAddress: 'Dubai, UAE',
    timeline: [
      { status: 'Order Placed', date: 'Jan 20, 2024', completed: true },
      { status: 'Processing', date: 'Jan 21, 2024', completed: true },
      { status: 'Shipped', date: 'Jan 22, 2024', completed: true },
      { status: 'Delivered', date: 'Pending', completed: false },
    ],
  },
};

const Tracking = () => {
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [error, setError] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSearching(true);

    // Simulate API call
    setTimeout(() => {
      const order = mockOrders[orderId.toUpperCase()];
      if (order) {
        setResult(order);
      } else {
        setError('Order not found. Please check your order ID and try again.');
        setResult(null);
      }
      setIsSearching(false);
    }, 1000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return Clock;
      case 'processing':
        return Package;
      case 'shipped':
        return Truck;
      case 'delivered':
        return CheckCircle;
      default:
        return Package;
    }
  };

  const StatusIcon = result ? getStatusIcon(result.status) : Package;

  return (
    <Layout>
      {/* Page Header */}
      <div className="bg-primary/5 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-center">
            Track Your Order
          </h1>
          <p className="text-muted-foreground text-center mt-2">
            Enter your order details to see the current status
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Search Form */}
        <form
          onSubmit={handleSearch}
          className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-premium mb-8"
        >
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Order ID</label>
              <Input
                placeholder="e.g., RV-001234"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <Input
                type="tel"
                placeholder="Your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>
          <Button
            type="submit"
            className="w-full h-12 bg-primary hover:bg-primary/90"
            disabled={isSearching}
          >
            {isSearching ? (
              <span className="animate-pulse">Searching...</span>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Track Order
              </>
            )}
          </Button>

          {error && (
            <p className="text-destructive text-sm text-center mt-4">{error}</p>
          )}

          <p className="text-xs text-muted-foreground text-center mt-4">
            Try: RV-001234 for demo
          </p>
        </form>

        {/* Results */}
        {result && (
          <div className="animate-fade-up space-y-6">
            {/* Status Card */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-premium">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <StatusIcon className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Order #{result.orderId}</p>
                  <p className="text-2xl font-display font-bold capitalize">
                    {result.status}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg">
                  <MapPin className="w-4 h-4 text-primary mt-0.5" />
                  <div>
                    <p className="text-muted-foreground">Shipping to</p>
                    <p className="font-medium">{result.shippingAddress}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg">
                  <Truck className="w-4 h-4 text-primary mt-0.5" />
                  <div>
                    <p className="text-muted-foreground">Estimated Delivery</p>
                    <p className="font-medium">{result.estimatedDelivery}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-premium">
              <h3 className="font-display font-semibold text-lg mb-6">Order Timeline</h3>
              <div className="space-y-4">
                {result.timeline.map((item, index) => (
                  <div key={item.status} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center',
                          item.completed
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        )}
                      >
                        {item.completed ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <Clock className="w-4 h-4" />
                        )}
                      </div>
                      {index < result.timeline.length - 1 && (
                        <div
                          className={cn(
                            'w-0.5 h-8 mt-1',
                            item.completed ? 'bg-primary' : 'bg-muted'
                          )}
                        />
                      )}
                    </div>
                    <div className="pt-1">
                      <p className={cn('font-medium', !item.completed && 'text-muted-foreground')}>
                        {item.status}
                      </p>
                      <p className="text-sm text-muted-foreground">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-premium">
              <h3 className="font-display font-semibold text-lg mb-4">Order Items</h3>
              <div className="space-y-3">
                {result.items.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <span>{item.name}</span>
                    <span className="text-muted-foreground">x{item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Tracking;
