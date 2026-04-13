/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Plus, Library } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Book } from './types';
import { MOCK_BOOKS } from './constants';
import BookShelf from './components/BookShelf';
import BookModal from './components/BookModal';
import AddBookForm from './components/AddBookForm';

export default function App() {
  const [books, setBooks] = useState<Book[]>(MOCK_BOOKS);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const handleAddBook = (newBookData: { title: string; author: string; rating: number; comment: string }) => {
    const newBook: Book = {
      id: Math.random().toString(36).substr(2, 9),
      title: newBookData.title,
      author: newBookData.author,
      rating: newBookData.rating,
      comment: newBookData.comment,
      coverImageUrl: `https://picsum.photos/seed/${newBookData.title}/200/300`,
      saveDate: new Date().toISOString().split('T')[0],
    };
    setBooks((prev) => [newBook, ...prev]);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="py-12 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-4 mb-4"
        >
          <div className="w-12 h-12 bg-library-gold rounded-full flex items-center justify-center shadow-lg">
            <Library className="text-library-brown" size={28} />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-library-beige drop-shadow-lg">
            BOOK ARCHIVE
          </h1>
        </motion.div>
        <p className="text-library-beige/60 italic text-lg md:text-xl">
          당신의 소중한 지혜가 머무는 클래식 라이브러리
        </p>
      </header>

      {/* Main Content: Bookshelf */}
      <main className="flex-grow">
        <BookShelf books={books} onBookClick={handleBookClick} />
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-library-beige/40 text-sm">
        <p>© 2024 Classic Book Archive. All rights reserved.</p>
      </footer>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsAddFormOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-library-gold text-library-brown rounded-full flex items-center justify-center shadow-2xl z-40 border-4 border-library-brown hover:bg-yellow-400 transition-colors"
      >
        <Plus size={32} strokeWidth={3} />
      </motion.button>

      {/* Modals */}
      <BookModal
        book={selectedBook}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      
      <AddBookForm
        isOpen={isAddFormOpen}
        onClose={() => setIsAddFormOpen(false)}
        onAdd={handleAddBook}
      />
    </div>
  );
}
