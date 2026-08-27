import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Disc, 
  Sparkles, 
  RotateCcw, 
  Users, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  Check, 
  Trophy, 
  Volume2, 
  UserCheck, 
  HelpCircle,
  FileText,
  Layers,
  Settings,
  X,
  Award
} from 'lucide-react';
import { soundFx } from '../../lib/soundFx';

// Danh sách các lớp mẫu THCS GDPT 2018 mặc định
const DEFAULT_CLASSES = [
  {
    id: 'cls-7a1',
    name: 'Lớp 7A1 - KHTN & Toán',
    students: [
      'Nguyễn Văn An', 'Trần Thị Mai', 'Lê Hoàng Long', 'Phạm Minh Thư',
      'Đỗ Gia Bảo', 'Vũ Thị Hương', 'Hoàng Nhật Minh', 'Ngô Thanh Trúc',
      'Bùi Tuấn Kiệt', 'Đặng Ngọc Ánh', 'Lương Hải Đăng', 'Võ Thùy Linh'
    ]
  },
  {
    id: 'cls-6a2',
    name: 'Lớp 6A2 - Tiếng Anh',
    students: [
      'Nguyễn Đức Huy', 'Lê Quỳnh Nga', 'Trần Quốc Bảo', 'Phạm Phương Linh',
      'Vũ Đình Trọng', 'Hoàng Bảo Ngọc', 'Đinh Quang Khải', 'Trịnh Yến Nhi'
    ]
  },
  {
    id: 'cls-8a3',
    name: 'Lớp 8A3 - Lịch Sử & Địa Lý',
    students: [
      'Dương Chí Thành', 'Nguyễn Thu Trang', 'Phan Hữu Thắng', 'Mai Phương Thảo',
      'Bùi Minh Khôi', 'Võ Ngọc Diệp', 'Đỗ Thành Đạt', 'Lý Gia Hân'
    ]
  },
  {
    id: 'cls-9a1',
    name: 'Lớp 9A1 - Ôn Thi Vào 10',
    students: [
      'Trần Minh Quân', 'Nguyễn Thảo Nguyên', 'Lê Tuấn Hưng', 'Hoàng Mai Chi',
      'Phạm Quang Sáng', 'Đặng Thùy Dương', 'Vũ Đức Nam', 'Bùi Lan Anh'
    ]
  }
];

// Bảng màu rực rỡ cho các nan quạt của vòng quay
const SLICE_COLORS = [
  '#059669', '#D97706', '#2563EB', '#DC2626', 
  '#7C3AED', '#0D9488', '#EA580C', '#4F46E5', 
  '#16A34A', '#CA8A04', '#0284C7', '#DB2777'
];

export const BuiltinLuckyWheel = ({ config, onComplete, isPractice = false }) => {
  // Quản lý danh sách lớp học lưu trữ
  const [classList, setClassList] = useState(() => {
    const saved = localStorage.getItem('hocvui_lucky_classes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_CLASSES;
  });

  const [selectedClassId, setSelectedClassId] = useState(() => {
    const savedId = localStorage.getItem('hocvui_selected_lucky_class_id');
    return savedId || (DEFAULT_CLASSES[0]?.id || 'cls-7a1');
  });

  // Học sinh của lớp đang chọn
  const currentClass = classList.find(c => c.id === selectedClassId) || classList[0] || {
    id: 'default',
    name: 'Danh sách mặc định',
    students: ['Học sinh 1', 'Học sinh 2', 'Học sinh 3', 'Học sinh 4']
  };

  // Danh sách học sinh đang quay trong vòng này (có thể loại trừ người đã trúng)
  const [activeItems, setActiveItems] = useState(currentClass.students);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState(null);
  const [winnerHistory, setWinnerHistory] = useState([]);
  const [removeOnWin, setRemoveOnWin] = useState(false);
  const [isManagerOpen, setIsManagerOpen] = useState(false);

  // Form thêm / sửa lớp
  const [editingClassId, setEditingClassId] = useState(null);
  const [formClassName, setFormClassName] = useState('');
  const [formStudentListText, setFormStudentListText] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  const canvasRef = useRef(null);

  // Đồng bộ danh sách học sinh khi đổi lớp
  useEffect(() => {
    setActiveItems(currentClass.students);
    setWinner(null);
    localStorage.setItem('hocvui_selected_lucky_class_id', currentClass.id);
  }, [selectedClassId, classList]);

  // Lưu danh sách lớp vào localStorage
  useEffect(() => {
    localStorage.setItem('hocvui_lucky_classes', JSON.stringify(classList));
  }, [classList]);

  // Vẽ Vòng Quay May Mắn lên Canvas HTML5
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    const center = size / 2;
    const radius = center - 15;
    const items = activeItems.length > 0 ? activeItems : ['(Danh sách trống)'];
    const numSlices = items.length;
    const sliceAngle = (2 * Math.PI) / numSlices;

    ctx.clearRect(0, 0, size, size);

    // Vẽ từng nan quạt
    for (let i = 0; i < numSlices; i++) {
      const startAngle = i * sliceAngle;
      const endAngle = startAngle + sliceAngle;
      const color = SLICE_COLORS[i % SLICE_COLORS.length];

      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();

      // Viền nan quạt
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#FFFFFF';
      ctx.stroke();

      // Vẽ chữ tên học sinh
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = numSlices > 18 ? 'bold 10px sans-serif' : numSlices > 10 ? 'bold 12px sans-serif' : 'bold 14px sans-serif';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
      ctx.shadowBlur = 4;
      
      // Cắt gọn tên nếu quá dài
      let text = items[i];
      if (text.length > 18) text = text.substring(0, 16) + '...';
      ctx.fillText(text, radius - 20, 5);
      ctx.restore();
    }

    // Viền tròn ngoài cùng phát sáng
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, 2 * Math.PI);
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#FDE047';
    ctx.stroke();

    // Tâm vòng quay
    ctx.beginPath();
    ctx.arc(center, center, 24, 0, 2 * Math.PI);
    ctx.fillStyle = '#FEF08A';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#065F46';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(center, center, 8, 0, 2 * Math.PI);
    ctx.fillStyle = '#065F46';
    ctx.fill();

  }, [activeItems]);

  // Xử lý Quay Bánh Xe
  const handleSpin = () => {
    if (spinning || activeItems.length === 0) return;

    soundFx.play('click');
    setSpinning(true);
    setWinner(null);

    const numSlices = activeItems.length;
    const sliceDeg = 360 / numSlices;
    const randomExtraRotations = 5 + Math.floor(Math.random() * 4); // 5 - 8 vòng quay
    const winningIdx = Math.floor(Math.random() * numSlices);

    // Tính toán góc quay chính xác để nan quạt trúng dừng ngay dưới mũi tên (ở đỉnh 270 độ / -90 độ)
    const targetSliceAngle = winningIdx * sliceDeg + sliceDeg / 2;
    // Điểm kim chỉ nằm ở đỉnh (270 độ hoặc -90 độ)
    const stopAngle = 360 * randomExtraRotations + (270 - targetSliceAngle);
    const newRotation = rotation + (stopAngle - (rotation % 360)) + 360 * randomExtraRotations;

    setRotation(newRotation);

    // Âm thanh kim lách cách
    const clickInterval = setInterval(() => {
      soundFx.play('click');
    }, 120);

    setTimeout(() => {
      clearInterval(clickInterval);
      setSpinning(false);
      const chosenWinner = activeItems[winningIdx];
      setWinner(chosenWinner);
      setWinnerHistory(prev => [
        { name: chosenWinner, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) },
        ...prev
      ]);
      soundFx.play('victory');

      if (typeof onComplete === 'function') {
        onComplete({
          score: 100,
          timeSeconds: 15,
          isPractice
        });
      }
    }, 3800);
  };

  // Loại trừ người trúng khỏi danh sách quay tiếp theo
  const handleRemoveWinner = () => {
    if (!winner) return;
    soundFx.play('click');
    setActiveItems(prev => prev.filter(item => item !== winner));
    setWinner(null);
  };

  // Đặt lại toàn bộ danh sách ban đầu của lớp
  const handleResetClassStudents = () => {
    soundFx.play('click');
    setActiveItems(currentClass.students);
    setWinner(null);
  };

  // Mở modal thêm lớp mới
  const handleOpenAddClass = () => {
    soundFx.play('click');
    setEditingClassId(null);
    setFormClassName('');
    setFormStudentListText('');
    setSaveSuccessMsg('');
    setIsManagerOpen(true);
  };

  // Mở modal sửa lớp hiện tại
  const handleOpenEditClass = (cls) => {
    soundFx.play('click');
    setEditingClassId(cls.id);
    setFormClassName(cls.name);
    setFormStudentListText(cls.students.join('\n'));
    setSaveSuccessMsg('');
    setIsManagerOpen(true);
  };

  // Lưu thông tin lớp
  const handleSaveClass = (e) => {
    e.preventDefault();
    if (!formClassName.trim()) return;

    soundFx.play('click');
    // Tách danh sách học sinh theo dòng hoặc dấu phẩy
    const rawList = formStudentListText
      .split(/[\n,]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const finalStudents = rawList.length > 0 ? rawList : ['Học sinh 1', 'Học sinh 2', 'Học sinh 3'];

    if (editingClassId) {
      // Cập nhật lớp cũ
      setClassList(prev => prev.map(c => {
        if (c.id === editingClassId) {
          return { ...c, name: formClassName.trim(), students: finalStudents };
        }
        return c;
      }));
      setSaveSuccessMsg(`Đã cập nhật lớp "${formClassName.trim()}" thành công!`);
    } else {
      // Thêm lớp mới
      const newId = 'cls-' + Date.now();
      const newClassObj = {
        id: newId,
        name: formClassName.trim(),
        students: finalStudents
      };
      setClassList(prev => [...prev, newClassObj]);
      setSelectedClassId(newId);
      setSaveSuccessMsg(`Đã tạo mới lớp "${formClassName.trim()}" thành công!`);
    }

    soundFx.play('correct');
    setTimeout(() => {
      setIsManagerOpen(false);
      setSaveSuccessMsg('');
    }, 1000);
  };

  // Xóa lớp
  const handleDeleteClass = (idToDelete, nameToDelete) => {
    if (classList.length <= 1) {
      alert('Hệ thống cần giữ lại ít nhất 1 lớp học!');
      return;
    }
    if (window.confirm(`Thầy Cô có chắc muốn xóa lớp "${nameToDelete}" không?`)) {
      soundFx.play('click');
      const updated = classList.filter(c => c.id !== idToDelete);
      setClassList(updated);
      if (selectedClassId === idToDelete) {
        setSelectedClassId(updated[0].id);
      }
    }
  };

  // Khôi phục danh sách các lớp mẫu ban đầu
  const handleRestoreDefaultClasses = () => {
    if (window.confirm('Khôi phục danh sách các lớp mẫu (6A2, 7A1, 8A3, 9A1)?')) {
      soundFx.play('click');
      setClassList(DEFAULT_CLASSES);
      setSelectedClassId(DEFAULT_CLASSES[0].id);
      localStorage.setItem('hocvui_lucky_classes', JSON.stringify(DEFAULT_CLASSES));
    }
  };

  return (
    <div 
      style={{
        background: 'linear-gradient(135deg, #065F46 0%, #059669 50%, #047857 100%)',
        border: '2px solid #34D399',
        boxShadow: '0 20px 25px -5px rgba(5, 150, 105, 0.4)'
      }}
      className="w-full max-w-5xl mx-auto rounded-3xl p-4 sm:p-7 text-white shadow-2xl space-y-6"
    >
      
      {/* Header Bar & Nơi Lưu Tên Lớp Đính Kèm Danh Sách */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-emerald-500/40">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center font-black shadow-lg border border-amber-300">
              <Disc className="w-6 h-6 animate-spin" />
            </div>
            <div>
              <h3 className="font-heading font-black text-lg sm:text-xl text-white drop-shadow-sm flex items-center gap-2">
                <span>VÒNG QUAY MAY MẮN GỌI TÊN HỌC SINH</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-700 text-amber-300 text-[10px] font-black uppercase tracking-wider border border-emerald-400/50">
                  GDPT 2018
                </span>
              </h3>
              <p className="text-xs text-emerald-100 font-bold">
                Chọn lớp đính kèm danh sách học sinh để quay gọi tên trả lời bài & phát thưởng ngẫu nhiên
              </p>
            </div>
          </div>
        </div>

        {/* Thanh Điều Khiển Chọn Lớp Nhanh & Nút Quản Lý Lớp */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Dropdown Chọn Lớp Đã Lưu */}
          <div className="flex items-center gap-1.5 bg-black/25 px-3 py-1.5 rounded-2xl border border-white/20">
            <Users className="w-4 h-4 text-amber-300 shrink-0" />
            <select
              value={selectedClassId}
              onChange={(e) => {
                soundFx.play('click');
                setSelectedClassId(e.target.value);
              }}
              style={{ background: 'transparent', color: '#FEF08A' }}
              className="font-black text-xs sm:text-sm focus:outline-none cursor-pointer pr-2"
            >
              {classList.map((cls) => (
                <option key={cls.id} value={cls.id} className="bg-emerald-900 text-white font-bold">
                  {cls.name} ({cls.students.length} HS)
                </option>
              ))}
            </select>
          </div>

          {/* Nút Thêm Lớp Mới & Quản Lý Danh Sách Lớp */}
          <button
            onClick={handleOpenAddClass}
            style={{ background: '#FEF08A', color: '#064E3B', border: '2px solid #FACC15' }}
            className="px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md hover:scale-105 transition-transform"
            title="Thêm Lớp Học Mới Kèm Danh Sách Học Sinh"
          >
            <Plus className="w-4 h-4 text-emerald-950 font-black" />
            <span>Thêm Lớp Mới</span>
          </button>

          <button
            onClick={() => handleOpenEditClass(currentClass)}
            style={{ background: 'rgba(255, 255, 255, 0.2)', color: '#FFFFFF', border: '1px solid rgba(255, 255, 255, 0.3)' }}
            className="p-2 rounded-xl text-xs font-black shadow-sm hover:bg-white/30 transition-colors"
            title="Chỉnh sửa danh sách học sinh lớp này"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Arena: Vòng Quay Bên Trái & Bảng Danh Sách Học Sinh Bên Phải */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* CỘT 1: KHUNG BÁNH XE VÒNG QUAY (7/12) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center relative">
          
          {/* Tag Thông Báo Lớp Đang Chọn */}
          <div 
            style={{ background: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255, 255, 255, 0.2)' }}
            className="mb-3 px-4 py-1.5 rounded-full text-xs font-black flex items-center gap-2 text-amber-200"
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span>Đang quay danh sách: <b className="text-white">{currentClass.name}</b> ({activeItems.length} học sinh)</span>
          </div>

          {/* Khung Vòng Quay Canvas với Kim Chỉ Đỉnh */}
          <div className="relative w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] flex items-center justify-center my-2">
            
            {/* Kim Chỉ Vòng Quay (Pointer ở đỉnh trên cùng) */}
            <div 
              style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))' }}
              className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none"
            >
              <div className="w-7 h-9 bg-gradient-to-b from-rose-500 to-red-600 rounded-b-full border-2 border-white flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
              </div>
            </div>

            {/* Vòng quay Canvas xoay theo state rotation */}
            <motion.div
              animate={{ rotate: rotation }}
              transition={{ duration: 3.8, ease: [0.15, 0.9, 0.3, 1] }}
              className="w-full h-full rounded-full shadow-2xl flex items-center justify-center overflow-hidden"
            >
              <canvas
                ref={canvasRef}
                width={380}
                height={380}
                className="w-full h-full cursor-pointer"
                onClick={handleSpin}
              />
            </motion.div>
          </div>

          {/* Nút Bấm Quay Siêu To Khổng Lồ */}
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={handleSpin}
              disabled={spinning || activeItems.length === 0}
              style={{
                background: 'linear-gradient(135deg, #FEF08A 0%, #FBBF24 50%, #F59E0B 100%)',
                color: '#451A03',
                border: '3px solid #FDE047',
                boxShadow: '0 10px 25px -3px rgba(245, 158, 11, 0.5)'
              }}
              className="px-8 sm:px-12 py-3.5 sm:py-4 rounded-2xl font-black text-sm sm:text-base shadow-2xl flex items-center gap-2 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all"
            >
              <Sparkles className="w-5 h-5 text-amber-950 animate-bounce" />
              <span>{spinning ? '🌀 ĐANG QUAY VÒNG...' : '🎯 BẤM ĐỂ QUAY NGAY'}</span>
            </button>

            <button
              onClick={handleResetClassStudents}
              style={{ background: 'rgba(255, 255, 255, 0.2)', border: '1px solid rgba(255, 255, 255, 0.3)' }}
              className="p-3.5 rounded-2xl font-black text-xs hover:bg-white/30 transition-all text-white"
              title="Khôi phục đầy đủ học sinh của lớp này"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>


        {/* CỘT 2: BẢNG KẾT QUẢ & DANH SÁCH HỌC SINH TRONG LỚP (5/12) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Khung Vinh Danh Người Trúng Thưởng */}
          <AnimatePresence>
            {winner && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0 }}
                style={{
                  background: 'linear-gradient(135deg, #FEF08A 0%, #FDE047 100%)',
                  border: '3px solid #FACC15',
                  color: '#451A03',
                  boxShadow: '0 20px 25px -5px rgba(250, 204, 21, 0.4)'
                }}
                className="p-5 rounded-3xl text-center space-y-2 shadow-2xl"
              >
                <div className="flex items-center justify-center gap-1.5 text-xs font-black uppercase text-amber-950">
                  <Trophy className="w-5 h-5 text-amber-600 animate-bounce" />
                  <span>🎉 CHÚC MỪNG HỌC SINH ĐƯỢC GỌI TÊN:</span>
                </div>

                <h4 className="text-2xl font-heading font-black text-emerald-950 drop-shadow-xs">
                  {winner}
                </h4>

                <div className="flex items-center justify-center gap-2 pt-2">
                  <button
                    onClick={handleRemoveWinner}
                    style={{ background: '#DC2626', color: '#FFFFFF' }}
                    className="px-3 py-1.5 rounded-xl text-xs font-black shadow-md hover:bg-red-700 transition-colors flex items-center gap-1"
                    title="Xóa học sinh này khỏi vòng quay tiếp theo để không bị gọi trùng"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Loại khỏi lượt sau</span>
                  </button>

                  <button
                    onClick={() => setWinner(null)}
                    style={{ background: '#065F46', color: '#FFFFFF' }}
                    className="px-3 py-1.5 rounded-xl text-xs font-black shadow-md hover:bg-emerald-800 transition-colors"
                  >
                    Đóng
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Khung Danh Sách Học Sinh Hiện Tại */}
          <div 
            style={{
              background: 'rgba(0, 0, 0, 0.25)',
              border: '1.5px solid rgba(255, 255, 255, 0.2)'
            }}
            className="p-4 rounded-3xl space-y-3 shadow-inner"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                <FileText className="w-4 h-4" />
                <span>Danh Sách Học Sinh ({activeItems.length}/{currentClass.students.length}):</span>
              </span>

              <button
                onClick={() => handleOpenEditClass(currentClass)}
                className="text-[11px] font-black text-amber-200 hover:underline flex items-center gap-1"
              >
                <Edit3 className="w-3 h-3" />
                <span>Sửa danh sách</span>
              </button>
            </div>

            {/* Danh sách thẻ tên học sinh cuộn mượt mà */}
            <div className="max-h-48 overflow-y-auto pr-1 space-y-1.5 scrollbar-thin scrollbar-thumb-emerald-600 scrollbar-track-transparent">
              {activeItems.map((name, idx) => (
                <div
                  key={idx}
                  style={{ background: 'rgba(255, 255, 255, 0.12)', border: '1px solid rgba(255, 255, 255, 0.15)' }}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold flex items-center justify-between text-white"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center text-[10px] font-black shrink-0">
                      {idx + 1}
                    </span>
                    <span className="truncate max-w-[180px]">{name}</span>
                  </div>
                  
                  <button
                    onClick={() => {
                      soundFx.play('click');
                      setActiveItems(prev => prev.filter((_, i) => i !== idx));
                    }}
                    className="text-rose-300 hover:text-rose-100 p-0.5"
                    title="Xóa học sinh này khỏi vòng quay hiện tại"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Lịch Sử Các Học Sinh Đã Trúng Thưởng */}
          {winnerHistory.length > 0 && (
            <div 
              style={{
                background: 'rgba(0, 0, 0, 0.25)',
                border: '1.5px solid rgba(255, 255, 255, 0.2)'
              }}
              className="p-3.5 rounded-3xl space-y-2 text-xs"
            >
              <div className="flex items-center justify-between text-amber-300 font-black border-b border-white/10 pb-1.5">
                <span className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Lịch Sử Gọi Tên ({winnerHistory.length}):</span>
                </span>
                <button
                  onClick={() => { soundFx.play('click'); setWinnerHistory([]); }}
                  className="text-[10px] text-rose-300 hover:underline"
                >
                  Xóa lịch sử
                </button>
              </div>

              <div className="max-h-24 overflow-y-auto space-y-1 scrollbar-none">
                {winnerHistory.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-emerald-100 text-[11px] font-bold">
                    <span>👑 {item.name}</span>
                    <span className="text-[10px] opacity-75 font-mono">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>


      {/* ==================================================================== */}
      {/* MODAL QUẢN LÝ / THÊM MỚI / CHỈNH SỬA TÊN LỚP & DANH SÁCH HỌC SINH */}
      {/* ==================================================================== */}
      <AnimatePresence>
        {isManagerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                background: 'linear-gradient(135deg, #065F46 0%, #047857 100%)',
                border: '2px solid #34D399',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
              }}
              className="w-full max-w-xl rounded-3xl p-6 text-white space-y-5 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-emerald-500/40 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center font-black shadow-md">
                    <Layers className="w-5 h-5" />
                  </div>
                  <h4 className="font-heading font-black text-base sm:text-lg text-white">
                    {editingClassId ? 'Chỉnh Sửa Lớp & Danh Sách Học Sinh' : 'Thêm Lớp Mới Đính Kèm Danh Sách'}
                  </h4>
                </div>

                <button
                  onClick={() => setIsManagerOpen(false)}
                  className="p-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {saveSuccessMsg && (
                <div 
                  style={{ background: '#FEF08A', color: '#064E3B', border: '2px solid #FACC15' }}
                  className="p-3 rounded-2xl text-xs font-black flex items-center gap-2 shadow-sm"
                >
                  <Check className="w-4 h-4 text-emerald-800" />
                  <span>{saveSuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handleSaveClass} className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-amber-200 mb-1">
                    Tên Lớp Học (Ví dụ: Lớp 7A3 - KHTN, Nhóm 1 Toán 8...):
                  </label>
                  <input
                    type="text"
                    required
                    value={formClassName}
                    onChange={(e) => setFormClassName(e.target.value)}
                    placeholder="Nhập tên lớp học..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white border-2 border-emerald-300 text-xs font-black text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-300 shadow-inner"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-amber-200 mb-1">
                    Danh Sách Tên Học Sinh Đính Kèm (Mỗi dòng 1 tên hoặc cách nhau bằng dấu phẩy):
                  </label>
                  <textarea
                    rows={6}
                    required
                    value={formStudentListText}
                    onChange={(e) => setFormStudentListText(e.target.value)}
                    placeholder="Nguyễn Văn An&#10;Trần Thị Mai&#10;Lê Hoàng Long&#10;Phạm Minh Thư..."
                    className="w-full p-3.5 rounded-xl bg-white border-2 border-emerald-300 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-300 shadow-inner leading-relaxed"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    style={{
                      background: '#FBBF24',
                      color: '#451A03',
                      border: '2px solid #FDE047',
                      boxShadow: '0 4px 15px rgba(251, 191, 36, 0.4)'
                    }}
                    className="flex-1 py-3 rounded-xl font-black text-xs sm:text-sm shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4 text-amber-950" />
                    <span>Lưu Lớp & Danh Sách</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsManagerOpen(false)}
                    style={{ background: 'rgba(255, 255, 255, 0.2)', border: '1px solid rgba(255, 255, 255, 0.3)' }}
                    className="px-5 py-3 rounded-xl font-black text-xs hover:bg-white/30 text-white transition-all"
                  >
                    Hủy Bỏ
                  </button>
                </div>
              </form>

              {/* Danh Sách Các Lớp Đang Có Trong Bộ Nhớ */}
              <div className="pt-2 border-t border-emerald-500/30 space-y-2">
                <div className="flex items-center justify-between text-xs font-black text-amber-200">
                  <span>Các lớp hiện có trong hệ thống ({classList.length}):</span>
                  <button
                    type="button"
                    onClick={handleRestoreDefaultClasses}
                    className="text-[11px] text-amber-300 hover:underline"
                  >
                    Khôi phục mẫu THCS
                  </button>
                </div>

                <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin scrollbar-thumb-emerald-600">
                  {classList.map((cls) => (
                    <div 
                      key={cls.id}
                      style={{ background: 'rgba(0, 0, 0, 0.2)', border: '1px solid rgba(255, 255, 255, 0.15)' }}
                      className="p-2.5 rounded-xl flex items-center justify-between text-xs font-bold"
                    >
                      <div className="truncate max-w-[280px]">
                        <span className="text-white">{cls.name}</span>
                        <span className="text-emerald-300 text-[11px] ml-2">({cls.students.length} học sinh)</span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedClassId(cls.id);
                            handleOpenEditClass(cls);
                          }}
                          className="p-1 rounded-lg bg-white/15 hover:bg-white/25 text-amber-300"
                          title="Sửa lớp này"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteClass(cls.id, cls.name)}
                          className="p-1 rounded-lg bg-white/15 hover:bg-rose-600 text-rose-300 hover:text-white"
                          title="Xóa lớp này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
