
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface TestResult {
  name: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  details?: any;
}

export const DatabaseTest = () => {
  const [isTestingRunning, setIsTestingRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const { toast } = useToast();

  const runTests = async () => {
    setIsTestingRunning(true);
    setTestResults([]);
    const results: TestResult[] = [];

    // Test 1: Basic connection
    try {
      console.log('Testing basic connection...');
      const { data, error } = await supabase.from('patients').select('count').limit(1);
      
      if (error) {
        results.push({
          name: 'Database Connection',
          status: 'error',
          message: `Connection failed: ${error.message}`,
          details: error
        });
      } else {
        results.push({
          name: 'Database Connection',
          status: 'success',
          message: 'Successfully connected to database'
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

    // Test 2: Authentication
    try {
      console.log('Testing authentication...');
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        results.push({
          name: 'Authentication',
          status: 'success',
          message: `User authenticated: ${session.user.email}`,
          details: { userId: session.user.id }
        });
      } else {
        results.push({
          name: 'Authentication',
          status: 'warning',
          message: 'No active session found'
        });
      }
    } catch (error) {
      results.push({
        name: 'Authentication',
        status: 'error',
        message: `Auth error: ${error}`,
        details: error
      });
    }

    // Test 3: Patients table access
    try {
      console.log('Testing patients table...');
      const { data, error } = await supabase
        .from('patients')
        .select('id, full_name')
        .limit(5);
      
      if (error) {
        results.push({
          name: 'Patients Table Access',
          status: 'error',
          message: `Query failed: ${error.message}`,
          details: error
        });
      } else {
        results.push({
          name: 'Patients Table Access',
          status: 'success',
          message: `Found ${data?.length || 0} patient records`,
          details: data
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

    // Test 4: Doctors table access
    try {
      console.log('Testing doctors table...');
      const { data, error } = await supabase
        .from('doctors')
        .select('id, full_name, specialization')
        .limit(5);
      
      if (error) {
        results.push({
          name: 'Doctors Table Access',
          status: 'error',
          message: `Query failed: ${error.message}`,
          details: error
        });
      } else {
        results.push({
          name: 'Doctors Table Access',
          status: 'success',
          message: `Found ${data?.length || 0} doctor records`,
          details: data
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

    // Test 5: Appointments table access
    try {
      console.log('Testing appointments table...');
      const { data, error } = await supabase
        .from('appointments')
        .select('id, status, appointment_date')
        .limit(5);
      
      if (error) {
        results.push({
          name: 'Appointments Table Access',
          status: 'error',
          message: `Query failed: ${error.message}`,
          details: error
        });
      } else {
        results.push({
          name: 'Appointments Table Access',
          status: 'success',
          message: `Found ${data?.length || 0} appointment records`,
          details: data
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

    setTestResults(results);
    setIsTestingRunning(false);

    const errorCount = results.filter(r => r.status === 'error').length;
    const warningCount = results.filter(r => r.status === 'warning').length;

    if (errorCount === 0) {
      toast({
        title: "Database Tests Completed",
        description: `All tests passed${warningCount > 0 ? ` with ${warningCount} warnings` : ''}!`,
      });
    } else {
      toast({
        title: "Database Issues Found",
        description: `${errorCount} errors and ${warningCount} warnings detected.`,
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Database Connection Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={runTests} 
          disabled={isTestingRunning}
          className="w-full"
        >
          {isTestingRunning ? "Running Tests..." : "Run Database Tests"}
        </Button>

        {testResults.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold">Test Results:</h3>
            {testResults.map((result, index) => (
              <div 
                key={index}
                className={`p-3 rounded-lg border ${getStatusColor(result.status)}`}
              >
                <div className="flex items-center space-x-2">
                  {getStatusIcon(result.status)}
                  <span className="font-medium">{result.name}</span>
                </div>
                <p className="text-sm mt-1">{result.message}</p>
                {result.details && (
                  <details className="mt-2">
                    <summary className="text-xs cursor-pointer">Details</summary>
                    <pre className="text-xs mt-1 overflow-auto">
                      {JSON.stringify(result.details, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
