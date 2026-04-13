import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { motion } from 'motion/react';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  interactive?: boolean;
}

export default function StarRating({ rating, onRatingChange, interactive = false }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (index: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(index);
    }
  };

  const handleMouseEnter = (index: number) => {
    if (interactive) {
      setHoverRating(index);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  return (
    <div className="flex gap-1" onMouseLeave={handleMouseLeave}>
      {[1, 2, 3, 4, 5].map((index) => (
        <motion.button
          key={index}
          whileHover={interactive ? { scale: 1.2 } : {}}
          whileTap={interactive ? { scale: 0.9 } : {}}
          onClick={() => handleClick(index)}
          onMouseEnter={() => handleMouseEnter(index)}
          className={`${interactive ? 'cursor-pointer' : 'cursor-default'} focus:outline-none`}
          type="button"
        >
          <Star
            size={20}
            className={`${
              index <= (hoverRating || rating)
                ? 'fill-library-gold text-library-gold'
                : 'text-gray-400'
            } transition-colors duration-200`}
          />
        </motion.button>
      ))}
    </div>
  );
}
