-- Enhanced Fasting System with AI Capabilities
-- Drop existing tables if they exist
DROP TABLE IF EXISTS fasting_sessions CASCADE;
DROP TABLE IF EXISTS fasting_phases CASCADE;
DROP TABLE IF EXISTS fasting_symptoms CASCADE;
DROP TABLE IF EXISTS fasting_recommendations CASCADE;
DROP TABLE IF EXISTS fasting_analytics CASCADE;

-- Enhanced fasting sessions table
CREATE TABLE fasting_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    fasting_type VARCHAR(20) NOT NULL, -- '16:8', '18:6', '20:4', 'OMAD', 'custom'
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    planned_end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    actual_end_time TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'completed', 'broken', 'paused'
    current_phase VARCHAR(30) DEFAULT 'preparation', -- 'preparation', 'early', 'deep', 'extended', 'breaking'
    
    -- Health metrics at start
    glucose_start INTEGER,
    weight_start DECIMAL(5,2),
    blood_pressure_start VARCHAR(20),
    energy_level_start INTEGER CHECK (energy_level_start BETWEEN 1 AND 10),
    mood_start INTEGER CHECK (mood_start BETWEEN 1 AND 10),
    
    -- Health metrics at end
    glucose_end INTEGER,
    weight_end DECIMAL(5,2),
    blood_pressure_end VARCHAR(20),
    energy_level_end INTEGER CHECK (energy_level_end BETWEEN 1 AND 10),
    mood_end INTEGER CHECK (mood_end BETWEEN 1 AND 10),
    
    -- AI-generated data
    ai_readiness_score INTEGER CHECK (ai_readiness_score BETWEEN 0 AND 100),
    ai_risk_level VARCHAR(20) DEFAULT 'low', -- 'low', 'medium', 'high', 'critical'
    ai_recommendations JSONB,
    personalized_guidance JSONB,
    
    -- Session outcomes
    success_rating INTEGER CHECK (success_rating BETWEEN 1 AND 10),
    difficulty_rating INTEGER CHECK (difficulty_rating BETWEEN 1 AND 10),
    notes TEXT,
    lessons_learned TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fasting phases tracking
CREATE TABLE fasting_phases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES fasting_sessions(id) ON DELETE CASCADE,
    phase_name VARCHAR(30) NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    duration_minutes INTEGER,
    
    -- Phase-specific metrics
    glucose_readings JSONB, -- Array of {time, value, notes}
    hydration_ml INTEGER DEFAULT 0,
    electrolyte_intake JSONB,
    symptoms_reported JSONB,
    energy_levels JSONB, -- Hourly energy tracking
    
    -- AI guidance for this phase
    ai_guidance JSONB,
    phase_success_score INTEGER CHECK (phase_success_score BETWEEN 0 AND 100),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Symptom tracking during fasting
CREATE TABLE fasting_symptoms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES fasting_sessions(id) ON DELETE CASCADE,
    phase_id UUID REFERENCES fasting_phases(id) ON DELETE CASCADE,
    
    symptom_type VARCHAR(50) NOT NULL, -- 'hunger', 'fatigue', 'headache', 'dizziness', etc.
    severity INTEGER CHECK (severity BETWEEN 1 AND 10),
    duration_minutes INTEGER,
    description TEXT,
    
    -- Context
    hours_into_fast INTEGER,
    glucose_at_time INTEGER,
    hydration_status VARCHAR(20),
    activity_level VARCHAR(20),
    
    -- AI response
    ai_recommendation TEXT,
    intervention_suggested BOOLEAN DEFAULT FALSE,
    intervention_type VARCHAR(50),
    
    reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI-generated recommendations
CREATE TABLE fasting_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_id UUID REFERENCES fasting_sessions(id) ON DELETE CASCADE,
    
    recommendation_type VARCHAR(50) NOT NULL, -- 'schedule', 'nutrition', 'hydration', 'exercise', 'medical'
    priority VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
    
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    action_items JSONB, -- Array of specific actions
    
    -- Personalization factors
    based_on_factors JSONB, -- What data influenced this recommendation
    confidence_score INTEGER CHECK (confidence_score BETWEEN 0 AND 100),
    
    -- User interaction
    viewed_at TIMESTAMP,
    accepted_at TIMESTAMP,
    dismissed_at TIMESTAMP,
    user_feedback INTEGER CHECK (user_feedback BETWEEN 1 AND 5),
    
    -- Effectiveness tracking
    implemented BOOLEAN DEFAULT FALSE,
    outcome_rating INTEGER CHECK (outcome_rating BETWEEN 1 AND 10),
    
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fasting analytics and insights
CREATE TABLE fasting_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    analysis_period VARCHAR(20) NOT NULL, -- 'weekly', 'monthly', 'quarterly'
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    
    -- Success metrics
    total_sessions INTEGER DEFAULT 0,
    completed_sessions INTEGER DEFAULT 0,
    success_rate DECIMAL(5,2),
    average_duration_hours DECIMAL(5,2),
    consistency_score INTEGER CHECK (consistency_score BETWEEN 0 AND 100),
    
    -- Health improvements
    average_glucose_improvement DECIMAL(5,2),
    weight_change_kg DECIMAL(5,2),
    energy_improvement DECIMAL(3,1),
    mood_improvement DECIMAL(3,1),
    
    -- Patterns identified
    optimal_fasting_type VARCHAR(20),
    best_start_times JSONB, -- Array of optimal start times
    challenging_phases JSONB,
    success_factors JSONB,
    risk_factors JSONB,
    
    -- AI insights
    ai_insights JSONB,
    personalized_recommendations JSONB,
    next_period_predictions JSONB,
    
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_fasting_sessions_user_status ON fasting_sessions(user_id, status);
CREATE INDEX idx_fasting_sessions_start_time ON fasting_sessions(start_time);
CREATE INDEX idx_fasting_phases_session ON fasting_phases(session_id);
CREATE INDEX idx_fasting_symptoms_session ON fasting_symptoms(session_id);
CREATE INDEX idx_fasting_recommendations_user ON fasting_recommendations(user_id, priority);
CREATE INDEX idx_fasting_analytics_user_period ON fasting_analytics(user_id, analysis_period);

-- Row Level Security
ALTER TABLE fasting_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE fasting_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE fasting_symptoms ENABLE ROW LEVEL SECURITY;
ALTER TABLE fasting_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE fasting_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own fasting sessions" ON fasting_sessions
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own fasting phases" ON fasting_phases
    FOR ALL USING (session_id IN (SELECT id FROM fasting_sessions WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage their own fasting symptoms" ON fasting_symptoms
    FOR ALL USING (session_id IN (SELECT id FROM fasting_sessions WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage their own fasting recommendations" ON fasting_recommendations
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can view their own fasting analytics" ON fasting_analytics
    FOR ALL USING (user_id = auth.uid());

-- Functions for fasting calculations
CREATE OR REPLACE FUNCTION calculate_fasting_phase(start_time TIMESTAMP WITH TIME ZONE, current_time TIMESTAMP WITH TIME ZONE)
RETURNS TEXT AS $$
DECLARE
    hours_elapsed DECIMAL;
BEGIN
    hours_elapsed := EXTRACT(EPOCH FROM (current_time - start_time)) / 3600;
    
    CASE 
        WHEN hours_elapsed < 2 THEN RETURN 'preparation';
        WHEN hours_elapsed < 6 THEN RETURN 'early';
        WHEN hours_elapsed < 12 THEN RETURN 'adaptation';
        WHEN hours_elapsed < 16 THEN RETURN 'deep';
        WHEN hours_elapsed < 24 THEN RETURN 'extended';
        ELSE RETURN 'therapeutic';
    END CASE;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION calculate_fasting_readiness(
    user_glucose INTEGER,
    last_meal_hours INTEGER,
    sleep_quality INTEGER,
    stress_level INTEGER,
    hydration_level INTEGER
)
RETURNS INTEGER AS $$
DECLARE
    readiness_score INTEGER := 50; -- Base score
BEGIN
    -- Glucose factor (30% weight)
    IF user_glucose BETWEEN 80 AND 120 THEN
        readiness_score := readiness_score + 30;
    ELSIF user_glucose BETWEEN 70 AND 140 THEN
        readiness_score := readiness_score + 20;
    ELSIF user_glucose > 180 OR user_glucose < 60 THEN
        readiness_score := readiness_score - 20;
    END IF;
    
    -- Last meal timing (25% weight)
    IF last_meal_hours >= 4 THEN
        readiness_score := readiness_score + 25;
    ELSIF last_meal_hours >= 2 THEN
        readiness_score := readiness_score + 15;
    ELSE
        readiness_score := readiness_score - 10;
    END IF;
    
    -- Sleep quality (20% weight)
    readiness_score := readiness_score + (sleep_quality * 2);
    
    -- Stress level (15% weight) - lower stress is better
    readiness_score := readiness_score + ((10 - stress_level) * 1.5);
    
    -- Hydration (10% weight)
    readiness_score := readiness_score + hydration_level;
    
    -- Ensure score is within bounds
    IF readiness_score > 100 THEN readiness_score := 100; END IF;
    IF readiness_score < 0 THEN readiness_score := 0; END IF;
    
    RETURN readiness_score;
END;
$$ LANGUAGE plpgsql;
