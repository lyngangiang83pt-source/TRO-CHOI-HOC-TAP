import React, { useState } from 'react';
import { 
  Gamepad2, 
  Layers, 
  Calculator, 
  BookOpen, 
  Languages, 
  Atom, 
  Compass, 
  Cpu, 
  ShieldCheck, 
  Search, 
  Flame, 
  Sparkles, 
  Trophy 
} from 'lucide-react';
import { useGames } from '../hooks/useGames';
import { useAuth } from '../context/AuthContext';
import { GameCard } from '../components/game/GameCard';
import { GameCardSkeleton } from '../components/common/SkeletonLoader';
import { soundFx } from '../lib/soundFx';

const GRADE_OPTIONS = [
  { id: 'all', label: 'Tất Cả Khối' },
  { id: '6', label: 'Lớp 6' },
  { id: '7', label: 'Lớp 7' },
  { id: '8', label: 'Lớp 8' },
  { id: '9', label: 'Lớp 9' }
];

const SUBJECT_OPTIONS = [
  { id: 'all', label: 'Tất Cả Môn', icon: Gamepad2 },
  { id: 'Toán Học', label: 'Toán Học', icon: Calculator },
  { id: 'Ngữ Văn', label: 'Ngữ Văn', icon: BookOpen },
  { id: 'Tiếng Anh', label: 'Tiếng Anh', icon: Languages },
  { id: 'Khoa Học Tự Nhiên', label: 'Khoa Học Tự Nhiên', icon: Atom },
  { id: 'Lịch Sử & Địa Lý', label: 'Lịch Sử & Địa Lý', icon: Compass },
  { id: 'Tin Học', label: 'Tin Học', icon: Cpu },
  { id: 'GDCD', label: 'GDCD', icon: ShieldCheck }
];

export const StudentDashboard = () => {
  const { profile } = useAuth();
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { games = [], loading, deleteGame } = useGames(selectedGrade, selectedSubject);

  const safeGames = Array.isArray(games) ? games.filter(Boolean) : [];

  const filteredGames = safeGames.filter(game =>
    ((game?.title || '')).toLowerCase().includes((searchTerm || '').toLowerCase()) ||
    ((game?.description || '')).toLowerCase().includes((searchTerm || '').toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Hero Welcome & EXP Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-950 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl -z-10" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4 sm:gap-6">
            {/* Unboxed Standalone Big Brand Logo in Banner */}
            <picture className="shrink-0 flex items-center justify-center group">
              <source srcSet="/logo2.webp" type="image/webp" />
              <img 
                src="/logo2.png" 
                alt="Logo 2" 
                className="h-20 sm:h-28 w-auto max-w-none object-contain filter drop-shadow-[0_10px_20px_rgba(99,102,241,0.3)] group-hover:scale-110 transition-transform duration-300" 
              />
            </picture>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Chương Trình GDPT 2018 THCS
              </div>
              <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
                Xin chào: <span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">{profile?.full_name || 'Thầy Huỳnh Ngân Giang'}</span>! 👋
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
                Khám phá hàng trăm trò chơi trắc nghiệm đối kháng, giải mã phòng kín và mini-game hấp dẫn để tích lũy EXP và chinh phục Bảng Xếp Hạng.
              </p>
            </div>
          </div>

          {/* User Rank Progress */}
          {profile && (
            <div className="w-full md:w-auto glass-panel p-4 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-2 min-w-[240px]">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-400">Cấp Bậc Hiện Tại:</span>
                <span className="text-amber-400 font-heading">{profile.rank_tier}</span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, ((profile.total_exp || 0) / 3000) * 100)}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-[11px] font-semibold text-slate-400">
                <span>{profile.total_exp || 0} EXP</span>
                <span>Mục tiêu: 3000 EXP</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Grade Level Selector Tabs (Lớp 6, 7, 8, 9) - Nền Vàng Nhạt & Xanh Lá Cây */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-bold uppercase text-slate-700 dark:text-slate-400 mr-2 flex items-center gap-1 shrink-0">
          <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Khối Lớp:
        </span>
        {GRADE_OPTIONS.map((grade) => {
          const isSelected = selectedGrade === grade.id;
          let badgeColorClass = 'bg-amber-100 text-amber-950 border-amber-400 hover:bg-amber-200 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-700';
          if (grade.id === '6') badgeColorClass = 'bg-emerald-100 text-emerald-950 border-emerald-400 hover:bg-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-700';
          else if (grade.id === '7') badgeColorClass = 'bg-amber-100 text-amber-950 border-amber-400 hover:bg-amber-200 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-700';
          else if (grade.id === '8') badgeColorClass = 'bg-green-100 text-green-950 border-green-400 hover:bg-green-200 dark:bg-green-950/80 dark:text-green-300 dark:border-green-700';
          else if (grade.id === '9') badgeColorClass = 'bg-yellow-100 text-yellow-950 border-yellow-400 hover:bg-yellow-200 dark:bg-yellow-950/80 dark:text-yellow-300 dark:border-yellow-700';

          return (
            <button
              key={grade.id}
              onClick={() => {
                soundFx.play('click');
                setSelectedGrade(grade.id);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap border shadow-sm ${
                isSelected
                  ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-white border-transparent shadow-md shadow-emerald-600/30 ring-2 ring-emerald-400/50 scale-105'
                  : badgeColorClass
              }`}
            >
              {grade.label}
            </button>
          );
        })}
      </div>

      {/* Subject Filter Bar (GDPT 2018 7 Môn) - Nền Xanh Lá Cây & Vàng Xen Kẽ Bắt Mắt */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {SUBJECT_OPTIONS.map((subj, idx) => {
          const Icon = subj.icon;
          const isSelected = selectedSubject === subj.id;
          const isEven = idx % 2 === 0;

          // Xen kẽ màu Xanh Lá Cây (isEven = true) và Màu Vàng Hoàng Gia (isEven = false)
          const normalBg = isEven
            ? 'bg-[#059669] hover:bg-emerald-700 text-white border-emerald-400'
            : 'bg-amber-500 hover:bg-amber-600 text-white border-amber-300';

          const selectedBg = isEven
            ? 'bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white border-white ring-2 ring-emerald-300 shadow-xl scale-105 font-black'
            : 'bg-gradient-to-r from-amber-900 via-yellow-900 to-amber-950 text-white border-white ring-2 ring-amber-300 shadow-xl scale-105 font-black';

          return (
            <button
              key={subj.id}
              onClick={() => {
                soundFx.play('click');
                setSelectedSubject(subj.id);
              }}
              className={`p-3 rounded-2xl border text-left flex flex-col items-start gap-2 transition-all shadow-md ${
                isSelected ? selectedBg : normalBg
              }`}
            >
              <Icon className={`w-5 h-5 ${isSelected ? 'text-amber-300' : 'text-white'}`} />
              <span className="text-xs font-black truncate w-full tracking-wide drop-shadow-xs">{subj.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search & Header Title Container - Nền Vàng Hoàng Gia Xen Kẽ Với Navbar Xanh Lá Cây */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 text-white p-5 rounded-2xl border border-amber-300 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-heading font-black text-white flex items-center gap-2 drop-shadow-sm">
              <Gamepad2 className="w-6 h-6 text-emerald-900" />
              <span>Kho Trò Chơi Học Tập</span>
            </h2>

            <span className="px-3.5 py-1 rounded-xl bg-white/20 text-white font-mono text-xs font-black shadow-md border border-white/40 flex items-center gap-1.5 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-emerald-900" />
              <span>
                {filteredGames.length === games.length 
                  ? `Tổng số: ${games.length} Bài Chơi` 
                  : `Đang xem: ${filteredGames.length} / ${games.length} Bài Chơi`}
              </span>
            </span>
          </div>

          <p className="text-xs text-amber-100 mt-1 font-extrabold">
            Chọn trò chơi để bắt đầu làm bài và tích lũy điểm thưởng EXP
          </p>
        </div>

        {/* Search Bar Input Trong Suốt / Trắng Sáng */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm tên game, từ khóa..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white text-slate-900 placeholder-slate-400 border border-amber-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-inner"
          />
        </div>
      </div>

      {/* Game Grid with Skeletons */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <GameCardSkeleton />
          <GameCardSkeleton />
          <GameCardSkeleton />
          <GameCardSkeleton />
        </div>
      ) : filteredGames.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredGames.map((game, idx) => (
            <GameCard key={game.id} game={game} index={idx} onDelete={deleteGame} />
          ))}
        </div>
      ) : (
        <div className="glass-panel p-12 rounded-3xl text-center border border-slate-800">
          <Gamepad2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-300">Chưa có trò chơi nào phù hợp</h3>
          <p className="text-xs text-slate-500 mt-1">
            Vui lòng thử chọn khối lớp khác hoặc tìm kiếm từ khóa khác.
          </p>
        </div>
      )}

    </div>
  );
};
