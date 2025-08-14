-- Create notifications table
CREATE TABLE public.notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    content TEXT,
    type VARCHAR(50) NOT NULL CHECK (type IN ('health_alert', 'coach_message', 'community_update', 'ai_insight', 'medication_reminder', 'appointment', 'system')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    is_read BOOLEAN DEFAULT false,
    action_url TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Create user goals table
CREATE TABLE public.user_goals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    goal_type VARCHAR(50) NOT NULL CHECK (goal_type IN ('weight_loss', 'glucose_control', 'exercise', 'medication_adherence', 'custom')),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    target_value DECIMAL(10,2),
    current_value DECIMAL(10,2) DEFAULT 0,
    unit VARCHAR(20),
    target_date DATE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create achievements table
CREATE TABLE public.achievements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    icon_url TEXT,
    points INTEGER DEFAULT 0,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

-- Create community posts table
CREATE TABLE public.community_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    group_id UUID REFERENCES public.support_groups(id),
    title VARCHAR(300),
    content TEXT NOT NULL,
    post_type VARCHAR(20) DEFAULT 'discussion' CHECK (post_type IN ('discussion', 'success_story', 'question', 'tip', 'announcement')),
    attachments JSONB DEFAULT '[]',
    likes_count INTEGER DEFAULT 0,
    replies_count INTEGER DEFAULT 0,
    is_pinned BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create post reactions table
CREATE TABLE public.post_reactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE,
    reaction_type VARCHAR(20) NOT NULL CHECK (reaction_type IN ('like', 'love', 'helpful', 'inspiring')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, post_id, reaction_type)
);

-- Create post replies table
CREATE TABLE public.post_replies (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    reply_to_id UUID REFERENCES public.post_replies(id),
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_replies ENABLE ROW LEVEL SECURITY;

-- Create policies for notifications
CREATE POLICY "Users can manage own notifications" ON public.notifications
    FOR ALL USING (auth.uid() = user_id);

-- Create policies for user goals
CREATE POLICY "Users can manage own goals" ON public.user_goals
    FOR ALL USING (auth.uid() = user_id);

-- Create policies for achievements
CREATE POLICY "Users can view own achievements" ON public.achievements
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can create achievements" ON public.achievements
    FOR INSERT WITH CHECK (true); -- Allow system to create achievements

-- Create policies for community posts
CREATE POLICY "Users can view posts in their groups" ON public.community_posts
    FOR SELECT USING (
        group_id IS NULL OR -- Public posts
        auth.uid() IN (
            SELECT user_id FROM public.group_memberships 
            WHERE group_id = community_posts.group_id AND is_active = true
        )
    );

CREATE POLICY "Users can create posts" ON public.community_posts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts" ON public.community_posts
    FOR UPDATE USING (auth.uid() = user_id);

-- Create policies for post reactions
CREATE POLICY "Users can manage own reactions" ON public.post_reactions
    FOR ALL USING (auth.uid() = user_id);

-- Create policies for post replies
CREATE POLICY "Users can view replies to visible posts" ON public.post_replies
    FOR SELECT USING (
        post_id IN (
            SELECT id FROM public.community_posts 
            WHERE group_id IS NULL OR 
            auth.uid() IN (
                SELECT user_id FROM public.group_memberships 
                WHERE group_id = community_posts.group_id AND is_active = true
            )
        )
    );

CREATE POLICY "Users can create replies" ON public.post_replies
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own replies" ON public.post_replies
    FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_notifications_user_created ON public.notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_unread ON public.notifications(user_id, is_read, created_at DESC);
CREATE INDEX idx_user_goals_user_status ON public.user_goals(user_id, status);
CREATE INDEX idx_achievements_user_earned ON public.achievements(user_id, earned_at DESC);
CREATE INDEX idx_community_posts_group_created ON public.community_posts(group_id, created_at DESC);
CREATE INDEX idx_community_posts_featured ON public.community_posts(is_featured, created_at DESC) WHERE is_featured = true;
CREATE INDEX idx_post_reactions_post ON public.post_reactions(post_id, reaction_type);
CREATE INDEX idx_post_replies_post_created ON public.post_replies(post_id, created_at DESC);
