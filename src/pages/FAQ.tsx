import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';
import { Link } from 'react-router-dom';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQ = () => {
  const faqs = [
    {
      category: 'Orders & Shipping',
      questions: [
        {
          q: 'How long does shipping take?',
          a: 'Standard shipping within the UAE takes 3-5 business days. International shipping varies by region, typically 7-15 business days. Express shipping options are available at checkout.',
        },
        {
          q: 'Do you offer free shipping?',
          a: 'Yes! We offer free standard shipping on all orders over $150. Orders under $150 have a flat shipping rate based on your location.',
        },
        {
          q: 'Can I track my order?',
          a: 'Absolutely. Once your order is shipped, you\'ll receive an email with a tracking number. You can also track your order on our Order Tracking page.',
        },
        {
          q: 'Do you ship internationally?',
          a: 'Yes, we ship worldwide. International customers may be responsible for customs duties and import taxes, which vary by country.',
        },
      ],
    },
    {
      category: 'Returns & Exchanges',
      questions: [
        {
          q: 'What is your return policy?',
          a: 'We offer a 30-day return policy. Items must be unworn, unwashed, with original tags attached. Sale items marked as final sale are not eligible for return.',
        },
        {
          q: 'How do I exchange an item?',
          a: 'Contact our customer service team with your order number and the item you\'d like to exchange. We\'ll check availability and arrange the exchange for you.',
        },
        {
          q: 'How long do refunds take?',
          a: 'Once we receive your return, please allow 5-7 business days for the refund to be processed and appear in your account.',
        },
        {
          q: 'What if my item arrives damaged?',
          a: 'Contact us within 48 hours of delivery with photos of the damage. We\'ll arrange a free return and send a replacement or full refund.',
        },
      ],
    },
    {
      category: 'Products & Sizing',
      questions: [
        {
          q: 'How do I find my size?',
          a: 'Please refer to our Size Guide for detailed measurements. Our garments are designed with a modest, relaxed fit. If you\'re between sizes, we recommend sizing up.',
        },
        {
          q: 'Are your products true to color?',
          a: 'We strive to display accurate colors, but slight variations may occur due to screen settings. Product descriptions include specific color details.',
        },
        {
          q: 'What materials do you use?',
          a: 'We use premium fabrics including high-quality cotton, silk blends, linen, and wool. Each product description lists specific materials and care instructions.',
        },
        {
          q: 'Can I request custom sizing?',
          a: 'Currently, we don\'t offer custom sizing. However, we\'re working on introducing made-to-measure options in the future.',
        },
      ],
    },
    {
      category: 'Payment & Security',
      questions: [
        {
          q: 'What payment methods do you accept?',
          a: 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, Apple Pay, and Google Pay.',
        },
        {
          q: 'Is my payment information secure?',
          a: 'Absolutely. All transactions are encrypted using SSL technology, and we never store your full payment details on our servers.',
        },
        {
          q: 'Can I pay in installments?',
          a: 'Yes, we offer payment plans through select providers at checkout for qualifying orders.',
        },
        {
          q: 'Why was my payment declined?',
          a: 'Common reasons include incorrect card details, insufficient funds, or your bank blocking the transaction. Please contact your bank or try a different payment method.',
        },
      ],
    },
    {
      category: 'Account & Support',
      questions: [
        {
          q: 'Do I need an account to shop?',
          a: 'No, you can checkout as a guest. However, creating an account allows you to track orders, save your wishlist, and enjoy a faster checkout experience.',
        },
        {
          q: 'How do I contact customer service?',
          a: 'You can reach us via email at hello@rivervox.com, phone at +971 50 123 4567, or through our Contact page.',
        },
        {
          q: 'What are your customer service hours?',
          a: 'Our team is available Saturday-Thursday, 9 AM - 6 PM GST. We aim to respond to all inquiries within 24 hours.',
        },
        {
          q: 'How do I unsubscribe from emails?',
          a: 'Click the "Unsubscribe" link at the bottom of any marketing email, or update your preferences in your account settings.',
        },
      ],
    },
  ];

  return (
    <Layout>
      <SEO
        title="Frequently Asked Questions"
        description="Find answers to common questions about Rivervox orders, shipping to US & UK, returns, sizing, and more. Get the help you need quickly."
        keywords="Rivervox FAQ, Islamic fashion questions, shipping FAQ, returns policy, size guide help"
        canonicalPath="/faq"
      />
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-display font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-muted-foreground mb-12">
            Find answers to common questions about our products, shipping, returns, and more.
          </p>

          <div className="space-y-8">
            {faqs.map((section, index) => (
              <div key={index}>
                <h2 className="text-xl font-display font-semibold mb-4 text-primary">
                  {section.category}
                </h2>
                <Accordion type="single" collapsible className="space-y-2">
                  {section.questions.map((item, qIndex) => (
                    <AccordionItem
                      key={qIndex}
                      value={`${index}-${qIndex}`}
                      className="border border-border rounded-lg px-4"
                    >
                      <AccordionTrigger className="text-left hover:no-underline py-4">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-4">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>

          {/* Still Need Help */}
          <div className="mt-12 p-8 bg-primary/5 border border-primary/20 rounded-xl text-center">
            <h3 className="text-2xl font-display font-semibold mb-3">Still have questions?</h3>
            <p className="text-muted-foreground mb-6">
              Our customer service team is here to help you.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FAQ;
