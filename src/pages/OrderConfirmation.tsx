import { useSearchParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';
import { CheckCircle, Package, Truck, Home, CreditCard, Banknote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const OrderConfirmation = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId') || 'RV-000000';
  const [orderInfo, setOrderInfo] = useState<{ payment_method: string; payment_status: string } | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      const { data } = await supabase
        .from('orders')
        .select('payment_method, payment_status')
        .eq('order_number', orderId)
        .single();
      if (data) setOrderInfo(data);
    };
    if (orderId !== 'RV-000000') fetchOrder();
  }, [orderId]);

  return (
    <Layout>
      <SEO title="Order Confirmed" description="Your Rivervox order has been placed successfully." noindex />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-lg mx-auto text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in">
            <CheckCircle className="w-10 h-10 text-primary" />
          </div>

          <h1 className="text-3xl font-display font-bold mb-2 animate-fade-up">
            Order Confirmed!
          </h1>
          <p className="text-muted-foreground mb-8 animate-fade-up-delay-1">
            Thank you for your order. We'll send you a confirmation email shortly.
          </p>

          {/* Order ID */}
          <div className="bg-card border border-border rounded-xl p-6 mb-8 animate-fade-up-delay-2">
            <p className="text-sm text-muted-foreground mb-1">Order Number</p>
            <p className="text-2xl font-bold text-primary">{orderId}</p>
            {orderInfo && (
              <div className="flex items-center justify-center gap-3 mt-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-muted">
                  {orderInfo.payment_method === 'online' ? (
                    <><CreditCard className="w-3 h-3" /> Online Payment</>
                  ) : (
                    <><Banknote className="w-3 h-3" /> Cash on Delivery</>
                  )}
                </span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                  orderInfo.payment_status === 'paid'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {orderInfo.payment_status === 'paid' ? (
                    <><CheckCircle className="w-3 h-3" /> Paid</>
                  ) : (
                    <>Unpaid</>
                  )}
                </span>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="flex justify-center gap-4 mb-8">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6" />
              </div>
              <span className="text-xs mt-2">Confirmed</span>
            </div>
            <div className="flex-1 flex items-center">
              <div className="h-0.5 w-full bg-muted" />
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-muted text-muted-foreground rounded-full flex items-center justify-center">
                <Package className="w-6 h-6" />
              </div>
              <span className="text-xs mt-2 text-muted-foreground">Processing</span>
            </div>
            <div className="flex-1 flex items-center">
              <div className="h-0.5 w-full bg-muted" />
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-muted text-muted-foreground rounded-full flex items-center justify-center">
                <Truck className="w-6 h-6" />
              </div>
              <span className="text-xs mt-2 text-muted-foreground">Shipped</span>
            </div>
            <div className="flex-1 flex items-center">
              <div className="h-0.5 w-full bg-muted" />
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-muted text-muted-foreground rounded-full flex items-center justify-center">
                <Home className="w-6 h-6" />
              </div>
              <span className="text-xs mt-2 text-muted-foreground">Delivered</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link to={`/tracking?orderId=${orderId}`}>
                <Package className="w-4 h-4 mr-2" />
                Track Order
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderConfirmation;
