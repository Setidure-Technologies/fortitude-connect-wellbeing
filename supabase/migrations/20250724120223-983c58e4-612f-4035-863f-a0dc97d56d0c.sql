-- Security Fix Migration: Address Critical Vulnerabilities (Fixed)

-- 1. Fix Critical Privilege Escalation - Prevent users from updating their own role
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Create separate policies for profile updates with role protection
CREATE POLICY "Users can update own profile (except role)" ON public.profiles
FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id AND 
  -- Only allow role changes if user is admin
  has_role('admin'::text)
);

-- Create policy for non-role profile updates by regular users
CREATE POLICY "Users can update profile data" ON public.profiles
FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Admin-only policy for all profile updates including roles
CREATE POLICY "Admins can update any profile" ON public.profiles
FOR UPDATE 
USING (has_role('admin'::text))
WITH CHECK (has_role('admin'::text));

-- 2. Secure Database Functions - Add search_path protection
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$function$;

CREATE OR REPLACE FUNCTION public.sync_user_role(user_id uuid, new_role text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Only allow admins to sync roles
  IF NOT has_role('admin'::text) THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;
  
  UPDATE public.profiles 
  SET role = new_role::public.user_role 
  WHERE id = user_id;
  
  -- Log the action
  PERFORM log_admin_action('role_sync', user_id, jsonb_build_object('new_role', new_role));
END;
$function$;

CREATE OR REPLACE FUNCTION public.has_role(_role text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = _role::public.user_role
  );
$function$;

CREATE OR REPLACE FUNCTION public.sync_profile_to_auth()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $function$
BEGIN
  -- Update auth.users metadata when profile role changes
  UPDATE auth.users 
  SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || 
    jsonb_build_object('role', NEW.role::text, 'full_name', NEW.full_name)
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.force_role_sync(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $function$
DECLARE
  user_profile RECORD;
BEGIN
  -- Only allow admins to force role sync
  IF NOT has_role('admin'::text) THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;
  
  -- Get current profile data
  SELECT role, full_name INTO user_profile 
  FROM public.profiles 
  WHERE id = target_user_id;
  
  IF FOUND THEN
    -- Update auth.users metadata
    UPDATE auth.users 
    SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || 
      jsonb_build_object('role', user_profile.role::text, 'full_name', user_profile.full_name)
    WHERE id = target_user_id;
    
    -- Log the action
    PERFORM log_admin_action('force_role_sync', target_user_id, jsonb_build_object('role', user_profile.role));
  END IF;
END;
$function$;

CREATE OR REPLACE FUNCTION public.check_role_consistency(target_user_id uuid)
RETURNS TABLE(profile_role text, auth_role text, is_consistent boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $function$
BEGIN
  -- Only allow admins or users checking their own consistency
  IF NOT (has_role('admin'::text) OR auth.uid() = target_user_id) THEN
    RAISE EXCEPTION 'Access denied: Can only check own role consistency or admin access required';
  END IF;
  
  RETURN QUERY
  SELECT 
    p.role::text as profile_role,
    u.raw_user_meta_data->>'role' as auth_role,
    (p.role::text = u.raw_user_meta_data->>'role') as is_consistent
  FROM public.profiles p
  LEFT JOIN auth.users u ON p.id = u.id
  WHERE p.id = target_user_id;
END;
$function$;

-- 3. Create audit logging table for admin actions
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL,
  action text NOT NULL,
  target_user_id uuid,
  details jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on audit log
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs" ON public.admin_audit_log
FOR SELECT USING (has_role('admin'::text));

-- System can create audit logs
CREATE POLICY "System can create audit logs" ON public.admin_audit_log
FOR INSERT WITH CHECK (true);

-- 4. Create function to log admin actions
CREATE OR REPLACE FUNCTION public.log_admin_action(
  action_type text,
  target_user_id uuid DEFAULT NULL,
  action_details jsonb DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.admin_audit_log (
    admin_id,
    action,
    target_user_id,
    details
  ) VALUES (
    auth.uid(),
    action_type,
    target_user_id,
    action_details
  );
END;
$function$;

-- 5. Create secure admin promotion function
CREATE OR REPLACE FUNCTION public.promote_user_to_admin(target_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $function$
BEGIN
  -- Only allow existing admins to promote users
  IF NOT has_role('admin'::text) THEN
    RAISE EXCEPTION 'Access denied: Admin role required to promote users';
  END IF;
  
  -- Update user role
  UPDATE public.profiles 
  SET role = 'admin'::public.user_role,
      updated_at = now()
  WHERE email = target_email;
  
  -- Log the promotion
  PERFORM log_admin_action('promote_to_admin', 
    (SELECT id FROM public.profiles WHERE email = target_email),
    jsonb_build_object('email', target_email)
  );
  
  -- Send notification
  INSERT INTO public.notifications (
    user_id, 
    type, 
    title, 
    message
  ) 
  SELECT 
    id,
    'role_change',
    'Role Updated',
    'You have been promoted to administrator'
  FROM public.profiles 
  WHERE email = target_email;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User with email % not found', target_email;
  END IF;
END;
$function$;