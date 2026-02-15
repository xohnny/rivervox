import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, Youtube, Send } from 'lucide-react';
import { useSiteContent } from '@/hooks/useSiteContent';

interface FooterLink {
  label: string;
  path: string;
}

interface FooterContent {
  brandName: string;
  brandDescription: string;
  socialLinks: {
    instagram: string;
    facebook: string;
    twitter: string;
    youtube: string;
    telegram: string;
  };
  quickLinks: FooterLink[];
  customerServiceLinks: FooterLink[];
  contact: {
    address: string;
    phone: string;
    email: string;
  };
  copyrightText: string;
  bottomLinks: FooterLink[];
}

const defaultFooter: FooterContent = {
  brandName: 'Rivervox',
  brandDescription: 'Premium Islamic-inspired fashion for the modern family. Elegance meets modesty in every piece.',
  socialLinks: { instagram: '#', facebook: '#', twitter: '#', youtube: '#', telegram: '#' },
  quickLinks: [
    { label: 'Shop All', path: '/shop' },
    { label: "Men's Collection", path: '/shop?category=men' },
    { label: "Women's Collection", path: '/shop?category=women' },
    { label: "Children's Collection", path: '/shop?category=children' },
    { label: 'Track Order', path: '/tracking' },
  ],
  customerServiceLinks: [
    { label: 'Contact Us', path: '/contact' },
    { label: 'Shipping Policy', path: '/shipping-policy' },
    { label: 'Returns & Exchanges', path: '/returns-exchanges' },
    { label: 'Size Guide', path: '/size-guide' },
    { label: 'FAQ', path: '/faq' },
  ],
  contact: { address: '8206 Louisiana Blvd NE, Ste A #8412, Albuquerque, NM 87113, USA', phone: '+1 (781) 870-4028', email: 'hello@rivervox.com' },
  copyrightText: 'Rivervox. All rights reserved.',
  bottomLinks: [
    { label: 'Privacy Policy', path: '/privacy-policy' },
    { label: 'Terms of Service', path: '/terms-of-service' },
  ],
};

const socialIcons = {
  instagram: Instagram,
  facebook: Facebook,
  twitter: Twitter,
  youtube: Youtube,
  telegram: Send,
};

export const Footer = () => {
  const { content } = useSiteContent<FooterContent>('layout', 'footer', defaultFooter);

  return (
    <footer className="bg-primary text-primary-foreground font-sans">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-3xl font-display font-bold">{content.brandName}</h3>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              {content.brandDescription}
            </p>
            <div className="flex gap-3 pt-2 justify-center md:justify-start">
              {Object.entries(content.socialLinks).map(([platform, url]) => {
                const Icon = socialIcons[platform as keyof typeof socialIcons];
                if (!Icon || !url) return null;
                return (
                  <a key={platform} href={url} className="p-2 bg-primary-foreground/10 rounded-full hover:bg-primary-foreground/20 transition-colors" target="_blank" rel="noopener noreferrer">
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links & Customer Service */}
          <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-4 md:gap-8">
            <div className="space-y-4">
              <h4 className="font-display font-semibold uppercase tracking-wider text-xs md:text-sm whitespace-nowrap">Quick Links</h4>
              <nav className="flex flex-col gap-2">
                {content.quickLinks.map((link, i) => (
                  <Link key={i} to={link.path} className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm">
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="space-y-4 text-right md:text-left">
              <h4 className="font-display font-semibold uppercase tracking-wider text-xs md:text-sm whitespace-nowrap">Customer Service</h4>
              <nav className="flex flex-col gap-2 items-end md:items-start">
                {content.customerServiceLinks.map((link, i) => (
                  <Link key={i} to={link.path} className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm">
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold uppercase tracking-wider text-sm">Get in Touch</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm text-primary-foreground/80">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{content.contact.address}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-primary-foreground/80">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <a href={`tel:${content.contact.phone.replace(/\s/g, '')}`} className="hover:underline">{content.contact.phone}</a>
              </div>
              <div className="flex items-center gap-3 text-sm text-primary-foreground/80">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>{content.contact.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 mt-12 pt-6 pb-16 md:pb-0">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-primary-foreground/60">
              © {new Date().getFullYear()} {content.copyrightText}
            </p>
            <div className="flex gap-6 text-sm text-primary-foreground/60">
              {content.bottomLinks.map((link, i) => (
                <Link key={i} to={link.path} className="hover:text-primary-foreground transition-colors">{link.label}</Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
