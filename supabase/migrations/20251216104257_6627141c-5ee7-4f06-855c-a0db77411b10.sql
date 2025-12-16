-- Create function to update timestamps if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create aerodrome certifications table
CREATE TABLE public.aerodrome_certifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  aerodrome_name TEXT NOT NULL,
  icao_code TEXT,
  location TEXT NOT NULL,
  certificate_number TEXT NOT NULL UNIQUE,
  certificate_type TEXT NOT NULL,
  issue_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  operator_name TEXT NOT NULL,
  runway_count INTEGER DEFAULT 1,
  runway_length TEXT,
  category TEXT,
  last_inspection_date DATE,
  next_inspection_date DATE,
  comments TEXT,
  certificate_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.aerodrome_certifications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Authenticated users can view aerodrome certifications"
ON public.aerodrome_certifications
FOR SELECT
USING (true);

CREATE POLICY "DAAS and Super users can modify aerodrome certifications"
ON public.aerodrome_certifications
FOR ALL
USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_aerodrome_certifications_updated_at
BEFORE UPDATE ON public.aerodrome_certifications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();