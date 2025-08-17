-- Update the validate_profile_update function to allow basic role changes
CREATE OR REPLACE FUNCTION public.validate_profile_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- If role is being changed, check permissions
  IF OLD.role != NEW.role THEN
    -- Admins can change any role
    IF has_role('admin'::text) THEN
      -- Log role changes by admins
      PERFORM log_admin_action('role_change', NEW.id, 
        jsonb_build_object('old_role', OLD.role, 'new_role', NEW.role));
    ELSE
      -- Non-admins can only change between basic roles (patient, survivor, caregiver, volunteer)
      -- They cannot set admin or ngo roles
      IF NEW.role IN ('admin', 'ngo') THEN
        RAISE EXCEPTION 'Only administrators can assign admin or NGO roles';
      END IF;
      
      -- Log self role changes
      PERFORM log_admin_action('self_role_change', NEW.id, 
        jsonb_build_object('old_role', OLD.role, 'new_role', NEW.role));
    END IF;
  END IF;
  
  RETURN NEW;
END;
$function$;