import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Star, Eye, Sparkles, BookOpen, Layers, Trash2, ExternalLink } from 'lucide-react';
import { soundFx } from '../../lib/soundFx';
import { useAuth } from '../../context/AuthContext';

export const GameCard = ({ game, index = 0, onDelete }) => {
  const { profile } = useAuth();
  const isAdminOrTeacher = profile?.role === 'teacher' || profile?.role === 'admin' || profile?.email === 'lyngangiang83pt@gmail.com';
  const isYellow = index % 2 === 0;

  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    soundFx.play('click');
    if (window.confirm(`Thầy/Cô có chắc chắn muốn XÓA bài chơi "${game.title}" khỏi Kho Trò Chơi không?`)) {
      if (typeof onDelete === 'function') {
        onDelete(game.id);
      }
    }
  };

  const getSubjectColor = (subject) => {
    switch (subject) {
      case 'Toán Học': return 'from-blue-600 to-indigo-600 text-blue-300';
      case 'Ngữ Văn': return 'from-rose-600 to-pink-600 text-rose-300';
      case 'Tiếng Anh': return 'from-amber-600 to-yellow-600 text-amber-300';
      case 'Khoa Học Tự Nhiên': return 'from-emerald-600 to-teal-600 text-emerald-300';
      case 'Lịch Sử & Địa Lý': return 'from-orange-600 to-amber-700 text-orange-300';
      case 'Tin Học': return 'from-cyan-600 to-blue-700 text-cyan-300';
      default: return 'from-purple-600 to-indigo-600 text-purple-300';
    }
  };

  const getGradeBadgeStyle = (grade) => {
    switch (String(grade)) {
      case '6':
        return 'bg-emerald-100 text-emerald-950 border-emerald-400 dark:bg-emerald-950/90 dark:text-emerald-300 dark:border-emerald-600';
      case '7':
        return 'bg-amber-100 text-amber-950 border-amber-400 dark:bg-amber-950/90 dark:text-amber-300 dark:border-amber-600';
      case '8':
        return 'bg-green-100 text-green-950 border-green-400 dark:bg-green-950/90 dark:text-green-300 dark:border-green-600';
      case '9':
        return 'bg-yellow-100 text-yellow-950 border-yellow-400 dark:bg-yellow-950/90 dark:text-yellow-300 dark:border-yellow-600';
      default:
        return 'bg-amber-100 text-amber-950 border-amber-400 dark:bg-amber-950/90 dark:text-amber-300 dark:border-amber-600';
    }
  };

  // Nền khung Vàng Nhạt (#FEF9C3) và Xanh Lá Cây (#DCFCE7) Xen Kẽ Bắt Mắt
  const cardBgStyle = isYellow
    ? 'bg-[#FEF9C3] dark:bg-amber-950/80 border-2 border-amber-300 dark:border-amber-700/80 shadow-md'
    : 'bg-[#DCFCE7] dark:bg-emerald-950/80 border-2 border-emerald-300 dark:border-emerald-700/80 shadow-md';

  return (
    <div className={`group rounded-2xl p-4 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl relative overflow-hidden ${cardBgStyle}`}>
      
      {/* Grade Level Tag - Nền Vàng Nhạt & Xanh Lá Cây */}
      <div className="absolute top-6 left-6 z-10">
        <span className={`px-2.5 py-1 rounded-lg backdrop-blur-md text-[11px] font-extrabold border flex items-center gap-1 shadow-md ${getGradeBadgeStyle(game.grade_level)}`}>
          <Layers className="w-3 h-3 text-current" />
          Lớp {game.grade_level}
        </span>
      </div>

      {/* Delete Button for Teacher/Admin or onDelete prop */}
      {(onDelete || isAdminOrTeacher) && (
        <button
          onClick={handleDeleteClick}
          className="absolute top-6 right-6 z-20 p-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white backdrop-blur-md border border-rose-400 shadow-lg transition-all"
          title="Xóa bài chơi này khỏi Kho Game"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Thumbnail Container */}
      <div className="relative w-full h-44 rounded-xl overflow-hidden mb-3.5 bg-slate-900 border border-slate-700/50">
        <img
          src={game.thumbnail_url || 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80'}
          alt={game.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
        
        {/* Play Overlay Button */}
        <Link
          to={`/play/${game.id}`}
          onClick={() => soundFx.play('click')}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/50 backdrop-blur-xs"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/50 scale-90 group-hover:scale-100 transition-transform">
            <Play className="w-6 h-6 fill-white ml-0.5" />
          </div>
        </Link>
      </div>

      {/* Subject Badge & Play Count */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-600 text-white border border-emerald-400 shadow-xs`}>
          {game.subject}
        </span>

        <div className="flex items-center gap-3 text-xs text-slate-700 dark:text-slate-300 font-bold">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="font-bold text-slate-900 dark:text-slate-100">{game.avg_rating || 5.0}</span>
          </div>

          <div className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
            <span>{game.play_count || 0}</span>
          </div>
        </div>
      </div>

      {/* Title & Description */}
      <div>
        <h3 className={`text-base font-heading font-black transition-colors line-clamp-1 mb-1 ${isYellow ? 'text-amber-950 dark:text-white group-hover:text-emerald-700' : 'text-emerald-950 dark:text-white group-hover:text-amber-700'}`}>
          {game.title}
        </h3>
        <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed mb-4 font-semibold">
          {game.description || 'Trò chơi học tập tương tác nâng cao kiến thức.'}
        </p>
      </div>

      {/* Footer Action Buttons (Tab Mới & Chơi Ngay) */}
      <div className={`pt-3 border-t flex items-center justify-end gap-2.5 ${isYellow ? 'border-amber-300' : 'border-emerald-300'}`}>
        <a
          href={`/play/${game.id}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            e.stopPropagation();
            soundFx.play('click');
          }}
          className="flex-1 py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white border border-purple-400 text-xs font-black shadow-sm transition-all duration-200 flex items-center justify-center gap-1.5"
          title="Mở trò chơi trong Tab mới để chơi độc lập"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Tab Mới</span>
        </a>

        <Link
          to={`/play/${game.id}`}
          onClick={() => soundFx.play('click')}
          className={`flex-1 py-2 px-3 rounded-xl text-white text-xs font-black border shadow-sm transition-all duration-200 flex items-center justify-center gap-1.5 ${
            isYellow
              ? 'bg-emerald-600 hover:bg-emerald-700 border-emerald-400'
              : 'bg-amber-500 hover:bg-amber-600 border-amber-300'
          }`}
        >
          <span>Chơi Ngay</span>
          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
        </Link>
      </div>
    </div>
  );
};
