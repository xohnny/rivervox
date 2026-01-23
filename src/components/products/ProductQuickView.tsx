import { useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ShoppingBag, Check, ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { Product, ProductColor } from '@/types';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import { useSwipe } from '@/hooks/useSwipe';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ProductQuickViewProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProductQuickView = ({ product, open, onOpenChange }: ProductQuickViewProps) => {
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product, selectedSize, selectedColor);
    }
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  }, [product.images.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  }, [product.images.length]);

  // Swipe gesture support for mobile
  const swipeHandlers = useSwipe({
    onSwipeLeft: nextImage,
    onSwipeRight: prevImage,
    threshold: 50,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 gap-0 overflow-hidden max-h-[90vh] md:max-h-none">
        <DialogHeader className="sr-only">
          <DialogTitle>{product.name}</DialogTitle>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 max-h-[90vh] md:max-h-none overflow-y-auto md:overflow-visible">
          {/* Image Gallery with swipe support */}
          <div 
            className="relative bg-muted aspect-[4/5] md:aspect-auto md:h-[500px] flex-shrink-0 touch-pan-y group cursor-zoom-in"
            {...swipeHandlers}
            onClick={() => setIsFullscreen(true)}
          >
            <img
              src={product.images[currentImageIndex]}
              alt={product.name}
              className="w-full h-full object-cover select-none"
            />
            
            {/* Zoom indicator */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
              <ZoomIn className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            
            {/* Discount Badge */}
            {discount > 0 && (
              <span className="absolute top-4 left-4 bg-accent text-accent-foreground text-sm font-bold px-3 py-1.5 rounded">
                -{discount}%
              </span>
            )}

            {/* Image Navigation */}
            {product.images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-background/90 flex items-center justify-center hover:bg-background transition-colors shadow-lg z-10"
                >
                  <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-background/90 flex items-center justify-center hover:bg-background transition-colors shadow-lg z-10"
                >
                  <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </>
            )}

            {/* Image Dots */}
            {product.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {product.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                    className={cn(
                      'w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-all',
                      currentImageIndex === idx
                        ? 'bg-primary scale-110'
                        : 'bg-background/70 hover:bg-background'
                    )}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="p-4 md:p-8 flex flex-col">
            {/* Category */}
            <span className="text-xs uppercase tracking-wider text-muted-foreground mb-1 md:mb-2">
              {product.category}
            </span>

            {/* Title */}
            <h2 className="font-display text-xl md:text-3xl font-bold mb-2 md:mb-3">
              {product.name}
            </h2>

            {/* Price */}
            <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
              <span className="text-xl md:text-2xl font-bold text-primary">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-base md:text-lg text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6 leading-relaxed line-clamp-3 md:line-clamp-none">
              {product.description}
            </p>

            {/* Stock Status */}
            <div className="mb-3 md:mb-4">
              {product.stock > 10 ? (
                <span className="text-sm text-primary font-medium">✓ In Stock</span>
              ) : product.stock > 0 ? (
                <span className="text-sm text-accent-foreground font-medium">Only {product.stock} left</span>
              ) : (
                <span className="text-sm text-destructive font-medium">Out of Stock</span>
              )}
            </div>

            {/* Color Selector */}
            <div className="mb-4 md:mb-5">
              <label className="text-sm font-medium mb-2 block">
                Color: <span className="text-muted-foreground">{selectedColor.name}</span>
              </label>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    className={cn(
                      'w-8 h-8 md:w-9 md:h-9 rounded-full border-2 transition-all',
                      selectedColor.name === color.name
                        ? 'border-primary scale-110'
                        : 'border-transparent hover:scale-105'
                    )}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                    aria-label={`Select ${color.name}`}
                  />
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="mb-4 md:mb-5">
              <label className="text-sm font-medium mb-2 block">Size</label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      'min-w-[2.5rem] md:min-w-[3rem] px-3 md:px-4 py-1.5 md:py-2 rounded-md border text-sm font-medium transition-all',
                      selectedSize === size
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background border-border hover:border-primary'
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-4 md:mb-6">
              <label className="text-sm font-medium mb-2 block">Quantity</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-9 md:w-10 md:h-10 rounded-md border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                >
                  -
                </button>
                <span className="w-10 md:w-12 text-center font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-9 h-9 md:w-10 md:h-10 rounded-md border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={cn(
                'w-full py-3 md:py-4 rounded-md font-semibold text-sm md:text-base flex items-center justify-center gap-2 transition-all duration-300 mt-auto',
                isAdded
                  ? 'bg-emerald-medium text-primary-foreground'
                  : 'bg-primary text-primary-foreground hover:opacity-90',
                product.stock === 0 && 'opacity-50 cursor-not-allowed'
              )}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4 md:w-5 md:h-5" />
                  Added to Cart
                </>
              ) : product.stock === 0 ? (
                'Out of Stock'
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 md:w-5 md:h-5" />
                  Add to Cart - {formatPrice(product.price * quantity)}
                </>
              )}
            </button>
          </div>
        </div>
      </DialogContent>

      {/* Fullscreen Image Lightbox - using portal to render at body level */}
      {isFullscreen && createPortal(
        <div 
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center animate-fade-in"
          onClick={() => setIsFullscreen(false)}
        >
          {/* Close Button */}
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors z-10"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Image */}
          <img
            src={product.images[currentImageIndex]}
            alt={product.name}
            className="max-w-[95vw] max-h-[95vh] object-contain select-none"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Navigation for multiple images */}
          {product.images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>

              {/* Image counter */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 text-sm">
                {currentImageIndex + 1} / {product.images.length}
              </div>
            </>
          )}
        </div>,
        document.body
      )}
    </Dialog>
  );
};
