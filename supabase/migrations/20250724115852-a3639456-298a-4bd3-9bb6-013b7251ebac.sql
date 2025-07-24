-- Security Fix Migration: Address Critical Vulnerabilities

-- 1. Fix Critical Privilege Escalation - Prevent users from updating their own role
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Create separate policies for profile updates with role protection
CREATE POLICY "Users can update own profile (except role)" ON public.profiles
FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id AND 
  -- Prevent role changes unless user is admin
  (OLD.role = NEW.role OR has_role('admin'::text))
);

-- Admin-only policy for role updates
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

CREATE OR REPLACE FUNCTION public.update_user_activity()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.user_activity (user_id, last_active)
  VALUES (auth.uid(), now())
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    last_active = now(),
    activity_type = 'general';
END;
$function$;

CREATE OR REPLACE FUNCTION public.are_users_connected(user1_id uuid, user2_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.user_connections_enhanced
    WHERE ((requester_id = user1_id AND receiver_id = user2_id) 
           OR (requester_id = user2_id AND receiver_id = user1_id))
    AND status = 'accepted'
  );
$function$;

CREATE OR REPLACE FUNCTION public.is_group_member(group_uuid uuid, user_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.support_group_members 
    WHERE group_id = group_uuid 
    AND user_id = user_uuid 
    AND status = 'active'
  );
$function$;

CREATE OR REPLACE FUNCTION public.get_unique_display_id()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
    new_id TEXT;
    counter INTEGER := 0;
BEGIN
    LOOP
        new_id := generate_display_id();
        IF NOT EXISTS (SELECT 1 FROM profiles WHERE display_id = new_id) THEN
            RETURN new_id;
        END IF;
        
        counter := counter + 1;
        IF counter > 100 THEN
            RAISE EXCEPTION 'Could not generate unique display ID after 100 attempts';
        END IF;
    END LOOP;
END;
$function$;

CREATE OR REPLACE FUNCTION public.generate_display_id()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result TEXT := 'FN';
    i INTEGER;
BEGIN
    FOR i IN 1..6 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
    END LOOP;
    RETURN result;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
    new_display_id TEXT;
BEGIN
    -- Generate display_id first
    BEGIN
        new_display_id := get_unique_display_id();
    EXCEPTION WHEN OTHERS THEN
        -- Fallback to simple random ID if function fails
        new_display_id := 'FN' || upper(substr(gen_random_uuid()::text, 1, 6));
    END;
    
    -- Simple insert without complex ON CONFLICT logic
    INSERT INTO public.profiles (id, email, full_name, role, display_id)
    VALUES (
        NEW.id, 
        NEW.email, 
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'patient'::public.user_role),
        new_display_id
    );
    
    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    -- Log the error and still return NEW to not block user creation
    RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$function$;

-- 3. Create secure admin promotion function
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

-- 4. Create audit logging table for admin actions
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

-- 5. Create function to log admin actions
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