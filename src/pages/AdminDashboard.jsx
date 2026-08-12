import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Users, AlertTriangle, ArrowLeft, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { soundFx } from '../lib/soundFx';

const SAMPLE_USERS = [
  { id: 'u-1', name: 'Nguyễn Văn Nam', email: 'nam.hs@school.edu.vn', role: 'student', grade: '7', exp: 1250 },
  { id: 'u-2', name: 'Cô Trần Thị Thu Hà', email: 'ha.gv@school.edu.vn', role: 'teacher', grade: '8', exp: 4800 },
  { id: 'u-3', name: 'Lý Ngân Giang', email: 'lyngangiang83pt@gmail.com', role: 'admin', grade: '9', exp: 9999 }
];

export const AdminDashboard = () => {
  const { profile } = useAuth();
  const [userList, setUserList] = useState(SAMPLE_USERS);

  const isAuthorizedAdmin = profile?.email?.toLowerCase() === 'lyngangiang83pt@gmail.com';

  const handleRoleChange = (userId, newRole) => {
    soundFx.play('click');
    setUserList(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
  };

  if (!isAuthorizedAdmin) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
        <div className="w-16 h-16 rounded-3xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/40 mb-4 animate-bounce">
          <Lock className="w-8 h-8" />
        </div>

        <h2 className="text-2xl font-heading font-extrabold text-white mb-2">
          TRUY CẬP BỊ TỪ CHỐI (ACCESS DENIED)
        </h2>

        <p className="text-sm text-slate-300 max-w-md mb-6 leading-relaxed">
          Quyền truy cập Quản trị viên chỉ dành riêng cho tài khoản chính chủ <span className="font-mono font-bold text-amber-400">lyngangiang83pt@gmail.com</span>. 
          Tài khoản hiện tại của bạn (<span className="font-mono text-slate-400">{profile?.email || 'Chưa xác định'}</span>) không có thẩm quyền truy cập.
        </p>

        <Link
          to="/"
          onClick={() => soundFx.play('click')}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay Lại Trang Chủ</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 bg-gradient-to-r from-purple-950/60 via-slate-950 to-indigo-950/60">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider mb-2">
          <ShieldCheck className="w-4 h-4" />
          Quyền Hạn Cao Nhất Hệ Thống (lyngangiang83pt@gmail.com)
        </div>
        <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
          TRANG QUẢN TRỊ ADMIN
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
          Quản lý toàn bộ Người dùng, Phân quyền Role (Admin / Teacher / Student), Môn học GDPT 2018 và Kho Game Toàn Trường.
        </p>
      </div>

      {/* User Management Table */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-heading font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            <span>Danh Sách Người Dùng & Phân Quyền</span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 uppercase font-bold border-b border-slate-800">
              <tr>
                <th className="p-3">Họ & Tên</th>
                <th className="p-3">Email</th>
                <th className="p-3">Khối Lớp</th>
                <th className="p-3">Tổng EXP</th>
                <th className="p-3">Vai Trò (Role)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {userList.map((user) => (
                <tr key={user.id} className="hover:bg-slate-900/40">
                  <td className="p-3 font-semibold text-white">{user.name}</td>
                  <td className="p-3 text-slate-400 font-mono">{user.email}</td>
                  <td className="p-3">Lớp {user.grade}</td>
                  <td className="p-3 font-bold text-amber-400">{user.exp} EXP</td>
                  <td className="p-3">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500 capitalize"
                    >
                      <option value="student">student</option>
                      <option value="teacher">teacher</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
