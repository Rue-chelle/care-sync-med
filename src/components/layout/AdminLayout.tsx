
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { useUserStore } from "@/stores/userStore";

import {
  Sidebar,
  SidebarProvider,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";

import { 
  Users, Settings, Calendar, FileText, 
  BarChart, Package, MessageSquare, Building
} from "lucide-react";

type AdminLayoutProps = {
  children: React.ReactNode;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
};

export const AdminLayout = ({ children, currentTab, setCurrentTab }: AdminLayoutProps) => {
  const { user, logout } = useUserStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const menuItems = [
    { id: "overview", label: "Overview", icon: BarChart },
    { id: "users", label: "User Management", icon: Users },
    { id: "appointments", label: "Appointments", icon: Calendar },
    { id: "prescriptions", label: "Prescriptions", icon: FileText },
    { id: "billing", label: "Billing", icon: FileText },
    { id: "patients", label: "Patient Records", icon: Users },
    { id: "inventory", label: "Inventory", icon: Package },
    { id: "messaging", label: "Messaging", icon: MessageSquare },
    { id: "analytics", label: "Analytics", icon: BarChart },
    { id: "branches", label: "Branches", icon: Building },
    { id: "settings", label: "System Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="h-10 w-10 healthcare-gradient rounded-xl flex items-center justify-center">
                  <div className="h-6 w-6 text-white">CS</div>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                  CareSync
                </h1>
                <p className="text-sm text-slate-600">Admin Portal</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button className="healthcare-gradient text-white hover:opacity-90 transition-opacity">
                <Bell className="h-4 w-4 mr-2" />
                Announcements
              </Button>
              <Button className="healthcare-gradient text-white hover:opacity-90 transition-opacity">
                <Calendar className="h-4 w-4 mr-2" />
                Appointments
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Sign Out
              </Button>
              <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {user?.fullName?.substring(0, 1) || user?.email?.substring(0, 1) || "A"}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content with sidebar */}
      <SidebarProvider>
        <div className="flex w-full min-h-[calc(100vh-4.5rem)]">
          <Sidebar className="border-r">
            <SidebarHeader>
              <SidebarTrigger />
            </SidebarHeader>
            
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {menuItems.map((item) => (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton 
                          isActive={currentTab === item.id}
                          onClick={() => setCurrentTab(item.id)}
                          tooltip={item.label}
                        >
                          <item.icon className="size-4 mr-2" />
                          <span>{item.label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            
            <SidebarFooter className="border-t p-4">
              <div className="text-sm text-muted-foreground">
                CareSync Admin v1.0
              </div>
            </SidebarFooter>
          </Sidebar>
          
          {/* Main content area */}
          <div className="flex-1 p-6">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-slate-800">{
                menuItems.find(item => item.id === currentTab)?.label || "Dashboard"
              }</h2>
            </div>
            {children}
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};
