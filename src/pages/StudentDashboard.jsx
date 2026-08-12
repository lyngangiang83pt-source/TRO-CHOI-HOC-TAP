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

  const { games, loading } = useGames(selectedGrade, selectedSubject);

  const filteredGames = games.filter(game =>
    game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    game.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Hero Welcome & EXP Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-950 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl -z-10" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
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

      {/* Grade Level Selector Tabs (Lớp 6, 7, 8, 9) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-bold uppercase text-slate-400 mr-2 flex items-center gap-1">
          <Layers className="w-4 h-4 text-indigo-400" /> Khối Lớp:
        </span>
        {GRADE_OPTIONS.map((grade) => (
          <button
            key={grade.id}
            onClick={() => {
              soundFx.play('click');
              setSelectedGrade(grade.id);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedGrade === grade.id
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 border border-slate-800'
            }`}
          >
            {grade.label}
          </button>
        ))}
      </div>

      {/* Subject Filter Bar (GDPT 2018 7 Môn) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {SUBJECT_OPTIONS.map((subj) => {
          const Icon = subj.icon;
          const isSelected = selectedSubject === subj.id;
          return (
            <button
              key={subj.id}
              onClick={() => {
                soundFx.play('click');
                setSelectedSubject(subj.id);
              }}
              className={`p-3 rounded-2xl border text-left flex flex-col items-start gap-2 transition-all ${
                isSelected
                  ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-lg shadow-indigo-500/10'
                  : 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-800 text-slate-400'
              }`}
            >
              <Icon className={`w-5 h-5 ${isSelected ? 'text-indigo-400' : 'text-slate-400'}`} />
              <span className="text-xs font-bold truncate w-full">{subj.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search & Header Title */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
        <div>
          <h2 className="text-xl font-heading font-bold text-white flex items-center gap-2">
            <Gamepad2 className="w-6 h-6 text-indigo-400" />
            Kho Trò Chơi Học Tập ({filteredGames.length})
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Chọn trò chơi để bắt đầu làm bài và tích lũy điểm thưởng
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm tên game, từ khóa..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
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
          {filteredGames.map((game) => (
            <GameCard key={game.id} game={game} />
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
