import { Layout } from '@/components/layout/Layout';
import { Truck, Clock, Globe, Package } from 'lucide-react';

const ShippingPolicy = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-display font-bold mb-8">Shipping Policy</h1>
          
          {/* Quick Info Cards */}
          <div className="grid sm:grid-cols-2 gap-4 mb-12">
            <div className="p-6 bg-card border border-border rounded-xl flex items-start gap-4">
              <Truck className="w-8 h-8 text-primary shrink-0" />
              <div>
                <h3 className="font-semibold">Free Shipping</h3>
                <p className="text-sm text-muted-foreground">On orders over $150</p>
              </div>
            </div>
            <div className="p-6 bg-card border border-border rounded-xl flex items-start gap-4">
              <Clock className="w-8 h-8 text-primary shrink-0" />
              <div>
                <h3 className="font-semibold">Processing Time</h3>
                <p className="text-sm text-muted-foreground">1-2 business days</p>
              </div>
            </div>
            <div className="p-6 bg-card border border-border rounded-xl flex items-start gap-4">
              <Globe className="w-8 h-8 text-primary shrink-0" />
              <div>
                <h3 className="font-semibold">International</h3>
                <p className="text-sm text-muted-foreground">Worldwide delivery</p>
              </div>
            </div>
            <div className="p-6 bg-card border border-border rounded-xl flex items-start gap-4">
              <Package className="w-8 h-8 text-primary shrink-0" />
              <div>
                <h3 className="font-semibold">Tracking</h3>
                <p className="text-sm text-muted-foreground">Real-time updates</p>
              </div>
            </div>
          </div>

          <div className="prose prose-lg max-w-none space-y-8 text-foreground/80">
            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">Shipping Rates</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 pr-4 font-semibold">Region</th>
                      <th className="text-left py-3 pr-4 font-semibold">Standard</th>
                      <th className="text-left py-3 font-semibold">Express</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="py-3 pr-4">UAE</td>
                      <td className="py-3 pr-4">Free (3-5 days)</td>
                      <td className="py-3">$10 (1-2 days)</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4">GCC Countries</td>
                      <td className="py-3 pr-4">$15 (5-7 days)</td>
                      <td className="py-3">$25 (2-3 days)</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4">Middle East</td>
                      <td className="py-3 pr-4">$20 (7-10 days)</td>
                      <td className="py-3">$35 (3-5 days)</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4">International</td>
                      <td className="py-3 pr-4">$30 (10-15 days)</td>
                      <td className="py-3">$50 (5-7 days)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-muted-foreground">
                *Free shipping on all orders over $150 (standard delivery only)
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">Processing Time</h2>
              <p>
                Orders are processed within 1-2 business days (excluding weekends and holidays). During peak seasons or promotional periods, processing may take up to 3-4 business days.
              </p>
              <p>
                You will receive a confirmation email with tracking information once your order has been shipped.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">Order Tracking</h2>
              <p>
                Once your order is dispatched, you will receive an email with your tracking number. You can track your order using our{' '}
                <a href="/tracking" className="text-primary hover:underline">
                  Order Tracking
                </a>{' '}
                page or directly on the carrier's website.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">Delivery Information</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Please ensure your shipping address is correct and complete</li>
                <li>Include a phone number for delivery coordination</li>
                <li>Someone should be available to receive the package</li>
                <li>Signature may be required for high-value orders</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">Customs & Import Duties</h2>
              <p>
                For international orders, customers are responsible for any customs duties, import taxes, or fees that may apply. These charges are determined by your country's customs authorities and are not included in our shipping costs.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">Lost or Damaged Packages</h2>
              <p>
                If your package is lost or arrives damaged, please contact our customer service team within 48 hours of the expected delivery date. We will work with the carrier to resolve the issue and ensure you receive your order.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">Contact Us</h2>
              <p>
                For shipping inquiries, please contact us at{' '}
                <a href="mailto:shipping@rivervox.com" className="text-primary hover:underline">
                  shipping@rivervox.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ShippingPolicy;
