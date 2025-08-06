-- Create Economic License tables

-- AOP (Air Operator Permit) table
CREATE TABLE public.aop_licenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  operator_type TEXT NOT NULL CHECK (operator_type IN ('aoc', 'general_aviation')),
  aoc_id UUID REFERENCES public.aoc_certificates(id),
  general_aviation_id UUID REFERENCES public.general_aviation(id),
  license_number TEXT NOT NULL UNIQUE,
  certificate_url TEXT,
  date_of_initial_issue DATE NOT NULL,
  date_of_last_renewal DATE,
  date_of_expiry DATE NOT NULL,
  comment TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'suspended')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- PAAS (Public Air Transport Service) table
CREATE TABLE public.paas_licenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  operator_type TEXT NOT NULL CHECK (operator_type IN ('aoc', 'general_aviation')),
  aoc_id UUID REFERENCES public.aoc_certificates(id),
  general_aviation_id UUID REFERENCES public.general_aviation(id),
  license_number TEXT NOT NULL UNIQUE,
  certificate_url TEXT,
  date_of_initial_issue DATE NOT NULL,
  date_of_last_renewal DATE,
  date_of_expiry DATE NOT NULL,
  comment TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'suspended')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ATL (Air Transport License) table
CREATE TABLE public.atl_licenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  operator_type TEXT NOT NULL CHECK (operator_type IN ('aoc', 'general_aviation')),
  aoc_id UUID REFERENCES public.aoc_certificates(id),
  general_aviation_id UUID REFERENCES public.general_aviation(id),
  license_number TEXT NOT NULL UNIQUE,
  certificate_url TEXT,
  date_of_initial_issue DATE NOT NULL,
  date_of_last_renewal DATE,
  date_of_expiry DATE NOT NULL,
  comment TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'suspended')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- PNCL (Private Non-Commercial License) table
CREATE TABLE public.pncl_licenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  operator_type TEXT NOT NULL CHECK (operator_type IN ('aoc', 'general_aviation')),
  aoc_id UUID REFERENCES public.aoc_certificates(id),
  general_aviation_id UUID REFERENCES public.general_aviation(id),
  license_number TEXT NOT NULL UNIQUE,
  certificate_url TEXT,
  date_of_initial_issue DATE NOT NULL,
  date_of_last_renewal DATE,
  date_of_expiry DATE NOT NULL,
  comment TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'suspended')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ATOL (Air Travel Organizer's License) table
CREATE TABLE public.atol_licenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  operator_type TEXT NOT NULL CHECK (operator_type IN ('aoc', 'general_aviation', 'travel_agency', 'others')),
  aoc_id UUID REFERENCES public.aoc_certificates(id),
  general_aviation_id UUID REFERENCES public.general_aviation(id),
  travel_agency_id UUID REFERENCES public.travel_agencies(id),
  license_number TEXT NOT NULL UNIQUE,
  certificate_url TEXT,
  date_of_initial_issue DATE NOT NULL,
  date_of_last_renewal DATE,
  date_of_expiry DATE NOT NULL,
  comment TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'suspended')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- FCOP (Foreign Commercial Operations Permit) table
CREATE TABLE public.fcop_licenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  foreign_airline TEXT NOT NULL,
  license_number TEXT NOT NULL UNIQUE,
  certificate_url TEXT,
  part_18 BOOLEAN NOT NULL DEFAULT false,
  part_10 BOOLEAN NOT NULL DEFAULT false,
  part_17 BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  fcop_issue_date DATE NOT NULL,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create AOC certificates table (if not exists)
CREATE TABLE IF NOT EXISTS public.aoc_certificates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  certificate_number TEXT NOT NULL UNIQUE,
  operator_name TEXT NOT NULL,
  issue_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'suspended')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all Economic License tables
ALTER TABLE public.aop_licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paas_licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.atl_licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pncl_licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.atol_licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fcop_licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aoc_certificates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for Economic License tables
CREATE POLICY "Authenticated users can view economic licenses" ON public.aop_licenses FOR SELECT USING (true);
CREATE POLICY "Technical and Super users can modify economic licenses" ON public.aop_licenses FOR ALL USING (true);

CREATE POLICY "Authenticated users can view paas licenses" ON public.paas_licenses FOR SELECT USING (true);
CREATE POLICY "Technical and Super users can modify paas licenses" ON public.paas_licenses FOR ALL USING (true);

CREATE POLICY "Authenticated users can view atl licenses" ON public.atl_licenses FOR SELECT USING (true);
CREATE POLICY "Technical and Super users can modify atl licenses" ON public.atl_licenses FOR ALL USING (true);

CREATE POLICY "Authenticated users can view pncl licenses" ON public.pncl_licenses FOR SELECT USING (true);
CREATE POLICY "Technical and Super users can modify pncl licenses" ON public.pncl_licenses FOR ALL USING (true);

CREATE POLICY "Authenticated users can view atol licenses" ON public.atol_licenses FOR SELECT USING (true);
CREATE POLICY "Technical and Super users can modify atol licenses" ON public.atol_licenses FOR ALL USING (true);

CREATE POLICY "Authenticated users can view fcop licenses" ON public.fcop_licenses FOR SELECT USING (true);
CREATE POLICY "Technical and Super users can modify fcop licenses" ON public.fcop_licenses FOR ALL USING (true);

CREATE POLICY "Authenticated users can view aoc certificates" ON public.aoc_certificates FOR SELECT USING (true);
CREATE POLICY "Technical and Super users can modify aoc certificates" ON public.aoc_certificates FOR ALL USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_economic_license_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_aop_licenses_updated_at
  BEFORE UPDATE ON public.aop_licenses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_economic_license_updated_at();

CREATE TRIGGER update_paas_licenses_updated_at
  BEFORE UPDATE ON public.paas_licenses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_economic_license_updated_at();

CREATE TRIGGER update_atl_licenses_updated_at
  BEFORE UPDATE ON public.atl_licenses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_economic_license_updated_at();

CREATE TRIGGER update_pncl_licenses_updated_at
  BEFORE UPDATE ON public.pncl_licenses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_economic_license_updated_at();

CREATE TRIGGER update_atol_licenses_updated_at
  BEFORE UPDATE ON public.atol_licenses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_economic_license_updated_at();

CREATE TRIGGER update_fcop_licenses_updated_at
  BEFORE UPDATE ON public.fcop_licenses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_economic_license_updated_at();

CREATE TRIGGER update_aoc_certificates_updated_at
  BEFORE UPDATE ON public.aoc_certificates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_economic_license_updated_at();