import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Menu, X, Heart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCurrency } from '@/context/CurrencyContext';
import { useSiteContent } from '@/hooks/useSiteContent';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface HeaderContent {
  logoText: string;
  navLinks: { label: string; path: string }[];
}

const defaultHeader: HeaderContent = {
  logoText: 'Rivervox',
  navLinks: [
    { label: 'Home', path: '/' },
    { label: 'Shop', path: '/shop' },
    { label: 'Contact', path: '/contact' },
  ],
};

export const Header = () => {
  const { totalItems, openCart } = useCart();
  const { totalItems: wishlistItems } = useWishlist();
  const { currency, setCurrency, currencies } = useCurrency();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { content } = useSiteContent<HeaderContent>('layout', 'header', defaultHeader);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center h-16 md:h-20">
          {/* Logo */}
          <div className="flex-1">
            <Link to="/" className="inline-flex items-center group">
              <span className="text-2xl md:text-3xl font-display font-bold text-primary transition-all duration-300 group-hover:scale-105">
                {content.logoText}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden lg:flex items-center justify-center gap-8">
            {content.navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'nav-link text-sm uppercase tracking-wider font-sans',
                  location.pathname === link.path && 'text-primary font-semibold'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Icons - Desktop */}
          <div className="flex-1 flex items-center justify-end gap-2 md:gap-4">
            {/* Currency Selector */}
            <Select value={currency.code} onValueChange={setCurrency}>
              <SelectTrigger className="w-[85px] h-8 text-xs border-border/50 bg-transparent">
                <SelectValue>{currency.symbol} {currency.code}</SelectValue>
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {currencies.map((c) => (
                  <SelectItem key={c.code} value={c.code} className="text-xs">
                    {c.symbol} {c.code} — {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Desktop only icons */}
            <div className="hidden lg:flex items-center gap-4">
              <Link to="/wishlist" className="relative p-2 hover:bg-secondary rounded-full transition-colors" aria-label="Wishlist">
                <Heart className="w-5 h-5 text-foreground" />
                {wishlistItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-accent-foreground text-xs font-bold rounded-full flex items-center justify-center animate-scale-in">
                    {wishlistItems}
                  </span>
                )}
              </Link>

              <button onClick={openCart} className="relative p-2 hover:bg-secondary rounded-full transition-colors" aria-label="Open cart">
                <ShoppingBag className="w-5 h-5 text-foreground" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-accent-foreground text-xs font-bold rounded-full flex items-center justify-center animate-scale-in">
                    {totalItems}
                  </span>
                )}
              </button>

              <Link to="/account" className="p-2 hover:bg-secondary rounded-full transition-colors" aria-label="Account">
                <User className="w-5 h-5 text-foreground" />
              </Link>
            </div>

            {/* Mobile/Tablet: Only cart icon visible + hamburger */}
            <button onClick={openCart} className="lg:hidden relative p-2 hover:bg-secondary rounded-full transition-colors" aria-label="Open cart">
              <ShoppingBag className="w-5 h-5 text-foreground" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-accent-foreground text-xs font-bold rounded-full flex items-center justify-center animate-scale-in">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile/Tablet Menu Toggle */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 hover:bg-secondary rounded-full transition-colors" aria-label="Toggle menu">
              {mobileMenuOpen ? <X className="w-5 h-5 text-foreground" /> : <Menu className="w-5 h-5 text-foreground" />}
            </button>
          </div>
        </div>

        {/* Mobile/Tablet Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-1">
              {content.navLinks.map((link, index) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'py-3 px-4 text-sm uppercase tracking-wider rounded-lg transition-all duration-300',
                    'transform hover:translate-x-2',
                    location.pathname === link.path
                      ? 'bg-primary text-primary-foreground font-semibold'
                      : 'hover:bg-secondary/80'
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {link.label}
                </Link>
              ))}

              <div className="my-3 border-t border-border" />

              <Link
                to="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'flex items-center gap-3 py-3 px-4 text-sm uppercase tracking-wider rounded-lg transition-all duration-300',
                  'transform hover:translate-x-2',
                  location.pathname === '/wishlist'
                    ? 'bg-primary text-primary-foreground font-semibold'
                    : 'hover:bg-secondary/80'
                )}
              >
                <Heart className="w-5 h-5" />
                <span>Wishlist</span>
                {wishlistItems > 0 && (
                  <span className="ml-auto w-5 h-5 bg-accent text-accent-foreground text-xs font-bold rounded-full flex items-center justify-center">
                    {wishlistItems}
                  </span>
                )}
              </Link>

              <Link
                to="/account"
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'flex items-center gap-3 py-3 px-4 text-sm uppercase tracking-wider rounded-lg transition-all duration-300',
                  'transform hover:translate-x-2',
                  location.pathname === '/account'
                    ? 'bg-primary text-primary-foreground font-semibold'
                    : 'hover:bg-secondary/80'
                )}
              >
                <User className="w-5 h-5" />
                <span>Account</span>
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};
