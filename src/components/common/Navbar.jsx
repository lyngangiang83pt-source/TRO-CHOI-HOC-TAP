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
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link 
          to="/" 
          onClick={() => soundFx.play('click')}
          className="flex items-center gap-3 group focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-lg group-hover:scale-105 transition-transform duration-200 overflow-hidden">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center p-1 overflow-hidden">
              <picture className="w-full h-full flex items-center justify-center">
                <source srcSet="/logo2.webp" type="image/webp" />
                <img 
                  src="/logo2.png" 
                  alt="Logo 2" 
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    if (e.currentTarget.nextElementSibling) {
                      e.currentTarget.nextElementSibling.style.display = 'block';
                    }
                  }}
                />
              </picture>
              <Gamepad2 className="w-6 h-6 text-indigo-400 hidden group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <span className="font-heading font-bold text-lg bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
              HỌC VUI CẤP 2
            </span>
            <span className="hidden sm:inline-block text-[10px] font-semibold tracking-wider text-indigo-400 block -mt-1 uppercase">
              THCS GDPT 2018
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            to="/"
            onClick={() => soundFx.play('click')}
            className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              location.pathname === '/' 
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            Kho Game
          </Link>

          <Link
            to="/leaderboard"
            onClick={() => soundFx.play('click')}
            className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
              location.pathname === '/leaderboard' 
                ? 'bg-amber-600/20 text-amber-400 border border-amber-500/30' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            Bảng Xếp Hạng
          </Link>

          {profile?.role === 'teacher' && (
            <Link
              to="/teacher"
              onClick={() => soundFx.play('click')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                location.pathname === '/teacher' 
                  ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-emerald-400" />
              Góc Giáo Viên
            </Link>
          )}

          {profile?.email?.toLowerCase() === 'lyngangiang83pt@gmail.com' && (
            <Link
              to="/admin"
              onClick={() => soundFx.play('click')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                location.pathname === '/admin' 
                  ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              Quản Trị Admin
            </Link>
          )}
        </nav>

        {/* Right Stats & Profile Controls */}
        <div className="flex items-center gap-3">
          
          {/* Rank & EXP Badge */}
          {profile && (
            <div className="hidden sm:flex items-center gap-2">
              <div className={`px-2.5 py-1 rounded-full text-xs font-bold border bg-slate-900/80 flex items-center gap-1.5 ${getRankColor(profile.rank_tier)}`}>
                <Sparkles className="w-3.5 h-3.5" />
                <span>{profile.rank_tier}</span>
              </div>

              <div className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-950/80 text-indigo-300 border border-indigo-800/50 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
                <span>{profile.total_exp || 0} EXP</span>
              </div>

              <div className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-300 border border-amber-800/50 flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <span>{profile.coins || 0}</span>
              </div>
            </div>
          )}

          {/* Audio Toggle */}
          <button
            onClick={handleAudioToggle}
            className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/80 text-slate-300 hover:text-white transition-colors focus:outline-none"
            title={muted ? 'Bật âm thanh' : 'Tắt âm thanh'}
          >
            {muted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Dark / Light Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/80 text-slate-300 hover:text-white transition-colors focus:outline-none"
            title="Đổi giao diện Sáng / Tối"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          {/* Quick Demo Role Switcher Dropdown */}
          <div className="relative group">
            <button className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs font-medium text-slate-300 flex items-center gap-1.5 hover:bg-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="capitalize">{profile?.role || 'student'}</span>
            </button>
            <div className="absolute right-0 top-full mt-1 w-40 glass-panel rounded-xl shadow-xl py-1 hidden group-hover:block border border-slate-700/80 text-xs z-50">
              <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-800">
                Thử nghiệm Vai Trò:
              </div>
              <button 
                onClick={() => switchDemoRole('student')}
                className="w-full px-3 py-2 text-left hover:bg-indigo-600/20 text-slate-200 flex items-center justify-between"
              >
                <span>Học sinh (Lớp 7)</span>
                {profile?.role === 'student' && <span className="text-emerald-400 font-bold">✓</span>}
              </button>
              <button 
                onClick={() => switchDemoRole('teacher')}
                className="w-full px-3 py-2 text-left hover:bg-indigo-600/20 text-slate-200 flex items-center justify-between"
              >
                <span>Giáo viên THCS</span>
                {profile?.role === 'teacher' && <span className="text-emerald-400 font-bold">✓</span>}
              </button>
              <button 
                onClick={() => switchDemoRole('admin')}
                className="w-full px-3 py-2 text-left hover:bg-indigo-600/20 text-slate-200 flex items-center justify-between"
              >
                <span>Quản trị Admin</span>
                {profile?.role === 'admin' && <span className="text-emerald-400 font-bold">✓</span>}
              </button>
            </div>
          </div>

          {/* User Profile Button */}
          {profile ? (
            <div className="flex items-center gap-2">
              <Link 
                to="/profile" 
                onClick={() => soundFx.play('click')}
                className="flex items-center gap-2 p-1 pl-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 transition-colors"
              >
                <img 
                  src={profile.avatar_url} 
                  alt={profile.full_name} 
                  className="w-7 h-7 rounded-lg object-cover ring-2 ring-indigo-500/30"
                />
                <span className="hidden lg:inline-block text-xs font-semibold max-w-[100px] truncate text-slate-200">
                  {profile.full_name}
                </span>
              </Link>

              <button
                onClick={signOut}
                className="p-2 rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-colors"
                title="Đăng xuất"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              onClick={() => soundFx.play('click')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-200"
            >
              Đăng Nhập
            </Link>
          )}

        </div>
      </div>
    </header>
  );
};
