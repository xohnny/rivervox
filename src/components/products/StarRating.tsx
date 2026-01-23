import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export const StarRating = ({
  rating,
  maxRating = 5,
  size = 'md',
  showValue = false,
  interactive = false,
  onRatingChange,
}: StarRatingProps) => {
  const sizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleStarClick = (index: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(index + 1);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex gap-0.5">
        {Array.from({ length: maxRating }).map((_, index) => {
          const fillPercentage = Math.min(Math.max(rating - index, 0), 1) * 100;
          
          return (
            <button
              key={index}
              type="button"
              onClick={() => handleStarClick(index)}
              disabled={!interactive}
              className={cn(
                'relative',
                interactive && 'cursor-pointer hover:scale-110 transition-transform',
                !interactive && 'cursor-default'
              )}
            >
              {/* Background star (empty) */}
              <Star
                className={cn(
                  sizeClasses[size],
                  'text-muted-foreground/30'
                )}
              />
              {/* Foreground star (filled) - clipped based on rating */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fillPercentage}%` }}
              >
                <Star
                  className={cn(
                    sizeClasses[size],
                    'text-accent fill-accent'
                  )}
                />
              </div>
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className="ml-1 text-sm font-medium text-foreground">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};
