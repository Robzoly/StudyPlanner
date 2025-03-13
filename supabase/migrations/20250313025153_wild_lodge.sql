/*
  # Add achievements system

  1. New Tables
    - `achievements`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `points` (integer)
      - `icon` (text)
      - `category` (text)
      - `requirements` (jsonb)
      - `created_at` (timestamp)
    - `user_achievements`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `achievement_id` (uuid, references achievements)
      - `unlocked_at` (timestamp)
      - `created_at` (timestamp)

  2. Changes
    - Add `experience` column to profiles table
    - Add `streak_count` column to profiles table
    - Add `last_active_date` column to profiles table

  3. Security
    - Enable RLS on new tables
    - Add policies for authenticated users
*/

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  points integer NOT NULL DEFAULT 0,
  icon text NOT NULL,
  category text NOT NULL,
  requirements jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create user_achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id uuid REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Add new columns to profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'experience'
  ) THEN
    ALTER TABLE profiles ADD COLUMN experience integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'streak_count'
  ) THEN
    ALTER TABLE profiles ADD COLUMN streak_count integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'last_active_date'
  ) THEN
    ALTER TABLE profiles ADD COLUMN last_active_date date DEFAULT CURRENT_DATE;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read achievements"
  ON achievements
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can read own achievements"
  ON user_achievements
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
  ON user_achievements
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Insert initial achievements
INSERT INTO achievements (title, description, points, icon, category, requirements) VALUES
  ('First Task', 'Create your first task', 50, 'Star', 'tasks', '{"tasks_created": 1}'),
  ('Task Master', 'Complete 10 tasks', 100, 'Award', 'tasks', '{"tasks_completed": 10}'),
  ('Early Bird', 'Complete a task before its due date', 75, 'Sun', 'tasks', '{"early_completions": 1}'),
  ('Streak Starter', 'Maintain a 3-day activity streak', 150, 'Flame', 'engagement', '{"streak_days": 3}'),
  ('Organization Pro', 'Create tasks in 3 different categories', 100, 'FolderTree', 'tasks', '{"unique_categories": 3}'),
  ('Priority Manager', 'Complete tasks of all priority levels', 125, 'ListTodo', 'tasks', '{"priority_levels": 3}'),
  ('Study Champion', 'Reach level 5', 200, 'Trophy', 'profile', '{"min_level": 5}'),
  ('Perfect Week', 'Complete all tasks for 7 consecutive days', 300, 'Calendar', 'engagement', '{"perfect_days": 7}')
ON CONFLICT DO NOTHING;