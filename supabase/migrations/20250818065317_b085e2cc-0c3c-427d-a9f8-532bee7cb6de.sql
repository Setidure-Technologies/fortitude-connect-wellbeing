-- Phase 1: Database Structure Optimization and Enhancement
-- This migration addresses core architectural issues and adds missing functionality

-- 1. Create media/photo gallery system
CREATE TABLE public.media_galleries (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  owner_id uuid NOT NULL,
  gallery_type text NOT NULL DEFAULT 'user', -- 'user', 'group', 'admin'
  is_public boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE public.media_files (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  gallery_id uuid REFERENCES public.media_galleries(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_url text NOT NULL,
  file_type text NOT NULL,
  file_size integer NOT NULL,
  caption text,
  uploaded_by uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- 2. Create comprehensive file attachment system
CREATE TABLE public.file_attachments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  file_name text NOT NULL,
  file_url text NOT NULL,
  file_type text NOT NULL,
  file_size integer NOT NULL,
  storage_path text NOT NULL,
  uploaded_by uuid NOT NULL,
  attachment_type text NOT NULL, -- 'post', 'message', 'group', 'profile'
  entity_id uuid, -- ID of the related entity (post_id, message_id, etc.)
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- 3. Consolidate messaging system (keep direct_messages, remove private_messages later)
-- Add file attachment support to direct_messages
ALTER TABLE public.direct_messages ADD COLUMN IF NOT EXISTS thread_id uuid;
ALTER TABLE public.direct_messages ADD COLUMN IF NOT EXISTS is_deleted boolean DEFAULT false;
ALTER TABLE public.direct_messages ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- 4. Add file attachment support to forum posts
ALTER TABLE public.forum_posts ADD COLUMN IF NOT EXISTS has_attachments boolean DEFAULT false;

-- 5. Add file attachment support to support group messages
ALTER TABLE public.support_group_messages ADD COLUMN IF NOT EXISTS has_attachments boolean DEFAULT false;
ALTER TABLE public.support_group_messages ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- 6. Create user profile galleries
CREATE TABLE public.user_profile_galleries (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  gallery_id uuid NOT NULL REFERENCES public.media_galleries(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, gallery_id)
);

-- 7. Create support group galleries
CREATE TABLE public.support_group_galleries (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id uuid NOT NULL REFERENCES public.support_groups(id) ON DELETE CASCADE,
  gallery_id uuid NOT NULL REFERENCES public.media_galleries(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(group_id, gallery_id)
);

-- 8. Add messaging features to support groups
CREATE TABLE public.support_group_message_reactions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id uuid NOT NULL REFERENCES public.support_group_messages(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  reaction_type text NOT NULL DEFAULT 'like',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(message_id, user_id, reaction_type)
);

-- 9. Create connection activity tracking
CREATE TABLE public.connection_activities (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  connection_id uuid NOT NULL REFERENCES public.user_connections_enhanced(id) ON DELETE CASCADE,
  activity_type text NOT NULL, -- 'message_sent', 'group_joined', 'post_liked', etc.
  activity_data jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- 10. Add password reset tokens table for better security
CREATE TABLE public.password_reset_tokens (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  token text NOT NULL UNIQUE,
  expires_at timestamp with time zone NOT NULL,
  used boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.media_galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.file_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profile_galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_group_galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_group_message_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connection_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- RLS Policies for media galleries
CREATE POLICY "Users can view public galleries" ON public.media_galleries
  FOR SELECT USING (is_public = true OR owner_id = auth.uid() OR has_role('admin'::text));

CREATE POLICY "Users can create their galleries" ON public.media_galleries
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Gallery owners can update galleries" ON public.media_galleries
  FOR UPDATE USING (auth.uid() = owner_id OR has_role('admin'::text));

CREATE POLICY "Gallery owners can delete galleries" ON public.media_galleries
  FOR DELETE USING (auth.uid() = owner_id OR has_role('admin'::text));

-- RLS Policies for media files
CREATE POLICY "Users can view accessible media files" ON public.media_files
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.media_galleries g 
      WHERE g.id = gallery_id AND (g.is_public = true OR g.owner_id = auth.uid())
    ) OR has_role('admin'::text)
  );

CREATE POLICY "Users can upload to their galleries" ON public.media_files
  FOR INSERT WITH CHECK (
    auth.uid() = uploaded_by AND 
    EXISTS (
      SELECT 1 FROM public.media_galleries g 
      WHERE g.id = gallery_id AND g.owner_id = auth.uid()
    )
  );

-- RLS Policies for file attachments
CREATE POLICY "Users can view their attachments" ON public.file_attachments
  FOR SELECT USING (auth.uid() = uploaded_by OR has_role('admin'::text));

CREATE POLICY "Users can create attachments" ON public.file_attachments
  FOR INSERT WITH CHECK (auth.uid() = uploaded_by);

-- RLS Policies for support group message reactions
CREATE POLICY "Group members can view message reactions" ON public.support_group_message_reactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.support_group_messages m
      JOIN public.support_group_members gm ON m.group_id = gm.group_id
      WHERE m.id = message_id AND gm.user_id = auth.uid() AND gm.status = 'active'
    )
  );

CREATE POLICY "Group members can create reactions" ON public.support_group_message_reactions
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.support_group_messages m
      JOIN public.support_group_members gm ON m.group_id = gm.group_id
      WHERE m.id = message_id AND gm.user_id = auth.uid() AND gm.status = 'active'
    )
  );

-- RLS Policies for connection activities
CREATE POLICY "Connected users can view activities" ON public.connection_activities
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_connections_enhanced uc
      WHERE uc.id = connection_id AND 
      (uc.requester_id = auth.uid() OR uc.receiver_id = auth.uid()) AND
      uc.status = 'accepted'
    ) OR has_role('admin'::text)
  );

-- RLS Policies for password reset tokens
CREATE POLICY "Users can manage their reset tokens" ON public.password_reset_tokens
  FOR ALL USING (auth.uid() = user_id);

-- Add triggers for updated_at columns
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_media_galleries_updated_at
  BEFORE UPDATE ON public.media_galleries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_direct_messages_updated_at
  BEFORE UPDATE ON public.direct_messages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_support_group_messages_updated_at
  BEFORE UPDATE ON public.support_group_messages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX idx_media_files_gallery_id ON public.media_files(gallery_id);
CREATE INDEX idx_file_attachments_entity ON public.file_attachments(attachment_type, entity_id);
CREATE INDEX idx_file_attachments_uploader ON public.file_attachments(uploaded_by);
CREATE INDEX idx_support_group_message_reactions_message ON public.support_group_message_reactions(message_id);
CREATE INDEX idx_connection_activities_connection ON public.connection_activities(connection_id);
CREATE INDEX idx_password_reset_tokens_user ON public.password_reset_tokens(user_id);
CREATE INDEX idx_password_reset_tokens_token ON public.password_reset_tokens(token);

-- Add realtime publication for new tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.media_files;
ALTER PUBLICATION supabase_realtime ADD TABLE public.file_attachments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.support_group_message_reactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.connection_activities;

-- Fix existing RLS policies for forum reactions (this was mentioned as broken)
DROP POLICY IF EXISTS "Anyone can view reactions" ON public.post_reactions;
CREATE POLICY "Anyone can view post reactions" ON public.post_reactions
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can react" ON public.post_reactions;
CREATE POLICY "Authenticated users can create reactions" ON public.post_reactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own reactions" ON public.post_reactions;
CREATE POLICY "Users can manage their reactions" ON public.post_reactions
  FOR ALL USING (auth.uid() = user_id);

-- Create function to check if user is connected
CREATE OR REPLACE FUNCTION public.is_user_connected(user1_id uuid, user2_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_connections_enhanced
    WHERE ((requester_id = user1_id AND receiver_id = user2_id) 
           OR (requester_id = user2_id AND receiver_id = user1_id))
    AND status = 'accepted'
  );
$$;