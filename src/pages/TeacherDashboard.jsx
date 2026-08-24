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
  Link as LinkIcon,
  Trash2,
  Bot,
  Sparkles
} from 'lucide-react';
import { useGames } from '../hooks/useGames';
import { RadarSkillChart } from '../components/dashboard/RadarSkillChart';
import { ClassManager } from '../components/dashboard/ClassManager';
import { AssignmentModal } from '../components/dashboard/AssignmentModal';
import { Html5ZipUploader } from '../components/game/Html5ZipUploader';
import { GameCard } from '../components/game/GameCard';
import { AiQuestionGenerator } from '../components/dashboard/AiQuestionGenerator';
import { soundFx } from '../lib/soundFx';

export const TeacherDashboard = () => {
  const { games, addGame, deleteGame } = useGames();
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' | 'classes' | 'create_game' | 'manage_games' | 'ai_generator'
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  // New Game Form State
  const [gameType, setGameType] = useState('iframe');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [gameUrl, setGameUrl] = useState('');
  const [gradeLevel, setGradeLevel] = useState('7');
  const [subject, setSubject] = useState('Khoa Học Tự Nhiên');
  const [zipBlobUrl, setZipBlobUrl] = useState('');
  const [zipHtmlContent, setZipHtmlContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleCreateGame = async (e) => {
    e.preventDefault();
    soundFx.play('click');

    let gameTitle = title ? title.trim() : '';
    if (!gameTitle && (zipHtmlContent || zipBlobUrl)) {
      gameTitle = 'Trò Chơi HTML5 Tương Tác';
    }

    if (!gameTitle) {
      soundFx.play('wrong');
      setSuccessMsg(null);
      setErrorMsg('⚠️ Vui lòng nhập Tên Trò Chơi!');
      return;
    }

    // Tự động nhận diện gameType nếu giáo viên chọn Upload File hoặc dán URL
    let detectedType = gameType;
    let finalUrl = gameUrl;

    if (zipHtmlContent || zipBlobUrl) {
      detectedType = 'html5_zip';
      finalUrl = zipBlobUrl || 'html5-embedded-content';
    } else if (gameUrl && gameUrl.trim()) {
      detectedType = 'iframe';
      finalUrl = gameUrl.trim();
    }

    if (!finalUrl && !zipHtmlContent) {
      soundFx.play('wrong');
      setSuccessMsg(null);
      setErrorMsg(
        '⚠️ Vui lòng dán Link Nhúng (Wordwall/Quizizz/Canva) HOẶC nhấp Chọn File HTML5 ZIP/PowerPoint từ máy tính!'
      );
      return;
    }

    setSubmitting(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    const gameData = {
      title: gameTitle,
      description: description.trim() || 'Trò chơi học tập tương tác nâng cao kiến thức.',
      game_type: detectedType,
      game_url: finalUrl || 'https://wordwall.net/embed/play/123456/789',
      grade_level: gradeLevel,
      subject,
      thumbnail_url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80',
      is_public: true,
      config: {
        htmlContent: zipHtmlContent || ''
      }
    };

    const { error } = await addGame(gameData);
    setSubmitting(false);

    if (!error) {
      soundFx.play('victory');
      setSuccessMsg(`🎉 Đã đăng bài chơi "${title}" thành công vào Kho Trò Chơi Học Tập!`);
      setTitle('');
      setDescription('');
      setGameUrl('');
      setZipBlobUrl('');
      setZipHtmlContent('');
      
      // Tự động chuyển sang tab Quản Lý Bài Chơi để Thầy Cô thấy ngay kết quả
      setTimeout(() => {
        setActiveTab('manage_games');
      }, 1000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Top Banner Header - NỀN XANH LÁ CÂY TƯƠI MÁT & SANG TRỌNG */}
      <div className="rounded-3xl p-6 sm:p-8 border-2 border-emerald-400 bg-gradient-to-r from-[#065F46] via-[#059669] to-[#047857] text-white shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 border border-white/30 text-emerald-100 text-xs font-black uppercase tracking-wider backdrop-blur-md">
            <GraduationCap className="w-4 h-4 text-amber-300" />
            <span>Hệ Thống Quản Lý Dành Cho Giáo Viên</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-white drop-shadow-sm">
            GÓC GIÁO VIÊN THCS
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 font-medium max-w-xl leading-relaxed">
            Tạo bài tập game, nhúng iFrame (GAME-01), upload HTML5 ZIP (GAME-02), quản lý lớp học và theo dõi biểu đồ năng lực học sinh.
          </p>
        </div>

        <button
          onClick={() => setIsAssignModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xs flex items-center gap-2 shadow-xl border border-amber-300 transition-all transform hover:scale-105"
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

        <button
          onClick={() => setActiveTab('manage_games')}
          className={`pb-3 px-4 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'manage_games'
              ? 'border-rose-400 text-rose-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Trash2 className="w-4 h-4 text-rose-400" />
          <span>Quản Lý & Xóa Bài Chơi ({games.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('ai_generator')}
          className={`pb-3 px-4 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'ai_generator'
              ? 'border-purple-400 text-purple-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bot className="w-4 h-4 text-purple-400" />
          <span>🤖 AI Tạo Câu Hỏi & Kho Câu Hỏi</span>
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

      {/* TAB 3: Create Game (iFrame GAME-01 or HTML5 ZIP GAME-02) - NỀN VÀNG NHẠT SANG TRỌNG & SẮC NÉT */}
      {activeTab === 'create_game' && (
        <div className="bg-[#FEF9C3] rounded-3xl p-6 sm:p-8 border-2 border-amber-300 shadow-2xl max-w-3xl mx-auto space-y-6">
          <div className="border-b border-amber-300/80 pb-4">
            <h3 className="text-xl font-heading font-black text-amber-950 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <span>Tạo Trò Chơi Học Tập Mới</span>
            </h3>
            <p className="text-xs text-amber-900/90 mt-1 font-bold">
              Hỗ trợ nhúng game ngoại bằng (Wordwall, Quizizz, Kahoot, Canva) hoặc upload file HTML5 ZIP giải nén tự động.
            </p>
          </div>

          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-100 text-emerald-950 border-2 border-emerald-400 text-xs font-black flex items-center gap-2 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-100 text-rose-950 border-2 border-rose-400 text-xs font-black flex items-center gap-2 shadow-xs">
              <span className="shrink-0">{errorMsg}</span>
            </div>
          )}

          <form noValidate onSubmit={handleCreateGame} className="space-y-4">
            
            {/* Game Type Switcher */}
            <div>
              <label className="block text-xs font-black text-amber-950 mb-1.5">Loại Trò Chơi:</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setGameType('iframe')}
                  className={`p-3 rounded-xl border-2 text-xs font-black flex items-center justify-center gap-2 transition-all shadow-xs ${
                    gameType === 'iframe'
                      ? 'bg-amber-400 text-amber-950 border-amber-500 shadow-md ring-2 ring-amber-300'
                      : 'bg-white/80 text-amber-900 border-amber-300 hover:bg-amber-100'
                  }`}
                >
                  <LinkIcon className="w-4 h-4" />
                  <span>Nhúng iFrame (GAME-01)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setGameType('html5_zip')}
                  className={`p-3 rounded-xl border-2 text-xs font-black flex items-center justify-center gap-2 transition-all shadow-xs ${
                    gameType === 'html5_zip'
                      ? 'bg-amber-400 text-amber-950 border-amber-500 shadow-md ring-2 ring-amber-300'
                      : 'bg-white/80 text-amber-900 border-amber-300 hover:bg-amber-100'
                  }`}
                >
                  <FileArchive className="w-4 h-4" />
                  <span>Upload HTML5 ZIP (GAME-02)</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-amber-950 mb-1">Tên Trò Chơi:</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ví dụ: Chinh Phục Kiến Thức KHTN 7"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border-2 border-amber-200 text-xs font-black text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-300 shadow-inner"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black text-amber-950 mb-1">Khối Lớp:</label>
                <select
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white border-2 border-amber-200 text-xs font-black text-slate-900 focus:outline-none focus:border-amber-400 shadow-inner"
                >
                  <option value="6">Lớp 6</option>
                  <option value="7">Lớp 7</option>
                  <option value="8">Lớp 8</option>
                  <option value="9">Lớp 9</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-amber-950 mb-1">Môn Học (GDPT 2018):</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white border-2 border-amber-200 text-xs font-black text-slate-900 focus:outline-none focus:border-amber-400 shadow-inner"
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
                <label className="block text-xs font-black text-amber-950 mb-1">URL Nhúng (Wordwall / Quizizz / Kahoot):</label>
                <input
                  type="url"
                  required={gameType === 'iframe'}
                  value={gameUrl}
                  onChange={(e) => setGameUrl(e.target.value)}
                  placeholder="https://wordwall.net/embed/play/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border-2 border-amber-200 text-xs font-black text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-300 shadow-inner"
                />
              </div>
            ) : (
              <Html5ZipUploader onZipParsed={({ fileName, blobUrl, htmlContent }) => {
                setGameType('html5_zip');
                setZipBlobUrl(blobUrl);
                if (htmlContent) setZipHtmlContent(htmlContent);
                if (fileName && !title) {
                  const cleanName = fileName.replace(/\.(html|htm|zip|ppt|pptx)$/i, '').replace(/[-_]/g, ' ');
                  setTitle(cleanName);
                }
              }} />
            )}

            <div>
              <label className="block text-xs font-black text-amber-950 mb-1">Mô tả trò chơi:</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả nội dung bài học và hướng dẫn học sinh..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border-2 border-amber-200 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-300 shadow-inner"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-xl shadow-emerald-600/30 transition-all border border-emerald-400 transform hover:scale-[1.01] active:scale-[0.99]"
            >
              {submitting ? 'Đang Khởi Tạo Trò Chơi...' : 'Đăng Trò Chơi Mới'}
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: Manage & Delete Games */}
      {activeTab === 'manage_games' && (
        <div className="space-y-4">
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-heading font-bold text-white flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-rose-500" />
                Quản Lý & Xóa Bài Chơi Trong Kho ({games.length})
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Thầy Cô chỉ cần nhấp vào nút <span className="text-rose-400 font-bold">Thùng Rác Đỏ</span> trên mỗi thẻ bài để xóa các bài chơi không dùng nữa.
              </p>
            </div>
            <span className="px-3.5 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold font-mono">
              Kho Game Hiện Tại: {games.length} bài
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {games.map((game) => (
              <GameCard key={game.id} game={game} onDelete={deleteGame} />
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: AI Auto Question Generator & Question Bank */}
      {activeTab === 'ai_generator' && (
        <AiQuestionGenerator 
          onGameCreated={async (gameData) => {
            await addGame(gameData);
            setActiveTab('manage_games');
          }} 
        />
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
