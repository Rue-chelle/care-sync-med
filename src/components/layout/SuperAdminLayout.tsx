
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Shield, Users, BarChart, Settings, CreditCard, Flag, MessageSquare, FileText, Building } from "lucide-react";
import { useUserStore } from "@/stores/userStore";

type SuperAdminLayoutProps = {
  children: React.ReactNode;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
};

export const SuperAdminLayout = ({ children, currentTab, setCurrentTab }: SuperAdminLayoutProps) => {
  const { user, logout } = useUserStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const menuItems = [
    { id: "overview", label: "Dashboard Overview", icon: BarChart },
    { id: "clinics", label: "Clinic Management", icon: Building },
    { id: "users", label: "User Management", icon: Users },
    { id: "subscriptions", label: "Subscriptions", icon: CreditCard },
    { id: "analytics", label: "System Analytics", icon: BarChart },
    { id: "features", label: "Feature Flags", icon: Flag },
    { id: "tickets", label: "Support Tickets", icon: MessageSquare },
    { id: "broadcasts", label: "Broadcast Messages", icon: MessageSquare },
    { id: "audit", label: "Audit Logs", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-sm border-b border-purple-500/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden text-white h-8 w-8 sm:h-10 sm:w-10"
              >
                <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <div className="relative">
                <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                  <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
              </div>
              <div className="hidden xs:block">
                <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  AloraMed Super Admin
                </h1>
                <p className="text-xs sm:text-sm text-purple-300">Developer Access Panel</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Button variant="outline" size="sm" onClick={handleLogout} className="border-purple-500 text-purple-300 text-xs sm:text-sm px-2 sm:px-4">
                <span className="hidden xs:inline">Sign Out</span>
                <span className="xs:hidden">Out</span>
              </Button>
              <div className="h-6 w-6 sm:h-8 sm:w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {user?.fullName?.substring(0, 2) || "SA"}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content with sidebar */}
      <div className="flex w-full min-h-[calc(100vh-4.5rem)]">
        {/* Sidebar */}
        <div className={`
          fixed md:relative z-50 md:z-auto
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          transition-transform duration-300 ease-in-out
          w-64 bg-black/40 backdrop-blur-sm border-r border-purple-500/20 h-full
        `}>
          <div className="p-4 border-b border-purple-500/20 flex items-center justify-between md:hidden">
            <h2 className="font-semibold text-purple-300">Menu</h2>
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="text-white">
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="p-4">
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors
                    ${currentTab === item.id 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                      : 'text-purple-300 hover:bg-purple-500/20'
                    }
                  `}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
        
        {/* Main content area */}
        <div className="flex-1 p-4 sm:p-6">
          <div className="mb-4 sm:mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              {menuItems.find(item => item.id === currentTab)?.label || "Dashboard"}
            </h2>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};
