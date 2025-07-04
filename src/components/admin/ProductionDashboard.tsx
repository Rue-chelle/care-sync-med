
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProductionReady } from "@/hooks/useProductionReady";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from "lucide-react";

export const ProductionDashboard = () => {
  const { checks, isChecking, runProductionChecks } = useProductionReady();

  const getStatusIcon = (status: boolean, isLoading: boolean = false) => {
    if (isLoading) return <LoadingSpinner size={16} text="" />;
    return status ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <XCircle className="h-4 w-4 text-red-600" />
    );
  };

  const getStatusBadge = (status: boolean) => {
    return (
      <Badge variant={status ? "default" : "destructive"}>
        {status ? "Ready" : "Issues"}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Production Status</h2>
          <p className="text-slate-600">System readiness for real users</p>
        </div>
        <Button 
          onClick={runProductionChecks}
          disabled={isChecking}
          variant="outline"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
          Refresh Checks
        </Button>
      </div>

      {/* Overall Status */}
      <Card className={`border-2 ${checks.overall ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {checks.overall ? (
              <CheckCircle className="h-6 w-6 text-green-600" />
            ) : (
              <AlertTriangle className="h-6 w-6 text-red-600" />
            )}
            Overall System Status
            {getStatusBadge(checks.overall)}
          </CardTitle>
          <CardDescription>
            {checks.overall 
              ? "Your application is ready for production and real users!"
              : "Some systems need attention before going live with real users."
            }
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Individual System Checks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              {getStatusIcon(checks.database, isChecking)}
              Database
              {getStatusBadge(checks.database)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              {checks.database 
                ? "Database connection is working properly. Users can register and book appointments."
                : "Database connection issues detected. User data may not persist."
              }
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              {getStatusIcon(checks.authentication, isChecking)}
              Authentication
              {getStatusBadge(checks.authentication)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              {checks.authentication 
                ? "User authentication system is configured and operational."
                : "Authentication system needs configuration for user login/registration."
              }
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              {getStatusIcon(checks.email, isChecking)}
              Email System  
              {getStatusBadge(checks.email)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              {checks.email 
                ? "Email notifications are configured for user communications."
                : "Email system needs SMTP configuration for notifications."
              }
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Next Steps for Production</CardTitle>
          <CardDescription>Complete these items before launching with real users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {!checks.database && (
              <div className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="h-4 w-4" />
                <span>Fix database connection issues in Supabase settings</span>
              </div>
            )}
            {!checks.email && (
              <div className="flex items-center gap-2 text-yellow-700">
                <AlertTriangle className="h-4 w-4" />
                <span>Configure SMTP settings for email notifications</span>
              </div>
            )}
            {checks.overall && (
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle className="h-4 w-4" />
                <span>All systems ready! You can now invite real users to test the application.</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
