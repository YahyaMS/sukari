-- Create glucose readings table
CREATE TABLE public.glucose_readings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    value INTEGER NOT NULL CHECK (value > 0 AND value < 1000), -- mg/dL
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    category VARCHAR(20) NOT NULL CHECK (category IN ('fasting', 'pre_meal', 'post_meal', 'bedtime', 'random')),
    notes TEXT,
    symptoms TEXT[],
    meal_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create weight entries table
CREATE TABLE public.weight_entries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    weight_kg DECIMAL(5,2) NOT NULL CHECK (weight_kg > 0),
    body_fat_percentage DECIMAL(4,2) CHECK (body_fat_percentage >= 0 AND body_fat_percentage <= 100),
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    notes TEXT,
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create meals table
CREATE TABLE public.meals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    meal_type VARCHAR(20) NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    foods JSONB DEFAULT '[]',
    total_carbs DECIMAL(8,2) DEFAULT 0,
    total_calories DECIMAL(8,2) DEFAULT 0,
    total_protein DECIMAL(8,2) DEFAULT 0,
    total_fat DECIMAL(8,2) DEFAULT 0,
    total_fiber DECIMAL(8,2) DEFAULT 0,
    photo_url TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create exercise entries table
CREATE TABLE public.exercise_entries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    exercise_type VARCHAR(100) NOT NULL,
    duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
    intensity VARCHAR(20) CHECK (intensity IN ('low', 'moderate', 'high')),
    calories_burned INTEGER,
    notes TEXT,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for all health tracking tables
ALTER TABLE public.glucose_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weight_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_entries ENABLE ROW LEVEL SECURITY;

-- Create policies for glucose_readings
CREATE POLICY "Users can manage own glucose readings" ON public.glucose_readings
    FOR ALL USING (auth.uid() = user_id);

-- Create policies for weight_entries
CREATE POLICY "Users can manage own weight entries" ON public.weight_entries
    FOR ALL USING (auth.uid() = user_id);

-- Create policies for meals
CREATE POLICY "Users can manage own meals" ON public.meals
    FOR ALL USING (auth.uid() = user_id);

-- Create policies for exercise_entries
CREATE POLICY "Users can manage own exercise entries" ON public.exercise_entries
    FOR ALL USING (auth.uid() = user_id);

-- Add foreign key constraint for meal_id in glucose_readings
ALTER TABLE public.glucose_readings 
ADD CONSTRAINT fk_glucose_meal 
FOREIGN KEY (meal_id) REFERENCES public.meals(id) ON DELETE SET NULL;

-- Create indexes for better performance
CREATE INDEX idx_glucose_readings_user_timestamp ON public.glucose_readings(user_id, timestamp DESC);
CREATE INDEX idx_weight_entries_user_timestamp ON public.weight_entries(user_id, timestamp DESC);
CREATE INDEX idx_meals_user_timestamp ON public.meals(user_id, timestamp DESC);
CREATE INDEX idx_exercise_entries_user_timestamp ON public.exercise_entries(user_id, timestamp DESC);
