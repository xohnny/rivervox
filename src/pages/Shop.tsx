import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Grid, LayoutGrid, X, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';
import { ProductCard } from '@/components/products/ProductCard';
import { products } from '@/data/products';
import { useCurrency } from '@/context/CurrencyContext';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const categories = [
  { label: 'All', value: 'all' },
  { label: 'Men', value: 'men' },
  { label: 'Women', value: 'women' },
  { label: 'Children', value: 'children' },
  { label: 'Accessories', value: 'accessories' },
];

const sortOptions = [
  { label: 'Featured', value: 'featured' },
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Name: A to Z', value: 'name-asc' },
  { label: 'Name: Z to A', value: 'name-desc' },
];

// Calculate price range from products
const allPrices = products.map(p => p.price);
const minProductPrice = Math.floor(Math.min(...allPrices));
const maxProductPrice = Math.ceil(Math.max(...allPrices));

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { formatPrice } = useCurrency();
  const categoryParam = searchParams.get('category') || 'all';
  const [activeCategory, setActiveCategory] = useState(categoryParam);
  const [gridCols, setGridCols] = useState<3 | 4>(4);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState<[number, number]>([minProductPrice, maxProductPrice]);

  const filteredProducts = useMemo(() => {
    let result = [...products];
    
    // Filter by category
    if (activeCategory !== 'all') {
      result = result.filter((p) => p.category === activeCategory);
    }
    
    // Filter by price range
    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    
    // Sort products
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }
    
    return result;
  }, [activeCategory, priceRange, sortBy]);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    if (category === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  const handlePriceChange = (values: number[]) => {
    setPriceRange([values[0], values[1]]);
  };

  const resetFilters = () => {
    setActiveCategory('all');
    setPriceRange([minProductPrice, maxProductPrice]);
    setSortBy('featured');
    searchParams.delete('category');
    setSearchParams(searchParams);
  };

  const hasActiveFilters = 
    activeCategory !== 'all' || 
    priceRange[0] !== minProductPrice || 
    priceRange[1] !== maxProductPrice ||
    sortBy !== 'featured';

  const currentSortLabel = sortOptions.find(s => s.value === sortBy)?.label || 'Featured';

  return (
    <Layout>
      <SEO
        title="Shop Islamic Fashion"
        description="Browse our collection of premium thobes, abayas, hijabs and modest fashion accessories. Filter by category, size and price. Free shipping available to US & UK."
        keywords="buy thobe online, buy abaya online, Islamic clothing shop, modest fashion store, hijab shop, Muslim clothing USA, Muslim clothing UK"
        canonicalPath="/shop"
        pageKey="shop"
      />
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
        <div className="flex flex-col gap-4 mb-8">
          {/* Top Row - Categories & Actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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
              className="md:hidden flex items-center justify-center gap-2 px-4 py-2.5 border border-border rounded-lg bg-background"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters & Sort</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 bg-primary rounded-full" />
              )}
            </button>

            {/* Desktop: Sort & Grid Controls */}
            <div className="hidden md:flex items-center gap-4">
              {/* Sort Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-4 py-2 text-sm border border-border rounded-lg bg-background hover:bg-secondary transition-colors">
                    <span className="text-muted-foreground">Sort by:</span>
                    <span className="font-medium">{currentSortLabel}</span>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-background border border-border shadow-lg z-50">
                  {sortOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => setSortBy(option.value)}
                      className={cn(
                        'cursor-pointer',
                        sortBy === option.value && 'bg-primary/10 text-primary'
                      )}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Product Count */}
              <span className="text-sm text-muted-foreground">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
              </span>

              {/* Grid Toggle */}
              <div className="flex items-center gap-1 border border-border rounded-lg p-1 bg-background">
                <button
                  onClick={() => setGridCols(3)}
                  className={cn(
                    'p-2 rounded transition-colors',
                    gridCols === 3 ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
                  )}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setGridCols(4)}
                  className={cn(
                    'p-2 rounded transition-colors',
                    gridCols === 4 ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
                  )}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Price Filter - Hidden for now */}
        </div>

        {/* Mobile Filters Panel */}
        {showFilters && (
          <div className="md:hidden mb-6 p-4 bg-card border border-border rounded-xl animate-fade-in space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <span className="font-semibold">Filters & Sort</span>
              <button onClick={() => setShowFilters(false)} className="p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Categories */}
            <div>
              <span className="text-sm font-medium text-muted-foreground mb-3 block">Category</span>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => handleCategoryChange(cat.value)}
                    className={cn(
                      'px-4 py-2 text-sm rounded-full transition-all',
                      activeCategory === cat.value
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary border border-border'
                    )}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range - Hidden for now */}

            {/* Sort */}
            <div>
              <span className="text-sm font-medium text-muted-foreground mb-3 block">Sort By</span>
              <div className="grid grid-cols-2 gap-2">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSortBy(option.value)}
                    className={cn(
                      'px-3 py-2 text-sm rounded-lg transition-all text-left',
                      sortBy === option.value
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary border border-border'
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={resetFilters}
              >
                Reset All
              </Button>
              <Button
                className="flex-1"
                onClick={() => setShowFilters(false)}
              >
                Show {filteredProducts.length} Results
              </Button>
            </div>
          </div>
        )}

        {/* Active Filters Tags - Mobile */}
        {hasActiveFilters && !showFilters && (
          <div className="md:hidden flex flex-wrap items-center gap-2 mb-4">
            <span className="text-xs text-muted-foreground">Active:</span>
            {activeCategory !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                {categories.find(c => c.value === activeCategory)?.label}
                <button onClick={() => handleCategoryChange('all')}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {sortBy !== 'featured' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                {currentSortLabel}
                <button onClick={() => setSortBy('featured')}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={resetFilters}
              className="text-xs text-muted-foreground underline"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Mobile Results Count */}
        <div className="md:hidden flex items-center justify-between mb-4">
          <span className="text-sm text-muted-foreground">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Products Grid - Optimized mobile spacing */}
        <div
          className={cn(
            'grid gap-3 md:gap-6',
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
            <p className="text-muted-foreground mb-2">No products found matching your filters.</p>
            <p className="text-sm text-muted-foreground mb-4">
              Try adjusting your price range or category selection.
            </p>
            <Button
              variant="outline"
              onClick={resetFilters}
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Shop;
