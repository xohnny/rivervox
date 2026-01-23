import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
}

export const PageTransition = ({ children }: PageTransitionProps) => {
  const location = useLocation();

  return (
    <div
      key={location.pathname}
      className="animate-page-fade-in"
    >
      {children}
    </div>
  );
};
