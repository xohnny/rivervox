import { useEffect, useRef, useState } from 'react';
import { Truck, Shield, RefreshCw, Headphones } from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'On orders over $100',
  },
  {
    icon: Shield,
    title: 'Secure Payment',
    description: '100% secure checkout',
  },
  {
    icon: RefreshCw,
    title: 'Easy Returns',
    description: '30-day return policy',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Dedicated assistance',
  },
];

export const Features = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-12 border-y border-border bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 justify-items-center">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={cn(
                'group flex flex-col md:flex-row items-center md:items-start gap-3 text-center md:text-left',
                'opacity-0 translate-y-4 transition-all duration-500 ease-out',
                isVisible && 'opacity-100 translate-y-0'
              )}
              style={{ transitionDelay: isVisible ? `${index * 100}ms` : '0ms' }}
            >
              <div className="relative w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
                {/* Pulse ring animation on hover */}
                <div className="absolute inset-0 rounded-full bg-primary/10 scale-100 opacity-0 group-hover:scale-150 group-hover:opacity-0 transition-all duration-500 group-hover:animate-ping" />
                <feature.icon className="w-5 h-5 text-primary transition-transform duration-300 group-hover:scale-110" />
              </div>
              <div className="transition-all duration-300 group-hover:translate-x-0 md:group-hover:translate-x-1">
                <h3 className="font-semibold text-sm transition-colors duration-300 group-hover:text-primary">
                  {feature.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
