-- Health Monitoring System for Enhanced Fasting
-- Vital signs tracking during fasting sessions
CREATE TABLE fasting_vital_signs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES fasting_sessions(id) ON DELETE CASCADE,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    hours_into_fast DECIMAL(5,2),
    
    -- Core vital signs
    glucose_level INTEGER, -- mg/dL
    heart_rate INTEGER, -- BPM
    blood_pressure_systolic INTEGER, -- mmHg
    blood_pressure_diastolic INTEGER, -- mmHg
    oxygen_saturation DECIMAL(4,1), -- %
    body_temperature DECIMAL(4,1), -- Fahrenheit
    
    -- Subjective measures
    energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 10),
    hydration_level INTEGER CHECK (hydration_level BETWEEN 1 AND 10),
    hunger_level INTEGER CHECK (hunger_level BETWEEN 1 AND 10),
    mood_level INTEGER CHECK (mood_level BETWEEN 1 AND 10),
    
    -- Symptoms and notes
    symptoms JSONB, -- Array of symptom strings
    notes TEXT,
    
    -- Device/source information
    data_source VARCHAR(50), -- 'manual', 'cgm', 'wearable', 'bp_monitor'
    device_id VARCHAR(100),
    
    -- AI analysis
    ai_risk_score INTEGER CHECK (ai_risk_score BETWEEN 0 AND 100),
    ai_recommendations JSONB,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Emergency events during fasting
CREATE TABLE fasting_emergency_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES fasting_sessions(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL, -- 'critical_glucose', 'severe_symptoms', 'vital_signs_emergency'
    severity VARCHAR(20) NOT NULL, -- 'low', 'medium', 'high', 'critical'
    
    -- Event details
    indicators JSONB, -- Array of specific indicators that triggered the emergency
    vital_signs_at_event JSONB, -- Snapshot of vital signs when emergency was detected
    symptoms_at_event JSONB, -- Symptoms present during emergency
    
    -- Response and outcome
    recommended_action VARCHAR(100), -- 'break_fast', 'seek_medical_attention', 'call_emergency_services'
    action_taken VARCHAR(100), -- What the user actually did
    outcome VARCHAR(50), -- 'resolved', 'ongoing', 'escalated'
    
    -- Timing
    detected_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE,
    
    -- Follow-up
    medical_consultation BOOLEAN DEFAULT FALSE,
    healthcare_provider_notified BOOLEAN DEFAULT FALSE,
    notes TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Health monitoring alerts and notifications
CREATE TABLE fasting_health_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_id UUID REFERENCES fasting_sessions(id) ON DELETE CASCADE,
    
    alert_type VARCHAR(50) NOT NULL, -- 'glucose_trend', 'vital_signs', 'symptom_pattern', 'risk_increase'
    priority VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
    
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    
    -- Alert triggers
    triggered_by JSONB, -- What data/conditions triggered this alert
    threshold_values JSONB, -- The threshold values that were exceeded
    
    -- User interaction
    viewed_at TIMESTAMP,
    acknowledged_at TIMESTAMP,
    dismissed_at TIMESTAMP,
    action_taken VARCHAR(100),
    
    -- Alert lifecycle
    expires_at TIMESTAMP,
    auto_resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Wearable device integration
CREATE TABLE fasting_device_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_id UUID REFERENCES fasting_sessions(id) ON DELETE CASCADE,
    
    device_type VARCHAR(50) NOT NULL, -- 'cgm', 'fitness_tracker', 'smart_watch', 'bp_monitor'
    device_brand VARCHAR(50), -- 'Dexcom', 'Apple', 'Fitbit', 'Garmin', etc.
    device_model VARCHAR(100),
    
    -- Data payload
    data_type VARCHAR(50), -- 'glucose', 'heart_rate', 'steps', 'sleep', 'hrv'
    raw_data JSONB, -- Raw data from device
    processed_data JSONB, -- Processed/normalized data
    
    -- Timing and sync
    device_timestamp TIMESTAMP WITH TIME ZONE,
    sync_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Data quality
    data_quality_score INTEGER CHECK (data_quality_score BETWEEN 0 AND 100),
    anomalies_detected JSONB,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Health monitoring configuration per user
CREATE TABLE fasting_monitoring_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Monitoring preferences
    glucose_monitoring_enabled BOOLEAN DEFAULT TRUE,
    heart_rate_monitoring_enabled BOOLEAN DEFAULT TRUE,
    blood_pressure_monitoring_enabled BOOLEAN DEFAULT FALSE,
    symptom_tracking_enabled BOOLEAN DEFAULT TRUE,
    
    -- Alert thresholds (personalized)
    glucose_low_threshold INTEGER DEFAULT 70,
    glucose_high_threshold INTEGER DEFAULT 180,
    heart_rate_low_threshold INTEGER DEFAULT 50,
    heart_rate_high_threshold INTEGER DEFAULT 120,
    
    -- Monitoring frequency
    vital_signs_frequency_minutes INTEGER DEFAULT 120, -- Every 2 hours
    glucose_frequency_minutes INTEGER DEFAULT 240, -- Every 4 hours
    symptom_check_frequency_minutes INTEGER DEFAULT 180, -- Every 3 hours
    
    -- Emergency contacts
    emergency_contacts JSONB, -- Array of emergency contact information
    healthcare_provider JSONB, -- Primary healthcare provider info
    
    -- Notification preferences
    push_notifications_enabled BOOLEAN DEFAULT TRUE,
    email_notifications_enabled BOOLEAN DEFAULT FALSE,
    sms_notifications_enabled BOOLEAN DEFAULT FALSE,
    
    -- AI preferences
    ai_coaching_enabled BOOLEAN DEFAULT TRUE,
    ai_risk_assessment_enabled BOOLEAN DEFAULT TRUE,
    ai_intervention_threshold VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high'
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_fasting_vital_signs_session ON fasting_vital_signs(session_id, recorded_at);
CREATE INDEX idx_fasting_vital_signs_glucose ON fasting_vital_signs(glucose_level, recorded_at);
CREATE INDEX idx_fasting_emergency_events_session ON fasting_emergency_events(session_id, detected_at);
CREATE INDEX idx_fasting_health_alerts_user ON fasting_health_alerts(user_id, priority, created_at);
CREATE INDEX idx_fasting_device_data_user_session ON fasting_device_data(user_id, session_id, device_timestamp);
CREATE INDEX idx_fasting_monitoring_config_user ON fasting_monitoring_config(user_id);

-- Row Level Security
ALTER TABLE fasting_vital_signs ENABLE ROW LEVEL SECURITY;
ALTER TABLE fasting_emergency_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE fasting_health_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE fasting_device_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE fasting_monitoring_config ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own vital signs" ON fasting_vital_signs
    FOR ALL USING (session_id IN (SELECT id FROM fasting_sessions WHERE user_id = auth.uid()));

CREATE POLICY "Users can view their own emergency events" ON fasting_emergency_events
    FOR ALL USING (session_id IN (SELECT id FROM fasting_sessions WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage their own health alerts" ON fasting_health_alerts
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own device data" ON fasting_device_data
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own monitoring config" ON fasting_monitoring_config
    FOR ALL USING (user_id = auth.uid());

-- Functions for health monitoring
CREATE OR REPLACE FUNCTION calculate_health_risk_score(
    glucose INTEGER,
    heart_rate INTEGER,
    bp_systolic INTEGER,
    bp_diastolic INTEGER,
    energy_level INTEGER,
    symptoms TEXT[]
)
RETURNS INTEGER AS $$
DECLARE
    risk_score INTEGER := 0;
BEGIN
    -- Glucose risk factors
    IF glucose IS NOT NULL THEN
        IF glucose < 60 THEN risk_score := risk_score + 8;
        ELSIF glucose < 70 THEN risk_score := risk_score + 5;
        ELSIF glucose > 250 THEN risk_score := risk_score + 6;
        END IF;
    END IF;
    
    -- Heart rate risk factors
    IF heart_rate IS NOT NULL THEN
        IF heart_rate < 50 THEN risk_score := risk_score + 4;
        ELSIF heart_rate > 120 THEN risk_score := risk_score + 3;
        END IF;
    END IF;
    
    -- Blood pressure risk factors
    IF bp_systolic IS NOT NULL AND bp_diastolic IS NOT NULL THEN
        IF bp_systolic < 90 OR bp_diastolic < 60 THEN risk_score := risk_score + 5;
        ELSIF bp_systolic > 180 OR bp_diastolic > 110 THEN risk_score := risk_score + 4;
        END IF;
    END IF;
    
    -- Energy level risk
    IF energy_level IS NOT NULL AND energy_level < 3 THEN
        risk_score := risk_score + 3;
    END IF;
    
    -- Symptom risk factors
    IF symptoms IS NOT NULL THEN
        IF 'severe_dizziness' = ANY(symptoms) OR 'chest_pain' = ANY(symptoms) THEN
            risk_score := risk_score + 6;
        END IF;
    END IF;
    
    RETURN LEAST(risk_score, 100); -- Cap at 100
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION detect_emergency_conditions(
    glucose INTEGER,
    heart_rate INTEGER,
    bp_systolic INTEGER,
    symptoms TEXT[]
)
RETURNS BOOLEAN AS $$
BEGIN
    -- Critical glucose levels
    IF glucose IS NOT NULL AND (glucose < 50 OR glucose > 300) THEN
        RETURN TRUE;
    END IF;
    
    -- Critical heart rate
    IF heart_rate IS NOT NULL AND (heart_rate < 40 OR heart_rate > 150) THEN
        RETURN TRUE;
    END IF;
    
    -- Critical blood pressure
    IF bp_systolic IS NOT NULL AND (bp_systolic < 80 OR bp_systolic > 200) THEN
        RETURN TRUE;
    END IF;
    
    -- Critical symptoms
    IF symptoms IS NOT NULL AND (
        'chest_pain' = ANY(symptoms) OR 
        'difficulty_breathing' = ANY(symptoms) OR
        'loss_of_consciousness' = ANY(symptoms)
    ) THEN
        RETURN TRUE;
    END IF;
    
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql;
