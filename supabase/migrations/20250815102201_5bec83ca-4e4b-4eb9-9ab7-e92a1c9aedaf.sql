-- Create directorates table
CREATE TABLE public.directorates (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  directorate_name text NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.directorates ENABLE ROW LEVEL SECURITY;

-- Create policies for directorates
CREATE POLICY "All users can view directorates" 
ON public.directorates 
FOR SELECT 
USING (true);

CREATE POLICY "Super users can manage directorates" 
ON public.directorates 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.users 
  WHERE users.id::text = auth.uid()::text 
  AND users.role = 'Super User' 
  AND users.is_active = true
));

-- Insert default directorates
INSERT INTO public.directorates (directorate_name) VALUES 
('DOLTS'),
('DAAS'),
('DAWS'),
('DATR'),
('ICT'),
('AOC'),
('ATO'),
('DACL'),
('AMO'),
('FOCC');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_directorates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_directorates_updated_at
BEFORE UPDATE ON public.directorates
FOR EACH ROW
EXECUTE FUNCTION public.update_directorates_updated_at();