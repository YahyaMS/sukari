-- Enable Row Level Security on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.glucose_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weight_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coach_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coaches ENABLE ROW LEVEL SECURITY;

-- User Profiles - Users can only access their own profile
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid()::text = (SELECT auth.uid()::text));

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid()::text = (SELECT auth.uid()::text));

CREATE POLICY "Users can insert own profile" ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid()::text = (SELECT auth.uid()::text));

-- Medical Profiles - Users can only access their own medical data
CREATE POLICY "Users can view own medical profile" ON public.medical_profiles
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own medical profile" ON public.medical_profiles
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can insert own medical profile" ON public.medical_profiles
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Glucose Readings - Users can only access their own readings
CREATE POLICY "Users can view own glucose readings" ON public.glucose_readings
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own glucose readings" ON public.glucose_readings
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own glucose readings" ON public.glucose_readings
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own glucose readings" ON public.glucose_readings
    FOR DELETE USING (user_id = auth.uid());

-- Weight Entries - Users can only access their own weight data
CREATE POLICY "Users can view own weight entries" ON public.weight_entries
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own weight entries" ON public.weight_entries
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own weight entries" ON public.weight_entries
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own weight entries" ON public.weight_entries
    FOR DELETE USING (user_id = auth.uid());

-- Meals - Users can only access their own meal data
CREATE POLICY "Users can view own meals" ON public.meals
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own meals" ON public.meals
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own meals" ON public.meals
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own meals" ON public.meals
    FOR DELETE USING (user_id = auth.uid());

-- Exercise Entries - Users can only access their own exercise data
CREATE POLICY "Users can view own exercise entries" ON public.exercise_entries
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own exercise entries" ON public.exercise_entries
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own exercise entries" ON public.exercise_entries
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own exercise entries" ON public.exercise_entries
    FOR DELETE USING (user_id = auth.uid());

-- Achievements - Users can only access their own achievements
CREATE POLICY "Users can view own achievements" ON public.achievements
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own achievements" ON public.achievements
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- User Goals - Users can only access their own goals
CREATE POLICY "Users can view own goals" ON public.user_goals
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own goals" ON public.user_goals
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own goals" ON public.user_goals
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own goals" ON public.user_goals
    FOR DELETE USING (user_id = auth.uid());

-- Notifications - Users can only access their own notifications
CREATE POLICY "Users can view own notifications" ON public.notifications
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications" ON public.notifications
    FOR UPDATE USING (user_id = auth.uid());

-- Messages - Users can only access messages in conversations they participate in
CREATE POLICY "Users can view messages in their conversations" ON public.messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.conversations 
            WHERE conversations.id = messages.conversation_id 
            AND auth.uid() = ANY(conversations.participants)
        )
    );

CREATE POLICY "Users can insert messages in their conversations" ON public.messages
    FOR INSERT WITH CHECK (
        sender_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM public.conversations 
            WHERE conversations.id = conversation_id 
            AND auth.uid() = ANY(conversations.participants)
        )
    );

-- Conversations - Users can only access conversations they participate in
CREATE POLICY "Users can view their conversations" ON public.conversations
    FOR SELECT USING (auth.uid() = ANY(participants));

CREATE POLICY "Users can update their conversations" ON public.conversations
    FOR UPDATE USING (auth.uid() = ANY(participants));

-- Community Posts - Users can view all posts but only modify their own
CREATE POLICY "Users can view all community posts" ON public.community_posts
    FOR SELECT USING (true);

CREATE POLICY "Users can insert own community posts" ON public.community_posts
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own community posts" ON public.community_posts
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own community posts" ON public.community_posts
    FOR DELETE USING (user_id = auth.uid());

-- Post Replies - Users can view all replies but only modify their own
CREATE POLICY "Users can view all post replies" ON public.post_replies
    FOR SELECT USING (true);

CREATE POLICY "Users can insert own post replies" ON public.post_replies
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own post replies" ON public.post_replies
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own post replies" ON public.post_replies
    FOR DELETE USING (user_id = auth.uid());

-- Post Reactions - Users can view all reactions but only modify their own
CREATE POLICY "Users can view all post reactions" ON public.post_reactions
    FOR SELECT USING (true);

CREATE POLICY "Users can insert own post reactions" ON public.post_reactions
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own post reactions" ON public.post_reactions
    FOR DELETE USING (user_id = auth.uid());

-- Group Memberships - Users can view memberships for groups they belong to
CREATE POLICY "Users can view group memberships for their groups" ON public.group_memberships
    FOR SELECT USING (
        user_id = auth.uid() OR 
        EXISTS (
            SELECT 1 FROM public.group_memberships gm 
            WHERE gm.group_id = group_memberships.group_id 
            AND gm.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own group memberships" ON public.group_memberships
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own group memberships" ON public.group_memberships
    FOR UPDATE USING (user_id = auth.uid());

-- Support Groups - Users can view all public groups and groups they belong to
CREATE POLICY "Users can view support groups" ON public.support_groups
    FOR SELECT USING (
        is_private = false OR 
        EXISTS (
            SELECT 1 FROM public.group_memberships 
            WHERE group_id = support_groups.id 
            AND user_id = auth.uid()
        )
    );

-- Coach Assignments - Users can only view their own assignments
CREATE POLICY "Users can view own coach assignments" ON public.coach_assignments
    FOR SELECT USING (user_id = auth.uid());

-- Coaches - Users can view all active coaches
CREATE POLICY "Users can view active coaches" ON public.coaches
    FOR SELECT USING (is_active = true);
