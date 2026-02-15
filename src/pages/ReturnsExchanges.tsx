import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';
import { RotateCcw } from 'lucide-react';
import { useSiteContent } from '@/hooks/useSiteContent';

interface ReturnsContent {
  heading: string;
  policyHighlight: string;
  sections: { title: string; content: string }[];
}

const defaultContent: ReturnsContent = {
  heading: 'Returns & Exchanges',
  policyHighlight: 'We offer hassle-free returns within 30 days of delivery. Your satisfaction is our priority.',
  sections: [],
};

const ReturnsExchanges = () => {
  const { content } = useSiteContent<ReturnsContent>('returns-exchanges', 'main', defaultContent);

  return (
    <Layout>
      <SEO
        title="Returns & Exchanges"
        description="Easy returns and exchanges at Rivervox. Learn about our hassle-free return policy, exchange process, and refund timelines."
        keywords="Rivervox returns, exchange policy, refund, return Islamic clothing"
        canonicalPath="/returns-exchanges"
        pageKey="returns-exchanges"
      />
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-display font-bold mb-8">{content.heading}</h1>

          <div className="p-6 bg-primary/5 border border-primary/20 rounded-xl mb-12 flex items-start gap-4">
            <RotateCcw className="w-8 h-8 text-primary shrink-0" />
            <div>
              <h3 className="font-semibold text-lg">30-Day Return Policy</h3>
              <p className="text-muted-foreground">{content.policyHighlight}</p>
            </div>
          </div>

          <div className="prose prose-lg max-w-none space-y-8 text-foreground/80">
            {content.sections.map((section, i) => (
              <section key={i} className="space-y-4">
                <h2 className="text-2xl font-display font-semibold text-foreground">{section.title}</h2>
                {section.content.split('\n\n').map((paragraph, pi) => (
                  <p key={pi} className="whitespace-pre-line">{paragraph}</p>
                ))}
              </section>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ReturnsExchanges;
