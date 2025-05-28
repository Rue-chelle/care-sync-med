
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useUserStore } from "@/stores/userStore";
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
import { 
  BarChart3, 
  Building, 
  Users, 
  Shield, 
  CreditCard, 
  Flag, 
  HelpCircle, 
  MessageSquare, 
  FileText,
  Bell,
  LogOut
} from "lucide-react";

const SuperAdminDashboard = () => {
  const [currentTab, setCurrentTab] = useState("overview");
  const navigate = useNavigate();
  const { logout, user } = useUserStore();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    logout();
    navigate("/auth");
  };

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "clinics", label: "Clinic Management", icon: Building },
    { id: "users", label: "User Management", icon: Users },
    { id: "analytics", label: "System Analytics", icon: BarChart3 },
    { id: "subscriptions", label: "Subscriptions", icon: CreditCard },
    { id: "features", label: "Feature Flags", icon: Flag },
    { id: "tickets", label: "Support Tickets", icon: HelpCircle },
    { id: "broadcasts", label: "Broadcast Messages", icon: MessageSquare },
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-30">
        <div className="px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 ml-12 lg:ml-0">
              <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl flex items-center justify-center">
                <div className="h-6 w-6 text-white font-bold">AM</div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                  AloraMed Super Admin
                </h1>
                <p className="text-sm text-slate-600">System Administration</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Notifications</span>
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Logout</span>
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
          userRole="super_admin"
          userName={user?.fullName}
        />

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
