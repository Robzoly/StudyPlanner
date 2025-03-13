import { supabase } from './supabase';
import { toast } from 'sonner';

export type Achievement = {
  id: string;
  title: string;
  description: string;
  points: number;
  icon: string;
  category: string;
  requirements: Record<string, any>;
  created_at: string;
};

export type UserAchievement = {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
  created_at: string;
  achievement: Achievement;
};

export async function getAchievements() {
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .order('points', { ascending: true });

  if (error) {
    toast.error('Error fetching achievements');
    return { error };
  }

  return { data, error: null };
}

export async function getUserAchievements() {
  const { data, error } = await supabase
    .from('user_achievements')
    .select(`
      *,
      achievement:achievements(*)
    `)
    .order('unlocked_at', { ascending: false });

  if (error) {
    toast.error('Error fetching user achievements');
    return { error };
  }

  return { data, error: null };
}

export async function unlockAchievement(achievementId: string) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) return { error: userError };

  const { data, error } = await supabase
    .from('user_achievements')
    .insert([
      {
        user_id: userData.user.id,
        achievement_id: achievementId,
      },
    ])
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      // Unique violation - achievement already unlocked
      return { error: null };
    }
    toast.error('Error unlocking achievement');
    return { error };
  }

  toast.success('Achievement unlocked!');
  return { data, error: null };
}

export async function updateUserExperience(points: number) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) return { error: userError };

  const { data, error } = await supabase
    .from('profiles')
    .update({ 
      experience: supabase.rpc('increment_experience', { points_to_add: points }),
      last_active_date: new Date().toISOString()
    })
    .eq('id', userData.user.id)
    .select()
    .single();

  if (error) {
    toast.error('Error updating experience');
    return { error };
  }

  return { data, error: null };
}

export async function updateUserStreak() {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) return { error: userError };

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('last_active_date, streak_count')
    .eq('id', userData.user.id)
    .single();

  if (profileError) return { error: profileError };

  const lastActiveDate = new Date(profile.last_active_date);
  const today = new Date();
  const diffDays = Math.floor((today.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24));

  let newStreak = profile.streak_count;
  if (diffDays === 1) {
    // Consecutive day, increment streak
    newStreak += 1;
  } else if (diffDays > 1) {
    // Streak broken
    newStreak = 1;
  }

  const { data, error } = await supabase
    .from('profiles')
    .update({ 
      streak_count: newStreak,
      last_active_date: today.toISOString()
    })
    .eq('id', userData.user.id)
    .select()
    .single();

  if (error) {
    toast.error('Error updating streak');
    return { error };
  }

  return { data, error: null };
}