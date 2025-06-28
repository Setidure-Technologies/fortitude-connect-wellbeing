/*
  # Setup Initial Admin Users and Role Management

  1. New Tables
    - Add initial admin setup
    - Create role management functions
  
  2. Security
    - Add admin role assignment functions
    - Create initial admin user setup
  
  3. Functions
    - Function to promote users to admin
    - Function to assign roles
*/

-- Function to promote a user to admin (can be called manually)
CREATE OR REPLACE FUNCTION promote_user_to_admin(user_email TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles 
  SET role = 'admin'
  WHERE email = user_email;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User with email % not found', user_email;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to assign role to user (admin only)
CREATE OR REPLACE FUNCTION assign_user_role(target_user_id UUID, new_role user_role)
RETURNS VOID AS $$
DECLARE
  current_user_role user_role;
BEGIN
  -- Check if current user is admin
  SELECT role INTO current_user_role 
  FROM public.profiles 
  WHERE id = auth.uid();
  
  IF current_user_role != 'admin' THEN
    RAISE EXCEPTION 'Only admins can assign roles';
  END IF;
  
  -- Update the target user's role
  UPDATE public.profiles 
  SET role = new_role, updated_at = NOW()
  WHERE id = target_user_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
DECLARE
  user_role user_role;
BEGIN
  SELECT role INTO user_role 
  FROM public.profiles 
  WHERE id = user_id;
  
  RETURN user_role = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a table for admin actions log
CREATE TABLE IF NOT EXISTS public.admin_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  target_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for admin actions
ALTER TABLE public.admin_actions ENABLE ROW LEVEL SECURITY;

-- Policy for admin actions (only admins can view)
CREATE POLICY "Only admins can view admin actions" 
  ON public.admin_actions 
  FOR SELECT 
  USING (is_admin());

CREATE POLICY "Only admins can create admin actions" 
  ON public.admin_actions 
  FOR INSERT 
  WITH CHECK (is_admin() AND auth.uid() = admin_id);

-- Update the profiles table to allow admins to update any user's role
CREATE POLICY "Admins can update any user role" 
  ON public.profiles 
  FOR UPDATE 
  USING (is_admin());

-- Create private messages table for user-to-user chat
CREATE TABLE IF NOT EXISTS public.private_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for private messages
ALTER TABLE public.private_messages ENABLE ROW LEVEL SECURITY;

-- Policies for private messages
CREATE POLICY "Users can view their own messages" 
  ON public.private_messages 
  FOR SELECT 
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages" 
  ON public.private_messages 
  FOR INSERT 
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update read status of received messages" 
  ON public.private_messages 
  FOR UPDATE 
  USING (auth.uid() = receiver_id);

-- Add registration_link column to events table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'events' AND column_name = 'registration_link'
  ) THEN
    ALTER TABLE public.events ADD COLUMN registration_link TEXT;
  END IF;
END $$;

-- Update RLS policies for events to allow NGO users to create events
DROP POLICY IF EXISTS "Authenticated users can create events" ON public.events;
CREATE POLICY "Admins and NGOs can create events" 
  ON public.events 
  FOR INSERT 
  WITH CHECK (
    auth.uid() = host_id AND 
    (
      (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin' OR
      (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'ngo'
    )
  );

DROP POLICY IF EXISTS "Event hosts can update events" ON public.events;
CREATE POLICY "Event hosts and admins can update events" 
  ON public.events 
  FOR UPDATE 
  USING (
    auth.uid() = host_id OR 
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );

DROP POLICY IF EXISTS "Event hosts can delete events" ON public.events;
CREATE POLICY "Event hosts and admins can delete events" 
  ON public.events 
  FOR DELETE 
  USING (
    auth.uid() = host_id OR 
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );