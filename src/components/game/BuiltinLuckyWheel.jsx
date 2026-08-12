import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Disc, HelpCircle, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { soundFx } from '../../lib/soundFx';

const DEFAULT_QUESTIONS = [
  {
    q: "Hình nào có 4 cạnh bằng nhau và 4 góc vuông?",
    a: ["Hình vuông", "Hình chữ nhật", "Hình thoi"],
    correct: 0
  },
  {
    q: "Tổng 3 góc trong một tam giác bằng bao nhiêu độ?",
    a: ["90°", "180°", "360°"],
    correct: 1
  },
  {
    q: "Hình thoi có mấy đường chéo vuông góc với nhau?",
    a: ["1", "2", "4"],
    correct: 1
  }
];

export const BuiltinLuckyWheel = ({ config, onComplete, isPractice = false }) => {
  const questions = config?.questions || DEFAULT_QUESTIONS;
  const [currentIdx, setCurrentIdx] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedAns, setSelectedAns] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const handleSpin = () => {
    if (spinning || answered) return;

    soundFx.play('click');
    setSpinning(true);
    const newRot = rotation + 1440 + Math.floor(Math.random() * 360);
    setRotation(newRot);

    setTimeout(() => {
      setSpinning(false);
    }, 2500);
  };

  const handleSelectAnswer = (ansIdx) => {
    if (answered) return;

    setSelectedAns(ansIdx);
    setAnswered(true);

    const currentQ = questions[currentIdx];
    if (ansIdx === currentQ.correct) {
      soundFx.play('correct');
      setScore(prev => prev + 35);
    } else {
      soundFx.play('wrong');
    }
  };

  const handleNext = () => {
    soundFx.play('click');
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(prev => prev + 1);
      setSelectedAns(null);
      setAnswered(false);
    } else {
      soundFx.play('victory');
      setIsGameOver(true);
      const finalScore = Math.min(100, score + 30);
      if (typeof onComplete === 'function') {
        onComplete({
          score: finalScore,
          timeSeconds: 60,
          isPractice
        });
      }
    }
  };

  const currentQ = questions[currentIdx];

  return (
    <div className="w-full max-w-4xl mx-auto glass-panel rounded-3xl p-6 border border-slate-800 text-center">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2 text-amber-400 font-heading font-bold text-lg">
          <Disc className="w-6 h-6 animate-spin" />
          <span>Vòng Quay May Mắn Trắc Nghiệm</span>
        </div>

        <span className="bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-bold text-slate-300">
          Câu: <span className="text-amber-400">{currentIdx + 1} / {questions.length}</span>
        </span>
      </div>

      {!isGameOver ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          
          {/* Animated Wheel */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-52 h-52 sm:w-64 sm:h-64 mx-auto mb-4">
              <motion.div
                animate={{ rotate: rotation }}
                transition={{ duration: 2.5, ease: "easeOut" }}
                className="w-full h-full rounded-full border-4 border-amber-400 shadow-xl shadow-amber-400/20 bg-gradient-to-tr from-indigo-900 via-purple-900 to-amber-900 flex items-center justify-center relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/20 via-transparent to-transparent" />
                <Disc className="w-32 h-32 text-amber-400 opacity-60" />
              </motion.div>
              
              {/* Pointer */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-rose-500 rotate-45 border-2 border-white z-10" />
            </div>

            <button
              onClick={handleSpin}
              disabled={spinning}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90 text-white font-bold text-xs shadow-lg shadow-amber-500/30"
            >
              {spinning ? 'Đang Quay...' : 'Quay Bánh Xe May Mắn'}
            </button>
          </div>

          {/* Question Box */}
          <div className="text-left bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase mb-2">
              <HelpCircle className="w-4 h-4" />
              <span>Câu hỏi thử thách:</span>
            </div>

            <h4 className="text-base font-bold text-white mb-4">
              {currentQ.q}
            </h4>

            <div className="space-y-2.5">
              {currentQ.a.map((option, idx) => {
                const isSelected = selectedAns === idx;
                const isCorrect = idx === currentQ.correct;

                let btnStyle = 'bg-slate-950 hover:bg-slate-800 text-slate-200 border-slate-800';
                if (answered) {
                  if (isCorrect) btnStyle = 'bg-emerald-600/30 text-emerald-300 border-emerald-500';
                  else if (isSelected) btnStyle = 'bg-rose-600/30 text-rose-300 border-rose-500';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectAnswer(idx)}
                    disabled={answered}
                    className={`w-full p-3 rounded-xl text-xs font-semibold border text-left transition-all flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{option}</span>
                    {answered && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    {answered && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-400" />}
                  </button>
                );
              })}
            </div>

            {answered && (
              <button
                onClick={handleNext}
                className="w-full mt-4 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold"
              >
                {currentIdx + 1 < questions.length ? 'Câu Tiếp Theo →' : 'Xem Kết Quả 🏁'}
              </button>
            )}
          </div>

        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-amber-950/80 border border-amber-500/40 text-center">
          <h4 className="text-xl font-heading font-bold text-white mb-2">
            Chúc Mừng Bạn Đã Hoàn Thành Vòng Quay!
          </h4>
          <p className="text-sm text-amber-300 mb-4 font-bold">
            Tổng điểm đạt được: {score} Điểm
          </p>
          <button
            onClick={() => {
              setCurrentIdx(0);
              setScore(0);
              setIsGameOver(false);
              setAnswered(false);
            }}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs"
          >
            Quay Lại Ván Khác
          </button>
        </div>
      )}
    </div>
  );
};
