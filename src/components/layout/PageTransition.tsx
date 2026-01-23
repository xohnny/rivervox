import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
}

export const PageTransition = ({ children }: PageTransitionProps) => {
  const location = useLocation();
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentChildren, setCurrentChildren] = useState(children);
  const prevPathname = useRef(location.pathname);

  useEffect(() => {
    // Only animate if pathname actually changed
    if (prevPathname.current !== location.pathname) {
      setIsAnimating(true);
      
      // Short delay, then swap content and fade in
      const timeout = setTimeout(() => {
        setCurrentChildren(children);
        setIsAnimating(false);
      }, 120);

      prevPathname.current = location.pathname;
      return () => clearTimeout(timeout);
    } else {
      // Same page, just update children without animation
      setCurrentChildren(children);
    }
  }, [location.pathname, children]);

  return (
    <div
      className={`transition-opacity duration-200 ease-out ${
        isAnimating ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {currentChildren}
    </div>
  );
};
