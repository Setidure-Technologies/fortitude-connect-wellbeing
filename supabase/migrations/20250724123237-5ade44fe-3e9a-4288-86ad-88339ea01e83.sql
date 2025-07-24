-- Step 1: Fix Profile Update Policy Conflicts
-- Remove the conflicting policy that prevents normal users from updating profiles
DROP POLICY IF EXISTS "Users can update own profile (except role)" ON public.profiles;

-- Create a policy that allows users to update their own data but prevents role changes by non-admins
CREATE POLICY "Users can update own profile data" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id) 
WITH CHECK (
  auth.uid() = id
);

-- Create a separate function to validate profile updates including role restrictions
CREATE OR REPLACE FUNCTION public.validate_profile_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- If role is being changed and user is not admin, block the update
  IF OLD.role != NEW.role AND NOT has_role('admin'::text) THEN
    RAISE EXCEPTION 'Only administrators can change user roles';
  END IF;
  
  -- Log role changes by admins
  IF OLD.role != NEW.role AND has_role('admin'::text) THEN
    PERFORM log_admin_action('role_change', NEW.id, 
      jsonb_build_object('old_role', OLD.role, 'new_role', NEW.role));
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to enforce profile update validation
DROP TRIGGER IF EXISTS validate_profile_update_trigger ON public.profiles;
CREATE TRIGGER validate_profile_update_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_profile_update();

-- Step 2: Enhanced File Upload Security - Create rate limiting table
CREATE TABLE IF NOT EXISTS public.file_upload_rate_limits (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  upload_count integer NOT NULL DEFAULT 1,
  window_start timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on rate limits table
ALTER TABLE public.file_upload_rate_limits ENABLE ROW LEVEL SECURITY;

-- Policy for rate limits - users can view and update their own limits
CREATE POLICY "Users can manage their upload rate limits" 
ON public.file_upload_rate_limits 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Function to check and enforce upload rate limits
CREATE OR REPLACE FUNCTION public.check_upload_rate_limit(
  target_user_id uuid,
  max_uploads_per_hour integer DEFAULT 20
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_count integer;
  window_start_time timestamp with time zone;
BEGIN
  -- Calculate window start (1 hour ago)
  window_start_time := now() - interval '1 hour';
  
  -- Clean up old entries
  DELETE FROM public.file_upload_rate_limits 
  WHERE user_id = target_user_id 
    AND window_start < window_start_time;
  
  -- Get current count for this hour
  SELECT COALESCE(SUM(upload_count), 0) INTO current_count
  FROM public.file_upload_rate_limits
  WHERE user_id = target_user_id 
    AND window_start >= window_start_time;
  
  -- Check if limit exceeded
  IF current_count >= max_uploads_per_hour THEN
    RETURN false;
  END IF;
  
  -- Increment counter
  INSERT INTO public.file_upload_rate_limits (user_id, upload_count, window_start)
  VALUES (target_user_id, 1, now())
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    upload_count = file_upload_rate_limits.upload_count + 1;
  
  RETURN true;
END;
$$;

-- Step 3: Security Monitoring - Enhanced audit logging
CREATE TABLE IF NOT EXISTS public.security_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type text NOT NULL,
  user_id uuid,
  ip_address inet,
  user_agent text,
  details jsonb,
  severity text NOT NULL DEFAULT 'info',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on security events
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;

-- Only admins can view security events
CREATE POLICY "Admins can view security events" 
ON public.security_events 
FOR SELECT 
USING (has_role('admin'::text));

-- System can insert security events
CREATE POLICY "System can create security events" 
ON public.security_events 
FOR INSERT 
WITH CHECK (true);

-- Function to log security events
CREATE OR REPLACE FUNCTION public.log_security_event(
  event_type text,
  target_user_id uuid DEFAULT NULL,
  event_details jsonb DEFAULT NULL,
  event_severity text DEFAULT 'info'
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.security_events (
    event_type,
    user_id,
    details,
    severity
  ) VALUES (
    event_type,
    target_user_id,
    event_details,
    event_severity
  );
END;
$$;