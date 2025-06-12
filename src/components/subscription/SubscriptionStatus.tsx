
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { RefreshCw, CreditCard, Calendar } from "lucide-react";

interface SubscriptionData {
  subscribed: boolean;
  subscription_tier?: string;
  subscription_end?: string;
}

export const SubscriptionStatus = () => {
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const { toast } = useToast();

  const checkSubscription = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) {
        throw error;
      }

      setSubscriptionData(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to check subscription status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const openCustomerPortal = async () => {
    setPortalLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) {
        throw error;
      }

      window.open(data.url, '_blank');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to open customer portal",
        variant: "destructive",
      });
    } finally {
      setPortalLoading(false);
    }
  };

  useEffect(() => {
    checkSubscription();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = () => {
    if (!subscriptionData?.subscribed) {
      return <Badge variant="destructive">Inactive</Badge>;
    }
    return <Badge className="bg-green-500">Active</Badge>;
  };

  const getTierBadge = () => {
    if (!subscriptionData?.subscription_tier) return null;
    
    const tier = subscriptionData.subscription_tier;
    const colorMap: Record<string, string> = {
      Basic: "bg-blue-500",
      Premium: "bg-purple-500", 
      Enterprise: "bg-yellow-500"
    };
    
    return (
      <Badge className={colorMap[tier] || "bg-gray-500"}>
        {tier}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Subscription Status
            </CardTitle>
            <CardDescription>Manage your subscription and billing</CardDescription>
          </div>
          <Button 
            onClick={checkSubscription} 
            disabled={loading}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {subscriptionData ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-sm text-gray-600">Status:</span>
                <div className="mt-1">{getStatusBadge()}</div>
              </div>
              {subscriptionData.subscription_tier && (
                <div>
                  <span className="text-sm text-gray-600">Plan:</span>
                  <div className="mt-1">{getTierBadge()}</div>
                </div>
              )}
            </div>

            {subscriptionData.subscription_end && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>
                  Next billing: {formatDate(subscriptionData.subscription_end)}
                </span>
              </div>
            )}

            {subscriptionData.subscribed && (
              <Button 
                onClick={openCustomerPortal}
                disabled={portalLoading}
                className="w-full"
              >
                {portalLoading ? "Opening..." : "Manage Subscription"}
              </Button>
            )}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-600">Loading subscription status...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
