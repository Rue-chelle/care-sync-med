
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle, CheckCircle, Wifi, WifiOff } from 'lucide-react';

export const ConnectionStatus = () => {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { error } = await supabase.from('patients').select('count').limit(1);
        if (error) {
          setStatus('error');
        } else {
          setStatus('connected');
        }
      } catch (error) {
        setStatus('error');
      }
      setLastChecked(new Date());
    };

    checkConnection();
    
    // Check every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (status === 'connected') {
    return null; // Don't show anything when connected
  }

  return (
    <div className={`fixed top-4 right-4 z-50 p-3 rounded-lg border shadow-lg max-w-sm ${
      status === 'error' 
        ? 'bg-red-50 border-red-200 text-red-800' 
        : 'bg-yellow-50 border-yellow-200 text-yellow-800'
    }`}>
      <div className="flex items-center space-x-2">
        {status === 'checking' && <Wifi className="h-4 w-4 animate-pulse" />}
        {status === 'error' && <WifiOff className="h-4 w-4" />}
        <div>
          <p className="text-sm font-medium">
            {status === 'checking' && 'Checking connection...'}
            {status === 'error' && 'Connection Issue'}
          </p>
          {status === 'error' && (
            <p className="text-xs mt-1">
              Using demo mode. Some features may be limited.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
