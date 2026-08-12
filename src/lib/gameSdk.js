/**
 * Game SDK - JavaScript SDK kết nối giữa HTML5 Game / iFrame và Hệ Thống Kho Trò Chơi Cấp 2
 * Cho phép Game gửi điểm số, thời gian hoàn thành về ứng dụng chính (GAME-04).
 */

export const GAME_SDK_EVENT_TYPE = 'GAME_SCORE_REPORT';

export const initGameSdkListener = (onScoreReport) => {
  const handleMessage = (event) => {
    // Kiểm tra thông điệp từ Game iFrame
    if (event.data && event.data.type === GAME_SDK_EVENT_TYPE) {
      const { score, timeSeconds, status = 'completed' } = event.data;
      if (typeof onScoreReport === 'function') {
        onScoreReport({
          score: Math.min(100, Math.max(0, Number(score) || 0)),
          timeSeconds: Math.max(1, Number(timeSeconds) || 1),
          status
        });
      }
    }
  };

  window.addEventListener('message', handleMessage);
  return () => window.removeEventListener('message', handleMessage);
};

// Hàm hỗ trợ cho nhà phát triển tạo Game HTML5 dễ dàng gửi điểm
export const injectGameSdkHelperScript = `
  window.KhoTroChoiSDK = {
    submitScore: function(score, timeSeconds) {
      window.parent.postMessage({
        type: '${GAME_SDK_EVENT_TYPE}',
        score: score,
        timeSeconds: timeSeconds,
        status: 'completed'
      }, '*');
    }
  };
`;
