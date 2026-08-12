import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const MOCK_LEADERBOARD = [
  { id: '1', full_name: 'Lê Minh Anh', grade_level: '7', total_exp: 3450, rank_tier: 'Kim Cương', avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', games_played: 28 },
  { id: '2', full_name: 'Phạm Đức Bảo', grade_level: '7', total_exp: 2890, rank_tier: 'Vàng', avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', games_played: 24 },
  { id: '3', full_name: 'Nguyễn Thảo Nguyên', grade_level: '8', total_exp: 2410, rank_tier: 'Vàng', avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', games_played: 21 },
  { id: '4', full_name: 'Trần Gia Huy', grade_level: '6', total_exp: 1850, rank_tier: 'Bạc', avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', games_played: 16 },
  { id: '5', full_name: 'Hoàng Hải Yến', grade_level: '9', total_exp: 1520, rank_tier: 'Bạc', avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80', games_played: 14 }
];

export const useLeaderboard = (selectedGrade = 'all') => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      setLoading(true);

      if (!isSupabaseConfigured) {
        setTimeout(() => {
          let data = [...MOCK_LEADERBOARD];
          if (selectedGrade !== 'all') {
            data = data.filter(item => item.grade_level === selectedGrade);
          }
          setLeaderboard(data);
          setLoading(false);
        }, 400);
        return;
      }

      try {
        let query = supabase
          .from('profiles')
          .select('id, full_name, grade_level, total_exp, rank_tier, avatar_url')
          .eq('role', 'student')
          .order('total_exp', { ascending: false })
          .limit(20);

        if (selectedGrade !== 'all') {
          query = query.eq('grade_level', selectedGrade);
        }

        const { data, error } = await query;
        if (error) throw error;
        setLeaderboard(data && data.length > 0 ? data : MOCK_LEADERBOARD);
      } catch (err) {
        console.warn('Lỗi lấy bảng xếp hạng, sử dụng mock:', err.message);
        setLeaderboard(MOCK_LEADERBOARD);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
  }, [selectedGrade]);

  return { leaderboard, loading };
};
