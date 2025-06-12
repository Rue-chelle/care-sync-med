
import { SubscriptionPlans } from "@/components/subscription/SubscriptionPlans";
import { SubscriptionStatus } from "@/components/subscription/SubscriptionStatus";
import { useUserStore } from "@/stores/userStore";

const SubscriptionPage = () => {
  const { user } = useUserStore();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Subscription Management</h1>
          <p className="text-gray-600 mt-2">Manage your AloraMed subscription and billing</p>
        </div>

        {user && (
          <div className="mb-12">
            <SubscriptionStatus />
          </div>
        )}

        <SubscriptionPlans />
      </div>
    </div>
  );
};

export default SubscriptionPage;
