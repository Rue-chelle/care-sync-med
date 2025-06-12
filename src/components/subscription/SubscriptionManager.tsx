
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Settings, CreditCard, Calendar, AlertTriangle } from "lucide-react";

interface SubscriptionInfo {
  subscribed: boolean;
  subscription_tier?: string;
  subscription_end?: string;
  payment_provider?: string;
}

export const SubscriptionManager = () => {
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const checkSubscription = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) {
        throw error;
      }

      setSubscription(data);
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

  const cancelSubscription = async () => {
    if (!confirm("Are you sure you want to cancel your subscription?")) {
      return;
    }

    try {
      const { error } = await supabase.functions.invoke('cancel-subscription');
      
      if (error) {
        throw error;
      }

      toast({
        title: "Subscription cancelled",
        description: "Your subscription has been cancelled successfully.",
      });

      checkSubscription();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to cancel subscription",
        variant: "destructive",
      });
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
    if (!subscription?.subscribed) {
      return <Badge variant="destructive">Inactive</Badge>;
    }
    return <Badge className="bg-green-500">Active</Badge>;
  };

  const getTierBadge = () => {
    if (!subscription?.subscription_tier) return null;
    
    const tier = subscription.subscription_tier;
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

  const isExpiringSoon = () => {
    if (!subscription?.subscription_end) return false;
    const endDate = new Date(subscription.subscription_end);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Subscription Management
              </CardTitle>
              <CardDescription>Manage your AloraMed subscription</CardDescription>
            </div>
            <Button 
              onClick={checkSubscription} 
              disabled={loading}
              variant="outline"
              size="sm"
            >
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {subscription ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <span className="text-sm font-medium text-gray-600">Status</span>
                  <div>{getStatusBadge()}</div>
                </div>
                {subscription.subscription_tier && (
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-gray-600">Plan</span>
                    <div>{getTierBadge()}</div>
                  </div>
                )}
                {subscription.payment_provider && (
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-gray-600">Payment Provider</span>
                    <div className="capitalize text-sm">{subscription.payment_provider}</div>
                  </div>
                )}
              </div>

              {subscription.subscription_end && (
                <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
                  <Calendar className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-600">
                    Next billing: {formatDate(subscription.subscription_end)}
                  </span>
                  {isExpiringSoon() && (
                    <Badge variant="outline" className="ml-auto">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Expires Soon
                    </Badge>
                  )}
                </div>
              )}

              <div className="flex gap-3">
                {subscription.subscribed && (
                  <>
                    <Button 
                      onClick={cancelSubscription}
                      variant="destructive"
                      size="sm"
                    >
                      Cancel Subscription
                    </Button>
                    {subscription.payment_provider === 'stripe' && (
                      <Button 
                        onClick={async () => {
                          const { data } = await supabase.functions.invoke('customer-portal');
                          if (data?.url) window.open(data.url, '_blank');
                        }}
                        variant="outline"
                        size="sm"
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Manage Billing
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-600">Loading subscription details...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
