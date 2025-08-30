-- Create admins table to store admin user profiles
CREATE TABLE public.admins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  clinic_id UUID REFERENCES public.clinics(id),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  permissions JSONB DEFAULT '{"can_manage_staff": true, "can_view_analytics": true, "can_manage_billing": true}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access
CREATE POLICY "Admins can view their own record" 
ON public.admins 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can update their own record" 
ON public.admins 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can insert their own record" 
ON public.admins 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Super admins can manage all admins" 
ON public.admins 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM super_admins 
  WHERE super_admins.user_id = auth.uid()
));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_admins_updated_at
BEFORE UPDATE ON public.admins
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();