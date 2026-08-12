import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Trophy, RotateCcw, CheckCircle, Brain } from 'lucide-react';
import { soundFx } from '../../lib/soundFx';

const DEFAULT_PAIRS = [
  { q: "Hydro (H)", a: "NTK = 1" },
  { q: "Oxy (O)", a: "NTK = 16" },
  { q: "Carbon (C)", a: "NTK = 12" },
  { q: "Nito (N)", a: "NTK = 14" },
  { q: "Natri (Na)", a: "NTK = 23" },
  { q: "Sắt (Fe)", a: "NTK = 56" }
];

export const BuiltinMemoryGame = ({ config, onComplete, isPractice = false }) => {
  const pairs = config?.pairs || DEFAULT_PAIRS;
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    initDeck();
  }, [config]);

  const initDeck = () => {
    const cardDeck = [];
    pairs.forEach((pair, index) => {
      cardDeck.push({ id: `q-${index}`, pairId: index, text: pair.q, type: 'question' });
      cardDeck.push({ id: `a-${index}`, pairId: index, text: pair.a, type: 'answer' });
    });
    // Shuffle
    cardDeck.sort(() => Math.random() - 0.5);
    setCards(cardDeck);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setIsGameOver(false);
  };

  const handleCardClick = (index) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;

    soundFx.play('click');
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      const [firstIdx, secondIdx] = newFlipped;
      const card1 = cards[firstIdx];
      const card2 = cards[secondIdx];

      if (card1.pairId === card2.pairId) {
        soundFx.play('correct');
        const newMatched = [...matched, firstIdx, secondIdx];
        setMatched(newMatched);
        setFlipped([]);

        if (newMatched.length === cards.length) {
          soundFx.play('victory');
          setIsGameOver(true);
          const calculatedScore = Math.max(60, 100 - (moves * 3));
          if (typeof onComplete === 'function') {
            onComplete({
              score: calculatedScore,
              timeSeconds: moves * 4,
              isPractice
            });
          }
        }
      } else {
        soundFx.play('wrong');
        setTimeout(() => {
          setFlipped([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto glass-panel rounded-3xl p-6 border border-slate-800 text-center">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2 text-indigo-400 font-heading font-bold text-lg">
          <Brain className="w-6 h-6" />
          <span>Game Lật Thẻ Ghép Cặp Kiến Thức</span>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold text-slate-300">
          <span className="bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
            Số lần lật: <span className="text-amber-400 font-bold">{moves}</span>
          </span>
          <button
            onClick={initDeck}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
            title="Chơi lại"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3.5 sm:gap-4 max-w-2xl mx-auto">
        {cards.map((card, idx) => {
          const isFlipped = flipped.includes(idx) || matched.includes(idx);
          const isMatchedCard = matched.includes(idx);

          return (
            <motion.div
              key={card.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCardClick(idx)}
              className={`h-24 sm:h-28 rounded-2xl cursor-pointer flex items-center justify-center p-3 text-center select-none font-bold text-xs sm:text-sm transition-all duration-300 shadow-md ${
                isFlipped
                  ? isMatchedCard
                    ? 'bg-emerald-600/30 text-emerald-300 border-2 border-emerald-500/60 shadow-emerald-500/10'
                    : 'bg-indigo-600 text-white border-2 border-indigo-400'
                  : 'bg-slate-900 hover:bg-slate-800 border-2 border-slate-800 text-transparent'
              }`}
            >
              {isFlipped ? (
                <span>{card.text}</span>
              ) : (
                <Sparkles className="w-6 h-6 text-slate-700 opacity-50" />
              )}
            </motion.div>
          );
        })}
      </div>

      {isGameOver && (
        <div className="mt-8 p-6 rounded-2xl bg-indigo-950/80 border border-indigo-500/40 text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2">
            <CheckCircle className="w-6 h-6" />
          </div>
          <h4 className="text-xl font-heading font-bold text-white mb-1">
            Xuất Sắc! Hoàn Thành Tất Cả Các Cặp
          </h4>
          <p className="text-xs text-slate-300 mb-4">
            Bạn đã vượt qua thử thách với <span className="font-bold text-amber-400">{moves} lượt lật</span>.
          </p>
          <button
            onClick={initDeck}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
          >
            Chơi Lại Ván Mới
          </button>
        </div>
      )}
    </div>
  );
};
