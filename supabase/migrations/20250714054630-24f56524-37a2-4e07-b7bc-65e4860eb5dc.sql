-- Recreate the get_unique_display_id function with proper security definer
CREATE OR REPLACE FUNCTION public.get_unique_display_id()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;

-- Also recreate the generate_display_id function with proper security definer
CREATE OR REPLACE FUNCTION public.generate_display_id()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;

-- Recreate the handle_new_user function with proper security definer
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, display_id)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'patient'::public.user_role),
    get_unique_display_id()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    role = COALESCE(EXCLUDED.role, profiles.role),
    display_id = COALESCE(profiles.display_id, get_unique_display_id());
  RETURN NEW;
END;
$$;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.get_unique_display_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.generate_display_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;