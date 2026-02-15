import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useCurrency } from '@/context/CurrencyContext';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ShoppingBag, CreditCard, Truck, Check, Loader2, Banknote, Globe, ChevronsUpDown } from 'lucide-react';
import { z } from 'zod';
import { bangladeshDistricts } from '@/data/bangladeshDistricts';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const checkoutSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().trim().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().trim().regex(/^01[3-9]\d{8}$/, 'Phone must be a valid 11-digit Bangladesh number (e.g., 01XXXXXXXXX)'),
  address: z.string().trim().min(10, 'Address must be at least 10 characters').max(500),
  city: z.string().trim().min(2, 'City is required').max(100),
  notes: z.string().trim().max(500).optional(),
});

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { formatPrice, currency } = useCurrency();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');
  const [cityOpen, setCityOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: 'Dhaka',
    notes: '',
  });

  // Shipping: $60 for Dhaka, $100 for outside Dhaka
  const shippingCost = formData.city.toLowerCase() === 'dhaka' ? 60 : 100;
  const grandTotal = totalPrice + shippingCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate form
    const result = checkoutSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate order number
      const { data: orderNumber } = await supabase.rpc('generate_order_number');

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber || `RV-${Date.now()}`,
          user_id: user?.id || null,
          customer_name: formData.name,
          customer_email: formData.email || null,
          customer_phone: formData.phone,
          shipping_address: formData.address,
          shipping_city: formData.city,
          subtotal: totalPrice,
          shipping_cost: shippingCost,
          total: grandTotal,
          notes: formData.notes || null,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        product_name: item.product.name,
        product_image: item.product.images[0],
        quantity: item.quantity,
        unit_price: item.product.price,
        selected_size: item.selectedSize,
        selected_color_name: item.selectedColor.name,
        selected_color_hex: item.selectedColor.hex,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Send Telegram notification (fire-and-forget)
      const notifyPayload = {
        order_number: order.order_number,
        customer_name: formData.name,
        customer_phone: formData.phone,
        customer_email: formData.email || undefined,
        shipping_address: formData.address,
        shipping_city: formData.city,
        subtotal: totalPrice,
        shipping_cost: shippingCost,
        total: grandTotal,
        items: orderItems.map((item) => ({
          product_name: item.product_name,
          quantity: item.quantity,
          unit_price: item.unit_price,
          selected_size: item.selected_size,
          selected_color_name: item.selected_color_name,
        })),
        notes: formData.notes || undefined,
      };
      supabase.functions.invoke('notify-order', { body: notifyPayload }).catch((err) =>
        console.error('Telegram notification failed:', err)
      );

      // Clear cart and redirect
      clearCart();
      toast({
        title: 'Order Placed Successfully!',
        description: `Your order #${order.order_number} has been confirmed.`,
      });

      navigate(`/order-confirmation?orderId=${order.order_number}`);
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: 'Order Failed',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
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
          {/* Left Column - Shipping Details + Payment Method (mobile) */}
          <div className="order-2 lg:order-1 space-y-6">
            {/* Shipping Details Card */}
            <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-premium">
              <h2 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
                <Truck className="w-5 h-5 text-primary" />
                Shipping Details
              </h2>

              <form id="checkout-form" onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-2"
                  />
                  {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
                </div>

                <div>
                  <Label htmlFor="email">Email (Optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-2"
                  />
                  {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    value={formData.phone}
                    onChange={(e) => {
                      // Only allow digits and limit to 11 characters
                      const value = e.target.value.replace(/\D/g, '').slice(0, 11);
                      setFormData({ ...formData, phone: value });
                    }}
                    maxLength={11}
                    className="mt-2"
                  />
                  {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <Label htmlFor="city">District *</Label>
                  <Popover open={cityOpen} onOpenChange={setCityOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={cityOpen}
                        className="w-full justify-between mt-2 font-normal"
                      >
                        {formData.city || "Select district..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0 bg-card z-50" align="start">
                      <Command>
                        <CommandInput placeholder="Search district..." />
                        <CommandList>
                          <CommandEmpty>No district found.</CommandEmpty>
                          <CommandGroup className="max-h-60 overflow-y-auto">
                            {bangladeshDistricts.map((district) => (
                              <CommandItem
                                key={district}
                                value={district}
                                onSelect={(currentValue) => {
                                  setFormData({ ...formData, city: currentValue });
                                  setCityOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    formData.city === district ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {district}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {errors.city && <p className="text-sm text-destructive mt-1">{errors.city}</p>}
                </div>

                <div>
                  <Label htmlFor="address">Shipping Address *</Label>
                  <Textarea
                    id="address"
                    placeholder="Enter your complete address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows={3}
                    className="mt-2"
                  />
                  {errors.address && <p className="text-sm text-destructive mt-1">{errors.address}</p>}
                </div>

                <div>
                  <Label htmlFor="notes">Order Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any special instructions?"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={2}
                    className="mt-2"
                  />
                </div>

              </form>
            </div>

            {/* Payment Method Card - Shows after Shipping on mobile */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-premium lg:hidden">
              <h2 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                Payment Method
              </h2>
              <div className="space-y-3 mb-6">
                {/* Cash on Delivery */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`w-full p-4 rounded-lg border-2 flex items-center gap-3 transition-all ${
                    paymentMethod === 'cod'
                      ? 'bg-secondary/50 border-primary'
                      : 'bg-card border-border hover:border-primary/50'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    paymentMethod === 'cod' ? 'bg-primary' : 'border-2 border-muted-foreground/30'
                  }`}>
                    {paymentMethod === 'cod' && <Check className="w-4 h-4 text-primary-foreground" />}
                  </div>
                  <Banknote className="w-5 h-5 text-primary" />
                  <div className="text-left">
                    <p className="font-medium">Cash on Delivery</p>
                    <p className="text-sm text-muted-foreground">Pay when you receive</p>
                  </div>
                </button>

                {/* Online Payment */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('online')}
                  className={`w-full p-4 rounded-lg border-2 flex items-center gap-3 transition-all ${
                    paymentMethod === 'online'
                      ? 'bg-secondary/50 border-primary'
                      : 'bg-card border-border hover:border-primary/50'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    paymentMethod === 'online' ? 'bg-primary' : 'border-2 border-muted-foreground/30'
                  }`}>
                    {paymentMethod === 'online' && <Check className="w-4 h-4 text-primary-foreground" />}
                  </div>
                  <Globe className="w-5 h-5 text-primary" />
                  <div className="text-left">
                    <p className="font-medium">Online Payment</p>
                    <p className="text-sm text-muted-foreground">Pay securely online</p>
                  </div>
                </button>
              </div>
              <Button
                type="submit"
                form="checkout-form"
                className="w-full h-14 btn-hero text-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing Order...
                  </>
                ) : (
                  <>Place Order - {formatPrice(grandTotal)}</>
                )}
              </Button>
            </div>
          </div>

          {/* Right Column - Order Summary + Payment Method (desktop) */}
          <div className="order-1 lg:order-2 space-y-6">
            {/* Order Summary Card */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-premium">
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
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-border pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{formatPrice(shippingCost)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-3 border-t border-border">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(grandTotal)}</span>
                </div>
                {currency.code !== 'USD' && (
                  <p className="text-xs text-muted-foreground text-right">
                    ≈ ${grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                  </p>
                )}
              </div>

              {/* Currency & Shipping Notice */}
              <div className="bg-muted/50 rounded-lg p-3 mt-4 space-y-1">
                <p className="text-xs text-muted-foreground text-center">
                  Prices shown in {currency.name} ({currency.symbol}). Final charge will be processed at the equivalent rate.
                </p>
                <p className="text-xs text-muted-foreground text-center">
                  {formData.city.toLowerCase() === 'dhaka' 
                    ? `Dhaka delivery: ${formatPrice(60)}` 
                    : `Outside Dhaka delivery: ${formatPrice(100)}`}
                </p>
              </div>
            </div>

            {/* Payment Method Card - Desktop only */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-premium hidden lg:block">
              <h2 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                Payment Method
              </h2>
              <div className="space-y-3 mb-6">
                {/* Cash on Delivery */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`w-full p-4 rounded-lg border-2 flex items-center gap-3 transition-all ${
                    paymentMethod === 'cod'
                      ? 'bg-secondary/50 border-primary'
                      : 'bg-card border-border hover:border-primary/50'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    paymentMethod === 'cod' ? 'bg-primary' : 'border-2 border-muted-foreground/30'
                  }`}>
                    {paymentMethod === 'cod' && <Check className="w-4 h-4 text-primary-foreground" />}
                  </div>
                  <Banknote className="w-5 h-5 text-primary" />
                  <div className="text-left">
                    <p className="font-medium">Cash on Delivery</p>
                    <p className="text-sm text-muted-foreground">Pay when you receive</p>
                  </div>
                </button>

                {/* Online Payment */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('online')}
                  className={`w-full p-4 rounded-lg border-2 flex items-center gap-3 transition-all ${
                    paymentMethod === 'online'
                      ? 'bg-secondary/50 border-primary'
                      : 'bg-card border-border hover:border-primary/50'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    paymentMethod === 'online' ? 'bg-primary' : 'border-2 border-muted-foreground/30'
                  }`}>
                    {paymentMethod === 'online' && <Check className="w-4 h-4 text-primary-foreground" />}
                  </div>
                  <Globe className="w-5 h-5 text-primary" />
                  <div className="text-left">
                    <p className="font-medium">Online Payment</p>
                    <p className="text-sm text-muted-foreground">Pay securely online</p>
                  </div>
                </button>
              </div>
              <Button
                type="submit"
                form="checkout-form"
                className="w-full h-14 btn-hero text-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing Order...
                  </>
                ) : (
                  <>Place Order - {formatPrice(grandTotal)}</>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
