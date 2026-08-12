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

    if (!isSupabaseConfigured) {
      setTimeout(() => {
        let filtered = [...SAMPLE_GAMES_MOCK];
        if (selectedGrade !== 'all') {
          filtered = filtered.filter(g => g.grade_level === selectedGrade);
        }
        if (selectedSubject !== 'all') {
          filtered = filtered.filter(g => g.subject === selectedSubject);
        }
        setGames(filtered);
        setLoading(false);
      }, 500);
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
      if (fetchErr) throw fetchErr;

      setGames(data && data.length > 0 ? data : SAMPLE_GAMES_MOCK);
    } catch (err) {
      console.warn('Lấy dữ liệu game từ DB gặp lỗi, chuyển sang dữ liệu mẫu:', err.message);
      setGames(SAMPLE_GAMES_MOCK);
    } finally {
      setLoading(false);
    }
  }, [selectedGrade, selectedSubject]);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  const addGame = async (gameData) => {
    if (!isSupabaseConfigured) {
      const newGame = {
        ...gameData,
        id: 'game-' + Date.now(),
        play_count: 0,
        avg_rating: 5.0
      };
      setGames(prev => [newGame, ...prev]);
      return { data: newGame, error: null };
    }

    try {
      const { data, error: insertErr } = await supabase
        .from('games')
        .insert([gameData])
        .select()
        .single();

      if (insertErr) throw insertErr;
      await fetchGames();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  };

  return { games, loading, error, refetch: fetchGames, addGame };
};
