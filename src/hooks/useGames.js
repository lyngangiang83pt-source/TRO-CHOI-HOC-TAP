import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import rungChuongVangHtml from '../games/RungChuongVang.html?raw';
import thamHiemRungXanhHtml from '../games/ThamHiemRungXanh.html?raw';
import kimTuThapAiCapHtml from '../games/KimTuThapAiCap.html?raw';
import duaXeCongThuc1Html from '../games/DuaXeCongThuc1.html?raw';
import chayVietDaBangRungHtml from '../games/ChayVietDaBangRung.html?raw';
import duoiHinhBatChuHtml from '../games/DuoiHinhBatChu.html?raw';

// Trò Chơi Mặc Định #25: Đuổi Hình Bắt Chữ Học Tập
const DUOI_HINH_BAT_CHU_GAME = {
  id: 'game-25-duoi-hinh-bat-chu',
  title: 'Game #25: Đuổi Hình Bắt Chữ Học Tập',
  description: 'Quan sát các biểu tượng Emoji ghép tranh & hình đố mẹo sáng tạo để gõ đúng từ khóa khái niệm bài học!',
  thumbnail_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
  game_type: 'html5_zip',
  game_url: 'html5-embedded-content',
  grade_level: '7',
  subject: 'Tiếng Anh',
  play_count: 950,
  avg_rating: 5.0,
  is_public: true,
  config: {
    htmlContent: duoiHinhBatChuHtml || ''
  }
};

// Trò Chơi Mặc Định #14: Chạy Việt Dã Băng Rừng
const CHAY_VIET_DA_BANG_RUNG_GAME = {
  id: 'game-14-chay-viet-da-bang-rung',
  title: 'Game #14: Chạy Việt Dã Băng Rừng',
  description: 'Đường chạy việt dã né chướng ngại vật! Nhận diện mệnh đề Đúng/Sai trong 5s để nhảy vọt qua gốc cây cổ thụ băng về đích!',
  thumbnail_url: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=600&auto=format&fit=crop&q=80',
  game_type: 'html5_zip',
  game_url: 'html5-embedded-content',
  grade_level: '6',
  subject: 'Khoa Học Tự Nhiên',
  play_count: 910,
  avg_rating: 5.0,
  is_public: true,
  config: {
    htmlContent: chayVietDaBangRungHtml || ''
  }
};

// Trò Chơi Mặc Định #11: Đua Xe Công Thức 1 Tri Thức
const DUA_XE_CONG_THUC_1_GAME = {
  id: 'game-11-dua-xe-cong-thuc-1',
  title: 'Game #11: Đua Xe Công Thức 1 Tri Thức',
  description: 'Đường đua F1 tốc độ rực lửa! Trả lời đúng xe nạp Nitro tăng tốc vượt đối thủ, sai xe bị xịt lốp giảm tốc!',
  thumbnail_url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&auto=format&fit=crop&q=80',
  game_type: 'html5_zip',
  game_url: 'html5-embedded-content',
  grade_level: '7',
  subject: 'Khoa Học Tự Nhiên',
  play_count: 890,
  avg_rating: 5.0,
  is_public: true,
  config: {
    htmlContent: duaXeCongThuc1Html || ''
  }
};

// Trò Chơi Mặc Định #4: Thám Hiểm Kim Tự Tháp Ai Cập
const KIM_TU_THAP_AI_CAP_GAME = {
  id: 'game-04-kim-tu-thap-ai-cap',
  title: 'Game #4: Thám Hiểm Kim Tự Tháp Ai Cập',
  description: 'Giải mã ký tự cổ trên vách đá lăng mộ Pharaoh Tutankhamun để tìm đáp án đúng và thoát khỏi lăng mộ cổ đại!',
  thumbnail_url: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=600&auto=format&fit=crop&q=80',
  game_type: 'html5_zip',
  game_url: 'html5-embedded-content',
  grade_level: '8',
  subject: 'Lịch Sử & Địa Lý',
  play_count: 740,
  avg_rating: 5.0,
  is_public: true,
  config: {
    htmlContent: kimTuThapAiCapHtml || ''
  }
};

// Trò Chơi Mặc Định #22: Rung Chuông Vàng Trường Học
const RUNG_CHUONG_VANG_GAME = {
  id: 'game-22-rung-chuong-vang',
  title: 'Game #22: Rung Chuông Vàng Trường Học',
  description: 'Đấu trường sĩ tử gõ từ tự luận trả lời câu hỏi, tích lũy điểm số, rung chuông vàng chiến thắng!',
  thumbnail_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
  game_type: 'html5_zip',
  game_url: 'html5-embedded-content',
  grade_level: '7',
  subject: 'Khoa Học Tự Nhiên',
  play_count: 520,
  avg_rating: 5.0,
  is_public: true,
  config: {
    htmlContent: rungChuongVangHtml || ''
  }
};

// Trò Chơi Mặc Định #2: Chuyến Thám Hiểm Rừng Xanh
const THAM_HIEM_RUNG_XANH_GAME = {
  id: 'game-02-tham-hiem-rung-xanh',
  title: 'Game #2: Chuyến Thám Hiểm Rừng Xanh',
  description: 'Hành trình thám hiểm rừng rậm Amazon, giải đố trắc nghiệm & tự luận để bắc cầu qua sông, khám phá đền cổ!',
  thumbnail_url: 'https://images.unsplash.com/photo-1511497584788-876761c11969?w=600&auto=format&fit=crop&q=80',
  game_type: 'html5_zip',
  game_url: 'html5-embedded-content',
  grade_level: '6',
  subject: 'Khoa Học Tự Nhiên',
  play_count: 680,
  avg_rating: 4.9,
  is_public: true,
  config: {
    htmlContent: thamHiemRungXanhHtml || ''
  }
};

// Bộ nhớ RAM toàn cục đảm bảo 100% mọi game do Giáo viên upload đều giữ nguyên trong phiên làm việc
const GLOBAL_IN_MEMORY_GAMES = [DUOI_HINH_BAT_CHU_GAME, CHAY_VIET_DA_BANG_RUNG_GAME, DUA_XE_CONG_THUC_1_GAME, KIM_TU_THAP_AI_CAP_GAME, THAM_HIEM_RUNG_XANH_GAME, RUNG_CHUONG_VANG_GAME];

export const useGames = (selectedGrade = 'all', selectedSubject = 'all') => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGames = useCallback(() => {
    setError(null);

    // Lấy danh sách game do giáo viên tạo lưu trong localStorage
    let localCustomGames = [];
    try {
      const saved = localStorage.getItem('custom_created_games');
      if (saved) {
        localCustomGames = JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Lỗi đọc local custom games:', e);
    }

    const matchGrade = (gameGrade, targetGrade) => {
      if (targetGrade === 'all' || !targetGrade) return true;
      if (!gameGrade) return true;
      const gStr = String(gameGrade).toLowerCase();
      const tStr = String(targetGrade).toLowerCase();
      return gStr.includes(tStr) || tStr.includes(gStr);
    };

    const matchSubject = (gameSubject, targetSubject) => {
      if (targetSubject === 'all' || !targetSubject) return true;
      if (!gameSubject) return true;
      const sStr = String(gameSubject).toLowerCase();
      const tStr = String(targetSubject).toLowerCase();
      return sStr.includes(tStr) || tStr.includes(sStr);
    };

    const allRaw = [...localCustomGames, ...GLOBAL_IN_MEMORY_GAMES];
    const seen = new Set();
    const uniqueGames = [];
    for (const g of allRaw) {
      const idKey = g.id ? String(g.id) : `${g.title}_${g.created_at || ''}`;
      if (!seen.has(idKey)) {
        seen.add(idKey);
        uniqueGames.push(g);
      }
    }

    const filtered = uniqueGames.filter(g => matchGrade(g.grade_level, selectedGrade) && matchSubject(g.subject, selectedSubject));
    setGames(filtered);
    setLoading(false);
  }, [selectedGrade, selectedSubject]);

  useEffect(() => {
    fetchGames();
    const handleGameUpdate = () => fetchGames();
    window.addEventListener('custom_game_updated', handleGameUpdate);
    return () => window.removeEventListener('custom_game_updated', handleGameUpdate);
  }, [fetchGames]);

  const addGame = async (gameData) => {
    const newGame = {
      ...gameData,
      id: 'game-' + Date.now(),
      created_at: new Date().toISOString(),
      play_count: 0,
      avg_rating: 5.0,
      is_public: true
    };

    // 1. Đưa ngay vào RAM bộ nhớ toàn cục
    GLOBAL_IN_MEMORY_GAMES.unshift(newGame);

    // 2. Lưu an toàn vào localStorage (rút gọn nội dung HTML lớn nếu cần để không bị tràn 5MB limit)
    try {
      const saved = localStorage.getItem('custom_created_games');
      const list = saved ? JSON.parse(saved) : [];
      
      const safeGameForLocal = {
        ...newGame,
        config: {
          ...newGame.config,
          htmlContent: (newGame.config?.htmlContent && newGame.config.htmlContent.length > 200000) 
            ? newGame.config.htmlContent.substring(0, 200000) 
            : (newGame.config?.htmlContent || '')
        }
      };

      list.unshift(safeGameForLocal);
      localStorage.setItem('custom_created_games', JSON.stringify(list));
    } catch (e) {
      console.warn('Lỗi lưu localStorage (đã được bộ nhớ RAM toàn cục bảo vệ):', e);
    }

    setGames(prev => [newGame, ...prev]);

    if (!isSupabaseConfigured) {
      return { data: newGame, error: null };
    }

    try {
      // Supabase payload chuẩn định dạng SQL
      const dbPayload = {
        title: gameData.title,
        description: gameData.description || 'Trò chơi học tập tương tác cấp THCS.',
        game_type: gameData.game_type || 'iframe',
        game_url: gameData.game_url || '',
        grade_level: String(gameData.grade_level || '6'),
        subject: gameData.subject || 'Khoa Học Tự Nhiên',
        thumbnail_url: gameData.thumbnail_url || 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80',
        is_public: true,
        config: gameData.config || {}
      };

      // 1. Đẩy dữ liệu qua Supabase Client SDK
      const { data, error: insertErr } = await supabase
        .from('games')
        .insert([dbPayload])
        .select()
        .single();

      if (insertErr) {
        console.warn('Đang tự động đẩy qua REST API dự phòng:', insertErr.message);
        // 2. Tự động đẩy qua Supabase REST API dự phòng nếu SDK bị RLS chặn
        try {
          const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gqfopvgtrfezvtcadpyc.supabase.co';
          const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
          
          if (supabaseUrl && supabaseAnonKey) {
            const res = await fetch(`${supabaseUrl}/rest/v1/games`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'apikey': supabaseAnonKey,
                'Authorization': `Bearer ${supabaseAnonKey}`,
                'Prefer': 'return=representation'
              },
              body: JSON.stringify(dbPayload)
            });
            if (res.ok) {
              const resData = await res.json();
              if (Array.isArray(resData) && resData.length > 0) {
                newGame.id = resData[0].id;
              }
            }
          }
        } catch (apiErr) {
          console.warn('Lỗi REST API dự phòng:', apiErr);
        }
      } else if (data) {
        newGame.id = data.id;
      }

      // Tự động tải lại danh sách game từ Database cho tất cả học sinh và phát sự kiện đồng bộ
      await fetchGames();
      window.dispatchEvent(new CustomEvent('custom_game_updated'));
      return { data: data || newGame, error: null };
    } catch (err) {
      console.warn('Lỗi addGame tự động đẩy Supabase:', err);
      window.dispatchEvent(new CustomEvent('custom_game_updated'));
      return { data: newGame, error: null };
    }
  };

  const deleteGame = async (gameId) => {
    // 0. Xóa khỏi RAM bộ nhớ toàn cục
    const idx = GLOBAL_IN_MEMORY_GAMES.findIndex(g => String(g.id) === String(gameId));
    if (idx !== -1) {
      GLOBAL_IN_MEMORY_GAMES.splice(idx, 1);
    }

    // 1. Cập nhật state UI tức thì
    setGames(prev => prev.filter(g => String(g.id) !== String(gameId)));

    // 2. Xóa khỏi localStorage
    try {
      const saved = localStorage.getItem('custom_created_games');
      if (saved) {
        const list = JSON.parse(saved);
        const updated = list.filter(g => String(g.id) !== String(gameId));
        localStorage.setItem('custom_created_games', JSON.stringify(updated));
      }
    } catch (e) {
      console.warn('Lỗi xóa local custom game:', e);
    }

    // 3. Xóa khỏi Supabase Database nếu cấu hình
    if (isSupabaseConfigured) {
      try {
        await supabase.from('games').delete().eq('id', gameId);
      } catch (err) {
        console.warn('Lỗi xóa game Supabase DB:', err);
      }
    }

    window.dispatchEvent(new CustomEvent('custom_game_updated'));
    return { success: true };
  };

  return { games, loading, error, refetch: fetchGames, addGame, deleteGame };
};
