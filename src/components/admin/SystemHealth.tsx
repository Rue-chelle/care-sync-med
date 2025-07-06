
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MonitoringService, ErrorEvent } from "@/services/monitoringService";
import { CheckCircle, AlertCircle, XCircle, RefreshCw } from "lucide-react";

export const SystemHealth = () => {
  const [healthStatus, setHealthStatus] = useState<'checking' | 'healthy' | 'unhealthy'>('checking');
  const [errors, setErrors] = useState<ErrorEvent[]>([]);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkHealth = async () => {
    setHealthStatus('checking');
    const isHealthy = await MonitoringService.healthCheck();
    setHealthStatus(isHealthy ? 'healthy' : 'unhealthy');
    setLastCheck(new Date());
  };

  const loadErrors = () => {
    const storedErrors = MonitoringService.getStoredErrors();
    setErrors(storedErrors.slice(-10)); // Show last 10 errors
  };

  const clearErrors = () => {
    MonitoringService.clearStoredErrors();
    setErrors([]);
  };

  useEffect(() => {
    checkHealth();
    loadErrors();
    
    // Check health every 5 minutes
    const interval = setInterval(checkHealth, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = () => {
    switch (healthStatus) {
      case 'checking':
        return <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />;
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'unhealthy':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusBadge = () => {
    switch (healthStatus) {
      case 'checking':
        return <Badge variant="secondary">Checking...</Badge>;
      case 'healthy':
        return <Badge variant="default" className="bg-green-500">Healthy</Badge>;
      case 'unhealthy':
        return <Badge variant="destructive">Unhealthy</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon()}
              System Health
            </CardTitle>
            <CardDescription>
              Monitor system status and performance
            </CardDescription>
          </div>
          {getStatusBadge()}
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                Last checked: {lastCheck ? lastCheck.toLocaleString() : 'Never'}
              </p>
            </div>
            <Button onClick={checkHealth} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-orange-500" />
              Recent Errors ({errors.length})
            </CardTitle>
            <CardDescription>
              Latest application errors and issues
            </CardDescription>
          </div>
          {errors.length > 0 && (
            <Button onClick={clearErrors} variant="outline" size="sm">
              Clear Errors
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {errors.length === 0 ? (
            <p className="text-sm text-gray-500">No recent errors</p>
          ) : (
            <div className="space-y-3">
              {errors.map((error, index) => (
                <Alert key={index} className="border-orange-200 bg-orange-50">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  <AlertDescription>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-orange-800">
                          {error.message}
                        </span>
                        <Badge 
                          variant={error.severity === 'critical' ? 'destructive' : 'secondary'}
                          className="text-xs"
                        >
                          {error.severity}
                        </Badge>
                      </div>
                      <p className="text-xs text-orange-600">
                        {error.timestamp.toLocaleString()}
                      </p>
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Backup Status</CardTitle>
          <CardDescription>
            Database backup and recovery information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="border-blue-200 bg-blue-50">
            <CheckCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Automated Backups:</strong> Supabase automatically creates daily backups 
              of your database. You can access and restore backups from the Supabase dashboard 
              under Database → Backups.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};
