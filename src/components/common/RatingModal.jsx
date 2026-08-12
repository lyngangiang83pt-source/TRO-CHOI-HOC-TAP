import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Heart, Send, X } from 'lucide-react';
import { soundFx } from '../../lib/soundFx';

export const RatingModal = ({ isOpen, onClose, onSubmit, gameTitle }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [liked, setLiked] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    soundFx.play('click');
    onSubmit({ rating, comment, liked });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-panel w-full max-w-md rounded-3xl p-6 border border-slate-800 shadow-2xl relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-heading font-bold text-white text-center">
          Đánh Giá Trò Chơi
        </h3>
        <p className="text-xs text-slate-400 text-center mt-1 truncate">
          "{gameTitle}"
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          
          {/* Star Rating */}
          <div className="flex justify-center items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => {
                  soundFx.play('click');
                  setRating(star);
                }}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 focus:outline-none transition-transform hover:scale-125"
              >
                <Star
                  className={`w-8 h-8 ${
                    (hoverRating || rating) >= star
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-slate-700'
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Like Heart Button */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => {
                soundFx.play('click');
                setLiked(!liked);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                liked
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-lg shadow-rose-500/10'
                  : 'bg-slate-800/80 text-slate-400 hover:text-rose-400'
              }`}
            >
              <Heart className={`w-4 h-4 ${liked ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{liked ? 'Đã Thả Tim!' : 'Thả Tim Game Hay'}</span>
            </button>
          </div>

          {/* Comment input */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Nhận xét độ hay hoặc góp ý về game:
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Game rất hay, câu hỏi vừa sức..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Send className="w-4 h-4" />
            <span>Gửi Đánh Giá</span>
          </button>
        </form>
      </motion.div>
    </div>
  );
};
