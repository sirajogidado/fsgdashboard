
CREATE OR REPLACE FUNCTION public.approve_pending_registration(registration_id uuid)
RETURNS void AS $$
DECLARE
  reg RECORD;
BEGIN
  SELECT * INTO reg FROM pending_registrations WHERE id = registration_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Registration not found'; END IF;
  
  INSERT INTO users (name, email, phone_number, directorate, role, password_hash)
  VALUES (reg.full_name, reg.email, reg.phone_number, reg.requested_directorate, 
          COALESCE(reg.requested_role, 'Read and View'), 'password');
  
  UPDATE pending_registrations SET status = 'approved', updated_at = now() 
  WHERE id = registration_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
