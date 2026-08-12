import React, { useState } from 'react';
import { X, Send, Calendar, Award, RotateCcw } from 'lucide-react';
import { soundFx } from '../../lib/soundFx';

export const AssignmentModal = ({ isOpen, onClose, games, classes }) => {
  const [selectedGame, setSelectedGame] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [rewardExp, setRewardExp] = useState(100);
  const [maxAttempts, setMaxAttempts] = useState(3);
  const [dueDate, setDueDate] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    soundFx.play('correct');
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-lg rounded-3xl p-6 border border-slate-800 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-heading font-bold text-white text-center mb-4">
          Giao Bài Tập Game Cho Học Sinh
        </h3>

        {success ? (
          <div className="p-6 text-center text-emerald-400 font-bold text-sm">
            ✓ Giao bài thành công cho lớp học!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Chọn Trò Chơi Học Tập:
              </label>
              <select
                value={selectedGame}
                onChange={(e) => setSelectedGame(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="">-- Chọn game --</option>
                {games?.map((g) => (
                  <option key={g.id} value={g.id}>
                    [{g.subject} Lớp {g.grade_level}] {g.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Giao Cho Lớp Học:
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="">-- Chọn lớp --</option>
                <option value="c-1">Lớp 7A1 - Chuyên Toán & KHTN</option>
                <option value="c-2">Lớp 8B2 - Anh Văn & Ngữ Văn</option>
                <option value="c-3">Lớp 6C3 - Tin Học & GDCD</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Giới Hạn Lượt Chơi (GAME-06):
                </label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={maxAttempts}
                  onChange={(e) => setMaxAttempts(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Thưởng Kinh Nghiệm (EXP):
                </label>
                <input
                  type="number"
                  value={rewardExp}
                  onChange={(e) => setRewardExp(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Hạn Chót Hoàn Thành (Deadline):
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Giao Bài Cho Lớp</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
