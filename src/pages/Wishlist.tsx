import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import { Button } from '@/components/ui/button';

const Wishlist = () => {
  const { items, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();

  const handleAddToCart = (product: typeof items[0]) => {
    addToCart(product, product.sizes[0], product.colors[0]);
    removeFromWishlist(product.id);
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 min-h-[60vh] flex flex-col items-center justify-center">
          <Heart className="w-16 h-16 text-muted-foreground/50 mb-4" />
          <h1 className="font-display text-2xl font-bold mb-2">Your Wishlist is Empty</h1>
          <p className="text-muted-foreground mb-6">Save your favorite items for later</p>
          <Link to="/shop">
            <Button size="lg">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold mb-1">My Wishlist</h1>
            <p className="text-muted-foreground">{items.length} items saved</p>
          </div>
          <Button variant="outline" onClick={clearWishlist}>
            Clear All
          </Button>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((product) => (
            <div key={product.id} className="card-premium group">
              {/* Image */}
              <Link to={`/product/${product.id}`} className="block">
                <div className="relative aspect-[3/4] bg-muted overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {product.originalPrice && (
                    <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded">
                      -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </span>
                  )}
                </div>
              </Link>

              {/* Content */}
              <div className="p-4">
                <Link to={`/product/${product.id}`}>
                  <h3 className="font-display font-semibold text-base leading-tight line-clamp-2 hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <div className="flex items-center gap-2 mt-1 mb-4">
                  <span className="text-lg font-bold text-primary">{formatPrice(product.price)}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleAddToCart(product)}
                    className="flex-1"
                    disabled={product.stock === 0}
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeFromWishlist(product.id)}
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Wishlist;
