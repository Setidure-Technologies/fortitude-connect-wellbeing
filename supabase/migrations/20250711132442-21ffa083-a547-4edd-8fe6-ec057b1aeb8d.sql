-- Create comprehensive enhancement tables for Fortitude Network

-- 1. Articles table for Resources section
CREATE TABLE public.articles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  content text,
  excerpt text,
  external_url text,
  image_url text,
  author_id uuid REFERENCES public.profiles(id),
  category text DEFAULT 'general',
  is_published boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- 2. Resource links table
CREATE TABLE public.resource_links (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  url text NOT NULL,
  category text NOT NULL DEFAULT 'general', -- youtube, website, helpline
  tags text[],
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- 3. NGO directory table
CREATE TABLE public.ngos (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  focus_area text, -- e.g., children cancer, funding, screening
  location text,
  region text,
  contact_phone text,
  contact_email text,
  website text,
  address text,
  services_offered text[],
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- 4. Enhanced user connections with better features
CREATE TABLE public.user_connections_enhanced (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id uuid REFERENCES public.profiles(id) NOT NULL,
  receiver_id uuid REFERENCES public.profiles(id) NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'blocked')),
  message text,
  connection_type text DEFAULT 'friend', -- friend, mentor, support_buddy
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  accepted_at timestamp with time zone,
  UNIQUE(requester_id, receiver_id)
);

-- 5. Direct messages between connected users
CREATE TABLE public.direct_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id uuid REFERENCES public.profiles(id) NOT NULL,
  receiver_id uuid REFERENCES public.profiles(id) NOT NULL,
  message text NOT NULL,
  message_type text DEFAULT 'text', -- text, image, file
  attachment_url text,
  is_read boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  edited_at timestamp with time zone,
  parent_message_id uuid REFERENCES public.direct_messages(id) -- for replies
);

-- 6. Daily questions and polls
CREATE TABLE public.daily_questions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question text NOT NULL,
  question_type text DEFAULT 'open' CHECK (question_type IN ('open', 'poll', 'multiple_choice')),
  options jsonb, -- for polls/multiple choice
  is_active boolean DEFAULT true,
  featured_date date,
  created_by uuid REFERENCES public.profiles(id),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- 7. User responses to daily questions
CREATE TABLE public.question_responses (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id uuid REFERENCES public.daily_questions(id) NOT NULL,
  user_id uuid REFERENCES public.profiles(id) NOT NULL,
  response_text text,
  selected_option text, -- for polls
  is_anonymous boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(question_id, user_id)
);

-- 8. User activity tracking for online status
CREATE TABLE public.user_activity (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) NOT NULL,
  last_active timestamp with time zone NOT NULL DEFAULT now(),
  activity_type text DEFAULT 'general', -- general, chat, forum
  ip_address inet,
  user_agent text,
  UNIQUE(user_id)
);

-- 9. Notifications system
CREATE TABLE public.notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) NOT NULL,
  type text NOT NULL, -- connection_request, message, mention, system
  title text NOT NULL,
  message text,
  data jsonb, -- additional data specific to notification type
  is_read boolean DEFAULT false,
  action_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- 10. Cancer awareness statistics (configurable)
CREATE TABLE public.awareness_stats (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  stat_key text NOT NULL UNIQUE,
  stat_value text NOT NULL,
  stat_description text,
  display_order integer DEFAULT 0,
  source text,
  is_active boolean DEFAULT true,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ngos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_connections_enhanced ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.direct_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.awareness_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Articles: Public read, admin write
CREATE POLICY "Anyone can view published articles" ON public.articles FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can manage articles" ON public.articles FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Resource Links: Public read, admin write
CREATE POLICY "Anyone can view active resource links" ON public.resource_links FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage resource links" ON public.resource_links FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- NGOs: Public read, admin write
CREATE POLICY "Anyone can view active NGOs" ON public.ngos FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage NGOs" ON public.ngos FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- User Connections: Users can manage their own connections
CREATE POLICY "Users can view their connections" ON public.user_connections_enhanced FOR SELECT USING (
  auth.uid() = requester_id OR auth.uid() = receiver_id
);
CREATE POLICY "Users can create connection requests" ON public.user_connections_enhanced FOR INSERT WITH CHECK (
  auth.uid() = requester_id
);
CREATE POLICY "Users can update connection status" ON public.user_connections_enhanced FOR UPDATE USING (
  auth.uid() = receiver_id OR auth.uid() = requester_id
);

-- Direct Messages: Only between connected users
CREATE POLICY "Users can view their messages" ON public.direct_messages FOR SELECT USING (
  auth.uid() = sender_id OR auth.uid() = receiver_id
);
CREATE POLICY "Users can send messages to connections" ON public.direct_messages FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND 
  EXISTS (
    SELECT 1 FROM public.user_connections_enhanced 
    WHERE ((requester_id = auth.uid() AND receiver_id = direct_messages.receiver_id) 
           OR (receiver_id = auth.uid() AND requester_id = direct_messages.receiver_id))
    AND status = 'accepted'
  )
);

-- Daily Questions: Public read, admin write
CREATE POLICY "Anyone can view active questions" ON public.daily_questions FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage questions" ON public.daily_questions FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Question Responses: Users manage their own
CREATE POLICY "Users can view question responses" ON public.question_responses FOR SELECT USING (true);
CREATE POLICY "Users can create their responses" ON public.question_responses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their responses" ON public.question_responses FOR UPDATE USING (auth.uid() = user_id);

-- User Activity: Users manage their own
CREATE POLICY "Users can view their activity" ON public.user_activity FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their activity" ON public.user_activity FOR ALL USING (auth.uid() = user_id);

-- Notifications: Users see their own
CREATE POLICY "Users can view their notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can create notifications" ON public.notifications FOR INSERT WITH CHECK (true);

-- Awareness Stats: Public read, admin write
CREATE POLICY "Anyone can view active stats" ON public.awareness_stats FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage stats" ON public.awareness_stats FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Insert initial cancer awareness statistics
INSERT INTO public.awareness_stats (stat_key, stat_value, stat_description, display_order, source) VALUES
('new_cases_india', '1,461,000+', 'New cancer cases estimated in India (2022)', 1, 'IARC/Indian National Cancer Registry'),
('annual_deaths', '~900,000', 'Annual cancer deaths in India', 2, 'WHO/EY Report'),
('early_detection_rate', '29%', 'Cancers detected at early stage in India', 3, 'EY Report'),
('survival_rate', '3 in 5', 'Patients who do not survive cancer in India', 4, 'Deccan Herald Report'),
('lifetime_risk', '1 in 9', 'Indians who will develop cancer in their lifetime', 5, 'NCBI/PMC Study');

-- Insert sample resource links
INSERT INTO public.resource_links (title, description, url, category) VALUES 
('Cancer Treatment Centers of America', 'Comprehensive cancer treatment and support resources', 'https://www.cancercenter.com/', 'website'),
('Indian Cancer Society', 'Leading NGO for cancer awareness and support in India', 'https://indiancancersociety.org/', 'website'),
('Cancer Support YouTube Channel', 'Educational videos about cancer treatment and recovery', 'https://www.youtube.com/cancersupport', 'youtube'),
('National Cancer Helpline', '24/7 support and information helpline', 'tel:+91-11-24311111', 'helpline');

-- Insert sample NGO data
INSERT INTO public.ngos (name, description, focus_area, location, region, contact_email, website, services_offered) VALUES
('Tata Memorial Centre', 'Premier cancer treatment and research institute', 'Comprehensive Cancer Care', 'Mumbai', 'Maharashtra', 'info@tmc.gov.in', 'https://tmc.gov.in/', ARRAY['Treatment', 'Research', 'Training']),
('Indian Cancer Society', 'Cancer awareness, early detection and patient support', 'Awareness & Support', 'Mumbai', 'Pan-India', 'info@indiancancersociety.org', 'https://indiancancersociety.org/', ARRAY['Awareness', 'Screening', 'Support Groups']),
('CanSupport', 'Home-based palliative care for cancer patients', 'Palliative Care', 'Delhi', 'North India', 'info@cansupport.org', 'https://cansupport.org/', ARRAY['Home Care', 'Pain Management', 'Family Support']);

-- Create indexes for better performance
CREATE INDEX idx_articles_published ON public.articles(is_published, created_at DESC);
CREATE INDEX idx_resource_links_category ON public.resource_links(category, is_active);
CREATE INDEX idx_ngos_region ON public.ngos(region, is_active);
CREATE INDEX idx_user_connections_status ON public.user_connections_enhanced(status, created_at DESC);
CREATE INDEX idx_direct_messages_conversation ON public.direct_messages(sender_id, receiver_id, created_at DESC);
CREATE INDEX idx_notifications_user_unread ON public.notifications(user_id, is_read, created_at DESC);
CREATE INDEX idx_user_activity_last_active ON public.user_activity(last_active DESC);

-- Create function to update user activity
CREATE OR REPLACE FUNCTION public.update_user_activity()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_activity (user_id, last_active)
  VALUES (auth.uid(), now())
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    last_active = now(),
    activity_type = 'general';
END;
$$;

-- Create function to check if users are connected
CREATE OR REPLACE FUNCTION public.are_users_connected(user1_id uuid, user2_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_connections_enhanced
    WHERE ((requester_id = user1_id AND receiver_id = user2_id) 
           OR (requester_id = user2_id AND receiver_id = user1_id))
    AND status = 'accepted'
  );
$$;

-- Add trigger for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON public.articles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_ngos_updated_at BEFORE UPDATE ON public.ngos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_connections_updated_at BEFORE UPDATE ON public.user_connections_enhanced FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();