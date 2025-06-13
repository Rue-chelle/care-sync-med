
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PesepayPlans } from "@/components/subscription/PesepayPlans";
import { SubscriptionStatus } from "@/components/subscription/SubscriptionStatus";
import { SubscriptionManager } from "@/components/subscription/SubscriptionManager";
import { useUserStore } from "@/stores/userStore";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { ResponsiveContainer } from "@/components/ui/responsive-container";
import { MobileNav } from "@/components/ui/mobile-nav";
import { CreditCard, Settings, ShoppingCart } from "lucide-react";

const EnhancedSubscriptionPage = () => {
  const { user } = useUserStore();

  const navItems = [
    { id: "status", label: "Current Status", icon: CreditCard },
    { id: "plans", label: "Available Plans", icon: ShoppingCart },
    { id: "manage", label: "Manage", icon: Settings },
  ];

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b lg:hidden">
          <ResponsiveContainer>
            <div className="flex items-center justify-between py-4">
              <h1 className="text-xl font-bold text-gray-900">Subscription</h1>
              <MobileNav>
                <nav className="space-y-2">
                  {navItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <IconComponent className="h-5 w-5" />
                        {item.label}
                      </a>
                    );
                  })}
                </nav>
              </MobileNav>
            </div>
          </ResponsiveContainer>
        </div>

        <div className="py-6 sm:py-8">
          <ResponsiveContainer maxWidth="full">
            <div className="text-center mb-6 sm:mb-8 hidden lg:block">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Subscription Management</h1>
              <p className="text-gray-600 mt-2">Manage your AloraMed subscription and billing</p>
            </div>

            {user && (
              <Tabs defaultValue="status" className="space-y-6 sm:space-y-8">
                <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
                  {navItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <TabsTrigger 
                        key={item.id}
                        value={item.id} 
                        className="flex items-center gap-2 text-xs sm:text-sm"
                      >
                        <IconComponent className="h-4 w-4" />
                        <span className="hidden sm:inline">{item.label}</span>
                        <span className="sm:hidden">{item.label.split(' ')[0]}</span>
                      </TabsTrigger>
                    );
                  })}
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

            {!user && (
              <div className="text-center py-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Please sign in</h2>
                <p className="text-gray-600">You need to be signed in to view subscription information.</p>
              </div>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default EnhancedSubscriptionPage;
