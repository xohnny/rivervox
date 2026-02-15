import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useSiteContent } from '@/hooks/useSiteContent';

interface ContactContent {
  heading: string;
  subtitle: string;
  infoHeading: string;
  infoDescription: string;
  addressLabel: string;
  address: string;
  phone: string;
  emailLabel: string;
  emails: string[];
  formHeading: string;
}

const defaultContent: ContactContent = {
  heading: 'Contact Us',
  subtitle: "We'd love to hear from you. Get in touch with our team.",
  infoHeading: 'Get in Touch',
  infoDescription: 'Have questions about our products, orders, or anything else? Our dedicated team is here to help you with anything you need.',
  addressLabel: 'Our Address',
  address: '8206 Louisiana Blvd NE, Ste A #8412\nAlbuquerque, NM 87113\nUSA',
  phone: '+1 (781) 870-4028',
  emailLabel: 'Email Us',
  emails: ['hello@rivervox.com', 'support@rivervox.com'],
  formHeading: 'Send Us a Message',
};

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const { content } = useSiteContent<ContactContent>('contact', 'main', defaultContent);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { error } = await supabase.from('contact_messages').insert({
      name: formData.name,
      email: formData.email,
      phone: formData.phone || null,
      message: formData.message,
    });

    if (error) {
      toast({ title: 'Error', description: 'Failed to send message. Please try again.', variant: 'destructive' });
      setIsSubmitting(false);
      return;
    }

    toast({ title: 'Message Sent!', description: "We'll get back to you as soon as possible." });
    setFormData({ name: '', email: '', phone: '', message: '' });
    setIsSubmitting(false);
  };

  return (
    <Layout>
      <SEO
        title="Contact Us"
        description="Get in touch with Rivervox. Visit our store or send us a message. We're here to help with orders, sizing, and any questions."
        keywords="contact Rivervox, Islamic fashion store contact, customer support"
        canonicalPath="/contact"
        pageKey="contact"
      />
      <div className="bg-primary/5 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-center">{content.heading}</h1>
          <p className="text-muted-foreground text-center mt-2">{content.subtitle}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-display font-bold mb-4">{content.infoHeading}</h2>
              <p className="text-muted-foreground leading-relaxed">{content.infoDescription}</p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{content.addressLabel}</h3>
                  <p className="text-muted-foreground text-sm whitespace-pre-line">{content.address}</p>
                  <p className="text-muted-foreground text-sm mt-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    <a href={`tel:${content.phone.replace(/\s/g, '')}`} className="hover:underline">{content.phone}</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{content.emailLabel}</h3>
                  <p className="text-muted-foreground text-sm">
                    {content.emails.join('\n').split('\n').map((e, i) => <span key={i}>{e}<br /></span>)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-premium h-fit">
            <h2 className="text-xl font-display font-bold mb-6">{content.formHeading}</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name *</label>
                <Input placeholder="Your name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <Input type="email" placeholder="your@email.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <Input type="tel" placeholder="+1 000 000 0000" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message *</label>
                <Textarea placeholder="How can we help you?" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} rows={5} required />
              </div>
              <Button type="submit" className="w-full h-12 bg-primary hover:bg-primary/90" disabled={isSubmitting}>
                {isSubmitting ? <span className="animate-pulse">Sending...</span> : <><Send className="w-4 h-4 mr-2" />Send Message</>}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
