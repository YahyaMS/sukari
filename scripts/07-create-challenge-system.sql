-- Challenge and Competition System
-- Challenges Table
CREATE TABLE challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    challenge_type VARCHAR(50) NOT NULL CHECK (challenge_type IN (
        'glucose_stability', 'step_master', 'meal_prep', 'exercise_consistency',
        'weight_loss', 'streak_building', 'transformation', 'custom'
    )),
    duration_type VARCHAR(20) NOT NULL CHECK (duration_type IN ('daily', 'weekly', 'monthly', 'seasonal')),
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    max_participants INTEGER,
    reward_hp INTEGER DEFAULT 0,
    reward_badge VARCHAR(100),
    challenge_rules JSONB,
    target_metrics JSONB, -- What needs to be achieved
    is_team_challenge BOOLEAN DEFAULT false,
    is_public BOOLEAN DEFAULT true,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- Challenge Participants
CREATE TABLE challenge_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    team_name VARCHAR(100), -- For team challenges
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    progress JSONB DEFAULT '{}', -- Track progress metrics
    current_score INTEGER DEFAULT 0,
    rank INTEGER,
    completed BOOLEAN DEFAULT false,
    completion_date TIMESTAMP,
    UNIQUE(challenge_id, user_id)
);

-- Challenge Teams (for team challenges)
CREATE TABLE challenge_teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
    team_name VARCHAR(100) NOT NULL,
    team_leader UUID REFERENCES users(id),
    team_score INTEGER DEFAULT 0,
    team_rank INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(challenge_id, team_name)
);

-- Challenge Team Members
CREATE TABLE challenge_team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES challenge_teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    contribution_score INTEGER DEFAULT 0,
    UNIQUE(team_id, user_id)
);

-- Challenge Progress Logs
CREATE TABLE challenge_progress_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    log_date DATE DEFAULT CURRENT_DATE,
    activity_type VARCHAR(50), -- glucose_log, meal_log, exercise_log, etc.
    activity_data JSONB,
    points_earned INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Challenge Leaderboards (materialized view for performance)
CREATE TABLE challenge_leaderboards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    rank INTEGER NOT NULL,
    score INTEGER NOT NULL,
    progress_percentage DECIMAL(5,2) DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(challenge_id, user_id)
);

-- Row Level Security
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_progress_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_leaderboards ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view public challenges" ON challenges 
FOR SELECT USING (is_public = true AND is_active = true);

CREATE POLICY "Users can view their own challenges" ON challenges 
FOR SELECT USING (created_by = auth.uid());

CREATE POLICY "Users can create challenges" ON challenges 
FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can view challenge participants" ON challenge_participants 
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM challenges 
        WHERE challenges.id = challenge_participants.challenge_id 
        AND (challenges.is_public = true OR challenges.created_by = auth.uid())
    )
);

CREATE POLICY "Users can manage their own participation" ON challenge_participants 
FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can view their progress logs" ON challenge_progress_logs 
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their progress logs" ON challenge_progress_logs 
FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Anyone can view public leaderboards" ON challenge_leaderboards 
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM challenges 
        WHERE challenges.id = challenge_leaderboards.challenge_id 
        AND challenges.is_public = true
    )
);

-- Functions for Challenge System
CREATE OR REPLACE FUNCTION join_challenge(
    challenge_id UUID,
    user_id UUID,
    team_name VARCHAR(100) DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    challenge_record RECORD;
    participant_count INTEGER;
BEGIN
    -- Get challenge details
    SELECT * INTO challenge_record FROM challenges WHERE id = challenge_id AND is_active = true;
    
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;
    
    -- Check if challenge is still open
    IF challenge_record.start_date > CURRENT_TIMESTAMP THEN
        RETURN FALSE;
    END IF;
    
    IF challenge_record.end_date < CURRENT_TIMESTAMP THEN
        RETURN FALSE;
    END IF;
    
    -- Check participant limit
    IF challenge_record.max_participants IS NOT NULL THEN
        SELECT COUNT(*) INTO participant_count 
        FROM challenge_participants 
        WHERE challenge_participants.challenge_id = join_challenge.challenge_id;
        
        IF participant_count >= challenge_record.max_participants THEN
            RETURN FALSE;
        END IF;
    END IF;
    
    -- Join the challenge
    INSERT INTO challenge_participants (challenge_id, user_id, team_name)
    VALUES (challenge_id, user_id, team_name)
    ON CONFLICT (challenge_id, user_id) DO NOTHING;
    
    -- Initialize leaderboard entry
    INSERT INTO challenge_leaderboards (challenge_id, user_id, rank, score)
    VALUES (challenge_id, user_id, 999999, 0)
    ON CONFLICT (challenge_id, user_id) DO NOTHING;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION log_challenge_progress(
    challenge_id UUID,
    user_id UUID,
    activity_type VARCHAR(50),
    activity_data JSONB,
    points_earned INTEGER DEFAULT 0
)
RETURNS BOOLEAN AS $$
BEGIN
    -- Insert progress log
    INSERT INTO challenge_progress_logs (challenge_id, user_id, activity_type, activity_data, points_earned)
    VALUES (challenge_id, user_id, activity_type, activity_data, points_earned);
    
    -- Update participant progress
    UPDATE challenge_participants 
    SET 
        progress = COALESCE(progress, '{}'::jsonb) || jsonb_build_object(activity_type, COALESCE((progress->activity_type)::integer, 0) + 1),
        current_score = current_score + points_earned
    WHERE challenge_participants.challenge_id = log_challenge_progress.challenge_id 
    AND challenge_participants.user_id = log_challenge_progress.user_id;
    
    -- Update leaderboard
    UPDATE challenge_leaderboards 
    SET 
        score = score + points_earned,
        last_updated = CURRENT_TIMESTAMP
    WHERE challenge_leaderboards.challenge_id = log_challenge_progress.challenge_id 
    AND challenge_leaderboards.user_id = log_challenge_progress.user_id;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_challenge_rankings(challenge_id UUID)
RETURNS VOID AS $$
BEGIN
    -- Update individual rankings
    WITH ranked_participants AS (
        SELECT 
            user_id,
            score,
            ROW_NUMBER() OVER (ORDER BY score DESC, last_updated ASC) as new_rank
        FROM challenge_leaderboards
        WHERE challenge_leaderboards.challenge_id = update_challenge_rankings.challenge_id
    )
    UPDATE challenge_leaderboards 
    SET rank = ranked_participants.new_rank
    FROM ranked_participants
    WHERE challenge_leaderboards.challenge_id = update_challenge_rankings.challenge_id
    AND challenge_leaderboards.user_id = ranked_participants.user_id;
    
    -- Update participant rankings
    UPDATE challenge_participants 
    SET rank = challenge_leaderboards.rank
    FROM challenge_leaderboards
    WHERE challenge_participants.challenge_id = update_challenge_rankings.challenge_id
    AND challenge_participants.user_id = challenge_leaderboards.user_id;
END;
$$ LANGUAGE plpgsql;

-- Insert default challenges
INSERT INTO challenges (title, description, challenge_type, duration_type, start_date, end_date, max_participants, reward_hp, reward_badge, challenge_rules, target_metrics, is_public) VALUES
(
    'Weekly Glucose Stability Challenge',
    'Keep your glucose readings within target range for 7 consecutive days',
    'glucose_stability',
    'weekly',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP + INTERVAL '7 days',
    100,
    200,
    'Glucose Guardian',
    '{"target_range": {"min": 80, "max": 140}, "required_readings": 21}',
    '{"glucose_in_range": 21, "days_completed": 7}',
    true
),
(
    'Step Master Challenge',
    'Reach your daily step goal for 7 days straight',
    'step_master',
    'weekly',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP + INTERVAL '7 days',
    200,
    150,
    'Step Champion',
    '{"daily_step_goal": 8000, "required_days": 7}',
    '{"steps_completed": 7, "total_steps": 56000}',
    true
),
(
    'Meal Prep Champion',
    'Log home-cooked meals only for one week',
    'meal_prep',
    'weekly',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP + INTERVAL '7 days',
    50,
    250,
    'Chef Master',
    '{"home_cooked_only": true, "required_meals": 21}',
    '{"home_cooked_meals": 21, "days_completed": 7}',
    true
),
(
    'Monthly Transformation Challenge',
    'Complete comprehensive health improvements over 30 days',
    'transformation',
    'monthly',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP + INTERVAL '30 days',
    500,
    1000,
    'Transformation Hero',
    '{"glucose_stability": 0.8, "exercise_consistency": 0.9, "meal_logging": 0.95}',
    '{"glucose_days": 24, "exercise_days": 27, "meal_days": 29}',
    true
);

-- Trigger to automatically update rankings when scores change
CREATE OR REPLACE FUNCTION trigger_update_rankings()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM update_challenge_rankings(NEW.challenge_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_rankings_on_score_change
    AFTER INSERT OR UPDATE OF score ON challenge_leaderboards
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_rankings();
