import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Menu, X, Heart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { CurrencySelector } from './CurrencySelector';
import { cn } from '@/lib/utils';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Shop', path: '/shop' },
  { name: 'Tracking', path: '/tracking' },
  { name: 'Contact Us', path: '/contact' },
];

export const Header = () => {
  const { totalItems, openCart } = useCart();
  const { totalItems: wishlistItems } = useWishlist();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl md:text-3xl font-display font-bold text-primary">
              Rivervox
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'nav-link text-sm uppercase tracking-wider',
                  location.pathname === link.path && 'text-primary font-semibold'
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-2 md:gap-4">
            <CurrencySelector />
            <Link
              to="/wishlist"
              className="relative p-2 hover:bg-secondary rounded-full transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5 text-foreground" />
              {wishlistItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-accent-foreground text-xs font-bold rounded-full flex items-center justify-center animate-scale-in">
                  {wishlistItems}
                </span>
              )}
            </Link>

            <button
              onClick={openCart}
              className="relative p-2 hover:bg-secondary rounded-full transition-colors"
              aria-label="Open cart"
            >
              <ShoppingBag className="w-5 h-5 text-foreground" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-accent-foreground text-xs font-bold rounded-full flex items-center justify-center animate-scale-in">
                  {totalItems}
                </span>
              )}
            </button>

            <Link
              to="/account"
              className="p-2 hover:bg-secondary rounded-full transition-colors"
              aria-label="Account"
            >
              <User className="w-5 h-5 text-foreground" />
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-secondary rounded-full transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-foreground" />
              ) : (
                <Menu className="w-5 h-5 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'py-3 px-4 text-sm uppercase tracking-wider rounded-lg transition-colors',
                    location.pathname === link.path
                      ? 'bg-primary text-primary-foreground font-semibold'
                      : 'hover:bg-secondary'
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};
