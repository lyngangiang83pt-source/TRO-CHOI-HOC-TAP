import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gamepad2, Mail, Lock, User, Key, Sparkles, GraduationCap, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { soundFx } from '../lib/soundFx';

export const AuthPage = () => {
  const navigate = useNavigate();
  const { signInWithEmail, signInWithStudentCode, signUp } = useAuth();
  
  const [authMode, setAuthMode] = useState('student_code'); // 'student_code' | 'email_login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [studentCode, setStudentCode] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('student');
  const [gradeLevel, setGradeLevel] = useState('7');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    soundFx.play('click');
    setLoading(true);
    setErrorMsg(null);

    try {
      if (authMode === 'student_code') {
        const { error } = await signInWithStudentCode(studentCode);
        if (error) throw error;
        navigate('/');
      } else if (authMode === 'email_login') {
        const { error } = await signInWithEmail(email, password);
        if (error) throw error;
        navigate('/');
      } else if (authMode === 'signup') {
        const { error } = await signUp(email, password, fullName, role, gradeLevel);
        if (error) throw error;
        navigate('/');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
        
        {/* Top Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/30 mb-3">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Gamepad2 className="w-8 h-8 text-indigo-400" />
            </div>
          </div>
          <h2 className="text-xl font-heading font-bold text-white">
            KHO TRÒ CHƠI HỌC VUI CẤP 2
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Đăng nhập hệ thống học tập tương tác THCS GDPT 2018
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex p-1 rounded-2xl bg-slate-900 border border-slate-800 mb-6 text-xs font-bold">
          <button
            type="button"
            onClick={() => setAuthMode('student_code')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              authMode === 'student_code'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Mã Học Sinh
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('email_login')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              authMode === 'email_login'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Email
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('signup')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              authMode === 'signup'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Đăng Ký
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {authMode === 'student_code' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Nhập Mã Học Sinh (GV cấp):
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-amber-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={studentCode}
                  onChange={(e) => setStudentCode(e.target.value)}
                  placeholder="Ví dụ: HS602941"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm font-mono text-amber-300 focus:outline-none focus:border-indigo-500 uppercase"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                * Học sinh chỉ cần nhập Mã do Thầy/Cô cấp để vào chơi game ngay.
              </p>
            </div>
          )}

          {authMode === 'email_login' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email:</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@school.edu.vn"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Mật khẩu:</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </>
          )}

          {authMode === 'signup' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Họ & Tên:</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nguyễn Văn Nam"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email:</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hocsinh@school.edu.vn"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Mật khẩu:</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Vai Trò:</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="student">Học Sinh</option>
                    <option value="teacher">Giáo Viên</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Khối Lớp:</label>
                  <select
                    value={gradeLevel}
                    onChange={(e) => setGradeLevel(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
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
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-90 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all mt-2"
          >
            {loading ? 'Đang Xử Lý...' : authMode === 'signup' ? 'Tạo Tài Khoản' : 'Vào Hệ Thống'}
          </button>

        </form>

      </div>
    </div>
  );
};
