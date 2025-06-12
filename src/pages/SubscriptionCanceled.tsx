
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

const SubscriptionCanceled = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Subscription Canceled
          </CardTitle>
          <CardDescription>
            Your subscription process was canceled. No charges were made to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              You can try again at any time or contact our support team if you need assistance.
            </p>
          </div>
          <div className="space-y-2">
            <Button 
              onClick={() => navigate('/subscription')} 
              className="w-full"
            >
              Try Again
            </Button>
            <Button 
              onClick={() => navigate('/admin')} 
              variant="outline" 
              className="w-full"
            >
              Back to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionCanceled;
