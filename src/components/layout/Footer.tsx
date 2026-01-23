import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, Youtube, Send } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-3xl font-display font-bold">Rivervox</h3>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              Premium Islamic-inspired fashion for the modern family. Elegance meets modesty in every piece.
            </p>
            <div className="flex gap-3 pt-2 justify-center md:justify-start">
              <a href="#" className="p-2 bg-primary-foreground/10 rounded-full hover:bg-primary-foreground/20 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-primary-foreground/10 rounded-full hover:bg-primary-foreground/20 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-primary-foreground/10 rounded-full hover:bg-primary-foreground/20 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-primary-foreground/10 rounded-full hover:bg-primary-foreground/20 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-primary-foreground/10 rounded-full hover:bg-primary-foreground/20 transition-colors">
                <Send className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links & Customer Service - Side by side on mobile */}
          <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-4 md:gap-8">
            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="font-semibold uppercase tracking-wider text-xs md:text-sm whitespace-nowrap">Quick Links</h4>
              <nav className="flex flex-col gap-2">
                <Link to="/shop" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm">
                  Shop All
                </Link>
                <Link to="/shop?category=men" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm">
                  Men's Collection
                </Link>
                <Link to="/shop?category=women" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm">
                  Women's Collection
                </Link>
                <Link to="/shop?category=children" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm">
                  Children's Collection
                </Link>
                <Link to="/tracking" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm">
                  Track Order
                </Link>
              </nav>
            </div>

            {/* Customer Service */}
            <div className="space-y-4 text-right md:text-left">
              <h4 className="font-semibold uppercase tracking-wider text-xs md:text-sm whitespace-nowrap">Customer Service</h4>
              
              <nav className="flex flex-col gap-2 items-end md:items-start">
                <Link to="/contact" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm">
                  Contact Us
                </Link>
                <Link to="/shipping-policy" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm">
                  Shipping Policy
                </Link>
                <Link to="/returns-exchanges" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm">
                  Returns & Exchanges
                </Link>
                <Link to="/size-guide" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm">
                  Size Guide
                </Link>
                <Link to="/faq" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm">
                  FAQ
                </Link>
              </nav>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-semibold uppercase tracking-wider text-sm">Get in Touch</h4>
            <div className="space-y-3">
              {/* Bangladesh */}
              <div className="flex items-start gap-3 text-sm text-primary-foreground/80">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>4th Floor, Polwel Carnation Shopping Center, Uttara, Dhaka 1230, Bangladesh</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-primary-foreground/80">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>+88 09638 579882</span>
              </div>
              {/* USA */}
              <div className="flex items-start gap-3 text-sm text-primary-foreground/80">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>4400 San Benito St Unit B, Santa Fe, New Mexico 87507, USA</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-primary-foreground/80">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>+1 (781) 870-4028</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-primary-foreground/80">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>hello@rivervox.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 mt-12 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-primary-foreground/60">
              © {new Date().getFullYear()} Rivervox. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-primary-foreground/60">
              <Link to="/privacy-policy" className="hover:text-primary-foreground transition-colors">Privacy Policy</Link>
              <Link to="/terms-of-service" className="hover:text-primary-foreground transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
