import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Gamepad2, 
  Trophy, 
  User, 
  Sun, 
  Moon, 
  Volume2, 
  VolumeX, 
  LogOut, 
  Flame, 
  Coins, 
  GraduationCap, 
  ShieldCheck, 
  Sparkles,
  Bot 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { soundFx } from '../../lib/soundFx';
import { AiChatModal } from './AiChatModal';

export const Navbar = () => {
  const { user, profile, signOut, switchDemoRole } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [muted, setMuted] = React.useState(false);
  const [isAiChatOpen, setIsAiChatOpen] = React.useState(false);

  const handleAudioToggle = () => {
    const isMuted = soundFx.toggleMute();
    setMuted(isMuted);
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 'Kim Cương': return 'from-cyan-400 to-blue-600 text-cyan-300 border-cyan-500/50';
      case 'Vàng': return 'from-amber-400 to-yellow-600 text-amber-300 border-amber-500/50';
      case 'Bạc': return 'from-slate-300 to-slate-500 text-slate-200 border-slate-400/50';
      default: return 'from-amber-700 to-amber-900 text-amber-200 border-amber-700/50';
    }
  };

  return (
    <header 
      style={{
        background: 'linear-gradient(135deg, #065F46 0%, #059669 50%, #047857 100%)',
        borderBottom: '2px solid #34D399',
        boxShadow: '0 4px 20px -2px rgba(5, 150, 105, 0.4)'
      }}
      className="sticky top-0 z-40 w-full text-white backdrop-blur-md transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link 
          to="/" 
          onClick={() => soundFx.play('click')}
          className="flex items-center gap-3 group focus:outline-none"
        >
          <picture className="flex items-center justify-center shrink-0">
            <source srcSet="/logo2.webp" type="image/webp" />
            <img 
              src="/logo2.png" 
              alt="Logo 2" 
              className="h-12 sm:h-14 w-auto max-w-none object-contain filter drop-shadow-[0_4px_12px_rgba(255,255,255,0.4)] group-hover:scale-110 transition-transform duration-300"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                if (e.currentTarget.nextElementSibling) {
                  e.currentTarget.nextElementSibling.style.display = 'block';
                }
              }}
            />
            <Gamepad2 className="w-8 h-8 text-amber-300 hidden group-hover:rotate-12 transition-transform duration-300" />
          </picture>
          <div>
            <span className="font-heading font-black text-lg text-white drop-shadow-sm tracking-wide">
              HỌC VUI CẤP 2
            </span>
            <span className="hidden sm:inline-block text-[10px] font-bold tracking-wider text-emerald-100 block -mt-1 uppercase">
              THCS GDPT 2018
            </span>
          </div>
        </Link>

        {/* Navigation Links - Nền Xanh Lá Cây */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            to="/"
            onClick={() => soundFx.play('click')}
            className={`px-3.5 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
              location.pathname === '/' || location.pathname === '/dashboard'
                ? 'bg-white/25 text-white border border-white/40 shadow-sm' 
                : 'text-emerald-100 hover:text-white hover:bg-white/15'
            }`}
          >
            Kho Game
          </Link>

          <Link
            to="/leaderboard"
            onClick={() => soundFx.play('click')}
            className={`px-3.5 py-2 rounded-lg text-sm font-bold transition-all duration-200 flex items-center gap-1.5 ${
              location.pathname === '/leaderboard' 
                ? 'bg-white/25 text-white border border-white/40 shadow-sm' 
                : 'text-emerald-100 hover:text-white hover:bg-white/15'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-300" />
            Bảng Xếp Hạng
          </Link>

          {profile?.role === 'teacher' && (
            <Link
              to="/teacher"
              onClick={() => soundFx.play('click')}
              style={
                location.pathname === '/teacher'
                  ? {
                      background: '#047857',
                      border: '2px solid #34D399',
                      color: '#FFFFFF',
                      boxShadow: '0 4px 14px rgba(4, 120, 87, 0.5)'
                    }
                  : {
                      background: 'rgba(255, 255, 255, 0.15)',
                      border: '1px solid rgba(255, 255, 255, 0.25)',
                      color: '#FFFFFF'
                    }
              }
              className="px-4 py-2 rounded-xl text-sm font-black transition-all flex items-center gap-2 shadow-sm"
            >
              <GraduationCap className="w-4 h-4 text-amber-300" />
              <span>Góc Giáo Viên</span>
            </Link>
          )}

          {(profile?.email?.toLowerCase() === 'lyngangiang83pt@gmail.com' || profile?.username?.toLowerCase() === 'lyngangiang83pt') && (
            <Link
              to="/admin"
              onClick={() => soundFx.play('click')}
              style={
                location.pathname === '/admin'
                  ? {
                      background: '#047857',
                      border: '2px solid #34D399',
                      color: '#FFFFFF',
                      boxShadow: '0 4px 14px rgba(4, 120, 87, 0.5)'
                    }
                  : {
                      background: 'rgba(255, 255, 255, 0.15)',
                      border: '1px solid rgba(255, 255, 255, 0.25)',
                      color: '#FFFFFF'
                    }
              }
              className="px-4 py-2 rounded-xl text-sm font-black transition-all flex items-center gap-2 shadow-sm"
            >
              <ShieldCheck className="w-4 h-4 text-amber-300" />
              <span>Quản Trị Admin</span>
            </Link>
          )}

          {/* Nút Chatbox AI Trên Thanh Menu */}
          <button
            onClick={() => {
              soundFx.play('click');
              setIsAiChatOpen(true);
            }}
            style={{
              background: 'linear-gradient(135deg, #FEF08A 0%, #FBBF24 100%)',
              color: '#451A03',
              border: '2px solid #FDE047',
              boxShadow: '0 4px 14px rgba(251, 191, 36, 0.4)'
            }}
            className="px-3.5 py-1.5 rounded-xl text-sm font-black transition-all flex items-center gap-1.5 hover:scale-105 shadow-md ml-1"
            title="Mở Trợ Lý AI Chatbox Giải Đáp 7 Môn GDPT 2018 & Hướng Dẫn Chơi Game"
          >
            <Bot className="w-4 h-4 text-emerald-950 animate-bounce" />
            <span>Chatbox AI</span>
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-700 text-white text-[9px] font-black uppercase">
              AI
            </span>
          </button>
        </nav>

        {/* Right Stats & Profile Controls */}
        <div className="flex items-center gap-3">
          
          {/* Mobile AI Chatbox Button */}
          <button
            onClick={() => {
              soundFx.play('click');
              setIsAiChatOpen(true);
            }}
            style={{
              background: '#FEF08A',
              color: '#451A03',
              border: '1.5px solid #FACC15'
            }}
            className="md:hidden p-2 rounded-xl text-xs font-black shadow-md flex items-center gap-1 hover:scale-105 transition-transform"
            title="Mở Trợ Lý AI Chatbox"
          >
            <Bot className="w-4 h-4 text-emerald-950 animate-pulse" />
            <span className="text-[10px] font-black">AI</span>
          </button>
          
          {/* Rank & EXP Badge */}
          {profile && (
            <div className="hidden sm:flex items-center gap-2">
              <div className={`px-2.5 py-1 rounded-full text-xs font-bold border bg-white/15 text-white border-white/30 flex items-center gap-1.5`}>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{profile?.rank_tier || 'Đồng'}</span>
              </div>

              <div className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/15 text-white border border-white/30 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-orange-300 fill-orange-300" />
                <span>{profile?.total_exp || 0} EXP</span>
              </div>

              <div className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/15 text-white border border-white/30 flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-amber-300" />
                <span>{profile?.coins || 0}</span>
              </div>
            </div>
          )}

          {/* Audio Toggle */}
          <button
            onClick={handleAudioToggle}
            className="p-2 rounded-lg bg-white/15 hover:bg-white/25 text-white transition-colors focus:outline-none border border-white/20"
            title={muted ? 'Bật âm thanh' : 'Tắt âm thanh'}
          >
            {muted ? <VolumeX className="w-4 h-4 text-rose-300" /> : <Volume2 className="w-4 h-4 text-emerald-300" />}
          </button>

          {/* Quick Demo Role Switcher Dropdown - Nền Xanh Lá Cây Tươi Mát Đồng Bộ */}
          <div className="relative group">
            <button 
              style={{
                background: 'linear-gradient(135deg, #065F46 0%, #059669 100%)',
                border: '2px solid #34D399',
                color: '#FFFFFF'
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-2 shadow-md transition-all"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
              <span className="capitalize">{profile?.role || 'student'}</span>
            </button>

            {/* Khung Dropdown Nền Xanh Lá Cây (#065F46 - #059669) Chữ Trắng & Vàng Nét Đậm */}
            <div 
              style={{
                background: 'linear-gradient(135deg, #065F46 0%, #059669 100%)',
                border: '2px solid #34D399',
                boxShadow: '0 20px 25px -5px rgba(5, 150, 105, 0.4)'
              }}
              className="absolute right-0 top-full mt-2 w-52 rounded-2xl shadow-2xl py-1.5 hidden group-hover:block text-xs z-50 animate-in fade-in slide-in-from-top-1 duration-200"
            >
              <div 
                style={{ background: 'rgba(0, 0, 0, 0.25)', color: '#FEF08A' }}
                className="px-3.5 py-2 text-[10px] uppercase font-black rounded-t-xl tracking-wider border-b border-emerald-500/40"
              >
                🎯 Chuyển Đổi Vai Trò:
              </div>

              <div className="p-1.5 space-y-1">
                <button 
                  onClick={() => switchDemoRole('student')}
                  style={
                    profile?.role === 'student'
                      ? { background: '#FEF08A', color: '#064E3B', border: '2px solid #FACC15' }
                      : { background: 'rgba(255, 255, 255, 0.15)', color: '#FFFFFF', border: '1px solid rgba(255, 255, 255, 0.2)' }
                  }
                  className="w-full px-3 py-2 rounded-xl text-left transition-all flex items-center justify-between font-black shadow-xs"
                >
                  <span>👨‍🎓 Học sinh (Lớp 7)</span>
                  {profile?.role === 'student' && <span className="text-emerald-900 font-black text-sm">✓</span>}
                </button>

                <button 
                  onClick={() => switchDemoRole('teacher')}
                  style={
                    profile?.role === 'teacher'
                      ? { background: '#FEF08A', color: '#064E3B', border: '2px solid #FACC15' }
                      : { background: 'rgba(255, 255, 255, 0.15)', color: '#FFFFFF', border: '1px solid rgba(255, 255, 255, 0.2)' }
                  }
                  className="w-full px-3 py-2 rounded-xl text-left transition-all flex items-center justify-between font-black shadow-xs"
                >
                  <span>👩‍🏫 Giáo viên THCS</span>
                  {profile?.role === 'teacher' && <span className="text-emerald-900 font-black text-sm">✓</span>}
                </button>

                <button 
                  onClick={() => switchDemoRole('admin')}
                  style={
                    profile?.role === 'admin'
                      ? { background: '#FEF08A', color: '#064E3B', border: '2px solid #FACC15' }
                      : { background: 'rgba(255, 255, 255, 0.15)', color: '#FFFFFF', border: '1px solid rgba(255, 255, 255, 0.2)' }
                  }
                  className="w-full px-3 py-2 rounded-xl text-left transition-all flex items-center justify-between font-black shadow-xs"
                >
                  <span>👑 Quản trị Admin</span>
                  {profile?.role === 'admin' && <span className="text-emerald-900 font-black text-sm">✓</span>}
                </button>
              </div>
            </div>
          </div>

          {/* NÚT ĐĂNG NHẬP HIỆN TÊN NGƯỜI DÙNG KHI ĐÃ ĐĂNG NHẬP THÀNH CÔNG */}
          {user ? (
            <div className="flex items-center gap-2">
              <Link 
                to="/profile" 
                onClick={() => soundFx.play('click')}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 text-xs font-black shadow-md border border-amber-300 transition-all transform hover:scale-105"
                title="Trang cá nhân thành viên"
              >
                <img 
                  src={profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'} 
                  alt={profile?.full_name || 'Avatar'} 
                  className="w-6 h-6 rounded-full object-cover border border-amber-950/30 shrink-0"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <User className="w-4 h-4 fill-amber-950 text-amber-950 shrink-0" />
                <span className="max-w-[130px] sm:max-w-[160px] truncate font-black">
                  {profile?.full_name || profile?.username || user?.email?.split('@')[0] || 'Thành Viên'}
                </span>
              </Link>

              <button
                onClick={signOut}
                className="p-2 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white transition-colors border border-rose-400/50 shadow-xs"
                title="Đăng xuất khỏi hệ thống"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              onClick={() => soundFx.play('click')}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 text-xs font-black shadow-md flex items-center gap-1.5 transition-all transform hover:scale-105 active:scale-95 border border-amber-300"
              title="Bấm để Đăng Ký / Đăng Nhập vào hệ thống"
            >
              <User className="w-4 h-4 fill-amber-950 text-amber-950" />
              <span>Đăng Ký / Đăng Nhập</span>
            </Link>
          )}

        </div>
      </div>

      {/* AI Chatbox Modal */}
      <AiChatModal 
        isOpen={isAiChatOpen} 
        onClose={() => setIsAiChatOpen(false)} 
      />
    </header>
  );
};
