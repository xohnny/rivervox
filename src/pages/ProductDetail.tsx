import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { products } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { ProductColor } from '@/types';
import { ShoppingBag, Heart, Share2, ChevronRight, Minus, Plus, Check, Truck, RotateCcw, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ImageZoom } from '@/components/products/ImageZoom';
import { ProductReviews } from '@/components/products/ProductReviews';
import { StarRating } from '@/components/products/StarRating';
import { getAverageRating, getProductReviews } from '@/data/reviews';

const ProductDetail = () => {
  const { id } = useParams();
  const product = products.find(p => p.id === id);
  const { addToCart } = useCart();
  
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/shop">Back to Shop</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) return;
    
    for (let i = 0; i < quantity; i++) {
      addToCart(product, selectedSize, selectedColor);
    }
    
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-secondary/30 py-4">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <Link to="/shop" className="text-muted-foreground hover:text-foreground transition-colors">
              Shop
            </Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <Link 
              to={`/shop?category=${product.category}`} 
              className="text-muted-foreground hover:text-foreground transition-colors capitalize"
            >
              {product.category}
            </Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image with Zoom */}
          <div className="space-y-4">
            <div className="aspect-square rounded-xl overflow-hidden bg-secondary">
              <ImageZoom
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-primary font-medium uppercase tracking-wider mb-2">
                {product.category}
              </p>
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
                {product.name}
              </h1>
              
              {/* Rating Preview */}
              {getProductReviews(product.id).length > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <StarRating rating={getAverageRating(product.id)} size="sm" showValue />
                  <span className="text-sm text-muted-foreground">
                    ({getProductReviews(product.id).length} reviews)
                  </span>
                </div>
              )}
              
              <div className="flex items-center gap-4">
                {product.originalPrice ? (
                  <>
                    <span className="text-3xl font-bold text-primary">
                      AED {product.price}
                    </span>
                    <span className="text-xl text-muted-foreground line-through">
                      AED {product.originalPrice}
                    </span>
                    <span className="px-3 py-1 bg-accent text-accent-foreground text-sm font-medium rounded-full">
                      {discount}% OFF
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-primary">
                    AED {product.price}
                  </span>
                )}
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            {/* Color Selection */}
            <div>
              <p className="font-medium mb-3">
                Color: <span className="text-muted-foreground capitalize">{selectedColor?.name || 'Select'}</span>
              </p>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    className={cn(
                      'w-10 h-10 rounded-full border-2 transition-all capitalize',
                      selectedColor?.name === color.name
                        ? 'border-primary ring-2 ring-primary ring-offset-2'
                        : 'border-border hover:border-primary/50'
                    )}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <p className="font-medium mb-3">
                Size: <span className="text-muted-foreground">{selectedSize || 'Select'}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      'px-4 py-2 rounded-lg border transition-all font-medium',
                      selectedSize === size
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border hover:border-primary'
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <p className="font-medium mb-3">Quantity</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-border rounded-lg">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="p-3 hover:bg-secondary transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                    className="p-3 hover:bg-secondary transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.stock} items available
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <Button
                onClick={handleAddToCart}
                disabled={!selectedSize || !selectedColor || addedToCart}
                className="flex-1 h-14 text-lg"
              >
                {addedToCart ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Add to Cart
                  </>
                )}
              </Button>
              <Button variant="outline" size="icon" className="h-14 w-14">
                <Heart className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="icon" className="h-14 w-14">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
              <div className="text-center">
                <Truck className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">Free Shipping</p>
                <p className="text-xs text-muted-foreground">Orders over AED 200</p>
              </div>
              <div className="text-center">
                <RotateCcw className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">Easy Returns</p>
                <p className="text-xs text-muted-foreground">14-day policy</p>
              </div>
              <div className="text-center">
                <Shield className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">Secure Payment</p>
                <p className="text-xs text-muted-foreground">100% protected</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-16 border-t border-border">
            <h2 className="text-2xl font-display font-bold mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map(p => (
                <Link
                  key={p.id}
                  to={`/product/${p.id}`}
                  className="group block bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium group-hover:text-primary transition-colors">{p.name}</h3>
                    <p className="text-primary font-bold mt-1">AED {p.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Product Reviews Section */}
        <ProductReviews productId={product.id} productName={product.name} />
      </div>
    </Layout>
  );
};

export default ProductDetail;
