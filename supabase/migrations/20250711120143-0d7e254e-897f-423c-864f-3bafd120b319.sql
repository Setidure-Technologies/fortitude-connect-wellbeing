-- Create enhanced role sync functions and triggers

-- Function to sync profile role changes back to auth.users metadata
CREATE OR REPLACE FUNCTION public.sync_profile_to_auth()
RETURNS TRIGGER AS $$
BEGIN
  -- Update auth.users metadata when profile role changes
  UPDATE auth.users 
  SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || 
    jsonb_build_object('role', NEW.role::text, 'full_name', NEW.full_name)
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to sync profile changes to auth metadata
DROP TRIGGER IF EXISTS sync_profile_to_auth_trigger ON public.profiles;
CREATE TRIGGER sync_profile_to_auth_trigger
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  WHEN (OLD.role IS DISTINCT FROM NEW.role OR OLD.full_name IS DISTINCT FROM NEW.full_name)
  EXECUTE FUNCTION public.sync_profile_to_auth();

-- Function to force role sync for a specific user
CREATE OR REPLACE FUNCTION public.force_role_sync(target_user_id UUID)
RETURNS VOID AS $$
DECLARE
  user_profile RECORD;
BEGIN
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to verify role consistency
CREATE OR REPLACE FUNCTION public.check_role_consistency(target_user_id UUID)
RETURNS TABLE(
  profile_role TEXT,
  auth_role TEXT,
  is_consistent BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.role::text as profile_role,
    u.raw_user_meta_data->>'role' as auth_role,
    (p.role::text = u.raw_user_meta_data->>'role') as is_consistent
  FROM public.profiles p
  LEFT JOIN auth.users u ON p.id = u.id
  WHERE p.id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;