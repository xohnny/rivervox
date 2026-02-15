import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';
import { Truck, Clock, Globe, Package } from 'lucide-react';
import { useSiteContent } from '@/hooks/useSiteContent';

interface ShippingContent {
  heading: string;
  sections: { title: string; content: string }[];
  infoCards: { title: string; description: string }[];
  shippingTable: { country: string; rate: string; delivery: string }[];
}

const defaultContent: ShippingContent = {
  heading: 'Shipping Policy',
  sections: [],
  infoCards: [
    { title: 'Flat Rate Shipping', description: 'US $5.99 · UK $7.99' },
    { title: 'Processing Time', description: '1-2 business days' },
    { title: 'Delivery Areas', description: 'United States & United Kingdom' },
    { title: 'Tracking', description: 'Real-time updates' },
  ],
  shippingTable: [
    { country: '🇺🇸 United States', rate: '$5.99', delivery: '5-7 business days' },
    { country: '🇬🇧 United Kingdom', rate: '$7.99', delivery: '7-10 business days' },
  ],
};

const infoIcons = [Truck, Clock, Globe, Package];

const ShippingPolicy = () => {
  const { content } = useSiteContent<ShippingContent>('shipping-policy', 'main', defaultContent);

  return (
    <Layout>
      <SEO
        title="Shipping Policy - US & UK Delivery"
        description="Rivervox ships to the United States and United Kingdom. Learn about delivery times, tracking, and our shipping process."
        keywords="Rivervox shipping, US delivery, UK delivery, shipping rates"
        canonicalPath="/shipping-policy"
        pageKey="shipping-policy"
      />
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-display font-bold mb-8">{content.heading}</h1>

          <div className="grid sm:grid-cols-2 gap-4 mb-12">
            {content.infoCards.map((card, i) => {
              const Icon = infoIcons[i] || Package;
              return (
                <div key={i} className="p-6 bg-card border border-border rounded-xl flex items-start gap-4">
                  <Icon className="w-8 h-8 text-primary shrink-0" />
                  <div>
                    <h3 className="font-semibold">{card.title}</h3>
                    <p className="text-sm text-muted-foreground">{card.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="prose prose-lg max-w-none space-y-8 text-foreground/80">
            {content.shippingTable.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-2xl font-display font-semibold text-foreground">Shipping Rates</h2>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 pr-4 font-semibold">Country</th>
                        <th className="text-left py-3 pr-4 font-semibold">Rate</th>
                        <th className="text-left py-3 font-semibold">Estimated Delivery</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {content.shippingTable.map((row, i) => (
                        <tr key={i}>
                          <td className="py-3 pr-4">{row.country}</td>
                          <td className="py-3 pr-4">{row.rate}</td>
                          <td className="py-3">{row.delivery}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {content.sections.map((section, i) => (
              <section key={i} className="space-y-4">
                <h2 className="text-2xl font-display font-semibold text-foreground">{section.title}</h2>
                {section.content.split('\n\n').map((paragraph, pi) => (
                  <p key={pi}>{paragraph}</p>
                ))}
              </section>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ShippingPolicy;
