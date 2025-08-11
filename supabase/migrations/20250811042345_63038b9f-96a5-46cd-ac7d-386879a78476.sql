-- Security Fix: Restrict access to sensitive profile information
-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create separate policies for public vs private profile data
CREATE POLICY "Users can view public profile info" 
ON public.profiles 
FOR SELECT 
USING (
  -- Users can view basic public info of all profiles
  true
);

-- Create a view for public profile information only
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
  id,
  full_name,
  username,
  display_id,
  role,
  cancer_type,
  age_group,
  location,
  bio,
  profile_image_url,
  is_anonymous,
  created_at
FROM public.profiles;

-- Grant access to the public view
GRANT SELECT ON public.public_profiles TO authenticated, anon;

-- Create RLS policy for the view
ALTER VIEW public.public_profiles SET (security_invoker = true);

-- Create a secure function to get sensitive profile data (email, diagnosis_date) 
-- that only the profile owner or admins can access
CREATE OR REPLACE FUNCTION public.get_sensitive_profile_data(target_user_id uuid)
RETURNS TABLE(email text, diagnosis_date date)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow profile owner or admins to access sensitive data
  IF NOT (auth.uid() = target_user_id OR has_role('admin'::text)) THEN
    RAISE EXCEPTION 'Access denied: You can only view your own sensitive profile data';
  END IF;
  
  RETURN QUERY
  SELECT p.email, p.diagnosis_date
  FROM public.profiles p
  WHERE p.id = target_user_id;
END;
$$;

-- Update existing profile policies to be more restrictive
CREATE POLICY "Users can view own sensitive profile data" 
ON public.profiles 
FOR SELECT 
USING (
  -- Users can only see full profile data (including email) for themselves
  auth.uid() = id OR has_role('admin'::text)
);

-- Ensure the public policy is the default and more restrictive policy takes precedence
DROP POLICY IF EXISTS "Users can view public profile info" ON public.profiles;