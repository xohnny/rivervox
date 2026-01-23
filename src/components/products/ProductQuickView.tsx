import { useState } from 'react';
import { ShoppingBag, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product, ProductColor } from '@/types';
import { useCart } from '@/context/CartContext';
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
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);

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

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 gap-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>{product.name}</DialogTitle>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2">
          {/* Image Gallery */}
          <div className="relative bg-muted aspect-square md:aspect-auto md:h-[500px]">
            <img
              src={product.images[currentImageIndex]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            
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
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/90 flex items-center justify-center hover:bg-background transition-colors shadow-lg"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/90 flex items-center justify-center hover:bg-background transition-colors shadow-lg"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Image Dots */}
            {product.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {product.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={cn(
                      'w-2.5 h-2.5 rounded-full transition-all',
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
          <div className="p-6 md:p-8 flex flex-col">
            {/* Category */}
            <span className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
              {product.category}
            </span>

            {/* Title */}
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">
              {product.name}
            </h2>

            {/* Price */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl font-bold text-primary">${product.price}</span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {product.description}
            </p>

            {/* Stock Status */}
            <div className="mb-4">
              {product.stock > 10 ? (
                <span className="text-sm text-primary font-medium">✓ In Stock</span>
              ) : product.stock > 0 ? (
                <span className="text-sm text-accent-foreground font-medium">Only {product.stock} left</span>
              ) : (
                <span className="text-sm text-destructive font-medium">Out of Stock</span>
              )}
            </div>

            {/* Color Selector */}
            <div className="mb-5">
              <label className="text-sm font-medium mb-2 block">
                Color: <span className="text-muted-foreground">{selectedColor.name}</span>
              </label>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    className={cn(
                      'w-9 h-9 rounded-full border-2 transition-all',
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
            <div className="mb-5">
              <label className="text-sm font-medium mb-2 block">Size</label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      'min-w-[3rem] px-4 py-2 rounded-md border text-sm font-medium transition-all',
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
            <div className="mb-6">
              <label className="text-sm font-medium mb-2 block">Quantity</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-md border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                >
                  -
                </button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-10 h-10 rounded-md border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Spacer */}
            <div className="flex-grow" />

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={cn(
                'w-full py-4 rounded-md font-semibold text-base flex items-center justify-center gap-2 transition-all duration-300',
                isAdded
                  ? 'bg-emerald-medium text-primary-foreground'
                  : 'bg-primary text-primary-foreground hover:opacity-90',
                product.stock === 0 && 'opacity-50 cursor-not-allowed'
              )}
            >
              {isAdded ? (
                <>
                  <Check className="w-5 h-5" />
                  Added to Cart
                </>
              ) : product.stock === 0 ? (
                'Out of Stock'
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  Add to Cart - ${(product.price * quantity).toFixed(2)}
                </>
              )}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
