-- SECURITY HARDENING: Restrict access to sensitive data per scanner findings

-- Donations: restrict SELECT to owner or admin (remove public access to anonymous donations)
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own donations" ON public.donations;
CREATE POLICY "Donations: Users can view their own donations"
ON public.donations
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Donations: Admins can view all donations"
ON public.donations
FOR SELECT
USING (public.has_role('admin'));

-- Event attendees: remove public visibility and scope to user, host, or admin
ALTER TABLE public.event_attendees ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view event attendees" ON public.event_attendees;

CREATE POLICY IF NOT EXISTS "Event attendees: Users can view their own attendance"
ON public.event_attendees
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Event attendees: Event hosts can view attendees"
ON public.event_attendees
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.events e
    WHERE e.id = event_attendees.event_id
      AND e.host_id = auth.uid()
  )
);

CREATE POLICY IF NOT EXISTS "Event attendees: Admins can view all attendance"
ON public.event_attendees
FOR SELECT
USING (public.has_role('admin'));
