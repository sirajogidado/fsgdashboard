
CREATE TABLE IF NOT EXISTS public.user_module_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  module_key text NOT NULL,
  granted_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, module_key)
);

ALTER TABLE public.user_module_access ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to user_module_access"
  ON public.user_module_access FOR ALL
  USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_uma_user ON public.user_module_access(user_id);
