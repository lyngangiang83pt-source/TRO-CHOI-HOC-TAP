import React from 'react';
import { User, Trophy, Sparkles, Coins, Flame, Key, GraduationCap, Award, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { RadarSkillChart } from '../components/dashboard/RadarSkillChart';

const SAMPLE_BADGES = [
  { id: 'b-1', title: 'Tân Binh Học Vui', description: 'Hoàn thành trò chơi học tập đầu tiên', icon: Sparkles, unlocked: true },
  { id: 'b-2', title: 'Chiến Thần Khoa Học', description: 'Tích lũy 500 EXP từ game Khoa Học Tự Nhiên', icon: Award, unlocked: true },
  { id: 'b-3', title: 'Bậc Thầy Ngôn Ngữ', description: 'Đạt điểm tối đa trong 5 game Ngữ Văn & Tiếng Anh', icon: Trophy, unlocked: true },
  { id: 'b-4', title: 'Kẻ Hủy Diệt Deadline', description: 'Hoàn thành 10 bài tập trước thời hạn', icon: Flame, unlocked: false },
  { id: 'b-5', title: 'Huyền Thoại Kim Cương', description: 'Đạt hạng Kim Cương với tổng 3000 EXP', icon: Shield, unlocked: false }
];

export const ProfilePage = () => {
  const { profile } = useAuth();

  if (!profile) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Profile Header Banner - NỀN XANH LÁ CÂY TƯƠI MÁT */}
      <div 
        style={{
          background: 'linear-gradient(135deg, #065F46 0%, #059669 50%, #047857 100%)',
          border: '2px solid #34D399',
          boxShadow: '0 20px 25px -5px rgba(5, 150, 105, 0.35)'
        }}
        className="rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center gap-6 text-center md:text-left shadow-xl"
      >
        <div className="relative">
          <img
            src={profile.avatar_url}
            alt={profile.full_name}
            className="w-24 h-24 rounded-3xl object-cover ring-4 ring-emerald-300 shadow-2xl"
          />
          <span 
            style={{ background: '#FBBF24', color: '#451A03', border: '2px solid #FDE047' }}
            className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase shadow-md"
          >
            {profile.rank_tier}
          </span>
        </div>

        <div className="space-y-2 flex-1">
          <div className="flex flex-wrap justify-center md:justify-start gap-2">
            <span 
              style={{ background: 'rgba(255, 255, 255, 0.2)', border: '1px solid rgba(255, 255, 255, 0.3)' }}
              className="px-2.5 py-0.5 rounded-md text-emerald-100 text-xs font-black backdrop-blur-md"
            >
              {profile.role === 'student' ? `Học sinh Lớp ${profile.grade_level}` : profile.role === 'teacher' ? 'Giáo viên THCS' : 'Quản trị Admin'}
            </span>

            {profile.student_code && (
              <span 
                style={{ background: '#FEF08A', color: '#064E3B', border: '1px solid #FACC15' }}
                className="px-2.5 py-0.5 rounded-md text-xs font-mono font-black flex items-center gap-1 shadow-xs"
              >
                <Key className="w-3 h-3 text-emerald-950" />
                Mã HS: {profile.student_code}
              </span>
            )}
          </div>

          <h1 className="text-2xl font-heading font-black text-white drop-shadow-sm">
            {profile.full_name}
          </h1>

          <p className="text-xs text-emerald-100 font-mono font-bold">
            Email: {profile.email}
          </p>
        </div>

        {/* EXP & Coins */}
        <div 
          style={{ background: '#FEF9C3', border: '2px solid #FACC15' }}
          className="flex items-center gap-4 p-4 rounded-2xl shadow-md text-amber-950"
        >
          <div className="text-center px-3">
            <div className="flex items-center justify-center gap-1 text-orange-600 font-black text-lg">
              <Flame className="w-5 h-5 fill-orange-500 text-orange-500" />
              <span>{profile.total_exp || 0}</span>
            </div>
            <span className="text-[11px] text-amber-900 uppercase font-black">EXP Tích Lũy</span>
          </div>

          <div className="h-8 w-px bg-amber-300" />

          <div className="text-center px-3">
            <div className="flex items-center justify-center gap-1 text-amber-700 font-black text-lg">
              <Coins className="w-5 h-5 text-amber-600" />
              <span>{profile.coins || 0}</span>
            </div>
            <span className="text-[11px] text-amber-900 uppercase font-black">Điểm Thưởng</span>
          </div>
        </div>
      </div>

      {/* Radar Skill Chart & Badges Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Radar Skill Chart */}
        <RadarSkillChart title="Biểu Đồ Năng Lực Cá Nhân (GDPT 2018)" />

        {/* Badges Collection */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
          <h3 className="text-base font-heading font-bold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            Kho Huy Hiệu & Danh Hiệu Đã Mở Khóa
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SAMPLE_BADGES.map((badge) => {
              const Icon = badge.icon;
              return (
                <div
                  key={badge.id}
                  className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${
                    badge.unlocked
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                      : 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-60'
                  }`}
                >
                  <div className={`p-2 rounded-xl ${badge.unlocked ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-600'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{badge.title}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{badge.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
