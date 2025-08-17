-- CRITICAL SECURITY FIX: Implement RLS policies for sensitive tables

-- Fix donations table security (CRITICAL - contains donor PII)
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Donations: Donors can view their own donations"
ON public.donations
FOR SELECT
USING (auth.uid() = user_id OR auth.uid() = donor_id);

CREATE POLICY "Donations: NGOs can view donations to their organizations"
ON public.donations
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'ngo'
    AND profiles.organization = donations.organization_name
  )
);

CREATE POLICY "Donations: Admins can view all donations"
ON public.donations
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

CREATE POLICY "Donations: Users can create their own donations"
ON public.donations
FOR INSERT
WITH CHECK (auth.uid() = user_id OR auth.uid() = donor_id);

-- Fix event_attendees table security (CRITICAL - contains cancer patient data)
ALTER TABLE public.event_attendees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Event attendees: Users can view their own attendance"
ON public.event_attendees
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Event attendees: Event organizers can view attendees"
ON public.event_attendees
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.events
    WHERE events.id = event_attendees.event_id
    AND events.organizer_id = auth.uid()
  )
);

CREATE POLICY "Event attendees: Admins can view all attendance"
ON public.event_attendees
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

CREATE POLICY "Event attendees: Users can register for events"
ON public.event_attendees
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Event attendees: Users can update their own attendance"
ON public.event_attendees
FOR UPDATE
USING (auth.uid() = user_id);

-- Fix comments table security (contains user behavior tracking data)
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comments: Anyone can view published comments"
ON public.comments
FOR SELECT
USING (true);

CREATE POLICY "Comments: Users can create comments"
ON public.comments
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Comments: Users can update their own comments"
ON public.comments
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Comments: Users can delete their own comments"
ON public.comments
FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "Comments: Admins can manage all comments"
ON public.comments
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- Fix post_reactions table security
ALTER TABLE public.post_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Post reactions: Users can view all reactions"
ON public.post_reactions
FOR SELECT
USING (true);

CREATE POLICY "Post reactions: Users can manage their own reactions"
ON public.post_reactions
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Fix story_reactions table security
ALTER TABLE public.story_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Story reactions: Users can view all reactions"
ON public.story_reactions
FOR SELECT
USING (true);

CREATE POLICY "Story reactions: Users can manage their own reactions"
ON public.story_reactions
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Additional security for other sensitive tables
ALTER TABLE public.private_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Private messages: Users can view their own messages"
ON public.private_messages
FOR SELECT
USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Private messages: Users can send messages"
ON public.private_messages
FOR INSERT
WITH CHECK (auth.uid() = sender_id);

-- Secure notifications table
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Notifications: Users can view their own notifications"
ON public.notifications
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Notifications: System can create notifications"
ON public.notifications
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Notifications: Users can update their own notifications"
ON public.notifications
FOR UPDATE
USING (auth.uid() = user_id);

-- Secure support group members table
ALTER TABLE public.support_group_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Support group members: Members can view group membership"
ON public.support_group_members
FOR SELECT
USING (
  auth.uid() = user_id OR
  EXISTS (
    SELECT 1 FROM public.support_group_members sgm
    WHERE sgm.group_id = support_group_members.group_id
    AND sgm.user_id = auth.uid()
  )
);

CREATE POLICY "Support group members: Users can join groups"
ON public.support_group_members
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Support group members: Users can leave groups"
ON public.support_group_members
FOR DELETE
USING (auth.uid() = user_id);