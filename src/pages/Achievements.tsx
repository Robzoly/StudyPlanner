import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Trophy, Star, Award, Sun, Flame, FolderTree, ListTodo, Calendar } from 'lucide-react';
import { getAchievements, getUserAchievements, type Achievement, type UserAchievement } from '../lib/achievements';

const ICONS = {
  Star,
  Award,
  Sun,
  Flame,
  FolderTree,
  ListTodo,
  Trophy,
  Calendar,
};

export default function Achievements() {
  const { data: achievements = [] } = useQuery({
    queryKey: ['achievements'],
    queryFn: async () => {
      const { data, error } = await getAchievements();
      if (error) throw error;
      return data;
    },
  });

  const { data: userAchievements = [] } = useQuery({
    queryKey: ['userAchievements'],
    queryFn: async () => {
      const { data, error } = await getUserAchievements();
      if (error) throw error;
      return data;
    },
  });

  const unlockedAchievements = new Set(
    userAchievements.map((ua: UserAchievement) => ua.achievement_id)
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Achievements</h1>
        <div className="text-muted-foreground">
          {unlockedAchievements.size} / {achievements.length} Unlocked
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {achievements.map((achievement: Achievement) => {
          const Icon = ICONS[achievement.icon as keyof typeof ICONS];
          const isUnlocked = unlockedAchievements.has(achievement.id);

          return (
            <div
              key={achievement.id}
              className={`bg-card p-6 rounded-lg border ${
                isUnlocked ? 'border-primary' : 'opacity-75'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`p-2 rounded-lg ${
                    isUnlocked ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex items-center gap-1 text-sm font-medium">
                  <Trophy className="h-4 w-4" />
                  {achievement.points} XP
                </div>
              </div>
              <h3 className="font-semibold mb-1">{achievement.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {achievement.description}
              </p>
              {isUnlocked && (
                <div className="flex items-center gap-2 text-sm text-primary">
                  <Trophy className="h-4 w-4" />
                  Unlocked
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}