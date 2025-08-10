-- Create/update helper function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create healthcare_professionals table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.healthcare_professionals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  specialization TEXT,
  email TEXT,
  phone TEXT,
  website TEXT,
  location TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.healthcare_professionals ENABLE ROW LEVEL SECURITY;

-- Read policy: public can read
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE polname = 'Healthcare professionals are viewable by everyone' 
      AND schemaname = 'public' 
      AND tablename = 'healthcare_professionals'
  ) THEN
    CREATE POLICY "Healthcare professionals are viewable by everyone"
    ON public.healthcare_professionals
    FOR SELECT
    USING (true);
  END IF;
END $$;

-- Optional: keep writes restricted (no write policies -> blocked by RLS)

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_healthcare_professionals_updated_at ON public.healthcare_professionals;
CREATE TRIGGER update_healthcare_professionals_updated_at
BEFORE UPDATE ON public.healthcare_professionals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();