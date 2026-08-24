import React, { useState } from 'react';
import { Trophy, Medal, Crown, Flame, Layers, Sparkles } from 'lucide-react';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { LeaderboardRowSkeleton } from '../components/common/SkeletonLoader';
import { soundFx } from '../lib/soundFx';

const GRADE_OPTIONS = [
  { id: 'all', label: 'Toàn Cấp 2' },
  { id: '6', label: 'Lớp 6' },
  { id: '7', label: 'Lớp 7' },
  { id: '8', label: 'Lớp 8' },
  { id: '9', label: 'Lớp 9' }
];

export const LeaderboardPage = () => {
  const [selectedGrade, setSelectedGrade] = useState('all');
  const { leaderboard, loading } = useLeaderboard(selectedGrade);

  const top1 = leaderboard[0];
  const top2 = leaderboard[1];
  const top3 = leaderboard[2];
  const restList = leaderboard.slice(3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Header Banner - NỀN XANH LÁ CÂY TƯƠI MÁT */}
      <div 
        style={{
          background: 'linear-gradient(135deg, #065F46 0%, #059669 50%, #047857 100%)',
          border: '2px solid #34D399',
          boxShadow: '0 20px 25px -5px rgba(5, 150, 105, 0.35)'
        }}
        className="rounded-3xl p-6 sm:p-8 text-center space-y-2 text-white shadow-xl"
      >
        <div 
          style={{ background: 'rgba(255, 255, 255, 0.25)', border: '1px solid rgba(255, 255, 255, 0.4)' }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-amber-200 text-xs font-black uppercase tracking-wider backdrop-blur-md"
        >
          <Trophy className="w-4 h-4 text-amber-300" />
          <span>BẢNG XẾP HẠNG TOP HỌC SINH TÍCH CỰC GDPT 2018</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-heading font-black text-white drop-shadow-md">
          VINH DANH CAO THỦ HỌC VUI
        </h1>
        <p className="text-xs sm:text-sm text-emerald-100 font-bold max-w-lg mx-auto leading-relaxed">
          Tích lũy điểm Kinh Nghiệm (EXP) từ các bài chơi để nâng cao thứ hạng và nhận huy hiệu danh giá.
        </p>

        {/* Grade Selector Tabs Bên Trong Banner */}
        <div className="flex justify-center items-center gap-2 overflow-x-auto pt-4">
          {GRADE_OPTIONS.map((grade) => (
            <button
              key={grade.id}
              onClick={() => {
                soundFx.play('click');
                setSelectedGrade(grade.id);
              }}
              style={
                selectedGrade === grade.id
                  ? { background: '#FEF08A', color: '#064E3B', border: '2px solid #FACC15' }
                  : { background: 'rgba(255, 255, 255, 0.2)', color: '#FFFFFF', border: '1px solid rgba(255, 255, 255, 0.3)' }
              }
              className="px-4 py-2 rounded-xl text-xs font-black transition-all shadow-md hover:scale-105"
            >
              {grade.label}
            </button>
          ))}
        </div>
      </div>

      {/* Podium Top 3 */}
      {!loading && leaderboard.length >= 3 && (
        <div className="grid grid-cols-3 gap-3 sm:gap-6 items-end max-w-3xl mx-auto pt-6">
          
          {/* Top 2 Silver */}
          {top2 && (
            <div className="glass-panel rounded-3xl p-4 text-center border-2 border-slate-400/40 relative bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-800/40">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl overflow-hidden mb-2 ring-4 ring-slate-400/50 relative">
                <img src={top2.avatar_url} alt={top2.full_name} className="w-full h-full object-cover" />
                <div className="absolute top-0 right-0 bg-slate-400 text-slate-950 font-black text-xs px-1.5 py-0.5 rounded-bl-lg">2</div>
              </div>
              <h3 className="font-heading font-bold text-xs sm:text-sm text-white truncate">{top2.full_name}</h3>
              <p className="text-[11px] text-slate-400">Lớp {top2.grade_level}</p>
              <div className="mt-2 text-xs font-extrabold text-amber-400 flex items-center justify-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-amber-400" />
                <span>{top2.total_exp} EXP</span>
              </div>
            </div>
          )}

          {/* Top 1 Gold */}
          {top1 && (
            <div className="glass-panel rounded-3xl p-5 text-center border-2 border-amber-400 shadow-2xl shadow-amber-500/20 relative bg-gradient-to-t from-amber-950/60 via-slate-900 to-amber-900/30 scale-105">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 p-1.5 rounded-full shadow-lg animate-bounce">
                <Crown className="w-5 h-5 fill-slate-950" />
              </div>
              <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-2xl overflow-hidden mb-2 ring-4 ring-amber-400 relative mt-2">
                <img src={top1.avatar_url} alt={top1.full_name} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-heading font-bold text-sm sm:text-base text-white truncate">{top1.full_name}</h3>
              <p className="text-xs text-amber-300 font-semibold">Lớp {top1.grade_level} • {top1.rank_tier}</p>
              <div className="mt-2 text-sm font-extrabold text-amber-400 flex items-center justify-center gap-1">
                <Flame className="w-4 h-4 fill-amber-400" />
                <span>{top1.total_exp} EXP</span>
              </div>
            </div>
          )}

          {/* Top 3 Bronze */}
          {top3 && (
            <div className="glass-panel rounded-3xl p-4 text-center border-2 border-amber-700/40 relative bg-gradient-to-t from-slate-900 via-slate-900/80 to-amber-950/20">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl overflow-hidden mb-2 ring-4 ring-amber-700/50 relative">
                <img src={top3.avatar_url} alt={top3.full_name} className="w-full h-full object-cover" />
                <div className="absolute top-0 right-0 bg-amber-700 text-amber-100 font-black text-xs px-1.5 py-0.5 rounded-bl-lg">3</div>
              </div>
              <h3 className="font-heading font-bold text-xs sm:text-sm text-white truncate">{top3.full_name}</h3>
              <p className="text-[11px] text-slate-400">Lớp {top3.grade_level}</p>
              <div className="mt-2 text-xs font-extrabold text-amber-400 flex items-center justify-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-amber-400" />
                <span>{top3.total_exp} EXP</span>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Rest of Leaderboard Table */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 max-w-4xl mx-auto space-y-3">
        <h3 className="text-sm font-heading font-bold text-slate-300 mb-4">
          Danh Sách Tiếp Theo:
        </h3>

        {loading ? (
          <div className="space-y-3">
            <LeaderboardRowSkeleton />
            <LeaderboardRowSkeleton />
            <LeaderboardRowSkeleton />
          </div>
        ) : (
          restList.map((user, idx) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="w-7 text-center font-mono font-bold text-slate-400 text-sm">
                  #{idx + 4}
                </span>
                <img src={user.avatar_url} alt={user.full_name} className="w-10 h-10 rounded-xl object-cover" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">{user.full_name}</h4>
                  <p className="text-[11px] text-slate-400">Lớp {user.grade_level} • Hạng {user.rank_tier}</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs sm:text-sm font-extrabold text-amber-400 font-mono">
                  {user.total_exp} EXP
                </span>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
