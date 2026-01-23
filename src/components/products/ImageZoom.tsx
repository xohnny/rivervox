import { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { ZoomIn } from 'lucide-react';

interface ImageZoomProps {
  src: string;
  alt: string;
  className?: string;
}

export const ImageZoom = ({ src, alt, className }: ImageZoomProps) => {
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setZoomPosition({ x, y });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsZooming(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsZooming(false);
    setZoomPosition({ x: 50, y: 50 });
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative overflow-hidden cursor-zoom-in group',
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Base Image */}
      <img
        src={src}
        alt={alt}
        className={cn(
          'w-full h-full object-cover transition-transform duration-300',
          isZooming && 'scale-150'
        )}
        style={{
          transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
        }}
        draggable={false}
      />

      {/* Zoom indicator */}
      <div 
        className={cn(
          'absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm rounded-full p-2 transition-opacity duration-300',
          isZooming ? 'opacity-0' : 'opacity-100 group-hover:opacity-100'
        )}
      >
        <ZoomIn className="w-5 h-5 text-foreground" />
      </div>

      {/* Zoom hint text */}
      <div 
        className={cn(
          'absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm rounded-lg px-3 py-1.5 text-xs font-medium transition-opacity duration-300',
          isZooming ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'
        )}
      >
        Hover to zoom
      </div>
    </div>
  );
};
