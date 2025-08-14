-- Gamification System Tables
-- Health Points and Leveling System
CREATE TABLE user_gamification (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    health_points INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    total_hp_earned INTEGER DEFAULT 0,
    level_progress INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Streak System
CREATE TABLE streaks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    streak_type VARCHAR(50) NOT NULL,
    current_count INTEGER DEFAULT 0,
    longest_count INTEGER DEFAULT 0,
    last_activity_date DATE,
    freeze_count INTEGER DEFAULT 0,
    max_freezes INTEGER DEFAULT 2,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, streak_type)
);

-- Achievement System
CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    achievement_key VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    badge_icon VARCHAR(50),
    hp_reward INTEGER DEFAULT 0,
    rarity VARCHAR(20) DEFAULT 'common',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    achievement_key VARCHAR(100) REFERENCES achievements(achievement_key),
    progress INTEGER DEFAULT 0,
    target INTEGER DEFAULT 1,
    completed BOOLEAN DEFAULT false,
    unlocked_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, achievement_key)
);

-- Health Points Activity Log
CREATE TABLE hp_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL,
    hp_earned INTEGER NOT NULL,
    description TEXT,
    reference_id UUID, -- Links to glucose_readings, meals, etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default achievements
INSERT INTO achievements (achievement_key, name, description, category, badge_icon, hp_reward, rarity) VALUES
-- Consistency Achievements
('perfect_week', 'Perfect Week', 'Log all data for 7 consecutive days', 'consistency', '🏆', 100, 'uncommon'),
('month_master', 'Month Master', '30-day streak on any activity', 'consistency', '📅', 250, 'rare'),
('century_club', 'Century Club', '100-day overall health streak', 'consistency', '💯', 500, 'epic'),
('never_miss', 'Never Miss', 'Log glucose 50 days straight', 'consistency', '🎯', 300, 'rare'),

-- Improvement Achievements
('glucose_champion', 'Glucose Champion', 'Keep glucose in range for 24 hours', 'improvement', '🩸', 50, 'common'),
('weight_warrior', 'Weight Warrior', 'Lose 5% of starting weight', 'improvement', '⚖️', 200, 'uncommon'),
('hba1c_hero', 'HbA1c Hero', 'Reduce HbA1c by 0.5%', 'improvement', '📊', 500, 'epic'),
('med_reducer', 'Med Reducer', 'Reduce diabetes medication (coach approved)', 'improvement', '💊', 300, 'rare'),

-- Exploration Achievements
('data_detective', 'Data Detective', 'Use all tracking features', 'exploration', '🔍', 100, 'common'),
('recipe_explorer', 'Recipe Explorer', 'Try 20 new healthy recipes', 'exploration', '👨‍🍳', 150, 'uncommon'),
('exercise_experimenter', 'Exercise Experimenter', 'Try 10 different workout types', 'exploration', '🏃‍♂️', 120, 'uncommon'),
('coach_collaborator', 'Coach Collaborator', 'Complete 50 coach assignments', 'exploration', '🤝', 200, 'rare'),

-- Social Achievements
('motivator', 'Motivator', 'Help 5 friends reach their goals', 'social', '💪', 150, 'uncommon'),
('support_star', 'Support Star', 'Give 100 encouragement reactions', 'social', '⭐', 100, 'common'),
('mentor', 'Mentor', 'Guide a new user for 30 days', 'social', '🎓', 300, 'rare');

-- Row Level Security
ALTER TABLE user_gamification ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE hp_activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own gamification data" ON user_gamification FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own gamification data" ON user_gamification FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own gamification data" ON user_gamification FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own streaks" ON streaks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own streaks" ON streaks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own streaks" ON streaks FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own achievements" ON user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own achievements" ON user_achievements FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own achievements" ON user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own HP activities" ON hp_activities FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own HP activities" ON hp_activities FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Public read access for achievements reference table
CREATE POLICY "Anyone can view achievements" ON achievements FOR SELECT USING (true);

-- Functions for gamification
CREATE OR REPLACE FUNCTION initialize_user_gamification(user_id UUID)
RETURNS VOID AS $$
BEGIN
    -- Create gamification profile
    INSERT INTO user_gamification (user_id) VALUES (user_id)
    ON CONFLICT (user_id) DO NOTHING;
    
    -- Initialize streak types
    INSERT INTO streaks (user_id, streak_type) VALUES 
        (user_id, 'glucose_logging'),
        (user_id, 'meal_logging'),
        (user_id, 'exercise_streak'),
        (user_id, 'overall_health')
    ON CONFLICT (user_id, streak_type) DO NOTHING;
    
    -- Initialize achievement progress
    INSERT INTO user_achievements (user_id, achievement_key, target)
    SELECT user_id, achievement_key, 
        CASE 
            WHEN achievement_key = 'perfect_week' THEN 7
            WHEN achievement_key = 'month_master' THEN 30
            WHEN achievement_key = 'century_club' THEN 100
            WHEN achievement_key = 'never_miss' THEN 50
            WHEN achievement_key = 'recipe_explorer' THEN 20
            WHEN achievement_key = 'exercise_experimenter' THEN 10
            WHEN achievement_key = 'coach_collaborator' THEN 50
            WHEN achievement_key = 'motivator' THEN 5
            WHEN achievement_key = 'support_star' THEN 100
            WHEN achievement_key = 'mentor' THEN 30
            ELSE 1
        END as target
    FROM achievements
    ON CONFLICT (user_id, achievement_key) DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- Function to award health points
CREATE OR REPLACE FUNCTION award_health_points(
    user_id UUID,
    activity_type VARCHAR(50),
    hp_amount INTEGER,
    description TEXT DEFAULT NULL,
    reference_id UUID DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
    current_hp INTEGER;
    current_level INTEGER;
    new_level INTEGER;
BEGIN
    -- Insert HP activity
    INSERT INTO hp_activities (user_id, activity_type, hp_earned, description, reference_id)
    VALUES (user_id, activity_type, hp_amount, description, reference_id);
    
    -- Update user gamification
    UPDATE user_gamification 
    SET 
        health_points = health_points + hp_amount,
        total_hp_earned = total_hp_earned + hp_amount,
        updated_at = CURRENT_TIMESTAMP
    WHERE user_gamification.user_id = award_health_points.user_id
    RETURNING health_points, level INTO current_hp, current_level;
    
    -- Calculate new level (every 100 HP = 1 level)
    new_level := GREATEST(1, current_hp / 100 + 1);
    
    -- Update level if changed
    IF new_level > current_level THEN
        UPDATE user_gamification 
        SET level = new_level, level_progress = current_hp % 100
        WHERE user_gamification.user_id = award_health_points.user_id;
    ELSE
        UPDATE user_gamification 
        SET level_progress = current_hp % 100
        WHERE user_gamification.user_id = award_health_points.user_id;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to update streaks
CREATE OR REPLACE FUNCTION update_streak(
    user_id UUID,
    streak_type VARCHAR(50)
)
RETURNS VOID AS $$
DECLARE
    current_streak INTEGER;
    last_date DATE;
BEGIN
    SELECT current_count, last_activity_date 
    INTO current_streak, last_date
    FROM streaks 
    WHERE streaks.user_id = update_streak.user_id 
    AND streaks.streak_type = update_streak.streak_type;
    
    -- If last activity was yesterday, increment streak
    IF last_date = CURRENT_DATE - INTERVAL '1 day' THEN
        UPDATE streaks 
        SET 
            current_count = current_count + 1,
            longest_count = GREATEST(longest_count, current_count + 1),
            last_activity_date = CURRENT_DATE,
            updated_at = CURRENT_TIMESTAMP
        WHERE streaks.user_id = update_streak.user_id 
        AND streaks.streak_type = update_streak.streak_type;
        
        -- Award streak bonus HP
        IF (current_streak + 1) % 7 = 0 THEN
            PERFORM award_health_points(user_id, 'streak_bonus', 50, '7-day streak bonus');
        END IF;
        
    -- If last activity was today, do nothing
    ELSIF last_date = CURRENT_DATE THEN
        RETURN;
        
    -- If last activity was more than 1 day ago, reset streak
    ELSE
        UPDATE streaks 
        SET 
            current_count = 1,
            last_activity_date = CURRENT_DATE,
            updated_at = CURRENT_TIMESTAMP
        WHERE streaks.user_id = update_streak.user_id 
        AND streaks.streak_type = update_streak.streak_type;
    END IF;
END;
$$ LANGUAGE plpgsql;
