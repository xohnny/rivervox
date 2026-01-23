import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export const CartSlider = () => {
  const { items, isOpen, closeCart, removeFromCart, updateQuantity, totalPrice } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-foreground/50 z-50 animate-fade-in"
        onClick={closeCart}
      />

      {/* Slider */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background z-50 shadow-xl cart-slide-in">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-display font-semibold">Your Cart</h2>
              <span className="text-sm text-muted-foreground">({items.length} items)</span>
            </div>
            <button
              onClick={closeCart}
              className="p-2 hover:bg-secondary rounded-full transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground font-medium">Your cart is empty</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Add some beautiful pieces to get started
                </p>
                <Button
                  onClick={closeCart}
                  className="mt-6"
                  asChild
                >
                  <Link to="/shop">Continue Shopping</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.selectedSize}-${item.selectedColor.name}`}
                    className="flex gap-4 p-3 bg-secondary/30 rounded-lg animate-fade-in"
                  >
                    {/* Product Image */}
                    <div className="w-20 h-24 bg-muted rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">{item.product.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">
                          Size: {item.selectedSize}
                        </span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <div className="flex items-center gap-1">
                          <span
                            className="w-3 h-3 rounded-full border border-border"
                            style={{ backgroundColor: item.selectedColor.hex }}
                          />
                          <span className="text-xs text-muted-foreground">
                            {item.selectedColor.name}
                          </span>
                        </div>
                      </div>

                      {/* Price & Quantity */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.selectedSize,
                                item.selectedColor.name,
                                item.quantity - 1
                              )
                            }
                            disabled={item.quantity <= 1}
                            className="w-7 h-7 flex items-center justify-center border border-border rounded hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.selectedSize,
                                item.selectedColor.name,
                                item.quantity + 1
                              )
                            }
                            className="w-7 h-7 flex items-center justify-center border border-border rounded hover:bg-secondary transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-primary">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() =>
                              removeFromCart(
                                item.product.id,
                                item.selectedSize,
                                item.selectedColor.name
                              )
                            }
                            className="p-1.5 text-destructive hover:bg-destructive/10 rounded transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-border p-4 space-y-4">
              {/* Subtotal */}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-sm text-muted-foreground">Calculated at checkout</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="font-semibold">Total</span>
                <span className="text-xl font-bold text-primary">${totalPrice.toFixed(2)}</span>
              </div>

              {/* Checkout Button */}
              <Button
                className="w-full btn-hero"
                size="lg"
                asChild
                onClick={closeCart}
              >
                <Link to="/checkout">Proceed to Checkout</Link>
              </Button>

              <button
                onClick={closeCart}
                className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors text-center"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
