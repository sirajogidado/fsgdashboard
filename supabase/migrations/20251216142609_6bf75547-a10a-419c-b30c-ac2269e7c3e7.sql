-- Create safety_inspections table
CREATE TABLE public.safety_inspections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  aerodrome_id UUID REFERENCES public.aerodrome_certifications(id) ON DELETE CASCADE,
  inspection_type TEXT NOT NULL,
  scheduled_date DATE NOT NULL,
  completed_date DATE,
  inspector_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled',
  compliance_status TEXT DEFAULT 'pending',
  findings TEXT,
  recommendations TEXT,
  next_inspection_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create aerodrome_personnel table
CREATE TABLE public.aerodrome_personnel (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  aerodrome_id UUID REFERENCES public.aerodrome_certifications(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  position TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  hire_date DATE,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create personnel_certifications table
CREATE TABLE public.personnel_certifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  personnel_id UUID REFERENCES public.aerodrome_personnel(id) ON DELETE CASCADE,
  certification_name TEXT NOT NULL,
  certification_number TEXT,
  issuing_authority TEXT NOT NULL,
  issue_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  certificate_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.safety_inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aerodrome_personnel ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personnel_certifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for safety_inspections
CREATE POLICY "Authenticated users can view safety inspections"
ON public.safety_inspections FOR SELECT USING (true);

CREATE POLICY "DAAS and Super users can modify safety inspections"
ON public.safety_inspections FOR ALL USING (true);

-- RLS Policies for aerodrome_personnel
CREATE POLICY "Authenticated users can view aerodrome personnel"
ON public.aerodrome_personnel FOR SELECT USING (true);

CREATE POLICY "DAAS and Super users can modify aerodrome personnel"
ON public.aerodrome_personnel FOR ALL USING (true);

-- RLS Policies for personnel_certifications
CREATE POLICY "Authenticated users can view personnel certifications"
ON public.personnel_certifications FOR SELECT USING (true);

CREATE POLICY "DAAS and Super users can modify personnel certifications"
ON public.personnel_certifications FOR ALL USING (true);

-- Create triggers for updated_at
CREATE TRIGGER update_safety_inspections_updated_at
BEFORE UPDATE ON public.safety_inspections
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_aerodrome_personnel_updated_at
BEFORE UPDATE ON public.aerodrome_personnel
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_personnel_certifications_updated_at
BEFORE UPDATE ON public.personnel_certifications
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();