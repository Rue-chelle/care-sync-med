
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bell, Menu, X } from "lucide-react";
import { useUserStore } from "@/stores/userStore";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

import { 
  Users, Settings, Calendar, FileText, 
  BarChart, Package, MessageSquare, Building,
  Stethoscope, CreditCard, FolderOpen
} from "lucide-react";

type AdminLayoutProps = {
  children: React.ReactNode;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
};

export const AdminLayout = ({ children, currentTab, setCurrentTab }: AdminLayoutProps) => {
  const { user, logout } = useUserStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          title: "Error signing out",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      logout();
      navigate("/auth");
      
      toast({
        title: "Logged out successfully",
        description: "You have been signed out of your account.",
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error signing out",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const menuItems = [
    { id: "overview", label: "Dashboard Overview", icon: BarChart },
    { id: "users", label: "User Management", icon: Users },
    { id: "prescriptions", label: "Prescriptions", icon: Stethoscope },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "patients", label: "Patient Records", icon: FolderOpen },
    { id: "inventory", label: "Inventory", icon: Package },
    { id: "messaging", label: "Messaging", icon: MessageSquare },
    { id: "analytics", label: "Analytics", icon: BarChart },
    { id: "branches", label: "Branches", icon: Building },
    { id: "settings", label: "System Settings", icon: Settings },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="md:hidden h-8 w-8 sm:h-10 sm:w-10"
              >
                {sidebarOpen ? <X className="h-4 w-4 sm:h-5 sm:w-5" /> : <Menu className="h-4 w-4 sm:h-5 sm:w-5" />}
              </Button>
              <div className="relative">
                <div className="h-8 w-8 sm:h-10 sm:w-10 healthcare-gradient rounded-xl flex items-center justify-center">
                  <div className="h-5 w-5 sm:h-6 sm:w-6 text-white text-xs sm:text-sm font-bold">CS</div>
                </div>
              </div>
              <div className="hidden xs:block">
                <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                  CareSync
                </h1>
                <p className="text-xs sm:text-sm text-slate-600">Admin Portal</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-1 sm:space-x-3">
              {/* Hide some buttons on mobile */}
              <div className="hidden sm:flex items-center space-x-2">
                <Button className="healthcare-gradient text-white hover:opacity-90 transition-opacity text-xs sm:text-sm px-2 sm:px-4">
                  <Bell className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden md:inline">Announcements</span>
                </Button>
                <Button className="healthcare-gradient text-white hover:opacity-90 transition-opacity text-xs sm:text-sm px-2 sm:px-4">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden md:inline">Appointments</span>
                </Button>
              </div>
              
              <Button variant="outline" size="sm" onClick={handleLogout} className="text-xs sm:text-sm px-2 sm:px-4">
                <span className="hidden xs:inline">Sign Out</span>
                <span className="xs:hidden">Out</span>
              </Button>
              
              <div className="h-6 w-6 sm:h-8 sm:w-8 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {user?.fullName?.substring(0, 1) || user?.email?.substring(0, 1) || "A"}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Main content with sidebar */}
      <div className="flex w-full min-h-[calc(100vh-4.5rem)]">
        {/* Sidebar */}
        <div className={`
          fixed md:relative z-50 md:z-auto
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          transition-transform duration-300 ease-in-out
          w-64 bg-white border-r border-gray-200 h-full
        `}>
          <div className="p-4 border-b border-gray-100 flex items-center justify-between md:hidden">
            <h2 className="font-semibold text-gray-800">Menu</h2>
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
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
                      ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
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
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
              {currentTab === "overview" ? "Dashboard Overview" : 
               menuItems.find(item => item.id === currentTab)?.label || "Dashboard"}
            </h2>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};
