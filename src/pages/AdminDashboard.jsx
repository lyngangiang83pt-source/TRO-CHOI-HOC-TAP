import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Users, 
  Gamepad2, 
  Trophy, 
  Settings, 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  Download, 
  RefreshCw, 
  Flame, 
  Coins, 
  Lock, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  BookOpen, 
  ExternalLink, 
  BarChart3,
  UserCheck,
  GraduationCap,
  Database,
  ArrowLeft,
  Eye,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useGames } from '../hooks/useGames';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { soundFx } from '../lib/soundFx';

export const AdminDashboard = () => {
  const { profile, user } = useAuth();
  const { games, addGame, deleteGame, refetch: refetchGames } = useGames();

  // Kiểm tra phân quyền tuyệt đối: Chỉ email "lyngangiang83pt@gmail.com" hoặc username "lyngangiang83pt"
  const isAuthorizedAdmin = 
    profile?.email?.toLowerCase() === 'lyngangiang83pt@gmail.com' ||
    profile?.username?.toLowerCase() === 'lyngangiang83pt' ||
    user?.email?.toLowerCase() === 'lyngangiang83pt@gmail.com';

  const [activeTab, setActiveTab] = useState('games'); // 'games' | 'users' | 'curriculum' | 'leaderboard' | 'system'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('all');
  const [selectedGradeFilter, setSelectedGradeFilter] = useState('all');

  // Quản lý danh sách Users
  const [usersList, setUsersList] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '123',
    role: 'student',
    gradeLevel: '6',
    totalExp: 100,
    coins: 200
  });

  // Quản lý Trò Chơi (Games)
  const [editingGame, setEditingGame] = useState(null);
  const [isAddGameOpen, setIsAddGameOpen] = useState(false);
  const [newGameForm, setNewGameForm] = useState({
    title: '',
    description: '',
    grade_level: '6',
    subject: 'Khoa Học Tự Nhiên',
    game_type: 'iframe',
    game_url: '',
    thumbnail_url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80',
    is_public: true
  });

  // Tải danh sách người dùng từ Supabase & LocalStorage
  const fetchUsers = async () => {
    setLoadingUsers(true);
    let allUsers = [];

    // 1. Đọc từ Supabase nếu có cấu hình
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && Array.isArray(data)) {
          allUsers = data;
        }
      } catch (e) {
        console.warn('Lỗi đọc profiles từ Supabase:', e);
      }
    }

    // 2. Đọc từ LocalStorage
    try {
      const saved = localStorage.getItem('hocvuicap2_users');
      if (saved) {
        const parsed = JSON.parse(saved);
        const localArray = Object.values(parsed);
        // Hợp nhất dữ liệu tránh trùng lặp id/username
        localArray.forEach(lu => {
          if (!allUsers.some(u => u.username?.toLowerCase() === lu.username?.toLowerCase() || u.email?.toLowerCase() === lu.email?.toLowerCase())) {
            allUsers.push(lu);
          }
        });
      }
    } catch (e) {}

    // Dữ liệu mặc định mẫu nếu trống
    if (allUsers.length === 0) {
      allUsers = [
        { id: 'usr-admin-1', username: 'lyngangiang83pt', full_name: 'Thầy Huỳnh Ngân Giang', email: 'lyngangiang83pt@gmail.com', role: 'admin', grade_level: '9', total_exp: 9999, coins: 9999, rank_tier: 'Kim Cương' },
        { id: 'usr-hs-1', username: 'nguyen_nam7a', full_name: 'Nguyễn Văn Nam', email: 'nguyennam7a@gmail.com', role: 'student', grade_level: '7', total_exp: 1450, coins: 350, rank_tier: 'Bạc' },
        { id: 'usr-gv-1', username: 'co_thu_ha', full_name: 'Cô Trần Thị Thu Hà', email: 'cothuha@gmail.com', role: 'teacher', grade_level: '8', total_exp: 4200, coins: 1200, rank_tier: 'Kim Cương' },
        { id: 'usr-hs-2', username: 'le_minh_anh', full_name: 'Lê Minh Anh', email: 'minhanh6b@gmail.com', role: 'student', grade_level: '6', total_exp: 2890, coins: 680, rank_tier: 'Vàng' }
      ];
    }

    setUsersList(allUsers);
    setLoadingUsers(false);
  };

  useEffect(() => {
    if (isAuthorizedAdmin) {
      fetchUsers();
    }
  }, [isAuthorizedAdmin]);

  // Cập nhật vai trò (Role) trực tiếp của người dùng
  const handleUpdateUserRole = async (userId, newRole) => {
    soundFx.play('click');
    setUsersList(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));

    if (isSupabaseConfigured) {
      try {
        await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
      } catch (e) {
        console.warn('Lỗi cập nhật Supabase role:', e);
      }
    }

    // Cập nhật LocalStorage
    try {
      const saved = localStorage.getItem('hocvuicap2_users');
      if (saved) {
        const usersObj = JSON.parse(saved);
        Object.keys(usersObj).forEach(k => {
          if (usersObj[k].id === userId) {
            usersObj[k].role = newRole;
          }
        });
        localStorage.setItem('hocvuicap2_users', JSON.stringify(usersObj));
      }
    } catch (e) {}
  };

  // Lưu chỉnh sửa người dùng
  const handleSaveUserEdit = async () => {
    if (!editingUser) return;
    soundFx.play('click');

    setUsersList(prev => prev.map(u => u.id === editingUser.id ? editingUser : u));

    if (isSupabaseConfigured) {
      try {
        await supabase.from('profiles').update({
          full_name: editingUser.full_name,
          role: editingUser.role,
          grade_level: editingUser.grade_level,
          total_exp: Number(editingUser.total_exp || 0),
          coins: Number(editingUser.coins || 0),
          rank_tier: editingUser.rank_tier
        }).eq('id', editingUser.id);
      } catch (e) {
        console.warn('Lỗi lưu profile Supabase:', e);
      }
    }

    setEditingUser(null);
  };

  // Xóa người dùng
  const handleDeleteUser = async (userId, userName) => {
    soundFx.play('click');
    if (!window.confirm(`Thầy có chắc chắn muốn XÓA người dùng "${userName}" khỏi hệ thống không?`)) return;

    setUsersList(prev => prev.filter(u => u.id !== userId));

    if (isSupabaseConfigured) {
      try {
        await supabase.from('profiles').delete().eq('id', userId);
      } catch (e) {
        console.warn('Lỗi xóa profile Supabase:', e);
      }
    }

    try {
      const saved = localStorage.getItem('hocvuicap2_users');
      if (saved) {
        const usersObj = JSON.parse(saved);
        const filteredObj = {};
        Object.keys(usersObj).forEach(k => {
          if (usersObj[k].id !== userId) {
            filteredObj[k] = usersObj[k];
          }
        });
        localStorage.setItem('hocvuicap2_users', JSON.stringify(filteredObj));
      }
    } catch (e) {}
  };

  // Thêm người dùng mới
  const handleCreateUserSubmit = async (e) => {
    e.preventDefault();
    soundFx.play('click');
    const cleanUsername = newUserForm.username.trim().toLowerCase();
    const email = newUserForm.email.trim() || `${cleanUsername}@gmail.com`;

    const newUser = {
      id: 'usr-' + Date.now(),
      username: cleanUsername,
      full_name: newUserForm.fullName.trim() || cleanUsername,
      email: email,
      role: newUserForm.role,
      grade_level: newUserForm.gradeLevel,
      total_exp: Number(newUserForm.totalExp || 100),
      coins: Number(newUserForm.coins || 200),
      rank_tier: Number(newUserForm.totalExp) >= 3000 ? 'Kim Cương' : Number(newUserForm.totalExp) >= 1500 ? 'Vàng' : 'Đồng',
      student_code: 'HS' + Math.floor(100000 + Math.random() * 900000),
      created_at: new Date().toISOString()
    };

    setUsersList(prev => [newUser, ...prev]);

    if (isSupabaseConfigured) {
      try {
        await supabase.from('profiles').insert([newUser]);
      } catch (e) {
        console.warn('Lỗi insert Supabase:', e);
      }
    }

    try {
      const saved = localStorage.getItem('hocvuicap2_users');
      const usersObj = saved ? JSON.parse(saved) : {};
      usersObj[cleanUsername] = newUser;
      localStorage.setItem('hocvuicap2_users', JSON.stringify(usersObj));
    } catch (e) {}

    setIsAddUserOpen(false);
    setNewUserForm({
      username: '',
      fullName: '',
      email: '',
      password: '123',
      role: 'student',
      gradeLevel: '6',
      totalExp: 100,
      coins: 200
    });
  };

  // Thêm trò chơi mới
  const handleCreateGameSubmit = async (e) => {
    e.preventDefault();
    soundFx.play('click');
    await addGame(newGameForm);
    setIsAddGameOpen(false);
    setNewGameForm({
      title: '',
      description: '',
      grade_level: '6',
      subject: 'Khoa Học Tự Nhiên',
      game_type: 'iframe',
      game_url: '',
      thumbnail_url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80',
      is_public: true
    });
  };

  // Lưu chỉnh sửa Game
  const handleSaveGameEdit = async () => {
    if (!editingGame) return;
    soundFx.play('click');

    if (isSupabaseConfigured) {
      try {
        await supabase.from('games').update({
          title: editingGame.title,
          description: editingGame.description,
          grade_level: editingGame.grade_level,
          subject: editingGame.subject,
          thumbnail_url: editingGame.thumbnail_url,
          game_url: editingGame.game_url,
          is_public: editingGame.is_public
        }).eq('id', editingGame.id);
      } catch (e) {
        console.warn('Lỗi lưu game Supabase:', e);
      }
    }

    try {
      const saved = localStorage.getItem('custom_created_games');
      if (saved) {
        const list = JSON.parse(saved);
        const updated = list.map(g => g.id === editingGame.id ? editingGame : g);
        localStorage.setItem('custom_created_games', JSON.stringify(updated));
      }
    } catch (e) {}

    await refetchGames();
    setEditingGame(null);
  };

  // Xuất toàn bộ Database ra file JSON (Sao lưu 1-chạm)
  const handleExportBackup = () => {
    soundFx.play('click');
    const backupData = {
      exported_at: new Date().toISOString(),
      system: 'KHO TRO CHOI HOC TAP CAP 2',
      admin: 'Thầy Huỳnh Ngân Giang (lyngangiang83pt@gmail.com)',
      users: usersList,
      games: games
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `backup_kho_tro_choi_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Lọc người dùng
  const filteredUsers = useMemo(() => {
    return usersList.filter(u => {
      const matchSearch = 
        (u.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.student_code || '').toLowerCase().includes(searchTerm.toLowerCase());

      const matchRole = selectedRoleFilter === 'all' || u.role === selectedRoleFilter;
      const matchGrade = selectedGradeFilter === 'all' || String(u.grade_level) === String(selectedGradeFilter);

      return matchSearch && matchRole && matchGrade;
    });
  }, [usersList, searchTerm, selectedRoleFilter, selectedGradeFilter]);

  // Lọc trò chơi
  const filteredGames = useMemo(() => {
    return games.filter(g => {
      const matchSearch = 
        (g.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (g.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (g.subject || '').toLowerCase().includes(searchTerm.toLowerCase());

      const matchGrade = selectedGradeFilter === 'all' || String(g.grade_level) === String(selectedGradeFilter);
      return matchSearch && matchGrade;
    });
  }, [games, searchTerm, selectedGradeFilter]);

  // NẾU KHÔNG PHẢI LÀ ADMIN LYNGANGIANG83PT -> CHẶN TRUY CẬP NGHIÊM NGẶT
  if (!isAuthorizedAdmin) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-2xl border-2 border-rose-200">
          <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4 animate-bounce border border-rose-300">
            <Lock className="w-8 h-8" />
          </div>

          <h2 className="text-xl font-heading font-black text-slate-900 mb-2">
            KHU VỰC QUẢN TRỊ BẢO MẬT
          </h2>

          <p className="text-xs text-slate-600 mb-6 font-medium leading-relaxed">
            Quyền truy cập Quản trị viên chỉ dành riêng cho tài khoản chính chủ: <br />
            <strong className="text-rose-600 font-mono">lyngangiang83pt@gmail.com</strong>.
          </p>

          <Link
            to="/"
            onClick={() => soundFx.play('click')}
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay Về Kho Trò Chơi</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 font-sans">
      
      {/* 1. Header Banner Quản Trị Tối Cao - NỀN XANH LÁ CÂY TƯƠI MÁT & SANG TRỌNG */}
      <div className="rounded-3xl p-6 sm:p-8 border-2 border-emerald-400 bg-gradient-to-r from-[#065F46] via-[#059669] to-[#047857] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl -z-10" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 border border-white/30 text-emerald-100 text-xs font-black uppercase tracking-wider backdrop-blur-md">
              <ShieldCheck className="w-4 h-4 text-amber-300" />
              <span>QUẢN TRỊ VIÊN HỆ THỐNG: lyngangiang83pt@gmail.com</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-heading font-black text-white drop-shadow-sm">
              TRUNG TÂM ĐIỀU HÀNH TOÀN DIỆN
            </h1>

            <p className="text-xs text-emerald-100 max-w-2xl font-medium leading-relaxed">
              Quản trị toàn bộ Trò chơi, Tài khoản Người dùng, Phân quyền Giáo viên/Học sinh, 7 Môn học GDPT 2018, Bảng Xếp Hạng và Trạng thái Database Supabase.
            </p>
          </div>

          {/* Quick Stat Badges */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <button
              onClick={handleExportBackup}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xs shadow-md border border-amber-300 flex items-center gap-1.5 transition-all transform hover:scale-105"
              title="Tải về bản sao lưu toàn bộ Database dạng JSON"
            >
              <Download className="w-4 h-4" />
              <span>Sao Lưu Toàn Bộ DB</span>
            </button>

            <button
              onClick={() => {
                fetchUsers();
                refetchGames();
                soundFx.play('click');
              }}
              className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs shadow-md border border-white/30 flex items-center gap-1.5 transition-all"
              title="Làm mới dữ liệu từ Database"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Làm Mới</span>
            </button>
          </div>
        </div>

        {/* 4 Cards Thống Kê Tổng Quan */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/15">
          <div className="bg-white/10 p-3.5 rounded-2xl border border-white/20 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs text-amber-300 font-bold mb-1">
              <span>Tổng Trò Chơi</span>
              <Gamepad2 className="w-4 h-4" />
            </div>
            <div className="text-xl font-black text-white">{games.length} Bài Chơi</div>
          </div>

          <div className="bg-white/10 p-3.5 rounded-2xl border border-white/20 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs text-indigo-300 font-bold mb-1">
              <span>Tổng Thành Viên</span>
              <Users className="w-4 h-4" />
            </div>
            <div className="text-xl font-black text-white">{usersList.length} Tài Khoản</div>
          </div>

          <div className="bg-white/10 p-3.5 rounded-2xl border border-white/20 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs text-emerald-300 font-bold mb-1">
              <span>GDPT 2018 THCS</span>
              <GraduationCap className="w-4 h-4" />
            </div>
            <div className="text-xl font-black text-white">4 Khối (6, 7, 8, 9)</div>
          </div>

          <div className="bg-white/10 p-3.5 rounded-2xl border border-white/20 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs text-cyan-300 font-bold mb-1">
              <span>Trạng Thái Supabase</span>
              <Database className="w-4 h-4" />
            </div>
            <div className="text-sm font-black text-white flex items-center gap-1.5 mt-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{isSupabaseConfigured ? 'Đang Kết Nối Cloud' : 'Bộ Nhớ Local'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Navigation Tabs Điều Khiển */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-amber-200/80">
        <button
          onClick={() => { setActiveTab('games'); soundFx.play('click'); }}
          className={`px-4 py-2.5 rounded-xl font-black text-xs transition-all flex items-center gap-2 whitespace-nowrap shadow-xs ${
            activeTab === 'games'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'bg-white text-slate-700 hover:bg-amber-100 border border-amber-200'
          }`}
        >
          <Gamepad2 className="w-4 h-4" />
          <span>Quản Lý Trò Chơi ({games.length})</span>
        </button>

        <button
          onClick={() => { setActiveTab('users'); soundFx.play('click'); }}
          className={`px-4 py-2.5 rounded-xl font-black text-xs transition-all flex items-center gap-2 whitespace-nowrap shadow-xs ${
            activeTab === 'users'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'bg-white text-slate-700 hover:bg-amber-100 border border-amber-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Quản Lý Người Dùng ({usersList.length})</span>
        </button>

        <button
          onClick={() => { setActiveTab('curriculum'); soundFx.play('click'); }}
          className={`px-4 py-2.5 rounded-xl font-black text-xs transition-all flex items-center gap-2 whitespace-nowrap shadow-xs ${
            activeTab === 'curriculum'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'bg-white text-slate-700 hover:bg-amber-100 border border-amber-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Chương Trình 7 Môn GDPT</span>
        </button>

        <button
          onClick={() => { setActiveTab('system'); soundFx.play('click'); }}
          className={`px-4 py-2.5 rounded-xl font-black text-xs transition-all flex items-center gap-2 whitespace-nowrap shadow-xs ${
            activeTab === 'system'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'bg-white text-slate-700 hover:bg-amber-100 border border-amber-200'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Cấu Hình & Cơ Sở Dữ Liệu</span>
        </button>
      </div>

      {/* 3. NỘI DUNG TAB 1: QUẢN LÝ TRÒ CHƠI */}
      {activeTab === 'games' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm kiếm trò chơi..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <select
                value={selectedGradeFilter}
                onChange={(e) => setSelectedGradeFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none"
              >
                <option value="all">Tất Cả Khối</option>
                <option value="6">Lớp 6</option>
                <option value="7">Lớp 7</option>
                <option value="8">Lớp 8</option>
                <option value="9">Lớp 9</option>
              </select>
            </div>

            <button
              onClick={() => setIsAddGameOpen(true)}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md flex items-center justify-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Trò Chơi Mới</span>
            </button>
          </div>

          {/* Bảng Danh Sách Game */}
          <div className="bg-white rounded-2xl border border-amber-200 shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-[#FAF4E8] text-amber-950 uppercase font-black border-b border-amber-200">
                  <tr>
                    <th className="p-3.5">Ảnh</th>
                    <th className="p-3.5">Tên Bài Chơi</th>
                    <th className="p-3.5">Môn Học</th>
                    <th className="p-3.5">Khối</th>
                    <th className="p-3.5">Loại Game</th>
                    <th className="p-3.5">Lượt Chơi</th>
                    <th className="p-3.5 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredGames.map((game, idx) => (
                    <tr key={game.id || idx} className="hover:bg-amber-50/60 transition-colors">
                      <td className="p-3">
                        <img 
                          src={game.thumbnail_url || 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=100&auto=format&fit=crop&q=80'} 
                          alt={game.title}
                          className="w-12 h-10 rounded-lg object-cover border border-slate-200"
                        />
                      </td>
                      <td className="p-3 font-black text-slate-900 max-w-[220px] truncate">
                        {game.title}
                        <div className="text-[11px] text-slate-500 font-normal truncate">{game.description}</div>
                      </td>
                      <td className="p-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
                          {game.subject}
                        </span>
                      </td>
                      <td className="p-3 font-black text-amber-900">Lớp {game.grade_level}</td>
                      <td className="p-3 font-mono text-[11px] text-indigo-700 font-bold uppercase">{game.game_type}</td>
                      <td className="p-3 font-black text-slate-800">{game.play_count || 0}</td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setEditingGame(game)}
                            className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors"
                            title="Chỉnh sửa trò chơi"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteGame(game.id)}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors"
                            title="Xóa trò chơi này"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. NỘI DUNG TAB 2: QUẢN LÝ NGƯỜI DÙNG & HỌC SINH */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm kiếm tài khoản, email..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <select
                value={selectedRoleFilter}
                onChange={(e) => setSelectedRoleFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none"
              >
                <option value="all">Tất Cả Vai Trò</option>
                <option value="student">Học sinh</option>
                <option value="teacher">Giáo viên</option>
                <option value="admin">Quản trị Admin</option>
              </select>
            </div>

            <button
              onClick={() => setIsAddUserOpen(true)}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md flex items-center justify-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Thành Viên Mới</span>
            </button>
          </div>

          {/* Bảng Danh Sách Người Dùng */}
          <div className="bg-white rounded-2xl border border-amber-200 shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-[#FAF4E8] text-amber-950 uppercase font-black border-b border-amber-200">
                  <tr>
                    <th className="p-3.5">Họ & Tên</th>
                    <th className="p-3.5">Username</th>
                    <th className="p-3.5">Email</th>
                    <th className="p-3.5">Khối Lớp</th>
                    <th className="p-3.5">Tổng EXP</th>
                    <th className="p-3.5">Vai Trò (Role)</th>
                    <th className="p-3.5 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-amber-50/60 transition-colors">
                      <td className="p-3 font-black text-slate-900 flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center font-black text-xs border border-amber-300 shrink-0">
                          {u.full_name?.charAt(0) || 'U'}
                        </div>
                        <span className="truncate max-w-[140px]">{u.full_name}</span>
                      </td>
                      <td className="p-3 font-mono font-bold text-indigo-700">@{u.username}</td>
                      <td className="p-3 font-mono text-[11px] text-slate-600">{u.email}</td>
                      <td className="p-3 font-bold text-slate-800">Lớp {u.grade_level || '6'}</td>
                      <td className="p-3 font-black text-amber-600 flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                        <span>{u.total_exp || 0} EXP</span>
                      </td>
                      <td className="p-3">
                        <select
                          value={u.role}
                          onChange={(e) => handleUpdateUserRole(u.id, e.target.value)}
                          className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-300 text-xs font-black text-slate-900 focus:outline-none capitalize"
                        >
                          <option value="student">👨‍🎓 Học sinh</option>
                          <option value="teacher">👩‍🏫 Giáo viên</option>
                          <option value="admin">👑 Quản trị Admin</option>
                        </select>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setEditingUser(u)}
                            className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors"
                            title="Chỉnh sửa thông tin thành viên"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          {u.email !== 'lyngangiang83pt@gmail.com' && (
                            <button
                              onClick={() => handleDeleteUser(u.id, u.full_name || u.username)}
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors"
                              title="Xóa tài khoản này"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. NỘI DUNG TAB 3: CHƯƠNG TRÌNH 7 MÔN GDPT 2018 */}
      {activeTab === 'curriculum' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'Toán Học', desc: 'Đại số, Hình học trực quan & Xác suất thống kê', icon: '📐', count: games.filter(g => g.subject === 'Toán Học').length },
            { name: 'Ngữ Văn', desc: 'Đọc hiểu văn bản, Tiếng Việt thực hành & Viết', icon: '📖', count: games.filter(g => g.subject === 'Ngữ Văn').length },
            { name: 'Tiếng Anh', desc: 'Từ vựng Global Success, Ngữ pháp & Giao tiếp', icon: '🌐', count: games.filter(g => g.subject === 'Tiếng Anh').length },
            { name: 'Khoa Học Tự Nhiên', desc: 'Vật lý, Hóa học nguyên tử & Sinh học cơ thể', icon: '🔬', count: games.filter(g => g.subject === 'Khoa Học Tự Nhiên').length },
            { name: 'Lịch Sử & Địa Lý', desc: 'Dựng nước & Giữ nước, Địa lý Việt Nam & Thế giới', icon: '🧭', count: games.filter(g => g.subject === 'Lịch Sử & Địa Lý').length },
            { name: 'Tin Học', desc: 'Lập trình Scratch/Python, Thuật toán & Tư duy số', icon: '💻', count: games.filter(g => g.subject === 'Tin Học').length },
            { name: 'GDCD', desc: 'Đạo đức, Pháp luật & Kỹ năng sống học sinh', icon: '🛡️', count: games.filter(g => g.subject === 'GDCD').length }
          ].map((subj, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-amber-200 shadow-md flex flex-col justify-between space-y-3">
              <div className="flex items-start justify-between">
                <span className="text-2xl">{subj.icon}</span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {subj.count} Bài Chơi
                </span>
              </div>
              <div>
                <h3 className="font-heading font-black text-slate-900 text-sm">{subj.name}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{subj.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 6. NỘI DUNG TAB 4: CẤU HÌNH HỆ THỐNG & SUPABASE */}
      {activeTab === 'system' && (
        <div className="bg-white p-6 rounded-3xl border border-amber-200 shadow-md space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-heading font-black text-slate-900 flex items-center gap-2">
              <Database className="w-5 h-5 text-indigo-600" />
              <span>Trạng Thái Kết Nối Cơ Sở Dữ Liệu Supabase</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Kiểm tra các bảng dữ liệu, chính sách phân quyền RLS và cơ chế đồng bộ.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
              <div className="text-slate-500">Tài khoản Quản Trị Tối Cao (Root Admin):</div>
              <div className="text-sm font-black text-amber-900 font-mono">lyngangiang83pt@gmail.com</div>
              <div className="text-[11px] text-slate-600">Được bảo vệ bằng bộ lọc phân quyền `RequireAdmin`.</div>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-2">
              <div className="text-slate-500">Trạng Thái Đám Mây:</div>
              <div className="text-sm font-black text-indigo-900">
                {isSupabaseConfigured ? '🟢 Đã Kích Hoạt Supabase Cloud' : '🟡 Chế Độ Dự Phòng RAM & LocalStorage'}
              </div>
              <div className="text-[11px] text-slate-600">Tự động nạp và lưu trữ không bao giờ làm gián đoạn người dùng.</div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: CHỈNH SỬA THÀNH VIÊN */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 shadow-2xl border border-amber-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-heading font-black text-slate-900 text-base flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-indigo-600" />
                <span>Chỉnh Sửa Thành Viên</span>
              </h3>
              <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-bold text-slate-700">
              <div>
                <label className="block mb-1">Họ & Tên:</label>
                <input
                  type="text"
                  value={editingUser.full_name || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, full_name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block mb-1">Vai Trò (Role):</label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900 font-bold"
                >
                  <option value="student">Học sinh</option>
                  <option value="teacher">Giáo viên</option>
                  <option value="admin">Quản trị Admin</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block mb-1">Khối Lớp:</label>
                  <select
                    value={editingUser.grade_level}
                    onChange={(e) => setEditingUser({ ...editingUser, grade_level: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900 font-bold"
                  >
                    <option value="6">Lớp 6</option>
                    <option value="7">Lớp 7</option>
                    <option value="8">Lớp 8</option>
                    <option value="9">Lớp 9</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1">Tổng EXP:</label>
                  <input
                    type="number"
                    value={editingUser.total_exp || 0}
                    onChange={(e) => setEditingUser({ ...editingUser, total_exp: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900 font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveUserEdit}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md"
              >
                Lưu Thay Đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: THÊM THÀNH VIÊN MỚI */}
      {isAddUserOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <form onSubmit={handleCreateUserSubmit} className="bg-white max-w-md w-full rounded-3xl p-6 shadow-2xl border border-amber-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-heading font-black text-slate-900 text-base flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-600" />
                <span>Thêm Thành Viên Mới</span>
              </h3>
              <button type="button" onClick={() => setIsAddUserOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-bold text-slate-700">
              <div>
                <label className="block mb-1">Tên Đăng Nhập (Username):</label>
                <input
                  type="text"
                  required
                  value={newUserForm.username}
                  onChange={(e) => setNewUserForm({ ...newUserForm, username: e.target.value })}
                  placeholder="Ví dụ: nguyen_nam7a"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block mb-1">Họ & Tên:</label>
                <input
                  type="text"
                  required
                  value={newUserForm.fullName}
                  onChange={(e) => setNewUserForm({ ...newUserForm, fullName: e.target.value })}
                  placeholder="Ví dụ: Nguyễn Văn Nam"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block mb-1">Email Gmail:</label>
                <input
                  type="email"
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  placeholder="name@gmail.com"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block mb-1">Vai Trò:</label>
                  <select
                    value={newUserForm.role}
                    onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900 font-bold"
                  >
                    <option value="student">Học sinh</option>
                    <option value="teacher">Giáo viên</option>
                    <option value="admin">Quản trị Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1">Khối Lớp:</label>
                  <select
                    value={newUserForm.gradeLevel}
                    onChange={(e) => setNewUserForm({ ...newUserForm, gradeLevel: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900 font-bold"
                  >
                    <option value="6">Lớp 6</option>
                    <option value="7">Lớp 7</option>
                    <option value="8">Lớp 8</option>
                    <option value="9">Lớp 9</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAddUserOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md"
              >
                Tạo Tài Khoản
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 3: CHỈNH SỬA TRÒ CHƠI */}
      {editingGame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white max-w-lg w-full rounded-3xl p-6 shadow-2xl border border-amber-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-heading font-black text-slate-900 text-base flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-emerald-600" />
                <span>Chỉnh Sửa Trò Chơi</span>
              </h3>
              <button onClick={() => setEditingGame(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-bold text-slate-700">
              <div>
                <label className="block mb-1">Tên Trò Chơi:</label>
                <input
                  type="text"
                  value={editingGame.title || ''}
                  onChange={(e) => setEditingGame({ ...editingGame, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block mb-1">Mô Tả Ngắn:</label>
                <textarea
                  rows={2}
                  value={editingGame.description || ''}
                  onChange={(e) => setEditingGame({ ...editingGame, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block mb-1">Môn Học:</label>
                  <select
                    value={editingGame.subject}
                    onChange={(e) => setEditingGame({ ...editingGame, subject: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900 font-bold"
                  >
                    <option value="Toán Học">Toán Học</option>
                    <option value="Ngữ Văn">Ngữ Văn</option>
                    <option value="Tiếng Anh">Tiếng Anh</option>
                    <option value="Khoa Học Tự Nhiên">Khoa Học Tự Nhiên</option>
                    <option value="Lịch Sử & Địa Lý">Lịch Sử & Địa Lý</option>
                    <option value="Tin Học">Tin Học</option>
                    <option value="GDCD">GDCD</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1">Khối Lớp:</label>
                  <select
                    value={editingGame.grade_level}
                    onChange={(e) => setEditingGame({ ...editingGame, grade_level: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900 font-bold"
                  >
                    <option value="6">Lớp 6</option>
                    <option value="7">Lớp 7</option>
                    <option value="8">Lớp 8</option>
                    <option value="9">Lớp 9</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-1">Link Game / URL nhúng:</label>
                <input
                  type="text"
                  value={editingGame.game_url || ''}
                  onChange={(e) => setEditingGame({ ...editingGame, game_url: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900 font-bold"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setEditingGame(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveGameEdit}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md"
              >
                Lưu Thay Đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: THÊM TRÒ CHƠI MỚI */}
      {isAddGameOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <form onSubmit={handleCreateGameSubmit} className="bg-white max-w-lg w-full rounded-3xl p-6 shadow-2xl border border-amber-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-heading font-black text-slate-900 text-base flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-600" />
                <span>Thêm Trò Chơi Mới Vào Kho</span>
              </h3>
              <button type="button" onClick={() => setIsAddGameOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-bold text-slate-700">
              <div>
                <label className="block mb-1">Tên Trò Chơi:</label>
                <input
                  type="text"
                  required
                  value={newGameForm.title}
                  onChange={(e) => setNewGameForm({ ...newGameForm, title: e.target.value })}
                  placeholder="Ví dụ: Chinh Phục Bảng Tuần Hoàn Lớp 7"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block mb-1">Mô Tả Trò Chơi:</label>
                <textarea
                  rows={2}
                  value={newGameForm.description}
                  onChange={(e) => setNewGameForm({ ...newGameForm, description: e.target.value })}
                  placeholder="Mô tả nội dung bài chơi học tập..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block mb-1">Môn Học:</label>
                  <select
                    value={newGameForm.subject}
                    onChange={(e) => setNewGameForm({ ...newGameForm, subject: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900 font-bold"
                  >
                    <option value="Toán Học">Toán Học</option>
                    <option value="Ngữ Văn">Ngữ Văn</option>
                    <option value="Tiếng Anh">Tiếng Anh</option>
                    <option value="Khoa Học Tự Nhiên">Khoa Học Tự Nhiên</option>
                    <option value="Lịch Sử & Địa Lý">Lịch Sử & Địa Lý</option>
                    <option value="Tin Học">Tin Học</option>
                    <option value="GDCD">GDCD</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1">Khối Lớp:</label>
                  <select
                    value={newGameForm.grade_level}
                    onChange={(e) => setNewGameForm({ ...newGameForm, grade_level: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900 font-bold"
                  >
                    <option value="6">Lớp 6</option>
                    <option value="7">Lớp 7</option>
                    <option value="8">Lớp 8</option>
                    <option value="9">Lớp 9</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-1">Link Game / Wordwall / Quizizz nhúng:</label>
                <input
                  type="url"
                  value={newGameForm.game_url}
                  onChange={(e) => setNewGameForm({ ...newGameForm, game_url: e.target.value })}
                  placeholder="https://wordwall.net/embed/..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900 font-bold"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAddGameOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md"
              >
                Thêm Vào Kho Game
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
