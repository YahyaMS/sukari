-- Social Features and Friends System
-- Friends System
CREATE TABLE user_friends (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    friend_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'blocked')),
    requested_by UUID REFERENCES users(id) ON DELETE CASCADE,
    connected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, friend_id),
    CHECK (user_id != friend_id)
);

-- Social Feed Posts
CREATE TABLE social_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    post_type VARCHAR(50) NOT NULL CHECK (post_type IN (
        'achievement_unlock', 'streak_milestone', 'challenge_victory', 
        'meal_photo', 'exercise_completion', 'coach_recognition', 'level_up'
    )),
    content TEXT,
    metadata JSONB, -- Store achievement details, streak info, etc.
    privacy_level VARCHAR(20) DEFAULT 'friends' CHECK (privacy_level IN ('public', 'friends', 'private')),
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Social Reactions
CREATE TABLE social_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES social_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    reaction_type VARCHAR(20) NOT NULL CHECK (reaction_type IN (
        'like', 'fire', 'clap', 'heart', 'strong', 'celebrate'
    )),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(post_id, user_id, reaction_type)
);

-- Social Comments
CREATE TABLE social_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES social_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Friend Activity Feed
CREATE TABLE friend_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL,
    activity_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Privacy Settings
CREATE TABLE user_privacy_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    share_achievements BOOLEAN DEFAULT true,
    share_streaks BOOLEAN DEFAULT true,
    share_progress BOOLEAN DEFAULT false,
    share_glucose_trends BOOLEAN DEFAULT false,
    share_weight_progress BOOLEAN DEFAULT false,
    allow_friend_requests BOOLEAN DEFAULT true,
    show_in_leaderboards BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Row Level Security
ALTER TABLE user_friends ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE friend_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_privacy_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Friends
CREATE POLICY "Users can view their own friend connections" ON user_friends 
FOR SELECT USING (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE POLICY "Users can manage their own friend requests" ON user_friends 
FOR ALL USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- RLS Policies for Social Posts
CREATE POLICY "Users can view public posts" ON social_posts 
FOR SELECT USING (privacy_level = 'public' AND is_visible = true);

CREATE POLICY "Users can view friends' posts" ON social_posts 
FOR SELECT USING (
    privacy_level = 'friends' AND is_visible = true AND (
        auth.uid() = user_id OR 
        EXISTS (
            SELECT 1 FROM user_friends 
            WHERE (user_id = auth.uid() AND friend_id = social_posts.user_id AND status = 'accepted')
            OR (friend_id = auth.uid() AND user_id = social_posts.user_id AND status = 'accepted')
        )
    )
);

CREATE POLICY "Users can view their own posts" ON social_posts 
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own posts" ON social_posts 
FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for Reactions
CREATE POLICY "Users can view reactions on visible posts" ON social_reactions 
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM social_posts 
        WHERE social_posts.id = social_reactions.post_id 
        AND (
            (privacy_level = 'public' AND is_visible = true) OR
            (privacy_level = 'friends' AND is_visible = true AND (
                auth.uid() = social_posts.user_id OR 
                EXISTS (
                    SELECT 1 FROM user_friends 
                    WHERE (user_id = auth.uid() AND friend_id = social_posts.user_id AND status = 'accepted')
                    OR (friend_id = auth.uid() AND user_id = social_posts.user_id AND status = 'accepted')
                )
            )) OR
            auth.uid() = social_posts.user_id
        )
    )
);

CREATE POLICY "Users can manage their own reactions" ON social_reactions 
FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for Comments
CREATE POLICY "Users can view comments on visible posts" ON social_comments 
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM social_posts 
        WHERE social_posts.id = social_comments.post_id 
        AND (
            (privacy_level = 'public' AND is_visible = true) OR
            (privacy_level = 'friends' AND is_visible = true AND (
                auth.uid() = social_posts.user_id OR 
                EXISTS (
                    SELECT 1 FROM user_friends 
                    WHERE (user_id = auth.uid() AND friend_id = social_posts.user_id AND status = 'accepted')
                    OR (friend_id = auth.uid() AND user_id = social_posts.user_id AND status = 'accepted')
                )
            )) OR
            auth.uid() = social_posts.user_id
        )
    )
);

CREATE POLICY "Users can manage their own comments" ON social_comments 
FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for Privacy Settings
CREATE POLICY "Users can view own privacy settings" ON user_privacy_settings 
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own privacy settings" ON user_privacy_settings 
FOR ALL USING (auth.uid() = user_id);

-- Functions for Social Features
CREATE OR REPLACE FUNCTION send_friend_request(
    requester_id UUID,
    target_user_id UUID
)
RETURNS BOOLEAN AS $$
BEGIN
    -- Check if friendship already exists
    IF EXISTS (
        SELECT 1 FROM user_friends 
        WHERE (user_id = requester_id AND friend_id = target_user_id)
        OR (user_id = target_user_id AND friend_id = requester_id)
    ) THEN
        RETURN FALSE;
    END IF;
    
    -- Insert friend request
    INSERT INTO user_friends (user_id, friend_id, requested_by, status)
    VALUES (requester_id, target_user_id, requester_id, 'pending');
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION accept_friend_request(
    user_id UUID,
    requester_id UUID
)
RETURNS BOOLEAN AS $$
BEGIN
    -- Update the friend request to accepted
    UPDATE user_friends 
    SET status = 'accepted', updated_at = CURRENT_TIMESTAMP
    WHERE (user_friends.user_id = requester_id AND friend_id = accept_friend_request.user_id)
    AND status = 'pending';
    
    -- Create reciprocal friendship
    INSERT INTO user_friends (user_id, friend_id, requested_by, status)
    VALUES (accept_friend_request.user_id, requester_id, requester_id, 'accepted')
    ON CONFLICT (user_id, friend_id) DO UPDATE SET status = 'accepted';
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION create_social_post(
    user_id UUID,
    post_type VARCHAR(50),
    content TEXT DEFAULT NULL,
    metadata JSONB DEFAULT NULL,
    privacy_level VARCHAR(20) DEFAULT 'friends'
)
RETURNS UUID AS $$
DECLARE
    post_id UUID;
BEGIN
    INSERT INTO social_posts (user_id, post_type, content, metadata, privacy_level)
    VALUES (user_id, post_type, content, metadata, privacy_level)
    RETURNING id INTO post_id;
    
    RETURN post_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_friends_leaderboard(
    user_id UUID,
    leaderboard_type VARCHAR(50) DEFAULT 'health_points'
)
RETURNS TABLE (
    friend_id UUID,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    health_points INTEGER,
    level INTEGER,
    longest_streak INTEGER,
    rank INTEGER
) AS $$
BEGIN
    RETURN QUERY
    WITH friend_list AS (
        SELECT DISTINCT 
            CASE 
                WHEN uf.user_id = get_friends_leaderboard.user_id THEN uf.friend_id
                ELSE uf.user_id
            END as friend_user_id
        FROM user_friends uf
        WHERE (uf.user_id = get_friends_leaderboard.user_id OR uf.friend_id = get_friends_leaderboard.user_id)
        AND uf.status = 'accepted'
        
        UNION
        
        SELECT get_friends_leaderboard.user_id -- Include the user themselves
    ),
    friend_stats AS (
        SELECT 
            fl.friend_user_id,
            up.first_name,
            up.last_name,
            COALESCE(ug.health_points, 0) as health_points,
            COALESCE(ug.level, 1) as level,
            COALESCE(MAX(s.longest_count), 0) as longest_streak
        FROM friend_list fl
        LEFT JOIN user_profiles up ON fl.friend_user_id = up.id
        LEFT JOIN user_gamification ug ON fl.friend_user_id = ug.user_id
        LEFT JOIN streaks s ON fl.friend_user_id = s.user_id
        WHERE up.id IS NOT NULL
        GROUP BY fl.friend_user_id, up.first_name, up.last_name, ug.health_points, ug.level
    )
    SELECT 
        fs.friend_user_id,
        fs.first_name,
        fs.last_name,
        fs.health_points,
        fs.level,
        fs.longest_streak,
        ROW_NUMBER() OVER (
            ORDER BY 
                CASE 
                    WHEN leaderboard_type = 'health_points' THEN fs.health_points
                    WHEN leaderboard_type = 'level' THEN fs.level
                    WHEN leaderboard_type = 'longest_streak' THEN fs.longest_streak
                    ELSE fs.health_points
                END DESC
        )::INTEGER as rank
    FROM friend_stats fs
    ORDER BY rank;
END;
$$ LANGUAGE plpgsql;

-- Initialize privacy settings for existing users
INSERT INTO user_privacy_settings (user_id)
SELECT id FROM users
ON CONFLICT (user_id) DO NOTHING;
