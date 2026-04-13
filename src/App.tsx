/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Plus, Library, LogOut, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, onSnapshot, query, where, addDoc, deleteDoc, doc, orderBy } from 'firebase/firestore';
import { auth, db, loginWithGoogle, logout, handleFirestoreError, OperationType } from './firebase';
import { Book } from './types';
import BookShelf from './components/BookShelf';
import BookModal from './components/BookModal';
import AddBookForm from './components/AddBookForm';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // Firestore Listener
  useEffect(() => {
    if (!user) {
      setBooks([]);
      return;
    }

    const path = 'books';
    const q = query(
      collection(db, path),
      where('userId', '==', user.uid),
      orderBy('saveDate', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const booksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Book[];
      setBooks(booksData);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });

    return () => unsubscribe();
  }, [user]);

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const handleAddBook = async (newBookData: { title: string; author: string; rating: number; comment: string }) => {
    if (!user) return;

    const path = 'books';
    try {
      await addDoc(collection(db, path), {
        title: newBookData.title,
        author: newBookData.author,
        rating: newBookData.rating,
        comment: newBookData.comment,
        coverImageUrl: `https://picsum.photos/seed/${newBookData.title}/200/300`,
        saveDate: new Date().toISOString(),
        userId: user.uid,
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    if (!user) return;
    const path = `books/${bookId}`;
    try {
      await deleteDoc(doc(db, 'books', bookId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-library-brown">
        <div className="text-library-beige animate-pulse text-xl">라이브러리 입장 중...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-library-brown p-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="paper-texture p-12 rounded-sm max-w-md w-full space-y-8 text-library-brown"
        >
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-library-brown rounded-full flex items-center justify-center shadow-xl">
              <Library className="text-library-gold" size={40} />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tighter">BOOK ARCHIVE</h1>
            <p className="italic opacity-70">당신의 소중한 지혜가 머무는 곳</p>
          </div>
          <p className="text-sm leading-relaxed">
            책장을 이용하시려면 로그인이 필요합니다.<br />
            구글 계정으로 간편하게 시작하세요.
          </p>
          <button
            onClick={loginWithGoogle}
            className="w-full flex items-center justify-center gap-3 bg-library-brown text-library-beige py-4 rounded-sm font-bold hover:bg-black transition-all shadow-lg group"
          >
            <LogIn size={20} />
            Google로 로그인하기
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="py-12 px-6 text-center relative">
        <button
          onClick={logout}
          className="absolute top-8 right-8 flex items-center gap-2 text-library-beige/60 hover:text-library-beige transition-colors text-sm font-bold"
        >
          <LogOut size={18} />
          로그아웃
        </button>

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
          {user.displayName}님의 소중한 지혜가 머무는 클래식 라이브러리
        </p>
      </header>

      {/* Main Content: Bookshelf */}
      <main className="flex-grow">
        {books.length > 0 ? (
          <BookShelf books={books} onBookClick={handleBookClick} />
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-library-beige/40 space-y-4">
            <Library size={64} strokeWidth={1} />
            <p className="text-xl italic">책장이 비어있습니다. 첫 번째 책을 추가해보세요.</p>
          </div>
        )}
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
        onDelete={handleDeleteBook}
      />
      
      <AddBookForm
        isOpen={isAddFormOpen}
        onClose={() => setIsAddFormOpen(false)}
        onAdd={handleAddBook}
      />
    </div>
  );
}
