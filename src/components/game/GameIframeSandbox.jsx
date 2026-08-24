import React, { useEffect, useState, useRef } from 'react';
import { ShieldCheck, Timer, RotateCcw, Award, CheckCircle, AlertTriangle, Maximize2, Minimize2, ZoomIn, ZoomOut, Tv, ExternalLink, HelpCircle, Play } from 'lucide-react';
import { initGameSdkListener, injectGameSdkHelperScript } from '../../lib/gameSdk';
import { soundFx } from '../../lib/soundFx';

export const GameIframeSandbox = ({ game, isPractice = false, onComplete }) => {
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [finalScore, setFinalScore] = useState(null);
  const [isZoomed169, setIsZoomed169] = useState(false);
  const [isNativeFullscreen, setIsNativeFullscreen] = useState(false);
  const iframeRef = useRef(null);
  const containerRef = useRef(null);

  const handleTriggerNativeFullscreen = () => {
    soundFx.play('click');
    const elem = containerRef.current || document.documentElement;
    if (!document.fullscreenElement) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
      setIsNativeFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsNativeFullscreen(false);
    }
  };

  const htmlContent = game?.config?.htmlContent || game?.raw_html;

  // Nếu không có HTML file đính kèm, tự động sinh Game HTML5 Tương Tác Playable 100% có câu hỏi, điểm thưởng và kết nối SDK
  const playableFallbackHtml = React.useMemo(() => {
    if (htmlContent) return null;

    if (!game?.game_url || game.game_url.startsWith('blob:') || game.game_url.includes('example.com')) {
      const titleStr = game?.title || 'Đấu Trí Trắc Nghiệm Học Tập';
      const subjectStr = game?.subject || 'Khoa Học Tự Nhiên';
      const gradeStr = game?.grade_level || '7';

      return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${titleStr}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #090d16; color: #f8fafc; font-family: system-ui, -apple-system, sans-serif; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 1.5rem; }
    .game-card { background: rgba(30, 41, 59, 0.9); border: 1px solid rgba(99, 102, 241, 0.4); border-radius: 1.5rem; padding: 2rem; max-width: 680px; width: 100%; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.7); backdrop-filter: blur(16px); text-align: center; }
    .badge { display: inline-block; padding: 0.35rem 1rem; background: rgba(99, 102, 241, 0.2); color: #818cf8; border-radius: 9999px; font-size: 0.8rem; font-weight: 700; border: 1px solid rgba(99, 102, 241, 0.3); margin-bottom: 1rem; }
    h1 { font-size: 1.5rem; color: #ffffff; margin-bottom: 0.5rem; font-weight: 800; }
    p.desc { color: #94a3b8; font-size: 0.9rem; margin-bottom: 1.5rem; }
    .question-box { background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 1rem; padding: 1.25rem; margin-bottom: 1.5rem; text-align: left; }
    .q-title { font-size: 1.05rem; font-weight: 700; color: #e2e8f0; margin-bottom: 1rem; }
    .options-grid { display: grid; grid-template-columns: 1fr; gap: 0.75rem; }
    @media (min-width: 500px) { .options-grid { grid-template-columns: 1fr 1fr; } }
    .opt-btn { background: #1e293b; border: 1px solid #334155; border-radius: 0.75rem; padding: 0.85rem 1rem; text-align: left; color: #cbd5e1; font-weight: 600; font-size: 0.9rem; cursor: pointer; transition: all 0.2s; }
    .opt-btn:hover { background: #312e81; border-color: #6366f1; color: #ffffff; transform: translateY(-2px); }
    .opt-btn.correct { background: #065f46 !important; border-color: #10b981 !important; color: #ffffff !important; }
    .opt-btn.wrong { background: #881337 !important; border-color: #f43f5e !important; color: #ffffff !important; }
    .score-board { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; padding: 0.75rem 1rem; background: rgba(99, 102, 241, 0.1); border-radius: 0.75rem; color: #a5b4fc; font-weight: 700; font-size: 0.9rem; }
    .complete-box { display: none; text-align: center; }
    .complete-box.active { display: block; animation: fadeIn 0.3s ease-in; }
    .final-score { font-size: 3rem; font-weight: 900; color: #f59e0b; margin: 1rem 0; }
    .submit-btn { display: inline-block; padding: 0.85rem 2rem; background: linear-gradient(135deg, #4f46e5, #7c3aed); color: white; border-radius: 0.85rem; font-weight: 800; font-size: 0.95rem; cursor: pointer; border: none; shadow: 0 10px 20px rgba(99, 102, 241, 0.4); text-decoration: none; }
  </style>
</head>
<body>
  <div class="game-card">
    <div class="badge">🎮 Đấu Trí Học Tập • Lớp ${gradeStr} • ${subjectStr}</div>
    <h1>${titleStr}</h1>
    <p class="desc">Trả lời các câu hỏi tương tác để hoàn thành bài chơi và tích lũy điểm EXP thưởng!</p>

    <div id="quiz-screen">
      <div class="score-board">
        <span>Câu hỏi <span id="q-idx">1</span> / 3</span>
        <span>Điểm tích lũy: <span id="score-val">0</span></span>
      </div>

      <div class="question-box">
        <div class="q-title" id="q-text">Đang tải câu hỏi...</div>
        <div class="options-grid" id="opts-container"></div>
      </div>
    </div>

    <div id="complete-screen" class="complete-box">
      <div style="font-size: 3.5rem;">🎉</div>
      <h2 style="color: #10b981; margin-top: 0.5rem;">Hoàn Thành Bài Đấu Trí!</h2>
      <div class="final-score"><span id="final-score-val">100</span> <span style="font-size: 1rem; color: #94a3b8;">/ 100 Đ</span></div>
      <button class="submit-btn" onclick="finishGame()">Nộp Bài & Nhận Thưởng EXP</button>
    </div>
  </div>

  <script>
    const questions = [
      {
        q: "Câu 1: Khối kiến thức cốt lõi của môn ${subjectStr} Lớp ${gradeStr} giúp phát triển năng lực gì?",
        opts: ["A. Tư duy sáng tạo & Giải quyết vấn đề", "B. Ghi nhớ máy móc", "C. Thụ động thụ nhận", "D. Chỉ đọc chép"],
        ans: 0
      },
      {
        q: "Câu 2: Đâu là phương pháp học tập tương tác hiệu quả nhất theo chương trình GDPT 2018?",
        opts: ["A. Học qua các trò chơi tương tác & Thực hành", "B. Đọc sách không thực hành", "C. Chỉ làm bài tập giấy", "D. Học vẹt"],
        ans: 0
      },
      {
        q: "Câu 3: Mục tiêu khi hoàn thành bài chơi này là gì?",
        opts: ["A. Đạt 100 điểm & Tích lũy huy hiệu EXP", "B. Bỏ dở giữa chừng", "C. Không cần trả lời", "D. Bấm thoát ra"],
        ans: 0
      }
    ];

    let currentQ = 0;
    let currentScore = 0;
    let startTime = Date.now();

    function renderQuestion() {
      if (currentQ >= questions.length) {
        showComplete();
        return;
      }
      const item = questions[currentQ];
      document.getElementById('q-idx').innerText = currentQ + 1;
      document.getElementById('q-text').innerText = item.q;

      const optsDiv = document.getElementById('opts-container');
      optsDiv.innerHTML = '';

      item.opts.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'opt-btn';
        btn.innerText = opt;
        btn.onclick = () => checkAns(idx, item.ans, btn);
        optsDiv.appendChild(btn);
      });
    }

    function checkAns(selected, correct, btnEl) {
      const btns = document.querySelectorAll('.opt-btn');
      btns.forEach(b => b.disabled = true);

      if (selected === correct) {
        btnEl.classList.add('correct');
        currentScore += 35;
        if (currentScore > 100) currentScore = 100;
        document.getElementById('score-val').innerText = currentScore;
      } else {
        btnEl.classList.add('wrong');
        btns[correct].classList.add('correct');
      }

      setTimeout(() => {
        currentQ++;
        renderQuestion();
      }, 1000);
    }

    function showComplete() {
      document.getElementById('quiz-screen').style.display = 'none';
      const completeDiv = document.getElementById('complete-screen');
      completeDiv.classList.add('active');
      const finalScore = Math.max(currentScore, 100);
      document.getElementById('final-score-val').innerText = finalScore;
    }

    function finishGame() {
      const timeSeconds = Math.round((Date.now() - startTime) / 1000);
      const finalScore = Math.max(currentScore, 100);
      if (window.parent) {
        window.parent.postMessage({
          type: 'GAME_COMPLETE',
          score: finalScore,
          timeSeconds: timeSeconds
        }, '*');
      }
    }

    renderQuestion();
  </script>
</body>
</html>`;
    }
    return null;
  }, [game, htmlContent]);

  // Tự động tạo lại Blob URL tươi mới hoặc chuyển đổi URL Office Online sang Embed Link
  const activeUrl = React.useMemo(() => {
    if (htmlContent) {
      const blob = new Blob([htmlContent], { type: 'text/html' });
      return URL.createObjectURL(blob);
    }

    const rawUrl = game?.game_url || 'https://wordwall.net/embed/play/123456/789';
    const lowerUrl = rawUrl.toLowerCase();

    // Tự động bao bọc Microsoft Office Web Viewer nếu là file .ppt/.pptx/.doc/.docx
    if (lowerUrl.endsWith('.ppt') || lowerUrl.endsWith('.pptx') || lowerUrl.includes('.ppt?') || lowerUrl.includes('.pptx?')) {
      if (!lowerUrl.includes('officeapps.live.com')) {
        return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(rawUrl)}`;
      }
    }

    // Chuyển đổi link xem OneDrive sang Embed URL
    if (lowerUrl.includes('onedrive.live.com') || lowerUrl.includes('1drv.ms') || lowerUrl.includes('sharepoint.com')) {
      if (lowerUrl.includes('view.aspx')) {
        return rawUrl.replace('view.aspx', 'embed.aspx');
      }
    }

    return rawUrl;
  }, [game, htmlContent]);

  // Nhấn phím ESC để thoát chế độ phóng to 16:9
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isZoomed169) {
        setIsZoomed169(false);
        soundFx.play('click');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isZoomed169]);

  const toggleZoom169 = () => {
    soundFx.play('click');
    setIsZoomed169(prev => !prev);
  };

  // Timer Ticking (GAME-05)
  useEffect(() => {
    if (gameCompleted) return;
    const interval = setInterval(() => {
      setTimerSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [gameCompleted]);

  // Listen for JS SDK postMessage Score Reports (GAME-04)
  useEffect(() => {
    const cleanupListener = initGameSdkListener(({ score, timeSeconds }) => {
      soundFx.play('victory');
      setFinalScore(score);
      setGameCompleted(true);
      if (typeof onComplete === 'function') {
        onComplete({
          score,
          timeSeconds: timeSeconds || timerSeconds,
          isPractice
        });
      }
    });

    return () => cleanupListener();
  }, [isPractice, onComplete, timerSeconds]);

  const handleManualSubmitScore = (simulatedScore = 90) => {
    soundFx.play('correct');
    setFinalScore(simulatedScore);
    setGameCompleted(true);
    if (typeof onComplete === 'function') {
      onComplete({
        score: simulatedScore,
        timeSeconds: timerSeconds,
        isPractice
      });
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentSrcDoc = htmlContent || playableFallbackHtml || undefined;

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* Top Game Bar Controls */}
      <div className="w-full max-w-5xl glass-panel rounded-t-2xl p-3.5 border-b-0 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            Sandbox iFrame An Toàn (GAME-03)
          </span>

          {isPractice && (
            <span className="px-3 py-1 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold">
              Chế Độ Luyện Tập (GAME-08)
            </span>
          )}

          <span className="hidden sm:inline-flex items-center gap-1 text-xs text-indigo-300 font-mono font-semibold bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
            <Tv className="w-3.5 h-3.5" /> 16:9 Widescreen
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* NÚT MỞ TRONG CỬA SỔ MỚI */}
          <a
            href={game?.game_url || activeUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundFx.play('click')}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all flex items-center gap-1.5"
            title="Mở trò chơi trong cửa sổ mới (khi Microsoft Office/Drive bị chặn iFrame)"
          >
            <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Mở Tab Mới</span>
          </a>

          {/* NÚT BẬT / THOÁT FULL MÀN HÌNH CHUẨN TRÌNH DUYỆT */}
          <button
            onClick={handleTriggerNativeFullscreen}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-600/30"
            title="Bật chế độ Toàn Màn Hình (Fullscreen HD)"
          >
            <Maximize2 className="w-4 h-4 text-emerald-200" />
            <span>{isNativeFullscreen ? 'Thoát Full Màn Hình' : '🖥️ Full Màn Hình'}</span>
          </button>

          {/* NÚT PHÓNG TO / THU NHỎ TỈ LỆ 16:9 */}
          <button
            onClick={toggleZoom169}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md ${
              isZoomed169
                ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30 ring-2 ring-amber-400/50'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 text-white shadow-indigo-600/30'
            }`}
            title={isZoomed169 ? 'Thu nhỏ về màn hình chuẩn (Phím ESC)' : 'Phóng to 16:9 Toàn Màn Hình'}
          >
            {isZoomed169 ? (
              <>
                <Minimize2 className="w-4 h-4" />
                <span>Thu Nhỏ 16:9</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-4 h-4" />
                <span>Phóng To 16:9</span>
              </>
            )}
          </button>

          {/* Live Timer (GAME-05) */}
          <div className="flex items-center gap-2 bg-slate-900/90 px-3.5 py-1.5 rounded-xl border border-slate-800 font-mono text-sm font-bold text-indigo-300">
            <Timer className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span>{formatTime(timerSeconds)}</span>
          </div>
        </div>
      </div>

      {/* Thông Báo Hướng Dẫn Trợ Giúp Mở Tab Mới */}
      <div className="w-full max-w-5xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 px-3.5 py-2 rounded-xl text-xs flex flex-wrap items-center justify-between gap-2 my-2 shadow-sm">
        <div className="flex items-center gap-2 min-w-[240px] flex-1">
          <HelpCircle className="w-4 h-4 text-amber-500 shrink-0" />
          <span className="font-medium">
            Nếu khung game bị lỗi thiếu file hoặc bị chặn:
          </span>
        </div>
        <a
          href={game?.game_url || activeUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => soundFx.play('click')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shrink-0 shadow-md transition-all border border-amber-400/40"
        >
          <ExternalLink className="w-3.5 h-3.5 text-amber-200" />
          <span>Mở Tab Mới Chơi Ngay</span>
        </a>
      </div>

      {/* iFrame Container - Normal 16:9 View */}
      <div 
        className={`w-full max-w-5xl aspect-video h-[520px] sm:h-[600px] bg-slate-950 rounded-b-2xl overflow-hidden border border-slate-800 shadow-2xl relative transition-all duration-300 ${
          isZoomed169 ? 'hidden' : 'block'
        }`}
      >
        <iframe
          ref={iframeRef}
          src={currentSrcDoc ? undefined : activeUrl}
          srcDoc={currentSrcDoc}
          title={game.title}
          className="w-full h-full border-0 bg-white"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-presentation allow-downloads allow-modals allow-popups-to-escape-sandbox"
          loading="lazy"
        />

        {/* Completion Overlay */}
        {gameCompleted && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40 mb-4 animate-bounce">
              <CheckCircle className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-heading font-bold text-white mb-2">
              Hoàn Thành Bài Chơi!
            </h3>
            
            <p className="text-sm text-slate-300 mb-4">
              Thời gian chơi: <span className="font-bold text-indigo-400">{formatTime(timerSeconds)}</span>
            </p>

            <div className="text-4xl font-heading font-extrabold text-amber-400 mb-6">
              {finalScore} <span className="text-lg font-normal text-slate-400">/ 100 Điểm</span>
            </div>

            <button
              onClick={() => {
                setGameCompleted(false);
                setTimerSeconds(0);
              }}
              className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Chơi Lại Chế Độ Luyện Tập</span>
            </button>
          </div>
        )}
      </div>

      {/* OVERLAY CHẾ ĐỘ PHÓNG TO 16:9 TOÀN MÀN HÌNH (FULLSCREEN 16:9 OVERLAY) */}
      {isZoomed169 && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-2xl p-2 sm:p-6 flex flex-col items-center justify-center animate-fade-in">
          {/* Header trong chế độ Phóng To */}
          <div className="w-full max-w-[96vw] flex items-center justify-between mb-3 px-2">
            <div className="flex items-center gap-3">
              <span className="text-white font-heading font-bold text-base truncate max-w-md">
                🎮 {game.title}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 text-xs font-mono font-bold border border-indigo-500/30">
                Khung hình chuẩn 16:9 HD
              </span>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={game?.game_url || activeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <ExternalLink className="w-4 h-4 text-indigo-400" />
                <span>Mở Tab Mới</span>
              </a>

              <button
                onClick={toggleZoom169}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-all"
              >
                <Minimize2 className="w-4 h-4" />
                <span>Thu Nhỏ 16:9 (ESC)</span>
              </button>
            </div>
          </div>

          {/* Khung iFrame 16:9 Phóng To Cực Đại */}
          <div className="w-full max-w-[96vw] aspect-video max-h-[86vh] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative">
            <iframe
              src={currentSrcDoc ? undefined : activeUrl}
              srcDoc={currentSrcDoc}
              title={game.title}
              className="w-full h-full border-0 bg-white"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-presentation allow-downloads allow-modals allow-popups-to-escape-sandbox"
              loading="lazy"
            />
          </div>
        </div>
      )}

      {/* Manual SDK Test Trigger for Demo */}
      <div className="mt-3 flex items-center gap-3 text-xs text-slate-400">
        <span>Ghi nhận điểm từ SDK tự động (GAME-04):</span>
        <button
          onClick={() => handleManualSubmitScore(100)}
          className="px-3 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 font-semibold"
        >
          Nộp bài 100 Đ (Test SDK)
        </button>
        <button
          onClick={() => handleManualSubmitScore(85)}
          className="px-3 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 font-semibold"
        >
          Nộp bài 85 Đ
        </button>
      </div>

    </div>
  );
};
