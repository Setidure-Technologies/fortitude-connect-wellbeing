-- Simplify and fix the handle_new_user function for more reliable signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;

-- Ensure the trigger exists and is properly configured
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();