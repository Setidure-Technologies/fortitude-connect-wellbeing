-- Step 1: Fix Profile Update Policy Conflicts
-- Remove the conflicting policy that prevents normal users from updating profiles
DROP POLICY IF EXISTS "Users can update own profile (except role)" ON public.profiles;

-- Ensure clear separation: admins can update any profile including roles, users can update their own data except roles
CREATE POLICY "Users can update own profile data" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id) 
WITH CHECK (
  auth.uid() = id AND 
  -- Prevent role changes by non-admins by checking if role is being changed
  (OLD.role = NEW.role OR has_role('admin'::text))
);

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
    upload_count = file_upload_rate_limits.upload_count + 1,
    window_start = GREATEST(file_upload_rate_limits.window_start, window_start_time);
  
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

-- Step 4: Enhanced file validation function
CREATE OR REPLACE FUNCTION public.validate_file_upload(
  file_name text,
  file_size bigint,
  file_type text,
  user_id uuid
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  validation_result jsonb := '{"valid": true, "errors": []}'::jsonb;
  errors jsonb := '[]'::jsonb;
  max_size_mb integer;
  allowed_types text[];
BEGIN
  -- Check rate limiting first
  IF NOT check_upload_rate_limit(user_id) THEN
    errors := errors || '["Rate limit exceeded. Too many uploads in the last hour."]'::jsonb;
  END IF;
  
  -- File size validation based on type
  CASE 
    WHEN file_type LIKE 'image/%' THEN
      max_size_mb := 5;
      allowed_types := ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    WHEN file_type LIKE 'audio/%' THEN
      max_size_mb := 25;
      allowed_types := ARRAY['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a'];
    WHEN file_type = 'application/pdf' THEN
      max_size_mb := 10;
      allowed_types := ARRAY['application/pdf'];
    ELSE
      errors := errors || format('["File type %s is not allowed"]', file_type)::jsonb;
  END CASE;
  
  -- Check file size
  IF file_size > (max_size_mb * 1024 * 1024) THEN
    errors := errors || format('["File size exceeds %sMB limit"]', max_size_mb)::jsonb;
  END IF;
  
  -- Check file type
  IF NOT (file_type = ANY(allowed_types)) THEN
    errors := errors || format('["File type %s is not allowed"]', file_type)::jsonb;
  END IF;
  
  -- Check filename for malicious patterns
  IF file_name ~ '\.(exe|bat|cmd|scr|vbs|js|jar|com|pif)$' THEN
    errors := errors || '["Potentially dangerous file extension detected"]'::jsonb;
  END IF;
  
  -- Log security event if validation fails
  IF jsonb_array_length(errors) > 0 THEN
    PERFORM log_security_event(
      'file_upload_validation_failed',
      user_id,
      jsonb_build_object(
        'file_name', file_name,
        'file_size', file_size,
        'file_type', file_type,
        'errors', errors
      ),
      'warn'
    );
    
    validation_result := jsonb_build_object(
      'valid', false,
      'errors', errors
    );
  END IF;
  
  RETURN validation_result;
END;
$$;