import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, RotateCcw, Trophy, Star, ShieldCheck, Heart, Sparkles, ExternalLink, Maximize2 } from 'lucide-react';
import { useGames } from '../hooks/useGames';
import { useProgress } from '../hooks/useProgress';
import { GameIframeSandbox } from '../components/game/GameIframeSandbox';
import { BuiltinMemoryGame } from '../components/game/BuiltinMemoryGame';
import { BuiltinWordSearch } from '../components/game/BuiltinWordSearch';
import { BuiltinLuckyWheel } from '../components/game/BuiltinLuckyWheel';
import { RatingModal } from '../components/common/RatingModal';
import { soundFx } from '../lib/soundFx';

export const GamePlayPage = () => {
  const { gameId } = useParams();
  const { games, loading } = useGames();
  const { saveProgress, submitFeedback } = useProgress();

  const [isPractice, setIsPractice] = useState(false);
  const [isRatingOpen, setIsRatingOpen] = useState(false);
  const [completedStats, setCompletedStats] = useState(null);

  const currentGame = games.find(g => String(g.id) === String(gameId)) || (games.length > 0 ? games[0] : null);

  const handleGameCompletion = async ({ score, timeSeconds }) => {
    if (!currentGame) return;
    soundFx.play('victory');
    const result = await saveProgress({
      gameId: currentGame.id,
      score,
      completionTimeSeconds: timeSeconds,
      isPractice
    });

    setCompletedStats({ score, timeSeconds, result });
    setIsRatingOpen(true);
  };

  const handleRatingSubmit = async ({ rating, comment }) => {
    if (!currentGame) return;
    await submitFeedback(currentGame.id, rating, comment);
  };

  if (loading && !currentGame) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin mb-4"></div>
        <p className="text-sm font-bold text-slate-300">Đang nạp dữ liệu trò chơi học tập...</p>
      </div>
    );
  }

  if (!currentGame) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <p className="text-slate-400 mb-4 font-semibold">Không tìm thấy trò chơi học tập này.</p>
        <Link to="/" className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30">
          Quay Lại Kho Game
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            onClick={() => soundFx.play('click')}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30">
                Lớp {currentGame.grade_level} • {currentGame.subject}
              </span>
            </div>
            <h1 className="text-lg font-heading font-bold text-white mt-0.5">
              {currentGame.title}
            </h1>
          </div>
        </div>

        {/* Mode Selector Toggle (GAME-08) & Standalone New Tab & Fullscreen Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => {
              soundFx.play('click');
              const elem = document.documentElement;
              if (!document.fullscreenElement) {
                if (elem.requestFullscreen) elem.requestFullscreen();
              } else {
                if (document.exitFullscreen) document.exitFullscreen();
              }
            }}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-1.5"
            title="Bật / Thoát chế độ Toàn Màn Hình"
          >
            <Maximize2 className="w-3.5 h-3.5 text-emerald-200" />
            <span>🖥️ Full Màn Hình</span>
          </button>

          <a
            href={`/play/${currentGame.id}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundFx.play('click')}
            className="px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 text-xs font-bold transition-all flex items-center gap-1.5"
            title="Mở trò chơi trong cửa sổ độc lập mới"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Mở Tab Độc Lập</span>
          </a>

          <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold flex-1 sm:flex-initial">
            <button
              onClick={() => {
                soundFx.play('click');
                setIsPractice(false);
              }}
              className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg transition-all ${
                !isPractice
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Chơi Tính Điểm
            </button>

            <button
              onClick={() => {
                soundFx.play('click');
                setIsPractice(true);
              }}
              className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 ${
                isPractice
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Luyện Tập</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Game Play Arena */}
      <div className="w-full">
        {currentGame.game_type === 'builtin_memory' ? (
          <BuiltinMemoryGame
            config={currentGame.config}
            isPractice={isPractice}
            onComplete={handleGameCompletion}
          />
        ) : currentGame.game_type === 'builtin_wordsearch' ? (
          <BuiltinWordSearch
            config={currentGame.config}
            isPractice={isPractice}
            onComplete={handleGameCompletion}
          />
        ) : currentGame.game_type === 'builtin_wheel' ? (
          <BuiltinLuckyWheel
            config={currentGame.config}
            isPractice={isPractice}
            onComplete={handleGameCompletion}
          />
        ) : (
          <GameIframeSandbox
            game={currentGame}
            isPractice={isPractice}
            onComplete={handleGameCompletion}
          />
        )}
      </div>

      {/* Rating & Feedback Modal (GAME-10) */}
      <RatingModal
        isOpen={isRatingOpen}
        onClose={() => setIsRatingOpen(false)}
        onSubmit={handleRatingSubmit}
        gameTitle={currentGame.title}
      />

    </div>
  );
};
