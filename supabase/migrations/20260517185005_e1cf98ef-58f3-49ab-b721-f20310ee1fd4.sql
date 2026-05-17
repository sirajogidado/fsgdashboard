
-- Workflow stages config
CREATE TABLE public.workflow_stages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  stage_key TEXT NOT NULL UNIQUE,
  stage_name TEXT NOT NULL,
  stage_order INTEGER NOT NULL DEFAULT 0,
  color TEXT DEFAULT 'gray',
  is_terminal BOOLEAN DEFAULT false,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.workflow_stages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to workflow_stages" ON public.workflow_stages FOR ALL USING (true) WITH CHECK (true);

-- Per-record workflow state (generic across all module tables)
CREATE TABLE public.record_workflow (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  current_stage TEXT NOT NULL DEFAULT 'draft',
  assigned_to UUID,
  submitted_by UUID,
  submitted_at TIMESTAMPTZ,
  approved_by UUID,
  approved_at TIMESTAMPTZ,
  rejection_reason TEXT,
  directorate TEXT,
  priority TEXT DEFAULT 'normal',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (table_name, record_id)
);

CREATE INDEX idx_record_workflow_assigned ON public.record_workflow(assigned_to, current_stage);
CREATE INDEX idx_record_workflow_lookup ON public.record_workflow(table_name, record_id);

ALTER TABLE public.record_workflow ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to record_workflow" ON public.record_workflow FOR ALL USING (true) WITH CHECK (true);

-- Workflow transition history
CREATE TABLE public.workflow_transitions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  record_workflow_id UUID NOT NULL,
  from_stage TEXT,
  to_stage TEXT NOT NULL,
  actor_id UUID,
  actor_name TEXT,
  action TEXT NOT NULL,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_workflow_transitions_rwid ON public.workflow_transitions(record_workflow_id);

ALTER TABLE public.workflow_transitions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to workflow_transitions" ON public.workflow_transitions FOR ALL USING (true) WITH CHECK (true);

-- In-app notifications
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  category TEXT DEFAULT 'general',
  link TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_notifications_user ON public.notifications(user_id, is_read, created_at DESC);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to notifications" ON public.notifications FOR ALL USING (true) WITH CHECK (true);

-- Notification preferences
CREATE TABLE public.notification_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  email_enabled BOOLEAN DEFAULT true,
  sms_enabled BOOLEAN DEFAULT false,
  email_approvals BOOLEAN DEFAULT true,
  email_expiry BOOLEAN DEFAULT true,
  email_general BOOLEAN DEFAULT true,
  sms_approvals BOOLEAN DEFAULT false,
  sms_expiry BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to notification_preferences" ON public.notification_preferences FOR ALL USING (true) WITH CHECK (true);

-- Seed default workflow stages
INSERT INTO public.workflow_stages (stage_key, stage_name, stage_order, color, is_terminal, description) VALUES
  ('draft', 'Draft', 10, 'gray', false, 'Record is being prepared'),
  ('submitted', 'Submitted for Review', 20, 'blue', false, 'Submitted for inspector review'),
  ('inspector_review', 'Inspector Review', 30, 'amber', false, 'Under technical inspection'),
  ('director_review', 'Director Approval', 40, 'purple', false, 'Awaiting directorate approval'),
  ('approved', 'Approved / Issued', 50, 'green', true, 'Certificate issued'),
  ('rejected', 'Rejected', 60, 'red', true, 'Application rejected'),
  ('expired', 'Expired', 70, 'red', true, 'Certificate expired');

-- Seed notification prefs for existing users
INSERT INTO public.notification_preferences (user_id)
SELECT id FROM public.users
ON CONFLICT (user_id) DO NOTHING;

-- Updated_at triggers
CREATE TRIGGER set_workflow_stages_updated_at BEFORE UPDATE ON public.workflow_stages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER set_record_workflow_updated_at BEFORE UPDATE ON public.record_workflow
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER set_notification_preferences_updated_at BEFORE UPDATE ON public.notification_preferences
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for notifications inbox
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.record_workflow;
