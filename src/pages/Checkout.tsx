import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ShoppingBag, CreditCard, Truck, Check } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { items, totalPrice, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    notes: '',
  });

  const shippingCost = totalPrice > 100 ? 0 : 10;
  const grandTotal = totalPrice + shippingCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate order creation
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const orderId = `RV-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    clearCart();
    toast({
      title: 'Order Placed Successfully!',
      description: `Your order #${orderId} has been confirmed.`,
    });

    navigate(`/order-confirmation?orderId=${orderId}`);
    setIsSubmitting(false);
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-display font-bold mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">Add some products before checkout</p>
          <Button onClick={() => navigate('/shop')}>Continue Shopping</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Page Header */}
      <div className="bg-primary/5 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-center">Checkout</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Checkout Form */}
          <div className="order-2 lg:order-1">
            <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-premium">
              <h2 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
                <Truck className="w-5 h-5 text-primary" />
                Shipping Details
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name *</label>
                  <Input
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number *</label>
                  <Input
                    type="tel"
                    placeholder="+971 50 000 0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Shipping Address *</label>
                  <Textarea
                    placeholder="Enter your complete address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Order Notes (Optional)</label>
                  <Textarea
                    placeholder="Any special instructions?"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={2}
                  />
                </div>

                {/* Payment Method */}
                <div className="pt-4 border-t border-border">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-primary" />
                    Payment Method
                  </h3>
                  <div className="p-4 bg-secondary/50 rounded-lg border-2 border-primary flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">Cash on Delivery</p>
                      <p className="text-xs text-muted-foreground">Pay when you receive</p>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-14 btn-hero text-lg mt-6"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="animate-pulse">Processing Order...</span>
                  ) : (
                    <>
                      Place Order - ${grandTotal.toFixed(2)}
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="order-1 lg:order-2">
            <div className="bg-card border border-border rounded-xl p-6 shadow-premium sticky top-24">
              <h2 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                Order Summary
              </h2>

              {/* Items */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.selectedSize}-${item.selectedColor.name}`}
                    className="flex gap-4"
                  >
                    <div className="w-16 h-20 bg-muted rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">{item.product.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {item.selectedSize} / {item.selectedColor.name}
                      </p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-border pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>
                    {shippingCost === 0 ? (
                      <span className="text-primary">Free</span>
                    ) : (
                      `$${shippingCost.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-3 border-t border-border">
                  <span>Total</span>
                  <span className="text-primary">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Free Shipping Notice */}
              {shippingCost > 0 && (
                <p className="text-xs text-muted-foreground text-center mt-4">
                  Add ${(100 - totalPrice).toFixed(2)} more for free shipping!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
