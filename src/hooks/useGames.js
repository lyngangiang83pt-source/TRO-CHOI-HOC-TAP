import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const SAMPLE_GAMES_MOCK = [
  {
    id: 'game-1',
    title: 'Chinh Phục Nguyên Tử & Phân Tử',
    description: 'Lật thẻ ghép cặp kí hiệu hóa học & nguyên tử khối Khoa Học Tự Nhiên Lớp 7.',
    thumbnail_url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80',
    game_type: 'builtin_memory',
    game_url: '',
    grade_level: '7',
    subject: 'Khoa Học Tự Nhiên',
    play_count: 142,
    avg_rating: 4.9,
    config: {
      pairs: [
        { q: "Hydro (H)", a: "NTK = 1" },
        { q: "Oxy (O)", a: "NTK = 16" },
        { q: "Carbon (C)", a: "NTK = 12" },
        { q: "Nito (N)", a: "NTK = 14" },
        { q: "Natri (Na)", a: "NTK = 23" },
        { q: "Sắt (Fe)", a: "NTK = 56" }
      ]
    }
  },
  {
    id: 'game-2',
    title: 'Giải Mã Từ Vựng Tiếng Anh 8',
    description: 'Tìm kiếm từ vựng Unit 1 - 3 Tiếng Anh Lớp 8 trong ô chữ bí mật.',
    thumbnail_url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80',
    game_type: 'builtin_wordsearch',
    game_url: '',
    grade_level: '8',
    subject: 'Tiếng Anh',
    play_count: 98,
    avg_rating: 4.8,
    config: {
      gridSize: 10,
      words: ["LEISURE", "CRAFT", "COMMUNITY", "HERITAGE", "CUSTOM", "VOLUNTEER"]
    }
  },
  {
    id: 'game-3',
    title: 'Vòng Quay May Mắn Toán 6: Hình Học',
    description: 'Quay bánh xe để trả lời câu hỏi về Hình vuông, Tam giác đều, Hình chữ nhật.',
    thumbnail_url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80',
    game_type: 'builtin_wheel',
    game_url: '',
    grade_level: '6',
    subject: 'Toán Học',
    play_count: 215,
    avg_rating: 5.0,
    config: {
      questions: [
        { q: "Hình nào có 4 cạnh bằng nhau và 4 góc vuông?", a: ["Hình vuông", "Hình chữ nhật", "Hình thoi"], correct: 0 },
        { q: "Tổng 3 góc trong một tam giác bằng bao nhiêu độ?", a: ["90°", "180°", "360°"], correct: 1 },
        { q: "Hình thoi có mấy đường chéo vuông góc với nhau?", a: ["1", "2", "4"], correct: 1 }
      ]
    }
  },
  {
    id: 'game-4',
    title: 'Wordwall: Đấu Trí Lịch Sử Lớp 9',
    description: 'Game trắc nghiệm nhúng Wordwall về các mốc Lịch Sử Việt Nam hiện đại.',
    thumbnail_url: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=600&auto=format&fit=crop&q=80',
    game_type: 'iframe',
    game_url: 'https://wordwall.net/embed/play/123456/789',
    grade_level: '9',
    subject: 'Lịch Sử & Địa Lý',
    play_count: 64,
    avg_rating: 4.7,
    config: {}
  }
];

export const useGames = (selectedGrade = 'all', selectedSubject = 'all') => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGames = useCallback(async () => {
    setLoading(true);
    setError(null);

    // Lấy danh sách game do giáo viên vừa tạo từ localStorage
    let localCustomGames = [];
    try {
      const saved = localStorage.getItem('custom_created_games');
      if (saved) {
        localCustomGames = JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Lỗi đọc local custom games:', e);
    }

    if (!isSupabaseConfigured) {
      setTimeout(() => {
        let combined = [...localCustomGames, ...SAMPLE_GAMES_MOCK];
        if (selectedGrade !== 'all') {
          combined = combined.filter(g => g.grade_level === selectedGrade);
        }
        if (selectedSubject !== 'all') {
          combined = combined.filter(g => g.subject === selectedSubject);
        }
        setGames(combined);
        setLoading(false);
      }, 300);
      return;
    }

    try {
      let query = supabase
        .from('games')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (selectedGrade !== 'all') {
        query = query.eq('grade_level', selectedGrade);
      }
      if (selectedSubject !== 'all') {
        query = query.eq('subject', selectedSubject);
      }

      const { data, error: fetchErr } = await query;

      let baseList = (data && data.length > 0) ? data : SAMPLE_GAMES_MOCK;
      // Gộp các game mới tạo local chưa trùng ID
      const existingIds = new Set(baseList.map(g => g.id));
      const newLocalOnly = localCustomGames.filter(g => !existingIds.has(g.id));
      let combined = [...newLocalOnly, ...baseList];

      if (selectedGrade !== 'all') {
        combined = combined.filter(g => g.grade_level === selectedGrade);
      }
      if (selectedSubject !== 'all') {
        combined = combined.filter(g => g.subject === selectedSubject);
      }

      setGames(combined);
    } catch (err) {
      console.warn('Lấy dữ liệu game từ DB gặp lỗi, chuyển sang dữ liệu mẫu + local:', err.message);
      let combined = [...localCustomGames, ...SAMPLE_GAMES_MOCK];
      if (selectedGrade !== 'all') {
        combined = combined.filter(g => g.grade_level === selectedGrade);
      }
      if (selectedSubject !== 'all') {
        combined = combined.filter(g => g.subject === selectedSubject);
      }
      setGames(combined);
    } finally {
      setLoading(false);
    }
  }, [selectedGrade, selectedSubject]);

  useEffect(() => {
    fetchGames();
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

    // Lưu ngay vào localStorage
    try {
      const saved = localStorage.getItem('custom_created_games');
      const list = saved ? JSON.parse(saved) : [];
      list.unshift(newGame);
      localStorage.setItem('custom_created_games', JSON.stringify(list));
    } catch (e) {
      console.warn('Lỗi lưu local custom game:', e);
    }

    setGames(prev => [newGame, ...prev]);

    if (!isSupabaseConfigured) {
      return { data: newGame, error: null };
    }

    try {
      const { data, error: insertErr } = await supabase
        .from('games')
        .insert([gameData])
        .select()
        .single();

      if (insertErr) {
        console.warn('Lỗi chèn Supabase, đã lưu tạm local:', insertErr.message);
      }
      await fetchGames();
      return { data: data || newGame, error: null };
    } catch (err) {
      console.warn('Lỗi addGame:', err);
      return { data: newGame, error: null };
    }
  };

  return { games, loading, error, refetch: fetchGames, addGame };
};
