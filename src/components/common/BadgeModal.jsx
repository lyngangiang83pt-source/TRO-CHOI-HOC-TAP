import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Sparkles, X, Award } from 'lucide-react';
import { soundFx } from '../../lib/soundFx';

export const BadgeModal = ({ badge, isOpen, onClose }) => {
  if (!isOpen || !badge) return null;

  React.useEffect(() => {
    soundFx.play('levelup');
  }, []);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          className="glass-panel w-full max-w-md rounded-3xl p-6 border-2 border-indigo-500/40 shadow-2xl relative text-center overflow-hidden"
        >
          {/* Background Glow */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-orange-500 p-1 shadow-lg shadow-amber-500/30 animate-bounce">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
              <Trophy className="w-10 h-10 text-amber-400" />
            </div>
          </div>

          <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Mở Khóa Danh Hiệu Mới!
          </div>

          <h3 className="text-xl font-heading font-bold text-white mt-3">
            {badge.title}
          </h3>

          <p className="text-sm text-slate-300 mt-2 px-4 leading-relaxed">
            {badge.description}
          </p>

          <div className="mt-6 pt-4 border-t border-slate-800">
            <button
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 hover:opacity-90 transition-opacity"
            >
              Nhận Thưởng & Tiếp Tục
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
