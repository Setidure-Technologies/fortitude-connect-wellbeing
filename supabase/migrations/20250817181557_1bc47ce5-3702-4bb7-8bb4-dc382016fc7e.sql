-- Tighten RLS on question_responses and add secure aggregate/anon access

-- 1) Drop overly-permissive SELECT policy if exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'question_responses' 
      AND policyname = 'Users can view question responses'
  ) THEN
    EXECUTE 'DROP POLICY "Users can view question responses" ON public.question_responses';
  END IF;
END$$;

-- 2) Add strict SELECT policy: only own responses
CREATE POLICY "Users can view own question responses"
ON public.question_responses
FOR SELECT
USING (auth.uid() = user_id);

-- Keep existing INSERT/UPDATE policies as-is

-- 3) Create SECURITY DEFINER function for aggregates
CREATE OR REPLACE FUNCTION public.get_question_response_aggregates(question_uuid uuid)
RETURNS TABLE(option_value text, response_count bigint, total_count bigint)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  WITH counts AS (
    SELECT selected_option AS option_value, COUNT(*)::bigint AS response_count
    FROM public.question_responses
    WHERE question_id = question_uuid
      AND selected_option IS NOT NULL
    GROUP BY selected_option
  ), total AS (
    SELECT COUNT(*)::bigint AS total_count
    FROM public.question_responses
    WHERE question_id = question_uuid
  )
  SELECT c.option_value, c.response_count, t.total_count
  FROM counts c CROSS JOIN total t;
END;
$$;

-- 4) Create SECURITY DEFINER function for anonymous responses feed
CREATE OR REPLACE FUNCTION public.get_anonymous_question_responses(question_uuid uuid, max_rows integer DEFAULT 50)
RETURNS TABLE(id uuid, question_id uuid, response_text text, selected_option text, created_at timestamptz)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT qr.id, qr.question_id, qr.response_text, qr.selected_option, qr.created_at
  FROM public.question_responses qr
  WHERE qr.question_id = question_uuid
    AND qr.is_anonymous = true
  ORDER BY qr.created_at DESC
  LIMIT COALESCE(max_rows, 50);
END;
$$;

-- 5) Grant execute to anon and authenticated so public/clients can call safely
GRANT EXECUTE ON FUNCTION public.get_question_response_aggregates(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_anonymous_question_responses(uuid, integer) TO anon, authenticated;