-- Phase 1: Fix Critical Database Policies

-- 1. Fix infinite recursion in support_group_members policy
DROP POLICY IF EXISTS "Users can view group members of groups they belong to" ON public.support_group_members;

-- Create a security definer function to check group membership safely
CREATE OR REPLACE FUNCTION public.is_group_member(group_uuid uuid, user_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.support_group_members 
    WHERE group_id = group_uuid 
    AND user_id = user_uuid 
    AND status = 'active'
  );
$$;

-- Create safe policy using the function
CREATE POLICY "Users can view group members safely" ON public.support_group_members
  FOR SELECT 
  USING (
    user_id = auth.uid() OR 
    public.is_group_member(group_id, auth.uid()) OR
    public.has_role('admin')
  );

-- 2. Add admin override policies for forum_posts
CREATE POLICY "Admins can delete any post" ON public.forum_posts
  FOR DELETE 
  USING (public.has_role('admin'));

CREATE POLICY "Admins can update any post" ON public.forum_posts
  FOR UPDATE 
  USING (public.has_role('admin'));

-- 3. Add admin override policies for events  
CREATE POLICY "Admins can delete any event" ON public.events
  FOR DELETE 
  USING (public.has_role('admin'));

CREATE POLICY "Admins can update any event" ON public.events
  FOR UPDATE 
  USING (public.has_role('admin'));

-- Fix events creation policy to include NGOs and admins
DROP POLICY IF EXISTS "Authenticated users can create events" ON public.events;
CREATE POLICY "Admins and NGOs can create events" ON public.events
  FOR INSERT 
  WITH CHECK (
    auth.uid() = host_id AND 
    (public.has_role('admin') OR public.has_role('ngo'))
  );

-- 4. Add admin override policies for support_groups
CREATE POLICY "Admins can delete any support group" ON public.support_groups
  FOR DELETE 
  USING (public.has_role('admin'));

CREATE POLICY "Admins can update any support group" ON public.support_groups
  FOR UPDATE 
  USING (public.has_role('admin'));

-- 5. Fix support group creation policy
DROP POLICY IF EXISTS "Admins and NGOs can create support groups" ON public.support_groups;
CREATE POLICY "Admins and NGOs can create support groups" ON public.support_groups
  FOR INSERT 
  WITH CHECK (
    auth.uid() = created_by AND 
    (public.has_role('admin') OR public.has_role('ngo'))
  );

-- 6. Add missing admin policies for articles
CREATE POLICY "Admins can insert articles" ON public.articles
  FOR INSERT 
  WITH CHECK (public.has_role('admin'));

CREATE POLICY "Admins can update articles" ON public.articles
  FOR UPDATE 
  USING (public.has_role('admin'));

CREATE POLICY "Admins can delete articles" ON public.articles
  FOR DELETE 
  USING (public.has_role('admin'));