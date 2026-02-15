import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Package, Truck, CheckCircle, Clock, MapPin, Loader2, XCircle } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useCurrency } from '@/context/CurrencyContext';
import { cn } from '@/lib/utils';
import { Tables } from '@/integrations/supabase/types';

type Order = Tables<'orders'>;
type OrderItem = Tables<'order_items'>;

interface OrderWithItems extends Order {
  order_items: OrderItem[];
}

const statusSteps = ['pending', 'processing', 'shipped', 'delivered'];

const Tracking = () => {
  const [searchParams] = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get('orderId') || '');
  const [phone, setPhone] = useState('');
  const [order, setOrder] = useState<OrderWithItems | null>(null);
  const [error, setError] = useState('');
  const { formatPrice } = useCurrency();
  const [isSearching, setIsSearching] = useState(false);

  // Auto-search if orderId is in URL
  useEffect(() => {
    const orderIdFromUrl = searchParams.get('orderId');
    if (orderIdFromUrl) {
      setOrderId(orderIdFromUrl);
      handleSearch(undefined, orderIdFromUrl);
    }
  }, [searchParams]);

  const handleSearch = async (e?: React.FormEvent, searchOrderId?: string) => {
    if (e) e.preventDefault();
    const searchId = searchOrderId || orderId;
    
    if (!searchId) return;
    
    setError('');
    setIsSearching(true);

    try {
      const { data, error: searchError } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('order_number', searchId.toUpperCase())
        .maybeSingle();

      if (searchError) throw searchError;

      if (data) {
        setOrder(data as OrderWithItems);
      } else {
        setError('Order not found. Please check your order ID and try again.');
        setOrder(null);
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('An error occurred. Please try again.');
      setOrder(null);
    } finally {
      setIsSearching(false);
    }
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
      case 'cancelled':
        return XCircle;
      default:
        return Package;
    }
  };

  const getStatusIndex = (status: string) => statusSteps.indexOf(status);

  const StatusIcon = order ? getStatusIcon(order.status) : Package;

  return (
    <Layout>
      <SEO
        title="Track Your Order"
        description="Track your Rivervox order in real-time. Enter your order number to see shipping status and delivery updates."
        keywords="track order, Rivervox order tracking, shipping status, delivery update"
        canonicalPath="/tracking"
      />
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
                placeholder="e.g., RV-20260123-0001"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone Number (Optional)</label>
              <Input
                type="tel"
                placeholder="Your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>
          <Button
            type="submit"
            className="w-full h-12 bg-primary hover:bg-primary/90"
            disabled={isSearching}
          >
            {isSearching ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Searching...
              </>
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
        </form>

        {/* Results */}
        {order && (
          <div className="animate-fade-in space-y-6">
            {/* Status Card */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-premium">
              <div className="flex items-center gap-4 mb-6">
                <div className={cn(
                  'w-16 h-16 rounded-full flex items-center justify-center',
                  order.status === 'cancelled' ? 'bg-destructive/10' : 'bg-primary/10'
                )}>
                  <StatusIcon className={cn(
                    'w-8 h-8',
                    order.status === 'cancelled' ? 'text-destructive' : 'text-primary'
                  )} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Order #{order.order_number}</p>
                  <p className="text-2xl font-display font-bold capitalize">
                    {order.status}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg">
                  <MapPin className="w-4 h-4 text-primary mt-0.5" />
                  <div>
                    <p className="text-muted-foreground">Shipping to</p>
                    <p className="font-medium">{order.shipping_city}, {order.shipping_country}</p>
                    <p className="text-xs text-muted-foreground">{order.shipping_address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg">
                  <Package className="w-4 h-4 text-primary mt-0.5" />
                  <div>
                    <p className="text-muted-foreground">Order Total</p>
                    <p className="font-medium">{formatPrice(Number(order.total))}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            {order.status !== 'cancelled' && (
              <div className="bg-card border border-border rounded-xl p-6 shadow-premium">
                <h3 className="font-display font-semibold text-lg mb-6">Order Progress</h3>
                <div className="space-y-4">
                  {statusSteps.map((step, index) => {
                    const isCompleted = getStatusIndex(order.status) >= index;
                    const isCurrent = order.status === step;
                    return (
                      <div key={step} className="flex items-start gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={cn(
                              'w-8 h-8 rounded-full flex items-center justify-center',
                              isCompleted
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground'
                            )}
                          >
                            {isCompleted ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <Clock className="w-4 h-4" />
                            )}
                          </div>
                          {index < statusSteps.length - 1 && (
                            <div
                              className={cn(
                                'w-0.5 h-8 mt-1',
                                isCompleted ? 'bg-primary' : 'bg-muted'
                              )}
                            />
                          )}
                        </div>
                        <div className="pt-1">
                          <p className={cn(
                            'font-medium capitalize',
                            !isCompleted && 'text-muted-foreground'
                          )}>
                            {step}
                          </p>
                          {isCurrent && (
                            <p className="text-sm text-muted-foreground">Current status</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Order Items */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-premium">
              <h3 className="font-display font-semibold text-lg mb-4">Order Items</h3>
              <div className="space-y-4">
                {order.order_items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 py-3 border-b border-border last:border-0"
                  >
                    {item.product_image && (
                      <div className="w-16 h-20 bg-muted rounded-md overflow-hidden flex-shrink-0">
                        <img
                          src={item.product_image}
                          alt={item.product_name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{item.product_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.selected_size} / {item.selected_color_name}
                      </p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">
                      {formatPrice(Number(item.unit_price) * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="border-t border-border mt-4 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(Number(order.subtotal))}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>
                    {Number(order.shipping_cost) === 0 ? 'Free' : formatPrice(Number(order.shipping_cost))}
                  </span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t border-border">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(Number(order.total))}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Tracking;
