import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SuperAdminLayout } from "@/components/layout/SuperAdminLayout";
import { SuperAdminOverview } from "@/components/super-admin/SuperAdminOverview";
import { ClinicManagement } from "@/components/super-admin/ClinicManagement";
import { UserManagement } from "@/components/super-admin/UserManagement";
import { SystemAnalytics } from "@/components/super-admin/SystemAnalytics";
import { FeatureFlags } from "@/components/super-admin/FeatureFlags";
import { SupportTickets } from "@/components/super-admin/SupportTickets";
import { BroadcastMessages } from "@/components/super-admin/BroadcastMessages";
import { AuditLogs } from "@/components/super-admin/AuditLogs";
import { SubscriptionManagement } from "@/components/super-admin/SubscriptionManagement";
import { DashboardSidebar } from "@/components/shared/DashboardSidebar";
import { GlobalNotificationsPanel } from "@/components/shared/GlobalNotificationsPanel";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/stores/userStore";
import { LogOut, Bell, Menu, TrendingUp, Building, Users, CreditCard, Settings, MessageSquare, FileText, BarChart } from "lucide-react";

const SuperAdminDashboard = () => {
  const [currentTab, setCurrentTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { logout } = useUserStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: TrendingUp },
    { id: "clinics", label: "Clinics", icon: Building },
    { id: "users", label: "Users", icon: Users },
    { id: "analytics", label: "Analytics", icon: BarChart },
    { id: "subscriptions", label: "Subscriptions", icon: CreditCard },
    { id: "features", label: "Features", icon: Settings },
    { id: "tickets", label: "Support Tickets", icon: MessageSquare },
    { id: "broadcasts", label: "Broadcasts", icon: MessageSquare },
    { id: "audit", label: "Audit Logs", icon: FileText },
  ];

  const renderContent = () => {
    switch (currentTab) {
      case "overview":
        return <SuperAdminOverview />;
      case "clinics":
        return <ClinicManagement />;
      case "users":
        return <UserManagement />;
      case "analytics":
        return <SystemAnalytics />;
      case "subscriptions":
        return <SubscriptionManagement />;
      case "features":
        return <FeatureFlags />;
      case "tickets":
        return <SupportTickets />;
      case "broadcasts":
        return <BroadcastMessages />;
      case "audit":
        return <AuditLogs />;
      default:
        return <SuperAdminOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#121212] via-[#1a1a2e] to-[#16213e]">
      {/* Header */}
      <header className="bg-[#1a1a2e]/80 backdrop-blur-sm border-b border-purple-500/20 sticky top-0 z-40">
        <div className="container mx-auto px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="icon"
                className="text-purple-300 hover:bg-purple-500/20 md:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  AloraMed Super Admin
                </h1>
                <p className="text-sm text-purple-300">System Management Panel</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-purple-300 hover:bg-purple-500/20"
                onClick={() => setNotificationsOpen(true)}
              >
                <Bell className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Notifications</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-purple-300 hover:bg-purple-500/20"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        <DashboardSidebar
          items={sidebarItems}
          activeTab={currentTab}
          onTabChange={setCurrentTab}
          userRole="super-admin"
          userName="Super Admin"
          theme="dark"
        />

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6 min-h-screen">
          {renderContent()}
        </main>
      </div>

      {/* Global Notifications Panel */}
      <GlobalNotificationsPanel
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        userRole="super-admin"
      />
    </div>
  );
};

export default SuperAdminDashboard;
