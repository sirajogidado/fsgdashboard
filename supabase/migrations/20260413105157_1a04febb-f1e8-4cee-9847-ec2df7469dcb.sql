-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Users table
CREATE TABLE public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone_number TEXT,
  directorate TEXT,
  role TEXT DEFAULT 'Technical',
  password_hash TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  profile_image TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to users" ON public.users FOR ALL USING (true) WITH CHECK (true);
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Pending registrations
CREATE TABLE public.pending_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_number TEXT,
  requested_directorate TEXT,
  requested_role TEXT,
  status TEXT DEFAULT 'pending',
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.pending_registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to pending_registrations" ON public.pending_registrations FOR ALL USING (true) WITH CHECK (true);
CREATE TRIGGER update_pending_registrations_updated_at BEFORE UPDATE ON public.pending_registrations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Directorates
CREATE TABLE public.directorates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.directorates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to directorates" ON public.directorates FOR ALL USING (true) WITH CHECK (true);

-- Aerodrome certifications
CREATE TABLE public.aerodrome_certifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  aerodrome_name TEXT NOT NULL,
  icao_code TEXT,
  location TEXT NOT NULL,
  certificate_number TEXT NOT NULL,
  certificate_type TEXT NOT NULL,
  issue_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  status TEXT DEFAULT 'active',
  operator_name TEXT NOT NULL,
  runway_count INTEGER,
  runway_length TEXT,
  category TEXT,
  last_inspection_date DATE,
  next_inspection_date DATE,
  comments TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.aerodrome_certifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to aerodrome_certifications" ON public.aerodrome_certifications FOR ALL USING (true) WITH CHECK (true);
CREATE TRIGGER update_aerodrome_certifications_updated_at BEFORE UPDATE ON public.aerodrome_certifications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Safety inspections
CREATE TABLE public.safety_inspections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  aerodrome_id UUID REFERENCES public.aerodrome_certifications(id) ON DELETE CASCADE,
  inspection_type TEXT NOT NULL,
  scheduled_date DATE NOT NULL,
  completed_date DATE,
  inspector_name TEXT NOT NULL,
  status TEXT DEFAULT 'scheduled',
  compliance_status TEXT DEFAULT 'pending',
  findings TEXT,
  recommendations TEXT,
  next_inspection_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.safety_inspections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to safety_inspections" ON public.safety_inspections FOR ALL USING (true) WITH CHECK (true);
CREATE TRIGGER update_safety_inspections_updated_at BEFORE UPDATE ON public.safety_inspections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Aerodrome personnel
CREATE TABLE public.aerodrome_personnel (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  aerodrome_id UUID REFERENCES public.aerodrome_certifications(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  position TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  hire_date DATE,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.aerodrome_personnel ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to aerodrome_personnel" ON public.aerodrome_personnel FOR ALL USING (true) WITH CHECK (true);
CREATE TRIGGER update_aerodrome_personnel_updated_at BEFORE UPDATE ON public.aerodrome_personnel FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Personnel certifications
CREATE TABLE public.personnel_certifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  personnel_id UUID REFERENCES public.aerodrome_personnel(id) ON DELETE CASCADE,
  certification_name TEXT NOT NULL,
  certification_number TEXT,
  issuing_authority TEXT,
  issue_date DATE,
  expiry_date DATE,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.personnel_certifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to personnel_certifications" ON public.personnel_certifications FOR ALL USING (true) WITH CHECK (true);
CREATE TRIGGER update_personnel_certifications_updated_at BEFORE UPDATE ON public.personnel_certifications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- AOC certificates
CREATE TABLE public.aoc_certificates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  certificate_number TEXT,
  operator_name TEXT,
  status TEXT DEFAULT 'active',
  issue_date DATE,
  expiry_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.aoc_certificates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to aoc_certificates" ON public.aoc_certificates FOR ALL USING (true) WITH CHECK (true);

-- AOP licenses
CREATE TABLE public.aop_licenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  license_number TEXT,
  operator_name TEXT,
  status TEXT DEFAULT 'active',
  issue_date DATE,
  expiry_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.aop_licenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to aop_licenses" ON public.aop_licenses FOR ALL USING (true) WITH CHECK (true);

-- PAAS licenses
CREATE TABLE public.paas_licenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  license_number TEXT,
  operator_name TEXT,
  status TEXT DEFAULT 'active',
  issue_date DATE,
  expiry_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.paas_licenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to paas_licenses" ON public.paas_licenses FOR ALL USING (true) WITH CHECK (true);

-- ATL licenses
CREATE TABLE public.atl_licenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  license_number TEXT,
  operator_name TEXT,
  status TEXT DEFAULT 'active',
  issue_date DATE,
  expiry_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.atl_licenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to atl_licenses" ON public.atl_licenses FOR ALL USING (true) WITH CHECK (true);

-- PNCL licenses
CREATE TABLE public.pncl_licenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  license_number TEXT,
  operator_name TEXT,
  status TEXT DEFAULT 'active',
  issue_date DATE,
  expiry_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.pncl_licenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to pncl_licenses" ON public.pncl_licenses FOR ALL USING (true) WITH CHECK (true);

-- ATOL licenses
CREATE TABLE public.atol_licenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  license_number TEXT,
  operator_name TEXT,
  status TEXT DEFAULT 'active',
  issue_date DATE,
  expiry_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.atol_licenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to atol_licenses" ON public.atol_licenses FOR ALL USING (true) WITH CHECK (true);

-- FCOP licenses
CREATE TABLE public.fcop_licenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  license_number TEXT,
  operator_name TEXT,
  status TEXT DEFAULT 'active',
  issue_date DATE,
  expiry_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.fcop_licenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to fcop_licenses" ON public.fcop_licenses FOR ALL USING (true) WITH CHECK (true);

-- General aviation
CREATE TABLE public.general_aviation (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  registration TEXT,
  operator_name TEXT,
  aircraft_type TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.general_aviation ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to general_aviation" ON public.general_aviation FOR ALL USING (true) WITH CHECK (true);

-- Foreign AMO
CREATE TABLE public.foreign_amo (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_name TEXT,
  country TEXT,
  approval_number TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.foreign_amo ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to foreign_amo" ON public.foreign_amo FOR ALL USING (true) WITH CHECK (true);

-- Foreign airline DACL
CREATE TABLE public.foreign_airline_dacl (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  airline_name TEXT,
  country TEXT,
  permit_number TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.foreign_airline_dacl ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to foreign_airline_dacl" ON public.foreign_airline_dacl FOR ALL USING (true) WITH CHECK (true);

-- FOCC MCC records
CREATE TABLE public.focc_mcc_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  record_number TEXT,
  operator_name TEXT,
  status TEXT DEFAULT 'active',
  issue_date DATE,
  expiry_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.focc_mcc_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to focc_mcc_records" ON public.focc_mcc_records FOR ALL USING (true) WITH CHECK (true);

-- AI chat sessions
CREATE TABLE public.ai_chat_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  session_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.ai_chat_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to ai_chat_sessions" ON public.ai_chat_sessions FOR ALL USING (true) WITH CHECK (true);

-- AI chat messages
CREATE TABLE public.ai_chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.ai_chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.ai_chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to ai_chat_messages" ON public.ai_chat_messages FOR ALL USING (true) WITH CHECK (true);

-- Document analysis
CREATE TABLE public.document_analysis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT,
  file_name TEXT,
  file_url TEXT,
  extracted_text TEXT,
  analysis_result JSONB,
  confidence_score NUMERIC,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.document_analysis ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to document_analysis" ON public.document_analysis FOR ALL USING (true) WITH CHECK (true);

-- AI reports
CREATE TABLE public.ai_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT,
  report_name TEXT,
  report_type TEXT,
  report_data JSONB,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.ai_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to ai_reports" ON public.ai_reports FOR ALL USING (true) WITH CHECK (true);

-- Audit trail
CREATE TABLE public.audit_trail (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT,
  user_name TEXT,
  action TEXT NOT NULL,
  module TEXT,
  details TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.audit_trail ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to audit_trail" ON public.audit_trail FOR ALL USING (true) WITH CHECK (true);

-- Documents
CREATE TABLE public.documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  file_url TEXT,
  file_type TEXT,
  module TEXT,
  uploaded_by TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to documents" ON public.documents FOR ALL USING (true) WITH CHECK (true);

-- Insert default admin user
INSERT INTO public.users (name, email, password_hash, directorate, role, is_active)
VALUES ('Admin', 'admin@ncaa.gov.ng', 'admin123', 'DAWS', 'Admin', true);

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
ALTER PUBLICATION supabase_realtime ADD TABLE public.pending_registrations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.aerodrome_certifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.safety_inspections;
ALTER PUBLICATION supabase_realtime ADD TABLE public.aerodrome_personnel;