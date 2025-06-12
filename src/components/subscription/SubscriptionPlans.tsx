
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Check, Star, Crown } from "lucide-react";

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
      "Basic patient records"
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
      "Custom reports"
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
      "API access"
    ],
    color: "text-yellow-600",
    popular: false
  }
];

export const SubscriptionPlans = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubscribe = async (planId: string) => {
    setLoading(planId);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { plan: planId }
      });

      if (error) {
        throw error;
      }

      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank');
      
      toast({
        title: "Redirecting to checkout",
        description: "You'll be redirected to Stripe to complete your subscription.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to start checkout process",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
        <p className="text-lg text-gray-600">Select the perfect plan for your healthcare practice</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => {
          const IconComponent = plan.icon;
          return (
            <Card 
              key={plan.id} 
              className={`relative ${plan.popular ? 'border-purple-500 shadow-2xl' : 'border-gray-200'}`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-500">
                  Most Popular
                </Badge>
              )}
              <CardHeader className="text-center">
                <div className={`w-12 h-12 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center`}>
                  <IconComponent className={`h-6 w-6 ${plan.color}`} />
                </div>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <CardDescription className="text-gray-600">{plan.description}</CardDescription>
                <div className="text-center">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-gray-600">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={loading === plan.id}
                  className={`w-full ${plan.popular ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  {loading === plan.id ? "Processing..." : "Get Started"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
