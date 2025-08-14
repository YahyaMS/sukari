-- Enhanced Fasting System Tables
CREATE TABLE IF NOT EXISTS fasting_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    fasting_type VARCHAR(20) NOT NULL, -- '16:8', '18:6', '20:4', 'OMAD', 'custom'
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    planned_end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    actual_end_time TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'paused', 'completed', 'broken'
    current_phase VARCHAR(20) DEFAULT 'preparation', -- 'preparation', 'early', 'deep', 'extended', 'refeeding'
    glucose_start INTEGER,
    glucose_end INTEGER,
    weight_start DECIMAL(5,2),
    weight_end DECIMAL(5,2),
    energy_level_start INTEGER CHECK (energy_level_start BETWEEN 1 AND 10),
    energy_level_end INTEGER CHECK (energy_level_end BETWEEN 1 AND 10),
    difficulty_rating INTEGER CHECK (difficulty_rating BETWEEN 1 AND 10),
    notes TEXT,
    ai_recommendations JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fasting_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES fasting_sessions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    log_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    log_type VARCHAR(30) NOT NULL, -- 'symptom', 'glucose', 'hydration', 'energy', 'mood', 'emergency'
    value JSONB NOT NULL, -- Flexible storage for different log types
    ai_response TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fasting_protocols (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    protocol_name VARCHAR(100) NOT NULL,
    fasting_type VARCHAR(20) NOT NULL,
    difficulty_level VARCHAR(20) NOT NULL, -- 'beginner', 'intermediate', 'advanced'
    custom_schedule JSONB, -- For custom fasting schedules
    medical_modifications JSONB, -- Diabetes-specific modifications
    ai_optimizations JSONB, -- AI-suggested optimizations
    success_rate DECIMAL(5,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fasting_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_type VARCHAR(50) NOT NULL,
    achievement_name VARCHAR(100) NOT NULL,
    description TEXT,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    session_id UUID REFERENCES fasting_sessions(id),
    metadata JSONB
);

-- Row Level Security
ALTER TABLE fasting_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE fasting_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE fasting_protocols ENABLE ROW LEVEL SECURITY;
ALTER TABLE fasting_achievements ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own fasting sessions" ON fasting_sessions
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own fasting logs" ON fasting_logs
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own fasting protocols" ON fasting_protocols
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own fasting achievements" ON fasting_achievements
    FOR ALL USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_fasting_sessions_user_id ON fasting_sessions(user_id);
CREATE INDEX idx_fasting_sessions_status ON fasting_sessions(status);
CREATE INDEX idx_fasting_logs_session_id ON fasting_logs(session_id);
CREATE INDEX idx_fasting_logs_user_id ON fasting_logs(user_id);
CREATE INDEX idx_fasting_protocols_user_id ON fasting_protocols(user_id);
