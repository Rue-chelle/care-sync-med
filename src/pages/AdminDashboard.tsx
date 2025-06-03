
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Users, FileText, MessageSquare, BarChart3, Settings, Building, Package, Bell, LogOut, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useUserStore } from "@/stores/userStore";
import { UserManagement } from "@/components/admin/UserManagement";
import { Prescriptions } from "@/components/admin/Prescriptions";
import { Billing } from "@/components/admin/Billing";
import { MessagingInterface } from "@/components/shared/MessagingInterface";
import { SystemSettings } from "@/components/admin/SystemSettings";
import { BranchManagement } from "@/components/admin/BranchManagement";
import { Analytics } from "@/components/admin/Analytics";
import { Inventory } from "@/components/admin/Inventory";
import { PatientRecords } from "@/components/admin/PatientRecords";
import { NotificationPanel } from "@/components/shared/NotificationPanel";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AdminDashboard = () => {
  const [currentTab, setCurrentTab] = useState("overview");
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { logout, user } = useUserStore();
  const isMobile = useIsMobile();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    logout();
    navigate("/auth");
  };

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "users", label: "User Management", icon: Users },
    { id: "patients", label: "Patient Records", icon: User },
    { id: "prescriptions", label: "Prescriptions", icon: FileText },
    { id: "inventory", label: "Inventory", icon: Package },
    { id: "billing", label: "Billing", icon: FileText },
    { id: "messaging", label: "Messaging", icon: MessageSquare },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "branches", label: "Branch Management", icon: Building },
    { id: "settings", label: "System Settings", icon: Settings },
  ];

  // Overview content component
  const OverviewContent = () => (
    <div className="space-y-4 lg:space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl lg:text-2xl font-bold">345</CardTitle>
            <CardDescription className="text-sm lg:text-base">Total Patients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-green-600">+12% from last month</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl lg:text-2xl font-bold">42</CardTitle>
            <CardDescription className="text-sm lg:text-base">Total Doctors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-green-600">+3 new this month</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl lg:text-2xl font-bold">1,287</CardTitle>
            <CardDescription className="text-sm lg:text-base">Monthly Appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-blue-600">98% completed</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg lg:text-xl">System Activity</CardTitle>
            <CardDescription className="text-sm lg:text-base">Recent actions in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-4 pb-4 border-b">
                  <div className="h-8 w-8 lg:h-10 lg:w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 lg:h-5 lg:w-5 text-blue-700" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm lg:text-base">New patient registered</p>
                    <p className="text-xs lg:text-sm text-muted-foreground">{i * 2} hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg lg:text-xl">Today's Appointments</CardTitle>
            <CardDescription className="text-sm lg:text-base">Scheduled for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs lg:text-sm">Time</TableHead>
                    <TableHead className="text-xs lg:text-sm">Patient</TableHead>
                    <TableHead className="text-xs lg:text-sm">Doctor</TableHead>
                    <TableHead className="text-xs lg:text-sm">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { time: "09:00", patient: "Emily Johnson", doctor: "Dr. Smith", status: "Completed" },
                    { time: "10:30", patient: "Michael Brown", doctor: "Dr. Wong", status: "In Progress" },
                    { time: "14:15", patient: "Sarah Lee", doctor: "Dr. Smith", status: "Scheduled" },
                  ].map((appt, i) => (
                    <TableRow key={i}>
                      <TableCell className="text-xs lg:text-sm">{appt.time}</TableCell>
                      <TableCell className="text-xs lg:text-sm">{appt.patient}</TableCell>
                      <TableCell className="text-xs lg:text-sm">{appt.doctor}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          appt.status === "Completed" ? "bg-green-100 text-green-800" :
                          appt.status === "In Progress" ? "bg-blue-100 text-blue-800" :
                          "bg-yellow-100 text-yellow-800"
                        }`}>{appt.status}</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (currentTab) {
      case "overview":
        return <OverviewContent />;
      case "users":
        return <UserManagement />;
      case "prescriptions":
        return <Prescriptions />;
      case "billing":
        return <Billing />;
      case "messaging":
        return <MessagingInterface userType="admin" />;
      case "patients":
        return <PatientRecords />;
      case "inventory":
        return <Inventory />;
      case "analytics":
        return <Analytics />;
      case "branches":
        return <BranchManagement />;
      case "settings":
        return <SystemSettings />;
      default:
        return <OverviewContent />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="px-4 lg:px-6 py-3 lg:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 md:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="h-8 w-8 lg:h-10 lg:w-10 bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl flex items-center justify-center">
                <div className="h-4 w-4 lg:h-6 lg:w-6 text-white font-bold text-xs lg:text-base">AM</div>
              </div>
              <div>
                <h1 className="text-lg lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                  AloraMed Admin
                </h1>
                <p className="text-xs lg:text-sm text-slate-600">Administrative Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 lg:space-x-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsNotificationOpen(true)}
                className="p-2 lg:px-3 lg:py-2"
              >
                <Bell className="h-4 w-4 mr-0 lg:mr-2" />
                <span className="hidden lg:inline">Notifications</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="p-2 lg:px-3 lg:py-2"
              >
                <LogOut className="h-4 w-4 mr-0 lg:mr-2" />
                <span className="hidden lg:inline">Logout</span>
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
          } transition-transform duration-300 z-40 bg-white/90 backdrop-blur-sm border-r border-slate-200 h-screen ${
            isMobile ? 'w-64' : 'w-16 md:w-64'
          }`}
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div className={`${isMobile ? 'block' : 'hidden md:block'} font-semibold text-slate-800`}>
              Navigation
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className={`${isMobile ? 'block' : 'hidden'} p-1`}
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
                      ? 'bg-blue-50 text-blue-600 border-blue-200'
                      : 'text-slate-600 hover:bg-slate-100'
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
          {renderTabContent()}
        </main>
      </div>

      <NotificationPanel 
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
    </div>
  );
};

export default AdminDashboard;
