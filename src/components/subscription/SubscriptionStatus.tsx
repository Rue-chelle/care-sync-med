
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { useRetry } from "@/hooks/useRetry";
import { supabase } from "@/integrations/supabase/client";
import { RefreshCw, CreditCard, Calendar, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/loading-skeleton";

interface SubscriptionData {
  subscribed: boolean;
  subscription_tier?: string;
  subscription_end?: string;
  payment_provider?: string;
}

export const SubscriptionStatus = () => {
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const { toast } = useToast();
  const { handleError } = useErrorHandler();
  const { executeWithRetry, isRetrying } = useRetry();

  const checkSubscription = async () => {
    setLoading(true);
    try {
      await executeWithRetry(async () => {
        const { data, error } = await supabase.functions.invoke('check-subscription');
        
        if (error) {
          throw error;
        }

        setSubscriptionData(data);
      }, {
        maxRetries: 3,
        retryDelay: 1000,
        onRetry: (attempt) => {
          console.log(`Retrying subscription check (attempt ${attempt})`);
        }
      });
    } catch (error: any) {
      handleError(error, {
        fallbackMessage: "Failed to check subscription status"
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

      if (data?.url) {
        window.open(data.url, '_blank');
      } else {
        throw new Error("No portal URL received");
      }
    } catch (error: any) {
      handleError(error, {
        fallbackMessage: "Failed to open customer portal"
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
      basic: "bg-blue-500",
      premium: "bg-purple-500", 
      enterprise: "bg-yellow-500"
    };
    
    return (
      <Badge className={colorMap[tier.toLowerCase()] || "bg-gray-500"}>
        {tier}
      </Badge>
    );
  };

  const isExpiringSoon = () => {
    if (!subscriptionData?.subscription_end) return false;
    const endDate = new Date(subscriptionData.subscription_end);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
  };

  if (loading && !subscriptionData) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-6 w-40 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div>
                <Skeleton className="h-4 w-12 mb-2" />
                <Skeleton className="h-6 w-16" />
              </div>
              <div>
                <Skeleton className="h-4 w-8 mb-2" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <CreditCard className="h-5 w-5" />
              Subscription Status
            </CardTitle>
            <CardDescription className="text-sm">
              Manage your subscription and billing
            </CardDescription>
          </div>
          <Button 
            onClick={checkSubscription} 
            disabled={loading || isRetrying}
            variant="outline"
            size="sm"
            className="shrink-0"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${(loading || isRetrying) ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {subscriptionData ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-4">
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
              {subscriptionData.payment_provider && (
                <div>
                  <span className="text-sm text-gray-600">Provider:</span>
                  <div className="mt-1 text-sm capitalize">{subscriptionData.payment_provider}</div>
                </div>
              )}
            </div>

            {subscriptionData.subscription_end && (
              <div className="flex items-center gap-2 text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
                <Calendar className="h-4 w-4 shrink-0" />
                <span>
                  Next billing: {formatDate(subscriptionData.subscription_end)}
                </span>
                {isExpiringSoon() && (
                  <Badge variant="outline" className="ml-auto shrink-0">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Expires Soon
                  </Badge>
                )}
              </div>
            )}

            {subscriptionData.subscribed && subscriptionData.payment_provider === 'stripe' && (
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
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">No subscription data found</p>
            <Button onClick={checkSubscription} variant="outline">
              Try Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
