// NavLink with smooth animated underline transitions
import { forwardRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ to, children, className, onClick }, ref) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
      <Link
        ref={ref}
        to={to}
        onClick={onClick}
        className={cn(
          'relative text-sm uppercase tracking-wider font-medium transition-all duration-300',
          'text-foreground/80 hover:text-primary',
          'group py-1 px-1',
          isActive && 'text-primary font-semibold',
          className
        )}
      >
        <span className="relative z-10">{children}</span>
        
        {/* Animated underline */}
        <span
          className={cn(
            'absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ease-out',
            isActive ? 'w-full' : 'w-0 group-hover:w-full'
          )}
        />
        
        {/* Subtle glow effect on hover */}
        <span
          className={cn(
            'absolute inset-0 -z-10 rounded-md transition-all duration-300',
            'bg-primary/0 group-hover:bg-primary/5',
            isActive && 'bg-primary/5'
          )}
        />
      </Link>
    );
  }
);

NavLink.displayName = 'NavLink';
