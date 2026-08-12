import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, CheckCircle, RotateCcw, Sparkles } from 'lucide-react';
import { soundFx } from '../../lib/soundFx';

const DEFAULT_WORDS = ["LEISURE", "CRAFT", "COMMUNITY", "HERITAGE", "CUSTOM"];

export const BuiltinWordSearch = ({ config, onComplete, isPractice = false }) => {
  const targetWords = config?.words || DEFAULT_WORDS;
  const [foundWords, setFoundWords] = useState([]);
  const [selectedWord, setSelectedWord] = useState('');
  const [isGameOver, setIsGameOver] = useState(false);

  const handleSelectWord = (word) => {
    if (foundWords.includes(word)) return;

    soundFx.play('correct');
    const updated = [...foundWords, word];
    setFoundWords(updated);

    if (updated.length === targetWords.length) {
      soundFx.play('victory');
      setIsGameOver(true);
      if (typeof onComplete === 'function') {
        onComplete({
          score: 100,
          timeSeconds: 45,
          isPractice
        });
      }
    }
  };

  const handleReset = () => {
    setFoundWords([]);
    setIsGameOver(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto glass-panel rounded-3xl p-6 border border-slate-800 text-center">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2 text-indigo-400 font-heading font-bold text-lg">
          <Search className="w-6 h-6" />
          <span>Giải Mã Ô Chữ Từ Vựng</span>
        </div>

        <div className="flex items-center gap-3 text-xs font-semibold text-slate-300">
          <span className="bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
            Đã tìm: <span className="text-emerald-400 font-bold">{foundWords.length} / {targetWords.length}</span>
          </span>
          <button
            onClick={handleReset}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <p className="text-xs text-slate-400 mb-4">
        Bấm chọn các từ tiếng Anh / Thuật ngữ đúng bên dưới để mở khóa toàn bộ ô chữ:
      </p>

      {/* Target Word List */}
      <div className="flex flex-wrap justify-center gap-3 max-w-xl mx-auto mb-6">
        {targetWords.map((word) => {
          const isFound = foundWords.includes(word);
          return (
            <button
              key={word}
              onClick={() => handleSelectWord(word)}
              disabled={isFound}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-md ${
                isFound
                  ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/50 line-through opacity-70'
                  : 'bg-slate-900 hover:bg-indigo-600/30 text-slate-200 hover:text-indigo-300 border border-slate-700'
              }`}
            >
              {word}
            </button>
          );
        })}
      </div>

      {isGameOver && (
        <div className="p-6 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2">
            <CheckCircle className="w-6 h-6" />
          </div>
          <h4 className="text-xl font-heading font-bold text-white mb-1">
            Tuyệt Vời! Đã Giải Mã Hoàn Toàn Ô Chữ
          </h4>
          <p className="text-xs text-slate-300 mb-4">
            Bạn được cộng 100 điểm vào thành tích môn học.
          </p>
          <button
            onClick={handleReset}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
          >
            Chơi Lại Ván Mới
          </button>
        </div>
      )}
    </div>
  );
};
