import React, { useState } from 'react';
import { Users, Plus, Key, GraduationCap, Copy, Check } from 'lucide-react';
import { soundFx } from '../../lib/soundFx';

const SAMPLE_CLASSES = [
  { id: 'c-1', name: 'Lớp 7A1 - Chuyên Toán & KHTN', grade_level: '7', code: 'CL701A', student_count: 38 },
  { id: 'c-2', name: 'Lớp 8B2 - Anh Văn & Ngữ Văn', grade_level: '8', code: 'CL802B', student_count: 42 },
  { id: 'c-3', name: 'Lớp 6C3 - Tin Học & GDCD', grade_level: '6', code: 'CL603C', student_count: 35 }
];

export const ClassManager = () => {
  const [classList, setClassList] = useState(SAMPLE_CLASSES);
  const [newClassName, setNewClassName] = useState('');
  const [newGrade, setNewGrade] = useState('7');
  const [copiedCode, setCopiedCode] = useState(null);

  const handleCreateClass = (e) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    soundFx.play('correct');
    const newClass = {
      id: 'c-' + Date.now(),
      name: newClassName,
      grade_level: newGrade,
      code: 'CL' + Math.floor(100 + Math.random() * 900) + newGrade,
      student_count: 0
    };

    setClassList([newClass, ...classList]);
    setNewClassName('');
  };

  const copyCode = (code) => {
    soundFx.play('click');
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="w-full glass-panel rounded-3xl p-6 border border-slate-800 space-y-6">
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-emerald-400 font-heading font-bold text-lg">
          <Users className="w-6 h-6" />
          <span>Quản Lý Lớp Học THCS</span>
        </div>
      </div>

      {/* Form Tạo Lớp Mới */}
      <form onSubmit={handleCreateClass} className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="sm:col-span-2">
          <input
            type="text"
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
            placeholder="Tên lớp (Ví dụ: Lớp 7A1 - KHTN)"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <select
            value={newGrade}
            onChange={(e) => setNewGrade(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="6">Khối Lớp 6</option>
            <option value="7">Khối Lớp 7</option>
            <option value="8">Khối Lớp 8</option>
            <option value="9">Khối Lớp 9</option>
          </select>
        </div>

        <button
          type="submit"
          className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo Lớp Mới</span>
        </button>
      </form>

      {/* Danh Sách Lớp */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {classList.map((cls) => (
          <div key={cls.id} className="glass-panel p-4 rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                Lớp {cls.grade_level}
              </span>
              <span className="text-xs text-slate-400 font-semibold">{cls.student_count} Học sinh</span>
            </div>

            <h4 className="text-sm font-bold text-white mb-3 line-clamp-1">{cls.name}</h4>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-mono text-xs font-bold text-amber-300">{cls.code}</span>
              </div>

              <button
                onClick={() => copyCode(cls.code)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold flex items-center gap-1"
              >
                {copiedCode === cls.code ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCode === cls.code ? 'Đã chép' : 'Sao chép mã'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
