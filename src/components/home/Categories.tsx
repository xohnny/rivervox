import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import categoryMen from '@/assets/category-men.jpg';
import categoryWomen from '@/assets/category-women.jpg';
import categoryChildren from '@/assets/category-children.jpg';
import categoryAccessories from '@/assets/category-accessories.jpg';

const categories = [
  {
    name: 'Men',
    slug: 'men',
    image: categoryMen,
    description: 'Elegant thobes & kurtas',
  },
  {
    name: 'Women',
    slug: 'women',
    image: categoryWomen,
    description: 'Graceful abayas & hijabs',
  },
  {
    name: 'Children',
    slug: 'children',
    image: categoryChildren,
    description: 'Adorable modest wear',
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    image: categoryAccessories,
    description: 'Complete your look',
  },
];

export const Categories = () => {
  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-accent font-medium text-sm uppercase tracking-[0.2em]">
            Shop by Category
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold mt-2">
            Explore Our Collections
          </h2>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.slug}
              to={`/shop?category=${category.slug}`}
              className="group relative aspect-[3/4] rounded-xl overflow-hidden animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image */}
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6">
                <h3 className="text-white text-xl md:text-2xl font-display font-bold mb-1">
                  {category.name}
                </h3>
                <p className="text-white/70 text-sm hidden md:block mb-3">
                  {category.description}
                </p>
                <span className="inline-flex items-center gap-2 text-accent text-sm font-medium group-hover:gap-3 transition-all">
                  Shop Now
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
