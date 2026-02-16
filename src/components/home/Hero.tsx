import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import heroBanner from '@/assets/hero-banner.jpg';
import { useSiteContent } from '@/hooks/useSiteContent';

const defaultHero = {
  badge_text: 'New Collection 2026',
  title_line1: 'Elegance Meets',
  title_line2: 'Modesty',
  description: 'Discover our premium collection of Islamic-inspired fashion. Crafted with love, designed for the modern family.',
  button1_text: 'Shop Collection',
  button1_link: '/shop',
  button2_text: 'Contact Us',
  button2_link: '/contact',
  background_image: '',
};

export const Hero = () => {
  const { content } = useSiteContent('home', 'hero', defaultHero);
  const bgImage = content.background_image || heroBanner;

  return (
    <section className="relative min-h-[80vh] md:min-h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={bgImage} alt="Rivervox Premium Fashion" className="w-full h-full object-cover" loading="eager" fetchPriority="high" decoding="async" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl text-white">
          <span className="inline-block text-accent font-medium text-sm uppercase tracking-[0.2em] mb-4 animate-fade-up">
            {content.badge_text}
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-tight mb-6 animate-fade-up-delay-1">
            {content.title_line1}
            <span className="block text-accent">{content.title_line2}</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-8 max-w-lg leading-relaxed animate-fade-up-delay-2">
            {content.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-up-delay-3">
            <Link to={content.button1_link} className="btn-hero inline-flex items-center justify-center gap-2 min-w-[220px]">
              {content.button1_text}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to={content.button2_link} className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white text-white font-semibold rounded-md hover:bg-white hover:text-foreground transition-all duration-300 min-w-[220px]">
              {content.button2_text}
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};
