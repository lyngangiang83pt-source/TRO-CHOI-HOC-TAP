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
  Sparkles 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { soundFx } from '../../lib/soundFx';

export const Navbar = () => {
  const { profile, signOut, switchDemoRole } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [muted, setMuted] = React.useState(false);

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
    <header className="sticky top-0 z-40 w-full bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white border-b border-emerald-500/40 shadow-md backdrop-blur-md transition-colors duration-300">
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
              className={`px-3.5 py-2 rounded-lg text-sm font-bold transition-all duration-200 flex items-center gap-1.5 ${
                location.pathname === '/teacher' 
                  ? 'bg-white/25 text-white border border-white/40 shadow-sm' 
                  : 'text-emerald-100 hover:text-white hover:bg-white/15'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-amber-300" />
              Góc Giáo Viên
            </Link>
          )}

          {(profile?.email?.toLowerCase() === 'lyngangiang83pt@gmail.com' || profile?.username?.toLowerCase() === 'lyngangiang83pt') && (
            <Link
              to="/admin"
              onClick={() => soundFx.play('click')}
              className={`px-3.5 py-2 rounded-lg text-sm font-bold transition-all duration-200 flex items-center gap-1.5 ${
                location.pathname === '/admin' 
                  ? 'bg-white/25 text-white border border-white/40 shadow-sm' 
                  : 'text-emerald-100 hover:text-white hover:bg-white/15'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-amber-300" />
              Quản Trị Admin
            </Link>
          )}
        </nav>

        {/* Right Stats & Profile Controls */}
        <div className="flex items-center gap-3">
          
          {/* Rank & EXP Badge */}
          {profile && (
            <div className="hidden sm:flex items-center gap-2">
              <div className={`px-2.5 py-1 rounded-full text-xs font-bold border bg-white/15 text-white border-white/30 flex items-center gap-1.5`}>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{profile.rank_tier}</span>
              </div>

              <div className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/15 text-white border border-white/30 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-orange-300 fill-orange-300" />
                <span>{profile.total_exp || 0} EXP</span>
              </div>

              <div className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/15 text-white border border-white/30 flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-amber-300" />
                <span>{profile.coins || 0}</span>
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

          {/* Dark / Light Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-white/15 hover:bg-white/25 text-white transition-colors focus:outline-none border border-white/20"
            title="Đổi giao diện Sáng / Tối"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-emerald-100" />}
          </button>

          {/* Quick Demo Role Switcher Dropdown */}
          <div className="relative group">
            <button className="px-2.5 py-1.5 rounded-lg bg-white/15 border border-white/30 text-xs font-bold text-white flex items-center gap-1.5 hover:bg-white/25">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
              <span className="capitalize">{profile?.role || 'student'}</span>
            </button>
            <div className="absolute right-0 top-full mt-1 w-40 glass-panel rounded-xl shadow-xl py-1 hidden group-hover:block border border-slate-700/80 text-xs z-50">
              <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-800">
                Thử nghiệm Vai Trò:
              </div>
              <button 
                onClick={() => switchDemoRole('student')}
                className="w-full px-3 py-2 text-left hover:bg-emerald-600/20 text-slate-200 flex items-center justify-between font-bold"
              >
                <span>Học sinh (Lớp 7)</span>
                {profile?.role === 'student' && <span className="text-emerald-400 font-bold">✓</span>}
              </button>
              <button 
                onClick={() => switchDemoRole('teacher')}
                className="w-full px-3 py-2 text-left hover:bg-emerald-600/20 text-slate-200 flex items-center justify-between font-bold"
              >
                <span>Giáo viên THCS</span>
                {profile?.role === 'teacher' && <span className="text-emerald-400 font-bold">✓</span>}
              </button>
              <button 
                onClick={() => switchDemoRole('admin')}
                className="w-full px-3 py-2 text-left hover:bg-emerald-600/20 text-slate-200 flex items-center justify-between font-bold"
              >
                <span>Quản trị Admin</span>
                {profile?.role === 'admin' && <span className="text-emerald-400 font-bold">✓</span>}
              </button>
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
    </header>
  );
};
