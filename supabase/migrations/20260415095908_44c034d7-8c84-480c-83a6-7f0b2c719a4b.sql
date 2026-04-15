
-- Aircraft Status
CREATE TABLE public.aircraft_status (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  aoc_holder text,
  registration_mark text,
  aircraft_type text,
  serial_number text,
  cofa_expiry date,
  registered_owner text,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.aircraft_status ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to aircraft_status" ON public.aircraft_status FOR ALL USING (true) WITH CHECK (true);

-- AMO Licenses
CREATE TABLE public.amo_licenses (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  holder_criteria text,
  approval_number text,
  maintenance_location text,
  expiry_date date,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.amo_licenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to amo_licenses" ON public.amo_licenses FOR ALL USING (true) WITH CHECK (true);

-- ATO Licenses
CREATE TABLE public.ato_licenses (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_name text,
  certificate_number text,
  training_type text,
  issue_date date,
  expiry_date date,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.ato_licenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to ato_licenses" ON public.ato_licenses FOR ALL USING (true) WITH CHECK (true);

-- Acceptance Certificates
CREATE TABLE public.acceptance_certificates (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  certificate_number text,
  aircraft_manufacturer text,
  aircraft_type text,
  serial_number text,
  issue_date date,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.acceptance_certificates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to acceptance_certificates" ON public.acceptance_certificates FOR ALL USING (true) WITH CHECK (true);

-- Aircraft Types
CREATE TABLE public.aircraft_types (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type_name text NOT NULL,
  manufacturer text,
  category text,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.aircraft_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to aircraft_types" ON public.aircraft_types FOR ALL USING (true) WITH CHECK (true);

-- Aircraft Manufacturers
CREATE TABLE public.aircraft_manufacturers (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  manufacturer_name text NOT NULL,
  country text,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.aircraft_manufacturers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to aircraft_manufacturers" ON public.aircraft_manufacturers FOR ALL USING (true) WITH CHECK (true);

-- Operation Types
CREATE TABLE public.operation_types (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  operation_type text NOT NULL,
  category text,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.operation_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to operation_types" ON public.operation_types FOR ALL USING (true) WITH CHECK (true);

-- State of Registry
CREATE TABLE public.state_of_registry (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  country_name text NOT NULL,
  country_code text,
  registration_prefix text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.state_of_registry ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to state_of_registry" ON public.state_of_registry FOR ALL USING (true) WITH CHECK (true);

-- Training Organizations
CREATE TABLE public.training_organizations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_name text NOT NULL,
  country text,
  category text,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.training_organizations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to training_organizations" ON public.training_organizations FOR ALL USING (true) WITH CHECK (true);

-- Travel Agencies
CREATE TABLE public.travel_agencies (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agency_name text NOT NULL,
  location text,
  contact_person text,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.travel_agencies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to travel_agencies" ON public.travel_agencies FOR ALL USING (true) WITH CHECK (true);

-- Foreign Registration Marks
CREATE TABLE public.foreign_registration_marks (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  registration_mark text NOT NULL,
  country text,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.foreign_registration_marks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to foreign_registration_marks" ON public.foreign_registration_marks FOR ALL USING (true) WITH CHECK (true);

-- Certificate Types
CREATE TABLE public.certificate_types (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  certificate_name text NOT NULL,
  category text,
  validity text,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.certificate_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to certificate_types" ON public.certificate_types FOR ALL USING (true) WITH CHECK (true);

-- Foreign Airlines
CREATE TABLE public.foreign_airlines (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  airline_name text NOT NULL,
  country text,
  iata_code text,
  icao_code text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.foreign_airlines ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to foreign_airlines" ON public.foreign_airlines FOR ALL USING (true) WITH CHECK (true);

-- User Roles Config
CREATE TABLE public.user_roles_config (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  role_name text NOT NULL,
  description text,
  permissions jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.user_roles_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to user_roles_config" ON public.user_roles_config FOR ALL USING (true) WITH CHECK (true);
