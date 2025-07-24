-- Fix remaining functions with missing search_path

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

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;