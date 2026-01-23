import { Layout } from '@/components/layout/Layout';

const TermsOfService = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-display font-bold mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none space-y-8 text-foreground/80">
            <p className="lead text-lg">
              Welcome to Rivervox. By accessing and using our website, you agree to be bound by these Terms of Service. Please read them carefully before making a purchase.
            </p>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">Acceptance of Terms</h2>
              <p>
                By accessing or using the Rivervox website, you acknowledge that you have read, understood, and agree to be bound by these terms. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">Products and Pricing</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>All prices are listed in USD and are subject to change without notice</li>
                <li>We reserve the right to limit quantities or refuse orders</li>
                <li>Product colors may vary slightly due to screen settings</li>
                <li>We strive to ensure accuracy in product descriptions</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">Orders and Payment</h2>
              <p>
                By placing an order, you warrant that you are legally capable of entering into binding contracts. We accept major credit cards and other payment methods as displayed at checkout.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Orders are subject to acceptance and availability</li>
                <li>Payment is processed at the time of order placement</li>
                <li>We reserve the right to cancel orders due to pricing errors</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">Shipping and Delivery</h2>
              <p>
                Please refer to our Shipping Policy for detailed information about shipping methods, delivery times, and costs. Risk of loss passes to you upon delivery.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">Intellectual Property</h2>
              <p>
                All content on this website, including text, graphics, logos, images, and software, is the property of Rivervox and is protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">User Accounts</h2>
              <p>
                You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Please notify us immediately of any unauthorized use.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">Limitation of Liability</h2>
              <p>
                Rivervox shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our services. Our total liability shall not exceed the amount paid for the product in question.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">Governing Law</h2>
              <p>
                These terms shall be governed by and construed in accordance with the laws of the United Arab Emirates. Any disputes shall be resolved in the courts of Dubai.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of the website constitutes acceptance of the modified terms.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">Contact</h2>
              <p>
                For questions about these Terms of Service, please contact us at{' '}
                <a href="mailto:legal@rivervox.com" className="text-primary hover:underline">
                  legal@rivervox.com
                </a>
              </p>
            </section>

            <p className="text-sm text-muted-foreground pt-8 border-t">
              Last updated: January 2026
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TermsOfService;
