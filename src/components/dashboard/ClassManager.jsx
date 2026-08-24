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
    <div 
      style={{
        background: '#FFFBEB',
        border: '2px solid #FDE047',
        boxShadow: '0 20px 25px -5px rgba(245, 158, 11, 0.2)'
      }}
      className="w-full rounded-3xl p-6 sm:p-8 space-y-6 text-amber-950 shadow-xl"
    >
      <div className="flex items-center justify-between border-b border-amber-300/80 pb-4">
        <div className="flex items-center gap-2 font-heading font-black text-xl text-amber-950 drop-shadow-xs">
          <GraduationCap className="w-6 h-6 text-emerald-700" />
          <span>Quản Lý Lớp Học THCS GDPT 2018</span>
        </div>
      </div>

      {/* Form Tạo Lớp Mới */}
      <form 
        onSubmit={handleCreateClass} 
        style={{ background: '#FEF9C3', border: '2px solid #FACC15' }}
        className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-2xl shadow-sm"
      >
        <div className="sm:col-span-2">
          <input
            type="text"
            required
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
            placeholder="Tên lớp (Ví dụ: Lớp 7A1 - KHTN)"
            className="w-full px-3.5 py-2.5 rounded-xl bg-white border-2 border-amber-300 text-xs font-black text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 shadow-inner"
          />
        </div>

        <div>
          <select
            value={newGrade}
            onChange={(e) => setNewGrade(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-white border-2 border-amber-300 text-xs font-black text-slate-900 focus:outline-none focus:border-amber-500 shadow-inner"
          >
            <option value="6">Khối Lớp 6</option>
            <option value="7">Khối Lớp 7</option>
            <option value="8">Khối Lớp 8</option>
            <option value="9">Khối Lớp 9</option>
          </select>
        </div>

        <button
          type="submit"
          style={{
            background: 'linear-gradient(135deg, #065F46 0%, #059669 100%)',
            color: '#FFFFFF',
            border: '2px solid #34D399',
            boxShadow: '0 10px 15px -3px rgba(5, 150, 105, 0.4)'
          }}
          className="py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 shadow-md hover:scale-105 transition-all"
        >
          <Plus className="w-4 h-4 text-amber-300" />
          <span>Tạo Lớp Mới</span>
        </button>
      </form>

      {/* Danh Sách Lớp */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {classList.map((cls) => (
          <div 
            key={cls.id} 
            style={{ background: '#FEF9C3', border: '2px solid #FACC15', color: '#1C1917' }}
            className="p-5 rounded-2xl shadow-md space-y-3"
          >
            <div className="flex justify-between items-start">
              <span 
                style={{ background: '#059669', color: '#FFFFFF' }}
                className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase"
              >
                Lớp {cls.grade_level}
              </span>
              <span className="text-xs text-amber-950 font-black">{cls.student_count} Học sinh</span>
            </div>

            <h4 className="text-sm font-heading font-black text-slate-900 line-clamp-1">{cls.name}</h4>

            <div className="pt-3 border-t border-amber-300/80 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Key className="w-4 h-4 text-amber-700 font-bold" />
                <span className="font-mono text-xs font-black text-amber-950">{cls.code}</span>
              </div>

              <button
                onClick={() => copyCode(cls.code)}
                style={{ background: '#059669', color: '#FFFFFF' }}
                className="px-2.5 py-1 rounded-lg text-[11px] font-black flex items-center gap-1 shadow-xs hover:bg-emerald-700 transition-colors"
              >
                {copiedCode === cls.code ? <Check className="w-3 h-3 text-amber-300" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCode === cls.code ? 'Đã chép' : 'Sao chép mã'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
