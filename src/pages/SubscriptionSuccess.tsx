
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SubscriptionSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      toast({
        title: "Subscription Activated!",
        description: "Your subscription has been successfully activated. Welcome to AloraMed!",
      });
    }
  }, [sessionId, toast]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Subscription Activated!
          </CardTitle>
          <CardDescription>
            Thank you for subscribing to AloraMed. Your account is now active and ready to use.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              You now have access to all premium features of your selected plan.
            </p>
            <p className="text-sm text-gray-600">
              You can manage your subscription at any time from your account settings.
            </p>
          </div>
          <div className="space-y-2">
            <Button 
              onClick={() => navigate('/admin')} 
              className="w-full"
            >
              Go to Dashboard
            </Button>
            <Button 
              onClick={() => navigate('/subscription')} 
              variant="outline" 
              className="w-full"
            >
              Manage Subscription
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionSuccess;
