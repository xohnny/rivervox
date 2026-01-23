import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, Heart, User } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Shop', path: '/shop', icon: ShoppingBag },
  { name: 'Wishlist', path: '/wishlist', icon: Heart },
  { name: 'Account', path: '/account', icon: User },
];

export const MobileBottomNav = () => {
  const location = useLocation();
  const { totalItems: wishlistItems } = useWishlist();
  const [tappedItem, setTappedItem] = useState<string | null>(null);

  const handleTap = (path: string) => {
    setTappedItem(path);
    // Reset after animation completes
    setTimeout(() => setTappedItem(null), 200);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const isTapped = tappedItem === item.path;
          const Icon = item.icon;
          const showBadge = item.path === '/wishlist' && wishlistItems > 0;

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => handleTap(item.path)}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full py-2 transition-all duration-150',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <div 
                className={cn(
                  'relative flex flex-col items-center transition-transform duration-150',
                  isTapped && 'animate-tap-bounce'
                )}
              >
                {/* Ripple effect background */}
                <div 
                  className={cn(
                    'absolute inset-0 -m-3 rounded-full bg-primary/10 scale-0 transition-transform duration-200',
                    isTapped && 'scale-100'
                  )}
                />
                
                <Icon
                  className={cn(
                    'w-5 h-5 transition-all relative z-10',
                    isActive && 'scale-110',
                    isTapped && 'text-primary'
                  )}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {showBadge && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-accent text-accent-foreground text-[10px] font-bold rounded-full flex items-center justify-center z-10">
                    {wishlistItems > 9 ? '9+' : wishlistItems}
                  </span>
                )}
              </div>
              <span className={cn(
                'text-[10px] mt-1 font-medium relative z-10 transition-all duration-150',
                isActive && 'font-semibold',
                isTapped && 'text-primary'
              )}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
