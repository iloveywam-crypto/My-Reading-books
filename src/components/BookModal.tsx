import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { Book } from '../types';
import StarRating from './StarRating';

interface BookModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function BookModal({ book, isOpen, onClose }: BookModalProps) {
  if (!book) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl paper-texture p-8 md:p-12 rounded-sm overflow-hidden text-library-brown"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-black/5 rounded-full transition-colors"
            >
              <X size={24} />
            </button>

            <div className="flex flex-col md:flex-row gap-8">
              {/* Cover */}
              <div className="flex-shrink-0 mx-auto md:mx-0">
                <div className="w-48 h-72 bg-gray-200 rounded-sm shadow-2xl overflow-hidden border-4 border-white">
                  <img
                    src={book.coverImageUrl}
                    alt={book.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              {/* Details */}
              <div className="flex-grow space-y-6">
                <div>
                  <h2 className="text-3xl font-extrabold mb-1">{book.title}</h2>
                  <p className="text-lg opacity-80 italic">by {book.author}</p>
                </div>

                <div className="h-px bg-library-brown/20 w-full" />

                <div className="space-y-2">
                  <p className="text-sm font-bold uppercase tracking-widest opacity-60">My Rating</p>
                  <StarRating rating={book.rating} />
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-bold uppercase tracking-widest opacity-60">Reading Note</p>
                  <p className="text-lg leading-relaxed font-medium">
                    {book.comment || "기록된 내용이 없습니다."}
                  </p>
                </div>

                <div className="pt-4 text-xs opacity-50 text-right">
                  Saved on {book.saveDate}
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute bottom-0 left-0 w-full h-2 bg-library-gold/20" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
