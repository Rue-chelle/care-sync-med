
import { SubscriptionStatus } from "@/components/subscription/SubscriptionStatus";
import { SubscriptionPlans } from "@/components/subscription/SubscriptionPlans";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

export const SubscriptionBilling = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <CreditCard className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Subscription & Billing</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <SubscriptionStatus />
        </div>
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Available Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <SubscriptionPlans />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
