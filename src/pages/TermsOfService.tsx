import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';
import { useSiteContent } from '@/hooks/useSiteContent';

interface PolicyContent {
  heading: string;
  intro: string;
  lastUpdated: string;
  sections: { title: string; content: string }[];
}

const defaultContent: PolicyContent = {
  heading: 'Terms of Service',
  intro: 'Welcome to Rivervox. By accessing and using our website, you agree to be bound by these Terms of Service.',
  lastUpdated: 'January 2026',
  sections: [],
};

const TermsOfService = () => {
  const { content } = useSiteContent<PolicyContent>('terms-of-service', 'main', defaultContent);

  return (
    <Layout>
      <SEO
        title="Terms of Service"
        description="Read the terms and conditions for using the Rivervox website and purchasing our products."
        canonicalPath="/terms-of-service"
        keywords="Rivervox terms, terms of service, conditions of use"
      />
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-display font-bold mb-8">{content.heading}</h1>

          <div className="prose prose-lg max-w-none space-y-8 text-foreground/80">
            {content.intro && <p className="lead text-lg">{content.intro}</p>}

            {content.sections.map((section, i) => (
              <section key={i} className="space-y-4">
                <h2 className="text-2xl font-display font-semibold text-foreground">{section.title}</h2>
                {section.content.split('\n\n').map((paragraph, pi) => (
                  <p key={pi} className="whitespace-pre-line">{paragraph}</p>
                ))}
              </section>
            ))}

            {content.lastUpdated && (
              <p className="text-sm text-muted-foreground pt-8 border-t">
                Last updated: {content.lastUpdated}
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TermsOfService;
