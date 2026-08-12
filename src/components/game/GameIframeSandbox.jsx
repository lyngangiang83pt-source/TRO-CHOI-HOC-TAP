import React, { useEffect, useState, useRef } from 'react';
import { ShieldCheck, Timer, RotateCcw, Award, CheckCircle, AlertTriangle, Maximize2, Minimize2, ZoomIn, ZoomOut, Tv } from 'lucide-react';
import { initGameSdkListener, injectGameSdkHelperScript } from '../../lib/gameSdk';
import { soundFx } from '../../lib/soundFx';

export const GameIframeSandbox = ({ game, isPractice = false, onComplete }) => {
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [finalScore, setFinalScore] = useState(null);
  const [isZoomed169, setIsZoomed169] = useState(false);
  const iframeRef = useRef(null);

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

      {/* iFrame Container - Normal 16:9 View */}
      <div 
        className={`w-full max-w-5xl aspect-video h-[520px] sm:h-[600px] bg-slate-950 rounded-b-2xl overflow-hidden border border-slate-800 shadow-2xl relative transition-all duration-300 ${
          isZoomed169 ? 'hidden' : 'block'
        }`}
      >
        <iframe
          ref={iframeRef}
          src={game.game_url || 'https://wordwall.net/embed/play/123456/789'}
          title={game.title}
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
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

            <button
              onClick={toggleZoom169}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-all"
            >
              <Minimize2 className="w-4 h-4" />
              <span>Thu Nhỏ 16:9 (ESC)</span>
            </button>
          </div>

          {/* Khung iFrame 16:9 Phóng To Cực Đại */}
          <div className="w-full max-w-[96vw] aspect-video max-h-[86vh] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative">
            <iframe
              src={game.game_url || 'https://wordwall.net/embed/play/123456/789'}
              title={game.title}
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
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
