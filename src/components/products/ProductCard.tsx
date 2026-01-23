import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Check, Eye, Heart } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCurrency } from '@/context/CurrencyContext';
import { cn } from '@/lib/utils';
import { ProductQuickView } from './ProductQuickView';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { formatPrice } = useCurrency();
  const [isAdded, setIsAdded] = useState(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    // Add with default size and color - user can customize in quick view
    addToCart(product, product.sizes[0], product.colors[0]);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <>
      <div className="card-premium group h-full flex flex-col touch-manipulation">
        {/* Image Container - Fixed aspect ratio for consistency */}
        <div 
          className="relative aspect-[3/4] bg-muted overflow-hidden flex-shrink-0 cursor-pointer active:scale-[0.98] transition-transform"
          onClick={() => setQuickViewOpen(true)}
        >
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Discount Badge */}
          {discount > 0 && (
            <span className="absolute top-2 left-2 md:top-3 md:left-3 bg-accent text-accent-foreground text-[10px] md:text-xs font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded">
              -{discount}%
            </span>
          )}

          {/* Wishlist Button - Larger touch target on mobile */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product);
            }}
            className={cn(
              'absolute top-2 right-2 md:top-3 md:right-3 w-10 h-10 md:w-9 md:h-9 rounded-full flex items-center justify-center transition-all z-10 active:scale-95',
              inWishlist
                ? 'bg-primary text-primary-foreground'
                : 'bg-background/90 text-foreground hover:bg-background'
            )}
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={cn('w-5 h-5 md:w-4 md:h-4', inWishlist && 'fill-current')} />
          </button>

          {/* Stock Indicator */}
          {product.stock <= 5 && product.stock > 0 && (
            <span className="absolute bottom-2 left-2 md:bottom-3 md:left-3 bg-destructive text-destructive-foreground text-[10px] md:text-xs font-medium px-1.5 py-0.5 md:px-2 md:py-1 rounded animate-pulse-stock">
              Only {product.stock} left
            </span>
          )}

          {/* Quick View Overlay - Hidden on mobile, tap triggers directly */}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex items-center justify-center">
            <span className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-white text-sm font-medium bg-primary/80 px-4 py-2 rounded-full backdrop-blur-sm">
              <Eye className="w-4 h-4" />
              Quick View
            </span>
          </div>
      </div>

      {/* Content - Flex grow to fill remaining space */}
      <div className="p-3 md:p-4 flex flex-col flex-grow">
        {/* Title & Price - Fixed height */}
        <div className="mb-2 md:mb-3">
          <Link to={`/product/${product.id}`} className="hover:text-primary transition-colors">
            <h3 className="font-display font-semibold text-sm md:text-base leading-tight line-clamp-2 min-h-[2.25rem] md:min-h-[2.5rem]">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-center gap-1.5 md:gap-2 mt-1">
            <span className="text-base md:text-lg font-bold text-primary">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-xs md:text-sm text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>


        {/* Spacer to push button to bottom */}
        <div className="flex-grow" />

        {/* Add to Cart Button - Touch-friendly with larger tap area */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={cn(
            'w-full py-2.5 md:py-3 rounded-md font-semibold text-xs md:text-sm flex items-center justify-center gap-1.5 md:gap-2 transition-all duration-300 mt-auto active:scale-[0.98]',
            isAdded
              ? 'bg-emerald-medium text-primary-foreground'
              : 'bg-primary text-primary-foreground hover:opacity-90',
            product.stock === 0 && 'opacity-50 cursor-not-allowed'
          )}
        >
          {isAdded ? (
            <>
              <Check className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="hidden xs:inline">Added</span>
              <span className="xs:hidden">✓</span>
            </>
          ) : product.stock === 0 ? (
            'Out of Stock'
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>

    <ProductQuickView
      product={product}
      open={quickViewOpen}
      onOpenChange={setQuickViewOpen}
    />
  </>
  );
};
