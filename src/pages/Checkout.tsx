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
import { ShoppingBag, CreditCard, Truck, Check, Loader2, Globe, ChevronsUpDown } from 'lucide-react';
import { z } from 'zod';
import {
  shippingCountries,
  getRegions,
  getRegionLabel,
  getPostalCodeLabel,
  getPhonePlaceholder,
  type ShippingCountryCode,
} from '@/data/shippingRegions';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const checkoutSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().trim().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().trim().min(7, 'Please enter a valid phone number').max(20),
  address: z.string().trim().min(10, 'Address must be at least 10 characters').max(500),
  city: z.string().trim().min(2, 'City is required').max(100),
  region: z.string().trim().min(2, 'State/County is required').max(100),
  postalCode: z.string().trim().min(3, 'Postal code is required').max(20),
  country: z.enum(['US', 'GB']),
  notes: z.string().trim().max(500).optional(),
});

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { formatPrice, currency } = useCurrency();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod] = useState<'online'>('online');
  const [regionOpen, setRegionOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    region: '',
    postalCode: '',
    country: 'US' as ShippingCountryCode,
    notes: '',
  });

  const shippingCost = 0; // Free shipping or set your rates
  const grandTotal = totalPrice + shippingCost;

  const regions = getRegions(formData.country);
  const regionLabel = getRegionLabel(formData.country);
  const postalCodeLabel = getPostalCodeLabel(formData.country);
  const phonePlaceholder = getPhonePlaceholder(formData.country);

  const handleCountryChange = (value: string) => {
    setFormData({ ...formData, country: value as ShippingCountryCode, region: '', city: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

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
      const { data: orderNumber } = await supabase.rpc('generate_order_number');

      const countryName = shippingCountries.find(c => c.code === formData.country)?.name || formData.country;
      const fullAddress = `${formData.address}, ${formData.city}, ${formData.region} ${formData.postalCode}, ${countryName}`;

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber || `RV-${Date.now()}`,
          user_id: user?.id || null,
          customer_name: formData.name,
          customer_email: formData.email || null,
          customer_phone: formData.phone,
          shipping_address: fullAddress,
          shipping_city: formData.city,
          subtotal: totalPrice,
          shipping_cost: shippingCost,
          total: grandTotal,
          notes: formData.notes || null,
          payment_method: 'online',
          payment_status: 'unpaid',
          shipping_country: formData.country,
        })
        .select()
        .single();

      if (orderError) throw orderError;

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

      const { data: sessionData, error: sessionError } = await supabase.functions.invoke(
        'create-checkout-session',
        {
          body: {
            order_id: order.order_number,
            items: orderItems.map((item) => ({
              product_name: item.product_name,
              unit_price: item.unit_price,
              quantity: item.quantity,
            })),
            shipping_cost: shippingCost,
            success_url: `${window.location.origin}/order-confirmation?orderId=${order.order_number}`,
            cancel_url: `${window.location.origin}/checkout`,
          },
        }
      );

      if (sessionError || !sessionData?.url) {
        throw new Error(sessionError?.message || 'Failed to create payment session');
      }

      const notifyPayload = {
        order_number: order.order_number,
        customer_name: formData.name,
        customer_phone: formData.phone,
        customer_email: formData.email || undefined,
        shipping_address: fullAddress,
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
        payment_method: 'online',
      };
      supabase.functions.invoke('notify-order', { body: notifyPayload }).catch((err) =>
        console.error('Telegram notification failed:', err)
      );

      clearCart();
      window.location.href = sessionData.url;
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
      <div className="bg-primary/5 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-center">Checkout</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left Column - Shipping Details */}
          <div className="order-2 lg:order-1 space-y-6">
            <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-premium">
              <h2 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
                <Truck className="w-5 h-5 text-primary" />
                Shipping Details
              </h2>

              <form id="checkout-form" onSubmit={handleSubmit} className="space-y-5">
                {/* Country */}
                <div>
                  <Label htmlFor="country">Country *</Label>
                  <Select value={formData.country} onValueChange={handleCountryChange}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {shippingCountries.map((c) => (
                        <SelectItem key={c.code} value={c.code}>
                          {c.code === 'US' ? '🇺🇸' : '🇬🇧'} {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.country && <p className="text-sm text-destructive mt-1">{errors.country}</p>}
                </div>

                {/* Full Name */}
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

                {/* Email */}
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

                {/* Phone */}
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder={phonePlaceholder}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="mt-2"
                  />
                  {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone}</p>}
                </div>

                {/* Address */}
                <div>
                  <Label htmlFor="address">Street Address *</Label>
                  <Textarea
                    id="address"
                    placeholder="Enter your street address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows={2}
                    className="mt-2"
                  />
                  {errors.address && <p className="text-sm text-destructive mt-1">{errors.address}</p>}
                </div>

                {/* City */}
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    placeholder="Enter your city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="mt-2"
                  />
                  {errors.city && <p className="text-sm text-destructive mt-1">{errors.city}</p>}
                </div>

                {/* State/County + Postal Code row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{regionLabel} *</Label>
                    <Popover open={regionOpen} onOpenChange={setRegionOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={regionOpen}
                          className="w-full justify-between mt-2 font-normal"
                        >
                          {formData.region || `Select ${regionLabel.toLowerCase()}...`}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0 bg-card z-50" align="start">
                        <Command>
                          <CommandInput placeholder={`Search ${regionLabel.toLowerCase()}...`} />
                          <CommandList>
                            <CommandEmpty>No {regionLabel.toLowerCase()} found.</CommandEmpty>
                            <CommandGroup className="max-h-60 overflow-y-auto">
                              {regions.map((r) => (
                                <CommandItem
                                  key={r}
                                  value={r}
                                  onSelect={(val) => {
                                    setFormData({ ...formData, region: val });
                                    setRegionOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      formData.region === r ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {r}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    {errors.region && <p className="text-sm text-destructive mt-1">{errors.region}</p>}
                  </div>

                  <div>
                    <Label htmlFor="postalCode">{postalCodeLabel} *</Label>
                    <Input
                      id="postalCode"
                      placeholder={formData.country === 'US' ? '10001' : 'SW1A 1AA'}
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      className="mt-2"
                    />
                    {errors.postalCode && <p className="text-sm text-destructive mt-1">{errors.postalCode}</p>}
                  </div>
                </div>

                {/* Notes */}
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

            {/* Payment Method Card - Mobile */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-premium lg:hidden">
              <h2 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                Payment Method
              </h2>
              <div className="mb-6">
                <div className="w-full p-4 rounded-lg border-2 bg-secondary/50 border-primary flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 bg-primary">
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <Globe className="w-5 h-5 text-primary" />
                  <div className="text-left">
                    <p className="font-medium">Online Payment</p>
                    <p className="text-sm text-muted-foreground">Pay securely online</p>
                  </div>
                </div>
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

          {/* Right Column - Order Summary + Payment (desktop) */}
          <div className="order-1 lg:order-2 space-y-6">
            <div className="bg-card border border-border rounded-xl p-6 shadow-premium">
              <h2 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                Order Summary
              </h2>

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

              <div className="border-t border-border pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}</span>
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

              <div className="bg-muted/50 rounded-lg p-3 mt-4">
                <p className="text-xs text-muted-foreground text-center">
                  We currently ship to the United States and United Kingdom only.
                </p>
              </div>
            </div>

            {/* Payment Method Card - Desktop */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-premium hidden lg:block">
              <h2 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                Payment Method
              </h2>
              <div className="mb-6">
                <div className="w-full p-4 rounded-lg border-2 bg-secondary/50 border-primary flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 bg-primary">
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <Globe className="w-5 h-5 text-primary" />
                  <div className="text-left">
                    <p className="font-medium">Online Payment</p>
                    <p className="text-sm text-muted-foreground">Pay securely online</p>
                  </div>
                </div>
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
