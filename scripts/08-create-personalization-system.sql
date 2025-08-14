-- AI Personalization System
-- Tracks user behavior and preferences for personalized experiences

-- User behavior tracking
CREATE TABLE user_behaviors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    action_type VARCHAR(50) NOT NULL, -- 'glucose_log', 'meal_log', 'exercise_log', 'challenge_join', etc.
    context JSONB, -- Additional context about the action
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    session_id VARCHAR(100),
    device_info JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User preferences and personalization settings
CREATE TABLE user_personalization (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    notification_preferences JSONB DEFAULT '{}',
    engagement_style VARCHAR(20) DEFAULT 'balanced', -- 'gentle', 'balanced', 'competitive'
    preferred_challenge_types TEXT[] DEFAULT '{}',
    optimal_notification_times TIME[] DEFAULT '{}',
    motivation_triggers JSONB DEFAULT '{}', -- What motivates this user
    difficulty_preference VARCHAR(20) DEFAULT 'adaptive', -- 'easy', 'medium', 'hard', 'adaptive'
    ai_insights_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Smart nudges and personalized notifications
CREATE TABLE smart_nudges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    nudge_type VARCHAR(50) NOT NULL, -- 'reminder', 'encouragement', 'insight', 'challenge'
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    action_url VARCHAR(500),
    priority INTEGER DEFAULT 1, -- 1-5, higher is more important
    trigger_conditions JSONB, -- Conditions that triggered this nudge
    scheduled_for TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    opened_at TIMESTAMP WITH TIME ZONE,
    acted_on_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'sent', 'opened', 'acted', 'dismissed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Engagement patterns and insights
CREATE TABLE engagement_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    insight_type VARCHAR(50) NOT NULL, -- 'pattern', 'recommendation', 'achievement_prediction'
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    confidence_score DECIMAL(3,2), -- 0.00 to 1.00
    data_points JSONB, -- Supporting data for the insight
    action_recommendations JSONB, -- Suggested actions
    expires_at TIMESTAMP WITH TIME ZONE,
    viewed_at TIMESTAMP WITH TIME ZONE,
    acted_on BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Adaptive difficulty tracking
CREATE TABLE adaptive_difficulty (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    feature_type VARCHAR(50) NOT NULL, -- 'glucose_targets', 'exercise_goals', 'challenges'
    current_difficulty DECIMAL(3,2) DEFAULT 0.5, -- 0.0 to 1.0
    success_rate DECIMAL(3,2), -- Recent success rate
    adjustment_history JSONB, -- History of difficulty adjustments
    last_adjusted TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE user_behaviors ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_personalization ENABLE ROW LEVEL SECURITY;
ALTER TABLE smart_nudges ENABLE ROW LEVEL SECURITY;
ALTER TABLE engagement_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE adaptive_difficulty ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own behavior data" ON user_behaviors FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own behavior data" ON user_behaviors FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own personalization" ON user_personalization FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own nudges" ON smart_nudges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own nudges" ON smart_nudges FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own insights" ON engagement_insights FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own insights" ON engagement_insights FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own difficulty settings" ON adaptive_difficulty FOR ALL USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_user_behaviors_user_timestamp ON user_behaviors(user_id, timestamp DESC);
CREATE INDEX idx_smart_nudges_user_status ON smart_nudges(user_id, status);
CREATE INDEX idx_engagement_insights_user_created ON engagement_insights(user_id, created_at DESC);
