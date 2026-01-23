import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from '@/components/products/ProductCard';
import { sampleProducts } from '@/data/products';

export const FeaturedProducts = () => {
  const featuredProducts = sampleProducts.filter((p) => p.featured).slice(0, 8);

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <span className="text-accent font-medium text-sm uppercase tracking-[0.2em]">
              Handpicked for You
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold mt-2">
              Featured Products
            </h2>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
          >
            View All Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {featuredProducts.map((product, index) => (
            <div
              key={product.id}
              className="animate-fade-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
