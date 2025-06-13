
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { useRetry } from "@/hooks/useRetry";
import { supabase } from "@/integrations/supabase/client";
import { Check, Star, Crown, Shield, Zap } from "lucide-react";
import { ResponsiveContainer } from "@/components/ui/responsive-container";

const plans = [
  {
    id: "basic",
    name: "Basic",
    price: 29,
    description: "Perfect for small clinics getting started",
    icon: Check,
    features: [
      "Up to 100 patients",
      "Basic appointment scheduling",
      "Email support",
      "Standard analytics",
      "Basic patient records",
      "Mobile responsive"
    ],
    color: "text-blue-600",
    popular: false
  },
  {
    id: "premium",
    name: "Premium",
    price: 79,
    description: "Ideal for growing practices",
    icon: Star,
    features: [
      "Up to 500 patients",
      "Advanced appointment scheduling",
      "Priority support",
      "Advanced analytics",
      "Full patient records",
      "Multi-branch support",
      "Custom reports",
      "API access"
    ],
    color: "text-purple-600",
    popular: true
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 199,
    description: "For large healthcare organizations",
    icon: Crown,
    features: [
      "Unlimited patients",
      "Full feature access",
      "24/7 dedicated support",
      "Custom integrations",
      "Advanced compliance tools",
      "Multi-clinic management",
      "Custom branding",
      "White-label options",
      "Advanced security"
    ],
    color: "text-yellow-600",
    popular: false
  }
];

export const PesepayPlans = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();
  const { handleError } = useErrorHandler();
  const { executeWithRetry } = useRetry();

  const handleSubscribe = async (planId: string, amount: number) => {
    setLoading(planId);
    try {
      await executeWithRetry(async () => {
        const { data, error } = await supabase.functions.invoke('pesepay-payment', {
          body: { plan: planId, amount: amount }
        });

        if (error) {
          throw error;
        }

        if (data?.payment_url) {
          // Open Pesepay payment page in a new tab
          window.open(data.payment_url, '_blank');
          
          toast({
            title: "Redirecting to payment",
            description: "You'll be redirected to Pesepay to complete your subscription payment.",
          });
        } else {
          throw new Error("No payment URL received");
        }
      }, {
        maxRetries: 2,
        retryDelay: 1000
      });
    } catch (error: any) {
      handleError(error, {
        fallbackMessage: "Failed to start payment process"
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="py-8 sm:py-12">
      <ResponsiveContainer maxWidth="full">
        <div className="text-center mb-8 sm:mb-12 px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Pay securely with Pesepay - Zimbabwe's trusted payment platform
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500">
            <Shield className="h-4 w-4" />
            <span>Secure payments • Cancel anytime</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 px-4">
          {plans.map((plan) => {
            const IconComponent = plan.icon;
            const isLoading = loading === plan.id;
            
            return (
              <Card 
                key={plan.id} 
                className={`relative transition-all duration-200 hover:shadow-lg ${
                  plan.popular 
                    ? 'border-purple-500 shadow-xl scale-105 lg:scale-110' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-purple-500 px-3 py-1">
                      <Zap className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className={`w-12 h-12 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center`}>
                    <IconComponent className={`h-6 w-6 ${plan.color}`} />
                  </div>
                  <CardTitle className="text-xl sm:text-2xl font-bold">{plan.name}</CardTitle>
                  <CardDescription className="text-gray-600 min-h-[40px] flex items-center justify-center">
                    {plan.description}
                  </CardDescription>
                  <div className="text-center py-4">
                    <span className="text-3xl sm:text-4xl font-bold">${plan.price}</span>
                    <span className="text-gray-600 text-sm">/month</span>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <ul className="space-y-3 mb-6 sm:mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-4 w-4 text-green-500 mr-3 mt-0.5 shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    onClick={() => handleSubscribe(plan.id, plan.price)}
                    disabled={isLoading}
                    className={`w-full transition-all duration-200 ${
                      plan.popular 
                        ? 'bg-purple-600 hover:bg-purple-700 shadow-lg' 
                        : ''
                    }`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      "Pay with Pesepay"
                    )}
                  </Button>
                  
                  <p className="text-xs text-gray-500 text-center mt-3">
                    Secure payment processing
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="text-center mt-8 sm:mt-12 px-4">
          <p className="text-sm text-gray-600 mb-4">
            All plans include our core features and mobile app access
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
            <span>✓ 30-day money-back guarantee</span>
            <span>✓ No setup fees</span>
            <span>✓ Cancel anytime</span>
          </div>
        </div>
      </ResponsiveContainer>
    </div>
  );
};
