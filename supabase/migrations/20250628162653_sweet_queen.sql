/*
  # Fortitude Network Database Schema

  1. New Tables
    - `profiles` - Extended user profiles with cancer journey information
    - `forum_posts` - Community forum posts for discussions
    - `comments` - Comments on forum posts (with threading support)
    - `post_reactions` - Reactions (hearts, etc.) on forum posts
    - `post_tags` - Tags for categorizing forum posts
    - `stories` - Survivor stories and experiences
    - `story_reactions` - Reactions on survivor stories
    - `events` - Community events and workshops
    - `event_attendees` - Event registration and attendance
    - `connection_requests` - User connection requests
    - `connection_responses` - Responses to connection requests
    - `journey_entries` - Personal journey tracking entries
    - `user_achievements` - User achievements and milestones
    - `chat_conversations` - AI chat conversation threads
    - `chat_messages` - Individual chat messages
    - `donations` - Donation tracking
    - `community_stats` - Platform statistics

  2. Enums
    - `user_role` - User roles (patient, survivor, caregiver, volunteer, admin, ngo)
    - `post_type` - Forum post types (question, experience, support, celebration)
    - `story_tone` - Story emotional tone (hopeful, inspirational, raw, grief)
    - `cancer_type` - Cancer types (breast, lung, colon, blood, prostate, skin, other)
    - `mood_level` - Mood tracking levels (very_low, low, neutral, good, very_good)

  3. Security
    - Enable RLS on all tables
    - Add appropriate policies for data access
    - Ensure users can only access their own private data
    - Allow public access to community content
*/

-- Create enums
CREATE TYPE user_role AS ENUM ('patient', 'survivor', 'caregiver', 'volunteer', 'admin', 'ngo');
CREATE TYPE post_type AS ENUM ('question', 'experience', 'support', 'celebration');
CREATE TYPE story_tone AS ENUM ('hopeful', 'inspirational', 'raw', 'grief');
CREATE TYPE cancer_type AS ENUM ('breast', 'lung', 'colon', 'blood', 'prostate', 'skin', 'other');
CREATE TYPE mood_level AS ENUM ('very_low', 'low', 'neutral', 'good', 'very_good');

-- Update profiles table with cancer support specific fields
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS full_name text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS username text UNIQUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'patient';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS age_group text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS location text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cancer_type cancer_type;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS diagnosis_date date;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS profile_image_url text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_anonymous boolean DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Forum posts table
CREATE TABLE IF NOT EXISTS forum_posts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  post_type post_type DEFAULT 'question',
  is_anonymous boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Comments table (supports threading)
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id uuid REFERENCES forum_posts(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  parent_id uuid REFERENCES comments(id) ON DELETE CASCADE,
  is_anonymous boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Post reactions table
CREATE TABLE IF NOT EXISTS post_reactions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id uuid REFERENCES forum_posts(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  reaction_type text DEFAULT 'heart',
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, user_id, reaction_type)
);

-- Post tags table
CREATE TABLE IF NOT EXISTS post_tags (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id uuid REFERENCES forum_posts(id) ON DELETE CASCADE,
  tag text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Stories table
CREATE TABLE IF NOT EXISTS stories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  excerpt text,
  cancer_type cancer_type,
  tone story_tone DEFAULT 'hopeful',
  age_group text,
  is_anonymous boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Story reactions table
CREATE TABLE IF NOT EXISTS story_reactions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  story_id uuid REFERENCES stories(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  reaction_type text DEFAULT 'heart',
  created_at timestamptz DEFAULT now(),
  UNIQUE(story_id, user_id, reaction_type)
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text,
  event_type text,
  start_date timestamptz NOT NULL,
  end_date timestamptz,
  location text,
  is_online boolean DEFAULT false,
  meeting_link text,
  max_attendees integer,
  host_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Event attendees table
CREATE TABLE IF NOT EXISTS event_attendees (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  status text DEFAULT 'registered',
  created_at timestamptz DEFAULT now(),
  UNIQUE(event_id, user_id)
);

-- Connection requests table
CREATE TABLE IF NOT EXISTS connection_requests (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  requester_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  target_role user_role,
  age_range text,
  location text,
  message text,
  is_active boolean DEFAULT true,
  expires_at timestamptz DEFAULT (now() + interval '14 days'),
  created_at timestamptz DEFAULT now()
);

-- Connection responses table
CREATE TABLE IF NOT EXISTS connection_responses (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id uuid REFERENCES connection_requests(id) ON DELETE CASCADE,
  responder_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  message text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Journey entries table (for personal tracking)
CREATE TABLE IF NOT EXISTS journey_entries (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  entry_type text NOT NULL,
  title text,
  content text,
  mood mood_level,
  symptoms jsonb,
  entry_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

-- User achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_type text NOT NULL,
  achievement_name text NOT NULL,
  description text,
  earned_at timestamptz DEFAULT now()
);

-- Chat conversations table
CREATE TABLE IF NOT EXISTS chat_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  title text NOT NULL DEFAULT 'New Chat',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  message text NOT NULL,
  sender text NOT NULL CHECK (sender IN ('user', 'bot')),
  created_at timestamptz NOT NULL DEFAULT now(),
  conversation_id uuid REFERENCES chat_conversations(id)
);

-- Donations table
CREATE TABLE IF NOT EXISTS donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  amount numeric(10,2) NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  payment_method text NOT NULL DEFAULT 'paypal',
  transaction_id text,
  status text NOT NULL DEFAULT 'pending',
  donor_name text,
  donor_email text,
  message text,
  is_anonymous boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Community stats table
CREATE TABLE IF NOT EXISTS community_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  total_members integer DEFAULT 0,
  total_stories integer DEFAULT 0,
  total_events integer DEFAULT 0,
  total_donations numeric(10,2) DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_forum_posts_updated_at BEFORE UPDATE ON forum_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_stories_updated_at BEFORE UPDATE ON stories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE connection_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE connection_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE journey_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_stats ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT TO public USING (true);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT TO public WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE TO public USING (auth.uid() = id);

-- Forum posts policies
CREATE POLICY "Anyone can view posts" ON forum_posts FOR SELECT TO public USING (true);
CREATE POLICY "Authenticated users can create posts" ON forum_posts FOR INSERT TO public WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own posts" ON forum_posts FOR UPDATE TO public USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own posts" ON forum_posts FOR DELETE TO public USING (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "Anyone can view comments" ON comments FOR SELECT TO public USING (true);
CREATE POLICY "Authenticated users can create comments" ON comments FOR INSERT TO public WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments" ON comments FOR UPDATE TO public USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON comments FOR DELETE TO public USING (auth.uid() = user_id);

-- Post reactions policies
CREATE POLICY "Anyone can view reactions" ON post_reactions FOR SELECT TO public USING (true);
CREATE POLICY "Authenticated users can react" ON post_reactions FOR INSERT TO public WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reactions" ON post_reactions FOR UPDATE TO public USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reactions" ON post_reactions FOR DELETE TO public USING (auth.uid() = user_id);

-- Post tags policies
CREATE POLICY "Anyone can view post tags" ON post_tags FOR SELECT TO public USING (true);
CREATE POLICY "Post authors can manage tags" ON post_tags FOR ALL TO public USING (
  EXISTS (
    SELECT 1 FROM forum_posts 
    WHERE forum_posts.id = post_tags.post_id 
    AND forum_posts.user_id = auth.uid()
  )
);

-- Stories policies
CREATE POLICY "Anyone can view stories" ON stories FOR SELECT TO public USING (true);
CREATE POLICY "Authenticated users can create stories" ON stories FOR INSERT TO public WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own stories" ON stories FOR UPDATE TO public USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own stories" ON stories FOR DELETE TO public USING (auth.uid() = user_id);

-- Story reactions policies
CREATE POLICY "Anyone can view story reactions" ON story_reactions FOR SELECT TO public USING (true);
CREATE POLICY "Authenticated users can react to stories" ON story_reactions FOR INSERT TO public WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own story reactions" ON story_reactions FOR UPDATE TO public USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own story reactions" ON story_reactions FOR DELETE TO public USING (auth.uid() = user_id);

-- Events policies
CREATE POLICY "Anyone can view events" ON events FOR SELECT TO public USING (true);
CREATE POLICY "Authenticated users can create events" ON events FOR INSERT TO public WITH CHECK (auth.uid() = host_id);
CREATE POLICY "Event hosts can update events" ON events FOR UPDATE TO public USING (auth.uid() = host_id);
CREATE POLICY "Event hosts can delete events" ON events FOR DELETE TO public USING (auth.uid() = host_id);

-- Event attendees policies
CREATE POLICY "Anyone can view event attendees" ON event_attendees FOR SELECT TO public USING (true);
CREATE POLICY "Authenticated users can register for events" ON event_attendees FOR INSERT TO public WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own registrations" ON event_attendees FOR UPDATE TO public USING (auth.uid() = user_id);
CREATE POLICY "Users can cancel own registrations" ON event_attendees FOR DELETE TO public USING (auth.uid() = user_id);

-- Connection requests policies
CREATE POLICY "Anyone can view active connection requests" ON connection_requests FOR SELECT TO public USING (is_active = true);
CREATE POLICY "Authenticated users can create requests" ON connection_requests FOR INSERT TO public WITH CHECK (auth.uid() = requester_id);
CREATE POLICY "Users can update own requests" ON connection_requests FOR UPDATE TO public USING (auth.uid() = requester_id);
CREATE POLICY "Users can delete own requests" ON connection_requests FOR DELETE TO public USING (auth.uid() = requester_id);

-- Connection responses policies
CREATE POLICY "Request owners can view responses" ON connection_responses FOR SELECT TO public USING (
  EXISTS (
    SELECT 1 FROM connection_requests 
    WHERE connection_requests.id = connection_responses.request_id 
    AND connection_requests.requester_id = auth.uid()
  ) OR auth.uid() = responder_id
);
CREATE POLICY "Authenticated users can respond" ON connection_responses FOR INSERT TO public WITH CHECK (auth.uid() = responder_id);
CREATE POLICY "Users can update own responses" ON connection_responses FOR UPDATE TO public USING (auth.uid() = responder_id);

-- Journey entries policies (private to user)
CREATE POLICY "Users can view own journey entries" ON journey_entries FOR SELECT TO public USING (auth.uid() = user_id);
CREATE POLICY "Users can create own journey entries" ON journey_entries FOR INSERT TO public WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own journey entries" ON journey_entries FOR UPDATE TO public USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own journey entries" ON journey_entries FOR DELETE TO public USING (auth.uid() = user_id);

-- User achievements policies
CREATE POLICY "Users can view own achievements" ON user_achievements FOR SELECT TO public USING (auth.uid() = user_id);
CREATE POLICY "System can create achievements" ON user_achievements FOR INSERT TO public WITH CHECK (true);

-- Chat conversations policies
CREATE POLICY "Users can view their own conversations" ON chat_conversations FOR SELECT TO public USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own conversations" ON chat_conversations FOR INSERT TO public WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own conversations" ON chat_conversations FOR UPDATE TO public USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own conversations" ON chat_conversations FOR DELETE TO public USING (auth.uid() = user_id);

-- Chat messages policies
CREATE POLICY "Users can view their own chat messages" ON chat_messages FOR SELECT TO public USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own chat messages" ON chat_messages FOR INSERT TO public WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own chat messages" ON chat_messages FOR UPDATE TO public USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own chat messages" ON chat_messages FOR DELETE TO public USING (auth.uid() = user_id);

-- Donations policies
CREATE POLICY "Users can view their own donations" ON donations FOR SELECT TO public USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Anyone can create donations" ON donations FOR INSERT TO public WITH CHECK (true);

-- Community stats policies
CREATE POLICY "Anyone can view community stats" ON community_stats FOR SELECT TO public USING (true);

-- Insert initial community stats
INSERT INTO community_stats (total_members, total_stories, total_events, total_donations) 
VALUES (1247, 89, 15, 25430.00)
ON CONFLICT (id) DO NOTHING;

-- Create user profile trigger function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();