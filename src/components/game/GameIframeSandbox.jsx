import React, { useEffect, useState, useRef } from 'react';
import { ShieldCheck, Timer, RotateCcw, Award, CheckCircle, AlertTriangle } from 'lucide-react';
import { initGameSdkListener, injectGameSdkHelperScript } from '../../lib/gameSdk';
import { soundFx } from '../../lib/soundFx';

export const GameIframeSandbox = ({ game, isPractice = false, onComplete }) => {
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [finalScore, setFinalScore] = useState(null);
  const iframeRef = useRef(null);

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
      <div className="w-full max-w-5xl glass-panel rounded-t-2xl p-3.5 border-b-0 flex items-center justify-between">
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
        </div>

        {/* Live Timer (GAME-05) */}
        <div className="flex items-center gap-2 bg-slate-900/90 px-3.5 py-1.5 rounded-xl border border-slate-800 font-mono text-sm font-bold text-indigo-300">
          <Timer className="w-4 h-4 text-indigo-400 animate-pulse" />
          <span>{formatTime(timerSeconds)}</span>
        </div>
      </div>

      {/* iFrame Container */}
      <div className="w-full max-w-5xl h-[580px] bg-slate-950 rounded-b-2xl overflow-hidden border border-slate-800 shadow-2xl relative">
        <iframe
          ref={iframeRef}
          src={game.game_url || 'https://wordwall.net/embed/play/123456/789'}
          title={game.title}
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          loading="lazy"
        />

        {/* Completion Overlay if completed */}
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
