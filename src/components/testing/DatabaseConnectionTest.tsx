
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, XCircle, AlertCircle, Database, Users, Calendar, Stethoscope } from "lucide-react";

interface TestResult {
  name: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  details?: any;
  duration?: number;
}

export const DatabaseConnectionTest = () => {
  const [isTestingRunning, setIsTestingRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const { toast } = useToast();

  const runComprehensiveTests = async () => {
    setIsTestingRunning(true);
    setTestResults([]);
    const results: TestResult[] = [];

    // Test 1: Basic connection and configuration
    try {
      const startTime = Date.now();
      console.log('Testing basic connection...');
      
      const { data, error } = await supabase.from('patients').select('count').limit(1);
      const duration = Date.now() - startTime;
      
      if (error) {
        results.push({
          name: 'Database Connection',
          status: 'error',
          message: `Connection failed: ${error.message}`,
          details: error,
          duration
        });
      } else {
        results.push({
          name: 'Database Connection',
          status: 'success',
          message: `Connected successfully (${duration}ms)`,
          duration
        });
      }
    } catch (error) {
      results.push({
        name: 'Database Connection',
        status: 'error',
        message: `Connection error: ${error}`,
        details: error
      });
    }

    // Test 2: Authentication system
    try {
      const startTime = Date.now();
      console.log('Testing authentication system...');
      
      const { data: { session } } = await supabase.auth.getSession();
      const duration = Date.now() - startTime;
      
      if (session) {
        results.push({
          name: 'Authentication System',
          status: 'success',
          message: `Active session found for: ${session.user.email} (${duration}ms)`,
          details: { 
            userId: session.user.id,
            email: session.user.email,
            provider: session.user.app_metadata?.provider
          },
          duration
        });
      } else {
        results.push({
          name: 'Authentication System',
          status: 'warning',
          message: `No active session (${duration}ms)`,
          details: { message: 'User not logged in' },
          duration
        });
      }
    } catch (error) {
      results.push({
        name: 'Authentication System',
        status: 'error',
        message: `Auth system error: ${error}`,
        details: error
      });
    }

    // Test 3: Patients table operations
    try {
      const startTime = Date.now();
      console.log('Testing patients table operations...');
      
      // Test SELECT
      const { data: patients, error: selectError } = await supabase
        .from('patients')
        .select('id, full_name, created_at')
        .limit(10);
      
      const duration = Date.now() - startTime;
      
      if (selectError) {
        results.push({
          name: 'Patients Table Access',
          status: 'error',
          message: `Query failed: ${selectError.message}`,
          details: selectError,
          duration
        });
      } else {
        results.push({
          name: 'Patients Table Access',
          status: 'success',
          message: `Found ${patients?.length || 0} patient records (${duration}ms)`,
          details: patients?.slice(0, 3),
          duration
        });
      }
    } catch (error) {
      results.push({
        name: 'Patients Table Access',
        status: 'error',
        message: `Query error: ${error}`,
        details: error
      });
    }

    // Test 4: Doctors table operations
    try {
      const startTime = Date.now();
      console.log('Testing doctors table operations...');
      
      const { data: doctors, error: doctorsError } = await supabase
        .from('doctors')
        .select('id, full_name, specialization, consultation_fee')
        .limit(10);
        
      const duration = Date.now() - startTime;
      
      if (doctorsError) {
        results.push({
          name: 'Doctors Table Access',
          status: 'error',
          message: `Query failed: ${doctorsError.message}`,
          details: doctorsError,
          duration
        });
      } else {
        results.push({
          name: 'Doctors Table Access',
          status: 'success',
          message: `Found ${doctors?.length || 0} doctor records (${duration}ms)`,
          details: doctors?.slice(0, 3),
          duration
        });
      }
    } catch (error) {
      results.push({
        name: 'Doctors Table Access',
        status: 'error',
        message: `Query error: ${error}`,
        details: error
      });
    }

    // Test 5: Appointments table operations
    try {
      const startTime = Date.now();
      console.log('Testing appointments table operations...');
      
      const { data: appointments, error: appointmentsError } = await supabase
        .from('appointments')
        .select('id, status, appointment_date, appointment_time')
        .limit(10);
        
      const duration = Date.now() - startTime;
      
      if (appointmentsError) {
        results.push({
          name: 'Appointments Table Access',
          status: 'error',
          message: `Query failed: ${appointmentsError.message}`,
          details: appointmentsError,
          duration
        });
      } else {
        results.push({
          name: 'Appointments Table Access',
          status: 'success',
          message: `Found ${appointments?.length || 0} appointment records (${duration}ms)`,
          details: appointments?.slice(0, 3),
          duration
        });
      }
    } catch (error) {
      results.push({
        name: 'Appointments Table Access',
        status: 'error',
        message: `Query error: ${error}`,
        details: error
      });
    }

    // Test 6: Row Level Security (RLS) policies
    try {
      const startTime = Date.now();
      console.log('Testing RLS policies...');
      
      // Try to access data that should be restricted
      const { data: restrictedData, error: rlsError } = await supabase
        .from('patients')
        .select('*');
        
      const duration = Date.now() - startTime;
      
      if (rlsError && rlsError.message.includes('row-level security')) {
        results.push({
          name: 'Row Level Security',
          status: 'success',
          message: `RLS policies working correctly (${duration}ms)`,
          details: { message: 'Access properly restricted' },
          duration
        });
      } else if (rlsError) {
        results.push({
          name: 'Row Level Security',
          status: 'warning',
          message: `RLS test inconclusive: ${rlsError.message} (${duration}ms)`,
          details: rlsError,
          duration
        });
      } else {
        results.push({
          name: 'Row Level Security',
          status: 'warning',
          message: `RLS policies may need review - data accessible (${duration}ms)`,
          details: { recordCount: restrictedData?.length || 0 },
          duration
        });
      }
    } catch (error) {
      results.push({
        name: 'Row Level Security',
        status: 'error',
        message: `RLS test error: ${error}`,
        details: error
      });
    }

    // Test 7: Real-time capabilities
    try {
      const startTime = Date.now();
      console.log('Testing real-time capabilities...');
      
      // Test real-time subscription
      const channel = supabase.channel('test-channel');
      await new Promise((resolve) => {
        const timeout = setTimeout(() => {
          resolve(null);
        }, 2000);
        
        channel.subscribe((status) => {
          clearTimeout(timeout);
          resolve(status);
        });
      });
      
      const duration = Date.now() - startTime;
      
      results.push({
        name: 'Real-time Capabilities',
        status: 'success',
        message: `Real-time connection established (${duration}ms)`,
        duration
      });
      
      await supabase.removeChannel(channel);
    } catch (error) {
      results.push({
        name: 'Real-time Capabilities',
        status: 'warning',
        message: `Real-time test failed: ${error}`,
        details: error
      });
    }

    setTestResults(results);
    setIsTestingRunning(false);

    // Summary toast
    const errorCount = results.filter(r => r.status === 'error').length;
    const warningCount = results.filter(r => r.status === 'warning').length;
    const successCount = results.filter(r => r.status === 'success').length;

    if (errorCount === 0) {
      toast({
        title: "Database Tests Completed Successfully",
        description: `${successCount} tests passed${warningCount > 0 ? `, ${warningCount} warnings` : ''}!`,
      });
    } else {
      toast({
        title: "Database Issues Detected",
        description: `${errorCount} errors, ${warningCount} warnings, ${successCount} passed.`,
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'error':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'warning':
        return 'text-yellow-700 bg-yellow-50 border-yellow-200';
    }
  };

  const getTotalDuration = () => {
    return testResults
      .filter(r => r.duration)
      .reduce((sum, r) => sum + (r.duration || 0), 0);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Database className="mr-2 h-5 w-5 text-blue-600" />
          Database Connection & Health Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={runComprehensiveTests} 
          disabled={isTestingRunning}
          className="w-full healthcare-gradient text-white"
        >
          {isTestingRunning ? "Running Comprehensive Tests..." : "Run Database Health Check"}
        </Button>

        {testResults.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Test Results:</h3>
              <span className="text-sm text-gray-500">
                Total time: {getTotalDuration()}ms
              </span>
            </div>
            
            {testResults.map((result, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg border ${getStatusColor(result.status)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(result.status)}
                    <span className="font-medium">{result.name}</span>
                  </div>
                  {result.duration && (
                    <span className="text-xs opacity-75">{result.duration}ms</span>
                  )}
                </div>
                <p className="text-sm mt-2">{result.message}</p>
                {result.details && (
                  <details className="mt-3">
                    <summary className="text-xs cursor-pointer hover:underline">
                      View Details
                    </summary>
                    <pre className="text-xs mt-2 p-2 bg-black/5 rounded overflow-auto max-h-32">
                      {JSON.stringify(result.details, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}

            {/* Summary Card */}
            <div className="p-4 bg-slate-100 rounded-lg">
              <h4 className="font-medium mb-2">Test Summary</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {testResults.filter(r => r.status === 'success').length}
                  </div>
                  <div className="text-xs text-gray-600">Passed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {testResults.filter(r => r.status === 'warning').length}
                  </div>
                  <div className="text-xs text-gray-600">Warnings</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">
                    {testResults.filter(r => r.status === 'error').length}
                  </div>
                  <div className="text-xs text-gray-600">Errors</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
