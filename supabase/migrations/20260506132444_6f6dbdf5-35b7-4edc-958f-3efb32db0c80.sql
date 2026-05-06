-- 1. user_sessions table
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  token text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '7 days'),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON public.user_sessions(token);
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
-- No policies = deny all to anon/authenticated; service role bypasses RLS.

-- 2. Lock down users table
DROP POLICY IF EXISTS "Allow all access to users" ON public.users;
-- No replacement policies; only service role (edge functions) may access.

-- 3. Lock down pending_registrations
DROP POLICY IF EXISTS "Allow all access to pending_registrations" ON public.pending_registrations;
-- Allow anonymous self-registration (insert only) so the public registration form keeps working.
CREATE POLICY "Anyone can submit a registration"
  ON public.pending_registrations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    status = 'pending'
    AND char_length(full_name) BETWEEN 1 AND 200
    AND char_length(email) BETWEEN 3 AND 320
  );

-- 4. Fix approve_pending_registration search_path
CREATE OR REPLACE FUNCTION public.approve_pending_registration(registration_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  reg RECORD;
BEGIN
  SELECT * INTO reg FROM public.pending_registrations WHERE id = registration_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Registration not found'; END IF;

  INSERT INTO public.users (name, email, phone_number, directorate, role, password_hash)
  VALUES (reg.full_name, reg.email, reg.phone_number, reg.requested_directorate,
          COALESCE(reg.requested_role, 'Read and View'), 'password');

  UPDATE public.pending_registrations SET status = 'approved', updated_at = now()
  WHERE id = registration_id;
END;
$$;