
-- Create chat messages table for chat history
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  message TEXT NOT NULL,
  sender TEXT NOT NULL CHECK (sender IN ('user', 'bot')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chat conversations table for grouping messages
CREATE TABLE public.chat_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL DEFAULT 'New Chat',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add conversation_id to chat_messages
ALTER TABLE public.chat_messages ADD COLUMN conversation_id UUID REFERENCES public.chat_conversations(id);

-- Create donations table
CREATE TABLE public.donations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  payment_method TEXT NOT NULL DEFAULT 'paypal',
  transaction_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  donor_name TEXT,
  donor_email TEXT,
  message TEXT,
  is_anonymous BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create community stats table for analytics
CREATE TABLE public.community_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  total_members INTEGER DEFAULT 0,
  total_stories INTEGER DEFAULT 0,
  total_events INTEGER DEFAULT 0,
  total_donations DECIMAL(10,2) DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert initial stats
INSERT INTO public.community_stats (total_members, total_stories, total_events, total_donations)
VALUES (1247, 89, 15, 25430.50);

-- Create RLS policies for chat_messages
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own chat messages" 
  ON public.chat_messages 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own chat messages" 
  ON public.chat_messages 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chat messages" 
  ON public.chat_messages 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chat messages" 
  ON public.chat_messages 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create RLS policies for chat_conversations
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own conversations" 
  ON public.chat_conversations 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own conversations" 
  ON public.chat_conversations 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own conversations" 
  ON public.chat_conversations 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own conversations" 
  ON public.chat_conversations 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create RLS policies for donations
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own donations" 
  ON public.donations 
  FOR SELECT 
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Anyone can create donations" 
  ON public.donations 
  FOR INSERT 
  WITH CHECK (true);

-- Create RLS policies for community_stats
ALTER TABLE public.community_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view community stats" 
  ON public.community_stats 
  FOR SELECT 
  USING (true);

-- Add some sample data for testing
INSERT INTO public.stories (title, content, excerpt, user_id, cancer_type, tone, age_group, is_anonymous)
VALUES 
  ('My Journey with Hope', 'This is my story of courage and hope...', 'A story of resilience and community support', NULL, 'breast', 'hopeful', '40-50', true),
  ('Finding Strength Together', 'Community support changed everything for me...', 'How community support transformed my journey', NULL, 'lung', 'inspirational', '50-60', true),
  ('A New Beginning', 'After treatment, life took on new meaning...', 'Discovering joy and purpose after cancer', NULL, 'colon', 'hopeful', '30-40', true);

INSERT INTO public.events (title, description, start_date, end_date, event_type, is_online, max_attendees, host_id)
VALUES 
  ('Monthly Support Circle', 'Join us for emotional support and shared experiences', NOW() + INTERVAL '7 days', NOW() + INTERVAL '7 days' + INTERVAL '2 hours', 'Support Group', true, 25, NULL),
  ('Nutrition Workshop', 'Learn about maintaining health during treatment', NOW() + INTERVAL '14 days', NOW() + INTERVAL '14 days' + INTERVAL '1.5 hours', 'Workshop', true, 50, NULL),
  ('Wellness Retreat Weekend', 'A weekend focused on healing and connection', NOW() + INTERVAL '30 days', NOW() + INTERVAL '32 days', 'Retreat', false, 30, NULL);

-- Update community stats based on actual data
UPDATE public.community_stats 
SET 
  total_stories = (SELECT COUNT(*) FROM public.stories),
  total_events = (SELECT COUNT(*) FROM public.events),
  total_members = (SELECT COUNT(*) FROM auth.users),
  updated_at = NOW();
