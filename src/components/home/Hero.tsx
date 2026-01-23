import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import heroBanner from '@/assets/hero-banner.jpg';

export const Hero = () => {
  return (
    <section className="relative min-h-[80vh] md:min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroBanner}
          alt="Rivervox Premium Fashion"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl text-white">
          <span className="inline-block text-accent font-medium text-sm uppercase tracking-[0.2em] mb-4 animate-fade-up">
            New Collection 2024
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-tight mb-6 animate-fade-up-delay-1">
            Elegance Meets
            <span className="block text-accent">Modesty</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-8 max-w-lg leading-relaxed animate-fade-up-delay-2">
            Discover our premium collection of Islamic-inspired fashion. 
            Crafted with love, designed for the modern family.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-up-delay-3">
            <Link
              to="/shop"
              className="btn-hero inline-flex items-center justify-center gap-2"
            >
              Shop Collection
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/shop?category=new"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white text-white font-semibold rounded-md hover:bg-white hover:text-foreground transition-all duration-300"
            >
              View New Arrivals
            </Link>
          </div>

          {/* Trust Badges - Hidden for now */}
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};
