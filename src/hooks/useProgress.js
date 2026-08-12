import { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { soundFx } from '../lib/soundFx';

export const useProgress = () => {
  const { profile, refreshProfile } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const saveProgress = async ({
    gameId,
    assignmentId = null,
    score,
    completionTimeSeconds,
    isPractice = false,
    attemptsCount = 1
  }) => {
    setSubmitting(true);
    const expEarned = isPractice ? 0 : Math.round((score / 100) * 100);
    const coinsEarned = isPractice ? 0 : Math.round((score / 100) * 20);

    if (score >= 80) {
      soundFx.play('victory');
    } else {
      soundFx.play('correct');
    }

    if (!isSupabaseConfigured) {
      setTimeout(() => {
        setSubmitting(false);
        if (!isPractice && profile) {
          profile.total_exp = (profile.total_exp || 0) + expEarned;
          profile.coins = (profile.coins || 0) + coinsEarned;
        }
      }, 400);

      return {
        success: true,
        expEarned,
        coinsEarned,
        newTotalExp: (profile?.total_exp || 0) + expEarned
      };
    }

    try {
      const { data, error } = await supabase
        .from('student_progress')
        .insert([{
          game_id: gameId,
          assignment_id: assignmentId,
          student_id: profile.id,
          score,
          exp_earned: expEarned,
          coins_earned: coinsEarned,
          completion_time_seconds: completionTimeSeconds,
          is_practice: isPractice,
          attempts_count: attemptsCount,
          status: 'completed'
        }])
        .select()
        .single();

      if (error) throw error;
      await refreshProfile();
      return { success: true, expEarned, coinsEarned, data };
    } catch (err) {
      console.error('Lưu tiến độ thất bại:', err);
      return { success: false, error: err.message };
    } finally {
      setSubmitting(false);
    }
  };

  const submitFeedback = async (gameId, rating, comment) => {
    if (!isSupabaseConfigured) {
      return { success: true };
    }

    try {
      const { error } = await supabase
        .from('student_progress')
        .update({ feedback_rating: rating, feedback_comment: comment })
        .eq('game_id', gameId)
        .eq('student_id', profile.id);

      if (error) throw error;
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return { saveProgress, submitFeedback, submitting };
};
