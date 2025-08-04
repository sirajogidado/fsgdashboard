-- Create audit_trail table for tracking user actions
CREATE TABLE public.audit_trail (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  staff_name TEXT NOT NULL,
  staff_id TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('CREATE', 'UPDATE', 'DELETE', 'VIEW')),
  module TEXT NOT NULL,
  record_id TEXT,
  description TEXT NOT NULL,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on audit_trail table
ALTER TABLE public.audit_trail ENABLE ROW LEVEL SECURITY;

-- Create policies for audit_trail table
CREATE POLICY "Super users can view all audit records" 
ON public.audit_trail 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id::text = auth.uid()::text 
    AND users.role = 'Super User' 
    AND users.is_active = true
  )
);

CREATE POLICY "System can insert audit records" 
ON public.audit_trail 
FOR INSERT 
WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_audit_trail_user_id ON public.audit_trail(user_id);
CREATE INDEX idx_audit_trail_action ON public.audit_trail(action);
CREATE INDEX idx_audit_trail_module ON public.audit_trail(module);
CREATE INDEX idx_audit_trail_created_at ON public.audit_trail(created_at);

-- Create function to log audit trail
CREATE OR REPLACE FUNCTION public.log_audit_trail(
  p_user_id UUID,
  p_staff_name TEXT,
  p_staff_id TEXT,
  p_action TEXT,
  p_module TEXT,
  p_record_id TEXT DEFAULT NULL,
  p_description TEXT DEFAULT '',
  p_old_values JSONB DEFAULT NULL,
  p_new_values JSONB DEFAULT NULL,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  audit_id UUID;
BEGIN
  INSERT INTO public.audit_trail (
    user_id,
    staff_name,
    staff_id,
    action,
    module,
    record_id,
    description,
    old_values,
    new_values,
    ip_address,
    user_agent
  ) VALUES (
    p_user_id,
    p_staff_name,
    p_staff_id,
    p_action,
    p_module,
    p_record_id,
    p_description,
    p_old_values,
    p_new_values,
    p_ip_address,
    p_user_agent
  ) RETURNING id INTO audit_id;
  
  RETURN audit_id;
END;
$$;