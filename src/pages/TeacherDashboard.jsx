import React, { useState } from 'react';
import { 
  GraduationCap, 
  Plus, 
  Upload, 
  Users, 
  Award, 
  BarChart3, 
  Layers, 
  CheckCircle2, 
  Send,
  FileArchive,
  Link as LinkIcon
} from 'lucide-react';
import { useGames } from '../hooks/useGames';
import { RadarSkillChart } from '../components/dashboard/RadarSkillChart';
import { ClassManager } from '../components/dashboard/ClassManager';
import { AssignmentModal } from '../components/dashboard/AssignmentModal';
import { Html5ZipUploader } from '../components/game/Html5ZipUploader';
import { soundFx } from '../lib/soundFx';

export const TeacherDashboard = () => {
  const { games, addGame } = useGames();
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' | 'classes' | 'create_game'
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  // New Game Form State
  const [gameType, setGameType] = useState('iframe');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [gameUrl, setGameUrl] = useState('');
  const [gradeLevel, setGradeLevel] = useState('7');
  const [subject, setSubject] = useState('Khoa Học Tự Nhiên');
  const [zipBlobUrl, setZipBlobUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleCreateGame = async (e) => {
    e.preventDefault();
    soundFx.play('click');

    if (!title || !title.trim()) {
      soundFx.play('wrong');
      setSuccessMsg(null);
      setErrorMsg('⚠️ Vui lòng nhập Tên Trò Chơi!');
      return;
    }

    const finalUrl = gameType === 'html5_zip' ? zipBlobUrl : gameUrl;

    if (!finalUrl) {
      soundFx.play('wrong');
      setSuccessMsg(null);
      setErrorMsg(
        gameType === 'html5_zip' 
          ? '⚠️ Vui lòng chọn File nén HTML5 ZIP / PowerPoint (.zip, .html) trước khi tạo bài chơi!' 
          : '⚠️ Vui lòng nhập đường dẫn URL nhúng (Wordwall/Quizizz/Canva)!'
      );
      return;
    }

    setSubmitting(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    const gameData = {
      title,
      description,
      game_type: gameType,
      game_url: finalUrl,
      grade_level: gradeLevel,
      subject,
      thumbnail_url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80',
      is_public: true
    };

    const { error } = await addGame(gameData);
    setSubmitting(false);

    if (!error) {
      soundFx.play('correct');
      setSuccessMsg('🎉 Đã tạo trò chơi học tập mới thành công! Bài chơi đã hiển thị tức thì trên Kho Game.');
      setTitle('');
      setDescription('');
      setGameUrl('');
      setZipBlobUrl('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Top Banner Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 bg-gradient-to-r from-emerald-950/60 via-slate-950 to-indigo-950/60 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
            <GraduationCap className="w-4 h-4" />
            Hệ Thống Quản Lý Dành Cho Giáo Viên
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
            GÓC GIÁO VIÊN THCS
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Tạo bài tập game, nhúng iFrame (GAME-01), upload HTML5 ZIP (GAME-02), quản lý lớp học và theo dõi biểu đồ năng lực học sinh.
          </p>
        </div>

        <button
          onClick={() => setIsAssignModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 hover:opacity-90 transition-opacity"
        >
          <Send className="w-4 h-4" />
          <span>Giao Bài Tập Cho Lớp</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 text-xs font-bold">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`pb-3 px-4 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'analytics'
              ? 'border-emerald-400 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Thống Kê Năng Lực & Biểu Đồ</span>
        </button>

        <button
          onClick={() => setActiveTab('classes')}
          className={`pb-3 px-4 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'classes'
              ? 'border-emerald-400 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Quản Lý Lớp Học & Mã HS</span>
        </button>

        <button
          onClick={() => setActiveTab('create_game')}
          className={`pb-3 px-4 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'create_game'
              ? 'border-emerald-400 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Tạo / Upload Trò Chơi Mới</span>
        </button>
      </div>

      {/* TAB 1: Analytics & Radar Chart */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RadarSkillChart title="Biểu Đồ Radar Đánh Giá Năng Lực Trung Bình Lớp Học" />
          </div>

          <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
            <h3 className="text-base font-heading font-bold text-white mb-2">
              Chỉ Số Tương Tác Học Sinh
            </h3>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400 font-semibold">Tỉ Lệ Hoàn Thành Bài:</span>
              <p className="text-2xl font-heading font-extrabold text-emerald-400">92.4%</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400 font-semibold">Thời Gian Chơi Trung Bình:</span>
              <p className="text-2xl font-heading font-extrabold text-indigo-400">8 phút 45 giây</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400 font-semibold">Môn Học Yêu Thích Nhất:</span>
              <p className="text-xl font-heading font-bold text-amber-400">Khoa Học Tự Nhiên & Tiếng Anh</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Class Management */}
      {activeTab === 'classes' && <ClassManager />}

      {/* TAB 3: Create Game (iFrame GAME-01 or HTML5 ZIP GAME-02) */}
      {activeTab === 'create_game' && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 max-w-3xl mx-auto space-y-6">
          <div>
            <h3 className="text-lg font-heading font-bold text-white">
              Tạo Trò Chơi Học Tập Mới
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Hỗ trợ nhúng game ngoại bằng (Wordwall, Quizizz, Kahoot, Canva) hoặc upload file HTML5 ZIP giải nén tự động.
            </p>
          </div>

          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-2">
              <span>{errorMsg}</span>
            </div>
          )}

          <form noValidate onSubmit={handleCreateGame} className="space-y-4">
            
            {/* Game Type Switcher */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Loại Trò Chơi:</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setGameType('iframe')}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    gameType === 'iframe'
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  <LinkIcon className="w-4 h-4" />
                  <span>Nhúng iFrame (GAME-01)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setGameType('html5_zip')}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    gameType === 'html5_zip'
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  <FileArchive className="w-4 h-4" />
                  <span>Upload HTML5 ZIP (GAME-02)</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Tên Trò Chơi:</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ví dụ: Chinh Phục Kiến Thức KHTN 7"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
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

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Môn Học (GDPT 2018):</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
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
            </div>

            {gameType === 'iframe' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">URL Nhúng (Wordwall / Quizizz / Kahoot):</label>
                <input
                  type="url"
                  required={gameType === 'iframe'}
                  value={gameUrl}
                  onChange={(e) => setGameUrl(e.target.value)}
                  placeholder="https://wordwall.net/embed/play/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            ) : (
              <Html5ZipUploader onZipParsed={({ blobUrl }) => setZipBlobUrl(blobUrl)} />
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Mô tả trò chơi:</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả nội dung bài học và hướng dẫn học sinh..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 text-white font-bold text-xs shadow-lg shadow-emerald-600/20"
            >
              {submitting ? 'Đang Khởi Tạo...' : 'Đăng Trò Chơi Mới'}
            </button>
          </form>
        </div>
      )}

      {/* Assignment Modal */}
      <AssignmentModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        games={games}
      />

    </div>
  );
};
