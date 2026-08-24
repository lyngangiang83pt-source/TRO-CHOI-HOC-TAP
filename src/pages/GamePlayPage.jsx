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
      
      {/* Top Header Controls - NỀN XANH LÁ CÂY TƯƠI MÁT */}
      <div 
        style={{
          background: 'linear-gradient(135deg, #065F46 0%, #059669 50%, #047857 100%)',
          border: '2px solid #34D399',
          boxShadow: '0 10px 20px -5px rgba(5, 150, 105, 0.35)'
        }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl text-white shadow-xl"
      >
        <div className="flex items-center gap-3">
          <Link
            to="/"
            onClick={() => soundFx.play('click')}
            style={{ background: '#FEF08A', color: '#1E3A8A', border: '2px solid #FACC15' }}
            className="p-2 rounded-xl text-xs font-black shadow-md hover:opacity-90 transition-opacity"
            title="Quay về Kho Game"
          >
            <ArrowLeft className="w-5 h-5 text-emerald-950 font-black" />
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <span 
                style={{ background: 'rgba(255, 255, 255, 0.25)', border: '1px solid rgba(255, 255, 255, 0.4)' }}
                className="px-2.5 py-0.5 rounded-md text-amber-200 text-[10px] font-black uppercase tracking-wider backdrop-blur-md"
              >
                Lớp {currentGame.grade_level} • {currentGame.subject}
              </span>
            </div>
            <h1 className="text-lg font-heading font-black text-white mt-0.5 drop-shadow-sm">
              {currentGame.title}
            </h1>
          </div>
        </div>

        {/* Mode Selector Toggle & Buttons */}
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
            style={{ background: '#FBBF24', color: '#451A03', border: '2px solid #FDE047' }}
            className="px-3.5 py-1.5 rounded-xl font-black text-xs shadow-md transition-all flex items-center gap-1.5 hover:scale-105"
            title="Bật / Thoát chế độ Toàn Màn Hình"
          >
            <Maximize2 className="w-3.5 h-3.5 text-amber-950" />
            <span>🖥️ Full Màn Hình</span>
          </button>

          <a
            href={`/play/${currentGame.id}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundFx.play('click')}
            style={{ background: 'rgba(255, 255, 255, 0.2)', border: '1px solid rgba(255, 255, 255, 0.3)', color: '#FFFFFF' }}
            className="px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 hover:bg-white/30"
            title="Mở trò chơi trong cửa sổ độc lập mới"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
            <span>Mở Tab Độc Lập</span>
          </a>

          <div 
            style={{ background: 'rgba(0, 0, 0, 0.25)', border: '1px solid rgba(255, 255, 255, 0.2)' }}
            className="flex items-center gap-1 p-1 rounded-xl text-xs font-black flex-1 sm:flex-initial"
          >
            <button
              onClick={() => {
                soundFx.play('click');
                setIsPractice(false);
              }}
              style={
                !isPractice
                  ? { background: '#FEF08A', color: '#064E3B', border: '2px solid #FACC15' }
                  : { background: 'transparent', color: '#D1FAE5' }
              }
              className="px-3 py-1 rounded-lg transition-all font-black"
            >
              🏆 Tính EXP
            </button>
            <button
              onClick={() => {
                soundFx.play('click');
                setIsPractice(true);
              }}
              style={
                isPractice
                  ? { background: '#FEF08A', color: '#064E3B', border: '2px solid #FACC15' }
                  : { background: 'transparent', color: '#D1FAE5' }
              }
              className="px-3 py-1 rounded-lg transition-all font-black"
            >
              🎮 Luyện Tập
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
