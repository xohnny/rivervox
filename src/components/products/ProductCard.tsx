import { useState } from 'react';
import { ShoppingBag, Check } from 'lucide-react';
import { Product, ProductColor } from '@/types';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0]);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="card-premium group h-full flex flex-col">
      {/* Image Container - Fixed aspect ratio for consistency */}
      <div className="relative aspect-[3/4] bg-muted overflow-hidden flex-shrink-0">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Discount Badge */}
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded">
            -{discount}%
          </span>
        )}

        {/* Stock Indicator */}
        {product.stock <= 5 && product.stock > 0 && (
          <span className="absolute top-3 right-3 bg-destructive text-destructive-foreground text-xs font-medium px-2 py-1 rounded animate-pulse-stock">
            Only {product.stock} left
          </span>
        )}

        {/* Quick Add Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content - Flex grow to fill remaining space */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Title & Price - Fixed height */}
        <div className="mb-3">
          <h3 className="font-display font-semibold text-base leading-tight line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-lg font-bold text-primary">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
        </div>

        {/* Color Selector */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-muted-foreground">Color:</span>
          <div className="flex gap-1.5">
            {product.colors.slice(0, 4).map((color) => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color)}
                className={cn('color-swatch', selectedColor.name === color.name && 'selected')}
                style={{ backgroundColor: color.hex }}
                title={color.name}
                aria-label={`Select ${color.name}`}
              />
            ))}
          </div>
        </div>

        {/* Size Selector - Fixed height container */}
        <div className="flex flex-wrap gap-1.5 mb-4 min-h-[2.75rem]">
          {product.sizes.slice(0, 5).map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={cn('size-btn text-xs', selectedSize === size && 'selected')}
            >
              {size}
            </button>
          ))}
          {product.sizes.length > 5 && (
            <span className="size-btn text-xs bg-muted text-muted-foreground cursor-default">
              +{product.sizes.length - 5}
            </span>
          )}
        </div>

        {/* Spacer to push button to bottom */}
        <div className="flex-grow" />

        {/* Add to Cart Button - Always at bottom */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={cn(
            'w-full py-3 rounded-md font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300 mt-auto',
            isAdded
              ? 'bg-emerald-medium text-primary-foreground'
              : 'bg-primary text-primary-foreground hover:opacity-90',
            product.stock === 0 && 'opacity-50 cursor-not-allowed'
          )}
        >
          {isAdded ? (
            <>
              <Check className="w-4 h-4" />
              Added to Cart
            </>
          ) : product.stock === 0 ? (
            'Out of Stock'
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
};
