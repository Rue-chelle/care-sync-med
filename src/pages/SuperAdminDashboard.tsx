
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SuperAdminOverview } from "@/components/super-admin/SuperAdminOverview";
import { ClinicManagement } from "@/components/super-admin/ClinicManagement";
import { UserManagement } from "@/components/super-admin/UserManagement";
import { SystemAnalytics } from "@/components/super-admin/SystemAnalytics";
import { FeatureFlags } from "@/components/super-admin/FeatureFlags";
import { SupportTickets } from "@/components/super-admin/SupportTickets";
import { BroadcastMessages } from "@/components/super-admin/BroadcastMessages";
import { AuditLogs } from "@/components/super-admin/AuditLogs";
import { SubscriptionManagement } from "@/components/super-admin/SubscriptionManagement";
import { SystemSettings } from "@/components/super-admin/SystemSettings";
import { GlobalNotificationsPanel } from "@/components/shared/GlobalNotificationsPanel";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/stores/userStore";
import { useIsMobile } from "@/hooks/use-mobile";
import { LogOut, Bell, Menu, TrendingUp, Building, Users, CreditCard, Settings, MessageSquare, FileText, BarChart, X } from "lucide-react";

const SuperAdminDashboard = () => {
  const [currentTab, setCurrentTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { logout } = useUserStore();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const handleNavigateToSettings = () => {
    setCurrentTab("settings");
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
    { id: "settings", label: "System Settings", icon: Settings },
  ];

  const renderContent = () => {
    switch (currentTab) {
      case "overview":
        return <SuperAdminOverview onNavigateToSettings={handleNavigateToSettings} />;
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
      case "settings":
        return <SystemSettings />;
      default:
        return <SuperAdminOverview onNavigateToSettings={handleNavigateToSettings} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#121212] via-[#1a1a2e] to-[#16213e]">
      {/* Header */}
      <header className="bg-[#1a1a2e]/80 backdrop-blur-sm border-b border-purple-500/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 lg:px-6 py-3 lg:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-purple-300 hover:bg-purple-500/20 md:hidden p-2"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-lg lg:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  AloraMed Super Admin
                </h1>
                <p className="text-xs lg:text-sm text-purple-300">System Management Panel</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 lg:space-x-3">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-purple-300 hover:bg-purple-500/20 p-2 lg:px-3 lg:py-2"
                onClick={() => setNotificationsOpen(true)}
              >
                <Bell className="h-4 w-4 mr-0 lg:mr-2" />
                <span className="hidden lg:inline">Notifications</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-purple-300 hover:bg-purple-500/20 p-2 lg:px-3 lg:py-2"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-0 lg:mr-2" />
                <span className="hidden lg:inline">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex relative">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && isMobile && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`${
            isMobile 
              ? 'fixed' 
              : 'relative'
          } ${
            isMobile && !sidebarOpen 
              ? '-translate-x-full' 
              : 'translate-x-0'
          } transition-transform duration-300 z-40 bg-black/40 backdrop-blur-sm border-r border-purple-500/20 h-screen ${
            isMobile ? 'w-64' : 'w-16 md:w-64'
          }`}
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b border-purple-500/20 flex items-center justify-between">
            <div className={`${isMobile ? 'block' : 'hidden md:block'} font-semibold text-purple-300`}>
              Navigation
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className={`${isMobile ? 'block' : 'hidden'} text-white p-1`}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Sidebar Items */}
          <nav className="p-2 space-y-1">
            {sidebarItems.map((item) => {
              const isActive = currentTab === item.id;
              const Icon = item.icon;
              
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  className={`w-full justify-start ${
                    isActive 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      : 'text-purple-300 hover:bg-purple-500/20'
                  } ${isMobile ? 'px-4' : 'px-2 md:px-4'}`}
                  onClick={() => {
                    setCurrentTab(item.id);
                    if (isMobile) setSidebarOpen(false);
                  }}
                >
                  <Icon className={`h-5 w-5 ${isMobile ? 'mr-3' : 'mr-0 md:mr-3'}`} />
                  <span className={`${isMobile ? 'block' : 'hidden md:block'}`}>
                    {item.label}
                  </span>
                </Button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 p-4 lg:p-6 min-h-screen ${isMobile ? 'w-full' : ''}`}>
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
