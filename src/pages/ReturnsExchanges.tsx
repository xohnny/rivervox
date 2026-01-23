import { Layout } from '@/components/layout/Layout';
import { RotateCcw, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const ReturnsExchanges = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-display font-bold mb-8">Returns & Exchanges</h1>
          
          {/* Policy Highlight */}
          <div className="p-6 bg-primary/5 border border-primary/20 rounded-xl mb-12 flex items-start gap-4">
            <RotateCcw className="w-8 h-8 text-primary shrink-0" />
            <div>
              <h3 className="font-semibold text-lg">30-Day Return Policy</h3>
              <p className="text-muted-foreground">
                We offer hassle-free returns within 30 days of delivery. Your satisfaction is our priority.
              </p>
            </div>
          </div>

          <div className="prose prose-lg max-w-none space-y-8 text-foreground/80">
            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">Return Eligibility</h2>
              
              <div className="grid gap-4">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-emerald-800">Eligible for Return</p>
                    <ul className="text-sm text-emerald-700 mt-2 space-y-1">
                      <li>• Unused items in original condition with tags attached</li>
                      <li>• Items in original packaging</li>
                      <li>• Returns requested within 30 days of delivery</li>
                    </ul>
                  </div>
                </div>
                
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-800">Not Eligible for Return</p>
                    <ul className="text-sm text-red-700 mt-2 space-y-1">
                      <li>• Items that have been worn, washed, or altered</li>
                      <li>• Items without original tags or packaging</li>
                      <li>• Sale or clearance items marked as final sale</li>
                      <li>• Intimate apparel and accessories (hijabs, etc.)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">How to Return</h2>
              <ol className="list-decimal list-inside space-y-3 ml-4">
                <li>
                  <strong>Initiate Return:</strong> Log into your account and go to Order History, or contact our customer service team
                </li>
                <li>
                  <strong>Pack Items:</strong> Carefully pack items in original packaging with all tags attached
                </li>
                <li>
                  <strong>Ship:</strong> Use the prepaid return label provided (for UAE orders) or ship via your preferred carrier
                </li>
                <li>
                  <strong>Receive Refund:</strong> Once we receive and inspect the items, your refund will be processed within 5-7 business days
                </li>
              </ol>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">Exchanges</h2>
              <p>
                We offer free exchanges for different sizes or colors of the same item, subject to availability. To request an exchange:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Contact our customer service with your order number</li>
                <li>Specify the item and the new size/color you prefer</li>
                <li>We'll check availability and arrange the exchange</li>
                <li>You'll receive a prepaid label to return the original item</li>
              </ul>
              
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800">
                  <strong>Note:</strong> If the exchanged item is a different price, we'll process the difference as a charge or refund.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">Refund Information</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Refunds are issued to the original payment method</li>
                <li>Original shipping costs are non-refundable (unless the return is due to our error)</li>
                <li>For international returns, customers are responsible for return shipping costs</li>
                <li>Please allow 5-7 business days for the refund to appear in your account</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">Damaged or Defective Items</h2>
              <p>
                If you receive a damaged or defective item, please contact us within 48 hours of delivery with photos of the damage. We will arrange for a free return and send you a replacement or full refund at no additional cost.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">Contact Us</h2>
              <p>
                For returns and exchanges, please contact us at{' '}
                <a href="mailto:returns@rivervox.com" className="text-primary hover:underline">
                  returns@rivervox.com
                </a>{' '}
                or call us at +971 50 123 4567.
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ReturnsExchanges;
