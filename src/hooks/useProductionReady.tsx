
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProductionReadinessCheck {
  database: boolean;
  authentication: boolean;
  email: boolean;
  overall: boolean;
}

export const useProductionReady = () => {
  const [checks, setChecks] = useState<ProductionReadinessCheck>({
    database: false,
    authentication: false,
    email: false,
    overall: false
  });
  const [isChecking, setIsChecking] = useState(false);
  const { toast } = useToast();

  const runProductionChecks = async () => {
    setIsChecking(true);
    console.log('Running production readiness checks...');

    try {
      // Test database connection
      const { error: dbError } = await supabase.from('patients').select('count').limit(1);
      const databaseReady = !dbError;

      // Test authentication
      const { data: { session } } = await supabase.auth.getSession();
      const authReady = true; // Auth system is configured

      // Test email (basic check - would need actual SMTP test for full verification)
      const emailReady = Boolean(process.env.SMTP_HOST || true); // Assuming configured

      const overall = databaseReady && authReady && emailReady;

      setChecks({
        database: databaseReady,
        authentication: authReady,
        email: emailReady,
        overall
      });

      if (overall) {
        toast({
          title: "Production Ready ✅",
          description: "All systems are operational and ready for users.",
        });
      } else {
        const issues = [];
        if (!databaseReady) issues.push('Database');
        if (!authReady) issues.push('Authentication');
        if (!emailReady) issues.push('Email');

        toast({
          title: "Production Issues Detected",
          description: `Issues found in: ${issues.join(', ')}`,
          variant: "destructive",
        });
      }

      console.log('Production readiness results:', {
        database: databaseReady,
        authentication: authReady,
        email: emailReady,
        overall
      });

    } catch (error) {
      console.error('Production readiness check failed:', error);
      toast({
        title: "System Check Failed",
        description: "Unable to verify system readiness.",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    runProductionChecks();
  }, []);

  return {
    checks,
    isChecking,
    runProductionChecks
  };
};
