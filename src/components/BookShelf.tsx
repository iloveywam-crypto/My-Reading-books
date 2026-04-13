import React from 'react';
import { Book } from '../types';
import BookCard from './BookCard';

interface BookShelfProps {
  books: Book[];
  onBookClick: (book: Book) => void;
}

export default function BookShelf({ books, onBookClick }: BookShelfProps) {
  // Split books into 3 shelves
  const shelfCount = 3;
  const booksPerShelf = Math.ceil(books.length / shelfCount);
  
  const shelves = Array.from({ length: shelfCount }, (_, i) => 
    books.slice(i * booksPerShelf, (i + 1) * booksPerShelf)
  );

  return (
    <div className="flex flex-col gap-16 md:gap-24 py-12 px-4 max-w-6xl mx-auto">
      {shelves.map((shelfBooks, idx) => (
        <div key={idx} className="relative">
          {/* Shelf Surface */}
          <div className="absolute bottom-0 left-0 right-0 h-4 md:h-6 bg-[#5D4037] shelf-shadow rounded-sm z-10 border-t border-[#6D4C41]">
            <div className="absolute inset-x-0 top-0 h-1 bg-white/10" />
          </div>
          
          {/* Books on Shelf */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 pb-4 md:pb-6 min-h-[12rem] md:min-h-[15rem] px-4">
            {shelfBooks.map((book) => (
              <BookCard key={book.id} book={book} onClick={onBookClick} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
