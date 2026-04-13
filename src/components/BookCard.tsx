import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Book } from '../types';
import StarRating from './StarRating';

interface BookCardProps {
  book: Book;
  onClick: (book: Book) => void;
  key?: string | number;
}

export default function BookCard({ book, onClick }: BookCardProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="relative group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick(book)}
    >
      {/* Book Cover */}
      <div className="relative w-32 h-48 md:w-40 md:h-60 bg-gray-800 rounded-sm overflow-hidden book-shadow transition-transform duration-300 group-hover:-translate-y-2">
        <img
          src={book.coverImageUrl}
          alt={book.title}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
      </div>

      {/* Hover Tooltip (Comment) */}
      <AnimatePresence>
        {isHovered && book.comment && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute -top-16 left-1/2 -translate-x-1/2 z-20 w-48 bg-library-beige text-library-brown p-3 rounded-lg shadow-xl text-xs text-center border border-library-gold/30"
          >
            <p className="line-clamp-3 italic">"{book.comment}"</p>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-library-beige rotate-45 border-r border-b border-library-gold/30" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Book Info (Optional, but good for accessibility/clarity) */}
      <div className="mt-4 text-center">
        <h3 className="text-sm font-bold truncate w-32 md:w-40">{book.title}</h3>
        <p className="text-xs opacity-70 truncate w-32 md:w-40">{book.author}</p>
      </div>
    </motion.div>
  );
}
