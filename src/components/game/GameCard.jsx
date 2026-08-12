import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Star, Eye, Sparkles, BookOpen, Layers } from 'lucide-react';
import { soundFx } from '../../lib/soundFx';

export const GameCard = ({ game }) => {
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

  return (
    <div className="group glass-panel rounded-2xl p-4 border border-slate-800/80 hover:border-indigo-500/50 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 relative overflow-hidden">
      
      {/* Grade Level Tag */}
      <div className="absolute top-6 left-6 z-10">
        <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-[11px] font-bold text-indigo-300 border border-indigo-500/30 flex items-center gap-1 shadow-md">
          <Layers className="w-3 h-3 text-indigo-400" />
          Lớp {game.grade_level}
        </span>
      </div>

      {/* Thumbnail Container */}
      <div className="relative w-full h-44 rounded-xl overflow-hidden mb-3.5 bg-slate-900">
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
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/50 scale-90 group-hover:scale-100 transition-transform">
            <Play className="w-6 h-6 fill-white ml-0.5" />
          </div>
        </Link>
      </div>

      {/* Subject Badge & Play Count */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gradient-to-r ${getSubjectColor(game.subject)} bg-opacity-20 border border-slate-700/50`}>
          {game.subject}
        </span>

        <div className="flex items-center gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="font-semibold text-slate-200">{game.avg_rating || 5.0}</span>
          </div>

          <div className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-slate-400" />
            <span>{game.play_count || 0}</span>
          </div>
        </div>
      </div>

      {/* Title & Description */}
      <div>
        <h3 className="text-base font-heading font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1 mb-1">
          {game.title}
        </h3>
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
          {game.description || 'Trò chơi học tập tương tác nâng cao kiến thức.'}
        </p>
      </div>

      {/* Footer Action */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          {game.game_type === 'iframe' ? '🎮 iFrame Embed' : game.game_type === 'html5_zip' ? '⚡ HTML5 ZIP' : '✨ Mini-Game'}
        </span>

        <Link
          to={`/play/${game.id}`}
          onClick={() => soundFx.play('click')}
          className="px-3.5 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-bold transition-all duration-200 flex items-center gap-1.5"
        >
          <span>Chơi Ngay</span>
          <Play className="w-3 h-3 fill-current" />
        </Link>
      </div>

    </div>
  );
};
