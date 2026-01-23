import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Grid, LayoutGrid, X } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { ProductCard } from '@/components/products/ProductCard';
import { products } from '@/data/products';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const categories = [
  { label: 'All', value: 'all' },
  { label: 'Men', value: 'men' },
  { label: 'Women', value: 'women' },
  { label: 'Children', value: 'children' },
  { label: 'Accessories', value: 'accessories' },
];

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';
  const [activeCategory, setActiveCategory] = useState(categoryParam);
  const [gridCols, setGridCols] = useState<3 | 4>(4);
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') return products;
    return products.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    if (category === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  return (
    <Layout>
      {/* Page Header */}
      <div className="bg-primary/5 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-center">
            Shop Collection
          </h1>
          <p className="text-muted-foreground text-center mt-2">
            Discover our premium selection of Islamic-inspired fashion
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          {/* Category Tabs - Desktop */}
          <div className="hidden md:flex items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => handleCategoryChange(cat.value)}
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-full transition-all',
                  activeCategory === cat.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary hover:bg-secondary/80'
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center gap-2 px-4 py-2 border border-border rounded-lg"
          >
            <Filter className="w-4 h-4" />
            Filter
          </button>

          {/* Grid Toggle & Count */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {filteredProducts.length} products
            </span>
            <div className="hidden md:flex items-center gap-1 border border-border rounded-lg p-1">
              <button
                onClick={() => setGridCols(3)}
                className={cn(
                  'p-2 rounded',
                  gridCols === 3 ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
                )}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setGridCols(4)}
                className={cn(
                  'p-2 rounded',
                  gridCols === 4 ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
                )}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Category Filter */}
        {showFilters && (
          <div className="md:hidden mb-6 p-4 bg-secondary rounded-lg animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium">Categories</span>
              <button onClick={() => setShowFilters(false)}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => {
                    handleCategoryChange(cat.value);
                    setShowFilters(false);
                  }}
                  className={cn(
                    'px-4 py-2 text-sm rounded-full transition-all',
                    activeCategory === cat.value
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background border border-border'
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div
          className={cn(
            'grid gap-4 md:gap-6',
            gridCols === 3
              ? 'grid-cols-2 md:grid-cols-3'
              : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
          )}
        >
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              className="animate-fade-up"
              style={{ animationDelay: `${index * 0.03}s` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No products found in this category.</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => handleCategoryChange('all')}
            >
              View All Products
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Shop;
