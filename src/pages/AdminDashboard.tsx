
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Users, FileText, MessageSquare, BarChart3, Settings, Building, Package, Bell, LogOut } from "lucide-react";
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
import { DashboardSidebar } from "@/components/shared/DashboardSidebar";
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
  const navigate = useNavigate();
  const { logout, user } = useUserStore();

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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold">345</CardTitle>
            <CardDescription>Total Patients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-green-600">+12% from last month</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold">42</CardTitle>
            <CardDescription>Total Doctors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-green-600">+3 new this month</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold">1,287</CardTitle>
            <CardDescription>Monthly Appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-blue-600">98% completed</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>System Activity</CardTitle>
            <CardDescription>Recent actions in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-4 pb-4 border-b">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-700" />
                  </div>
                  <div>
                    <p className="font-medium">New patient registered</p>
                    <p className="text-sm text-muted-foreground">{i * 2} hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Today's Appointments</CardTitle>
            <CardDescription>Scheduled for today</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { time: "09:00", patient: "Emily Johnson", doctor: "Dr. Smith", status: "Completed" },
                  { time: "10:30", patient: "Michael Brown", doctor: "Dr. Wong", status: "In Progress" },
                  { time: "14:15", patient: "Sarah Lee", doctor: "Dr. Smith", status: "Scheduled" },
                ].map((appt, i) => (
                  <TableRow key={i}>
                    <TableCell>{appt.time}</TableCell>
                    <TableCell>{appt.patient}</TableCell>
                    <TableCell>{appt.doctor}</TableCell>
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
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-30">
        <div className="px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 ml-12 lg:ml-0">
              <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl flex items-center justify-center">
                <div className="h-6 w-6 text-white font-bold">AM</div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                  AloraMed Admin
                </h1>
                <p className="text-sm text-slate-600">Administrative Dashboard</p>
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
          userRole="admin"
          userName={user?.fullName}
        />

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
