import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus } from 'lucide-react';
import StarRating from './StarRating';

interface AddBookFormProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (book: { title: string; author: string; rating: number; comment: string }) => void;
}

export default function AddBookForm({ isOpen, onClose, onAdd }: AddBookFormProps) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !author) return;
    
    onAdd({ title, author, rating, comment });
    setTitle('');
    setAuthor('');
    setRating(5);
    setComment('');
    onClose();
  };

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
            className="relative w-full max-w-md paper-texture p-8 rounded-sm text-library-brown"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-black/5 rounded-full transition-colors"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-extrabold mb-6 flex items-center gap-2">
              <Plus size={24} className="text-library-gold" />
              새 책 등록하기
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest opacity-60">제목</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-library-brown/20 focus:border-library-gold outline-none py-2 text-lg transition-colors"
                  placeholder="책 제목을 입력하세요"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest opacity-60">저자</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-library-brown/20 focus:border-library-gold outline-none py-2 text-lg transition-colors"
                  placeholder="저자 이름을 입력하세요"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest opacity-60">별점</label>
                <StarRating rating={rating} onRatingChange={setRating} interactive />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest opacity-60">한 줄 평</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-transparent border-2 border-library-brown/10 focus:border-library-gold outline-none p-3 rounded-sm text-base transition-colors min-h-[100px] resize-none"
                  placeholder="책에 대한 짧은 감상을 남겨주세요"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-library-brown text-library-beige py-4 rounded-sm font-bold text-lg hover:bg-black transition-colors shadow-lg"
              >
                책장에 추가하기
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
