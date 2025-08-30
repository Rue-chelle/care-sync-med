-- Fix the function search path security issue
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Fix the log_audit_trail function search path
CREATE OR REPLACE FUNCTION public.log_audit_trail()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.audit_logs (
    user_id,
    action,
    resource_type,
    resource_id,
    details
  ) VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    CASE 
      WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD)
      ELSE to_jsonb(NEW)
    END
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Fix the update_doctor_analytics function search path
CREATE OR REPLACE FUNCTION public.update_doctor_analytics()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    INSERT INTO public.doctor_analytics (doctor_id, date, patients_seen, appointments_completed)
    VALUES (NEW.doctor_id, NEW.appointment_date, 1, 1)
    ON CONFLICT (doctor_id, date)
    DO UPDATE SET
      patients_seen = doctor_analytics.patients_seen + 1,
      appointments_completed = doctor_analytics.appointments_completed + 1,
      updated_at = now();
  ELSIF NEW.status = 'cancelled' AND OLD.status != 'cancelled' THEN
    INSERT INTO public.doctor_analytics (doctor_id, date, appointments_cancelled)
    VALUES (NEW.doctor_id, NEW.appointment_date, 1)
    ON CONFLICT (doctor_id, date)
    DO UPDATE SET
      appointments_cancelled = doctor_analytics.appointments_cancelled + 1,
      updated_at = now();
  ELSIF NEW.status = 'no_show' AND OLD.status != 'no_show' THEN
    INSERT INTO public.doctor_analytics (doctor_id, date, appointments_no_show)
    VALUES (NEW.doctor_id, NEW.appointment_date, 1)
    ON CONFLICT (doctor_id, date)
    DO UPDATE SET
      appointments_no_show = doctor_analytics.appointments_no_show + 1,
      updated_at = now();
  END IF;
  
  RETURN NEW;
END;
$$;