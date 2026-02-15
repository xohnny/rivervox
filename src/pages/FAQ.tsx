import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';
import { Link } from 'react-router-dom';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useSiteContent } from '@/hooks/useSiteContent';

interface FAQContent {
  heading: string;
  subtitle: string;
  categories: { category: string; questions: { q: string; a: string }[] }[];
  ctaHeading: string;
  ctaDescription: string;
  ctaButtonText: string;
  ctaButtonLink: string;
}

const defaultContent: FAQContent = {
  heading: 'Frequently Asked Questions',
  subtitle: 'Find answers to common questions about our products, shipping, returns, and more.',
  categories: [],
  ctaHeading: 'Still have questions?',
  ctaDescription: 'Our customer service team is here to help you.',
  ctaButtonText: 'Contact Us',
  ctaButtonLink: '/contact',
};

const FAQ = () => {
  const { content } = useSiteContent<FAQContent>('faq', 'main', defaultContent);

  return (
    <Layout>
      <SEO
        title="Frequently Asked Questions"
        description="Find answers to common questions about Rivervox orders, shipping, returns, sizing, and more."
        keywords="Rivervox FAQ, Islamic fashion questions, shipping FAQ, returns policy"
        canonicalPath="/faq"
      />
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-display font-bold mb-4">{content.heading}</h1>
          <p className="text-lg text-muted-foreground mb-12">{content.subtitle}</p>

          <div className="space-y-8">
            {content.categories.map((section, index) => (
              <div key={index}>
                <h2 className="text-xl font-display font-semibold mb-4 text-primary">{section.category}</h2>
                <Accordion type="single" collapsible className="space-y-2">
                  {section.questions.map((item, qIndex) => (
                    <AccordionItem key={qIndex} value={`${index}-${qIndex}`} className="border border-border rounded-lg px-4">
                      <AccordionTrigger className="text-left hover:no-underline py-4">{item.q}</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-4">{item.a}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>

          <div className="mt-12 p-8 bg-primary/5 border border-primary/20 rounded-xl text-center">
            <h3 className="text-2xl font-display font-semibold mb-3">{content.ctaHeading}</h3>
            <p className="text-muted-foreground mb-6">{content.ctaDescription}</p>
            <Link to={content.ctaButtonLink} className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors">
              {content.ctaButtonText}
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FAQ;
