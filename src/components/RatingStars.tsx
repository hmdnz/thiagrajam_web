import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number; // 0 - 5
  maxStars?: number;
  onRatingChange?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  maxStars = 5,
  onRatingChange,
  size = 'md',
  showText = false,
}) => {
  const isInteractive = !!onRatingChange;

  const sizeStyles = {
    sm: 'h-3.5 w-3.5',
    md: 'h-5 w-5',
    lg: 'h-7 w-7',
  };

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center">
        {Array.from({ length: maxStars }).map((_, idx) => {
          const starValue = idx + 1;
          const isFilled = starValue <= Math.round(rating);

          return (
            <button
              key={starValue}
              type="button"
              disabled={!isInteractive}
              onClick={() => onRatingChange?.(starValue)}
              className={`p-0.5 rounded transition-transform ${
                isInteractive ? 'hover:scale-110 cursor-pointer focus:outline-none' : 'cursor-default'
              }`}
              aria-label={`${starValue} star${starValue > 1 ? 's' : ''}`}
            >
              <Star
                className={`${sizeStyles[size]} ${
                  isFilled ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                }`}
              />
            </button>
          );
        })}
      </div>
      {showText && (
        <span className="text-sm font-semibold text-slate-700 ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};
