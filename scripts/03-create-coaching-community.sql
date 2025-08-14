-- Create coaches table
CREATE TABLE public.coaches (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    specializations TEXT[],
    certifications JSONB DEFAULT '[]',
    rating DECIMAL(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    max_patients INTEGER DEFAULT 20,
    bio TEXT,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create coach assignments table
CREATE TABLE public.coach_assignments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    coach_id UUID REFERENCES public.coaches(id) ON DELETE CASCADE,
    assigned_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
    notes TEXT,
    UNIQUE(user_id, coach_id)
);

-- Create support groups table
CREATE TABLE public.support_groups (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    group_type VARCHAR(50) NOT NULL,
    max_members INTEGER DEFAULT 50,
    is_private BOOLEAN DEFAULT false,
    moderator_id UUID REFERENCES auth.users(id),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create group memberships table
CREATE TABLE public.group_memberships (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    group_id UUID REFERENCES public.support_groups(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('member', 'moderator', 'admin')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    UNIQUE(user_id, group_id)
);

-- Create conversations table
CREATE TABLE public.conversations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    type VARCHAR(20) NOT NULL CHECK (type IN ('direct', 'group', 'coach')),
    participants UUID[] NOT NULL,
    group_id UUID REFERENCES public.support_groups(id),
    coach_assignment_id UUID REFERENCES public.coach_assignments(id),
    title VARCHAR(200),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE public.messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT,
    message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'audio')),
    file_url TEXT,
    reactions JSONB DEFAULT '{}',
    reply_to_id UUID REFERENCES public.messages(id),
    is_edited BOOLEAN DEFAULT false,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_by JSONB DEFAULT '[]'
);

-- Enable RLS
ALTER TABLE public.coaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coach_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create policies for coaches (coaches can manage their own profile)
CREATE POLICY "Coaches can manage own profile" ON public.coaches
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view active coaches" ON public.coaches
    FOR SELECT USING (is_active = true);

-- Create policies for coach assignments
CREATE POLICY "Users can view own coach assignments" ON public.coach_assignments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Coaches can view their assignments" ON public.coach_assignments
    FOR SELECT USING (
        auth.uid() IN (
            SELECT user_id FROM public.coaches WHERE id = coach_id
        )
    );

-- Create policies for support groups
CREATE POLICY "Users can view public groups" ON public.support_groups
    FOR SELECT USING (is_private = false OR auth.uid() = moderator_id);

CREATE POLICY "Group members can view private groups" ON public.support_groups
    FOR SELECT USING (
        is_private = true AND auth.uid() IN (
            SELECT user_id FROM public.group_memberships 
            WHERE group_id = id AND is_active = true
        )
    );

-- Create policies for group memberships
CREATE POLICY "Users can view group memberships" ON public.group_memberships
    FOR SELECT USING (
        auth.uid() = user_id OR 
        auth.uid() IN (
            SELECT user_id FROM public.group_memberships 
            WHERE group_id = group_memberships.group_id AND is_active = true
        )
    );

CREATE POLICY "Users can manage own memberships" ON public.group_memberships
    FOR ALL USING (auth.uid() = user_id);

-- Create policies for conversations
CREATE POLICY "Users can view own conversations" ON public.conversations
    FOR SELECT USING (auth.uid() = ANY(participants));

-- Create policies for messages
CREATE POLICY "Users can view messages in their conversations" ON public.messages
    FOR SELECT USING (
        auth.uid() IN (
            SELECT unnest(participants) FROM public.conversations 
            WHERE id = conversation_id
        )
    );

CREATE POLICY "Users can send messages to their conversations" ON public.messages
    FOR INSERT WITH CHECK (
        auth.uid() = sender_id AND
        auth.uid() IN (
            SELECT unnest(participants) FROM public.conversations 
            WHERE id = conversation_id
        )
    );
