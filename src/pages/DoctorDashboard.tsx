
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Users, Bell, MessageSquare, FileText, BarChart3, Settings, Menu, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useUserStore } from "@/stores/userStore";
import { DoctorAppointments } from "@/components/doctor/DoctorAppointments";
import { PatientRecords } from "@/components/doctor/PatientRecords";
import { PrescriptionTool } from "@/components/doctor/PrescriptionTool";
import { DoctorMessages } from "@/components/doctor/DoctorMessages";
import { DoctorAnalytics } from "@/components/doctor/DoctorAnalytics";
import { AvailabilitySettings } from "@/components/doctor/AvailabilitySettings";
import { FileUpload } from "@/components/doctor/FileUpload";

interface DoctorProfile {
  id: string;
  full_name: string;
  specialization: string;
  email: string;
  phone: string;
  bio: string;
  license_number: string;
  years_experience: number;
}

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [doctorProfile, setDoctorProfile] = useState<DoctorProfile | null>(null);
  const [todayStats, setTodayStats] = useState({
    totalAppointments: 0,
    completedAppointments: 0,
    pendingAppointments: 0,
    unreadMessages: 0
  });
  const { toast } = useToast();
  const { logout } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctorProfile();
    fetchTodayStats();
  }, []);

  const fetchDoctorProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching doctor profile:', error);
        return;
      }

      setDoctorProfile(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchTodayStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: doctorData } = await supabase
        .from('doctors')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!doctorData) return;

      const today = new Date().toISOString().split('T')[0];

      // Fetch today's appointments
      const { data: appointments } = await supabase
        .from('appointments')
        .select('status')
        .eq('doctor_id', doctorData.id)
        .eq('appointment_date', today);

      // Fetch unread messages
      const { data: messages } = await supabase
        .from('messages')
        .select('id')
        .eq('recipient_id', user.id)
        .is('read_at', null);

      const totalAppointments = appointments?.length || 0;
      const completedAppointments = appointments?.filter(a => a.status === 'completed').length || 0;
      const pendingAppointments = appointments?.filter(a => a.status === 'scheduled').length || 0;
      const unreadMessages = messages?.length || 0;

      setTodayStats({
        totalAppointments,
        completedAppointments,
        pendingAppointments,
        unreadMessages
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

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
      
      // Clear user store and redirect
      logout();
      navigate("/auth");
      
      toast({
        title: "Logged out successfully",
        description: "You have been signed out of your account.",
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Error signing out",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "appointments", label: "Appointments", icon: Calendar },
    { id: "patients", label: "Patient Records", icon: Users },
    { id: "prescriptions", label: "E-Prescriptions", icon: FileText },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "files", label: "File Upload", icon: FileText },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "availability", label: "Availability", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden"
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              <div className="h-10 w-10 healthcare-gradient rounded-xl flex items-center justify-center">
                <div className="h-6 w-6 text-white font-bold">AM</div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                  AloraMed Doctor
                </h1>
                <p className="text-sm text-slate-600">
                  Welcome, Dr. {doctorProfile?.full_name || 'Doctor'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" className="relative">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
                {todayStats.unreadMessages > 0 && (
                  <Badge className="ml-2 bg-red-500 text-white">
                    {todayStats.unreadMessages}
                  </Badge>
                )}
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:relative z-40 w-64 h-screen bg-white/90 backdrop-blur-sm border-r border-blue-100 transition-transform duration-300 ease-in-out`}>
          <div className="p-6">
            <nav className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? "default" : "ghost"}
                    className={`w-full justify-start ${
                      activeTab === item.id 
                        ? "healthcare-gradient text-white" 
                        : "hover:bg-blue-50"
                    }`}
                    onClick={() => {
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                    }}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    {item.label}
                  </Button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:ml-0">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-slate-800">Dashboard Overview</h2>
              
              {/* Today's Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-2xl font-bold text-blue-600">
                      {todayStats.totalAppointments}
                    </CardTitle>
                    <CardDescription>Today's Appointments</CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-2xl font-bold text-green-600">
                      {todayStats.completedAppointments}
                    </CardTitle>
                    <CardDescription>Completed</CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-2xl font-bold text-orange-600">
                      {todayStats.pendingAppointments}
                    </CardTitle>
                    <CardDescription>Pending</CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-2xl font-bold text-red-600">
                      {todayStats.unreadMessages}
                    </CardTitle>
                    <CardDescription>Unread Messages</CardDescription>
                  </CardHeader>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button 
                      className="healthcare-gradient text-white"
                      onClick={() => setActiveTab("appointments")}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      View Appointments
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setActiveTab("prescriptions")}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Write Prescription
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setActiveTab("messages")}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Check Messages
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "appointments" && <DoctorAppointments />}
          {activeTab === "patients" && <PatientRecords />}
          {activeTab === "prescriptions" && <PrescriptionTool />}
          {activeTab === "messages" && <DoctorMessages />}
          {activeTab === "files" && <FileUpload />}
          {activeTab === "analytics" && <DoctorAnalytics />}
          {activeTab === "availability" && <AvailabilitySettings />}
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DoctorDashboard;
