import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gamepad2, Mail, Lock, User, Key, Sparkles, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { soundFx } from '../lib/soundFx';

export const AuthPage = () => {
  const navigate = useNavigate();
  const { signInWithGoogle, signInWithUsername, signUpWithUsername, signInWithEmail, signInWithStudentCode } = useAuth();
  
  const [authMode, setAuthMode] = useState('signup'); // Bắt buộc mặc định mở tab 'signup' (Đăng Ký) trước cho người dùng mới
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [studentCode, setStudentCode] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('student');
  const [gradeLevel, setGradeLevel] = useState('7');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleGoogleLogin = async () => {
    soundFx.play('click');
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const { error } = await signInWithGoogle();
      if (error) throw error;
      navigate('/');
    } catch (err) {
      setErrorMsg(err.message || 'Đăng nhập Google thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestEntry = async () => {
    soundFx.play('click');
    await signInWithUsername('khach_demo', '123456');
    navigate('/');
  };

  const isGmailValid = (emailStr) => {
    if (!emailStr) return false;
    const clean = emailStr.trim().toLowerCase();
    return clean.endsWith('@gmail.com') || clean.endsWith('@gmail.com.vn');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    soundFx.play('click');
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      if (authMode === 'username_login') {
        const { error } = await signInWithUsername(username, password);
        if (error) throw error;
        navigate('/');
      } else if (authMode === 'student_code') {
        const { error } = await signInWithStudentCode(studentCode);
        if (error) throw error;
        navigate('/');
      } else if (authMode === 'email_login') {
        if (!isGmailValid(email)) {
          setErrorMsg('⚠️ Email chỉ chấp nhận xác minh với địa chỉ có đuôi @gmail.com hoặc @gmail.com.vn!');
          setLoading(false);
          return;
        }
        const { error } = await signInWithEmail(email, password);
        if (error) throw error;
        navigate('/');
      } else if (authMode === 'signup') {
        if (email && !isGmailValid(email)) {
          setErrorMsg('⚠️ Email xác minh phải có đuôi @gmail.com hoặc @gmail.com.vn!');
          setLoading(false);
          return;
        }
        const { error } = await signUpWithUsername(username || email.split('@')[0], password, fullName, role, gradeLevel);
        if (error) throw error;
        
        // Đăng ký thành công -> Tự động chuyển sang Đăng Nhập
        setSuccessMsg(`🎉 Tạo tài khoản "${username}" thành công! Vui lòng bấm Đăng Nhập bên dưới để vào hệ thống.`);
        setAuthMode('username_login');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Đăng nhập/Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[88vh] flex items-center justify-center p-3 sm:p-6 font-sans">
      
      {/* Container Thẻ Chia Đôi Chuẩn 2 Cột Giống Ảnh Mẫu */}
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 border border-slate-200">
        
        {/* CỘT BÊN TRÁI: BANNER TÍM DƯƠNG GRADIENT SANG TRỌNG */}
        <div className="lg:col-span-6 bg-gradient-to-br from-[#1E1B4B] via-[#2E2A72] to-[#4338CA] text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          
          {/* Họa tiết hiệu ứng sang trọng */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Header Thương Hiệu & Logo */}
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <picture className="flex items-center">
                <source srcSet="/logo2.webp" type="image/webp" />
                <img 
                  src="/logo2.png" 
                  alt="Logo 2" 
                  className="h-12 w-auto object-contain drop-shadow-md"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </picture>
              <div>
                <h1 className="text-xl font-heading font-black tracking-tight text-white flex items-center gap-1.5">
                  <span>HỌC VUI CẤP 2</span>
                </h1>
                <p className="text-[11px] font-bold text-amber-300 tracking-wider uppercase">THẦY HUỲNH NGÂN GIANG</p>
              </div>
            </div>

            {/* Pill Tag Công Nghệ 4.0 */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-amber-300 text-xs font-bold shadow-xs backdrop-blur-md mb-6">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Nền tảng công nghệ giáo dục 4.0</span>
            </div>

            {/* Tiêu đề chính & Mô tả */}
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-white leading-tight tracking-tight mb-4 drop-shadow-sm">
              Kho Trò Chơi Học Tập Cấp 2
            </h2>

            <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed font-medium mb-6">
              Website đa tác vụ dành cho công tác giáo dục: trò chơi tương tác học tập GDPT 2018, kho giáo án STEM, phòng đào tạo trực tuyến và trợ lý Chatbot lớp học.
            </p>

            {/* Danh sách tính năng chính */}
            <div className="space-y-3 font-semibold text-xs text-indigo-100 mb-8">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Đăng nhập 1-chạm tiện lợi qua tài khoản Google / Mã Học Sinh</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Đồng bộ dữ liệu giảng dạy và học liệu tức thì</span>
              </div>
            </div>
          </div>

          {/* Footer Copyright bên trái */}
          <div className="relative z-10 pt-6 border-t border-white/10 text-[11px] text-indigo-200/80 font-medium">
            © 2026 HỌC VUI CẤP 2. Đồng hành cùng giáo viên và học sinh Việt Nam.
          </div>
        </div>

        {/* CỘT BÊN PHẢI: FORM ĐĂNG NHẬP TRẮNG TINH KHÔI */}
        <div className="lg:col-span-6 bg-white p-8 sm:p-10 flex flex-col justify-center text-slate-900 relative">
          
          <div className="mb-5">
            <h3 className="text-2xl sm:text-3xl font-heading font-black text-slate-900 tracking-tight">
              Đăng nhập thành viên
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-bold mt-1">
              Học Vui Cấp 2 - Website đa tác vụ dành cho công tác giáo dục.
            </p>
          </div>

          {/* Khung Thông Báo Chào Mừng Màu Xanh Nhạt */}
          <div className="p-4 rounded-2xl bg-blue-50/90 border border-blue-200/80 text-center mb-5 shadow-xs">
            <h4 className="text-xs sm:text-sm font-black text-blue-950 mb-1">
              Chào mừng Quý Thầy/Cô và Học sinh! 👋
            </h4>
            <p className="text-xs text-blue-800 font-semibold leading-relaxed">
              Đăng nhập nhanh 1-chạm qua tài khoản Google hoặc Mã Học Sinh để trải nghiệm đầy đủ các tiện ích giáo dục.
            </p>
          </div>

          {/* NÚT ĐĂNG NHẬP GOOGLE 1-CHẠM CỰC LỚN CHUẨN MẪU */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-black text-sm border-2 border-slate-200 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3 active:scale-[0.99] mb-4 group"
          >
            {/* SVG Logo Google Chuẩn 4 Màu */}
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span className="text-slate-900 group-hover:text-indigo-600 transition-colors">
              Đăng nhập bằng Google (Gmail)
            </span>
          </button>

          {/* Dải phân cách */}
          <div className="relative flex items-center justify-center my-3">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider shrink-0">
              Hoặc chọn phương thức khác
            </span>
            <div className="border-t border-slate-200 w-full" />
          </div>

          {/* Tab Chuyển Đổi Phương Thức */}
          <div className="grid grid-cols-4 p-1 rounded-2xl bg-slate-100 border border-slate-200 mb-3 text-[11px] sm:text-xs font-bold gap-1">
            <button
              type="button"
              onClick={() => setAuthMode('username_login')}
              className={`py-2 rounded-xl transition-all ${
                authMode === 'username_login'
                  ? 'bg-emerald-600 text-white shadow-md font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tên Đăng Nhập
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('student_code')}
              className={`py-2 rounded-xl transition-all ${
                authMode === 'student_code'
                  ? 'bg-emerald-600 text-white shadow-md font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mã Học Sinh
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('email_login')}
              className={`py-2 rounded-xl transition-all ${
                authMode === 'email_login'
                  ? 'bg-emerald-600 text-white shadow-md font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Email
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('signup')}
              className={`py-2 rounded-xl transition-all ${
                authMode === 'signup'
                  ? 'bg-emerald-600 text-white shadow-md font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Đăng Ký
            </button>
          </div>

          {successMsg && (
            <div className="mb-3 p-3 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold text-center animate-pulse">
              {successMsg}
            </div>
          )}

          {errorMsg && (
            <div className="mb-3 p-3 rounded-xl bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold text-center">
              {errorMsg}
            </div>
          )}

          {/* Form Nhập Liệu */}
          <form onSubmit={handleSubmit} className="space-y-3">
            
            {/* 1. Form Đăng Nhập Bằng Username + Password */}
            {authMode === 'username_login' && (
              <>
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">
                    Tên Đăng Nhập (Username):
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-emerald-600 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Nhập tên đăng nhập (ví dụ: thaygiang83)"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">Mật khẩu:</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-emerald-600 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </>
            )}

            {/* 2. Form Đăng Nhập Bằng Mã Học Sinh */}
            {authMode === 'student_code' && (
              <div className="space-y-2">
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">
                    Nhập Mã Học Sinh (GV cấp):
                  </label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-amber-500 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={studentCode}
                      onChange={(e) => setStudentCode(e.target.value)}
                      placeholder="Ví dụ: HS602941"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm font-mono font-bold text-amber-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 uppercase"
                    />
                  </div>
                </div>

                {/* Thẻ Mã Học Sinh Nhanh */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-[11px] font-black text-slate-500 uppercase">Mã thử:</span>
                  <button
                    type="button"
                    onClick={() => setStudentCode('HS602941')}
                    className="px-2 py-0.5 rounded-md bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-xs font-mono font-bold border border-emerald-300"
                  >
                    ⚡ HS602941 (Nam)
                  </button>
                  <button
                    type="button"
                    onClick={() => setStudentCode('GV889102')}
                    className="px-2 py-0.5 rounded-md bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-mono font-bold border border-amber-300"
                  >
                    ⚡ GV889102 (Cô Hà)
                  </button>
                </div>
              </div>
            )}

            {/* 3. Form Đăng Nhập Bằng Email (@gmail.com / @gmail.com.vn) */}
            {authMode === 'email_login' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Gmail (đuôi @gmail.com / @gmail.com.vn):
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-emerald-600 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="vidu@gmail.com hoặc vidu@gmail.com.vn"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mật khẩu:</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-emerald-600 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </>
            )}

            {/* 4. Form Đăng Ký Tài Khoản Mới (Username + Email Gmail + Password + Full Name) */}
            {authMode === 'signup' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tên Đăng Nhập (Username):</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Tên viết liền không dấu (ví dụ: thaygiang83)"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Họ & Tên:</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Hồ Thanh Nam"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Gmail (bắt buộc đuôi @gmail.com hoặc @gmail.com.vn):
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="hocsinh@gmail.com hoặc hocsinh@gmail.com.vn"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mật khẩu:</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Vai Trò:</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="student">Học Sinh</option>
                      <option value="teacher">Giáo Viên</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Khối Lớp:</label>
                    <select
                      value={gradeLevel}
                      onChange={(e) => setGradeLevel(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="6">Lớp 6</option>
                      <option value="7">Lớp 7</option>
                      <option value="8">Lớp 8</option>
                      <option value="9">Lớp 9</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition-all mt-1"
            >
              {loading ? 'Đang Xử Lý...' : authMode === 'signup' ? 'Tạo Tài Khoản Ngay' : 'Đăng Nhập Ngay'}
            </button>

          </form>

          {/* Nút Xem Thử Ngay Dành Cho Khách */}
          <button
            type="button"
            onClick={handleGuestEntry}
            className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-300 flex items-center justify-center gap-1.5 transition-all mt-3"
          >
            <span>👋 Vào Trải Nghiệm Ngay (Khách / Demo)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Ghi chú bảo mật dưới chân */}
          <div className="text-center text-[11px] text-slate-500 font-extrabold flex items-center justify-center gap-1.5 mt-4">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Xác thực an toàn & bảo mật qua tài khoản Google</span>
          </div>

        </div>

      </div>
    </div>
  );
};
