
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PesepayPlans } from "@/components/subscription/PesepayPlans";
import { SubscriptionStatus } from "@/components/subscription/SubscriptionStatus";
import { SubscriptionManager } from "@/components/subscription/SubscriptionManager";
import { useUserStore } from "@/stores/userStore";

const EnhancedSubscriptionPage = () => {
  const { user } = useUserStore();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Subscription Management</h1>
          <p className="text-gray-600 mt-2">Manage your AloraMed subscription and billing</p>
        </div>

        {user && (
          <Tabs defaultValue="status" className="space-y-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="status">Current Status</TabsTrigger>
              <TabsTrigger value="plans">Available Plans</TabsTrigger>
              <TabsTrigger value="manage">Manage</TabsTrigger>
            </TabsList>

            <TabsContent value="status" className="space-y-6">
              <SubscriptionStatus />
            </TabsContent>

            <TabsContent value="plans">
              <PesepayPlans />
            </TabsContent>

            <TabsContent value="manage">
              <SubscriptionManager />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default EnhancedSubscriptionPage;
