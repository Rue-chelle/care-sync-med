import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Bell, MessageSquare, FileText, BarChart3, Settings, LogOut, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useUserStore } from "@/stores/userStore";
import { DoctorAppointments } from "@/components/doctor/DoctorAppointments";
import { PatientRecords } from "@/components/doctor/PatientRecords";
import { PrescriptionTool } from "@/components/doctor/PrescriptionTool";
import { MessagingInterface } from "@/components/shared/MessagingInterface";
import { DoctorAnalytics } from "@/components/doctor/DoctorAnalytics";
import { AvailabilitySettings } from "@/components/doctor/AvailabilitySettings";
import { FileUpload } from "@/components/doctor/FileUpload";
import { DashboardSidebar } from "@/components/shared/DashboardSidebar";

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
  const [doctorProfile, setDoctorProfile] = useState<DoctorProfile | null>(null);
  const [todayStats, setTodayStats] = useState({
    totalAppointments: 0,
    completedAppointments: 0,
    pendingAppointments: 0,
    unreadMessages: 0
  });
  const { toast } = useToast();
  const { logout, user } = useUserStore();
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
    { id: "messages", label: "Messages", icon: MessageSquare, badge: todayStats.unreadMessages },
    { id: "files", label: "File Upload", icon: Upload },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "availability", label: "Availability", icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-slate-800">Dashboard Overview</h2>
            
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

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    className="bg-gradient-to-r from-blue-600 to-teal-600 text-white"
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
        );
      case "appointments":
        return <DoctorAppointments />;
      case "patients":
        return <PatientRecords />;
      case "prescriptions":
        return <PrescriptionTool />;
      case "messages":
        return <MessagingInterface userType="doctor" />;
      case "files":
        return <FileUpload />;
      case "analytics":
        return <DoctorAnalytics />;
      case "availability":
        return <AvailabilitySettings />;
      default:
        return null;
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
                <span className="hidden sm:inline">Notifications</span>
                {todayStats.unreadMessages > 0 && (
                  <Badge className="ml-2 bg-red-500 text-white">
                    {todayStats.unreadMessages}
                  </Badge>
                )}
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
          activeTab={activeTab}
          onTabChange={setActiveTab}
          userRole="doctor"
          userName={doctorProfile?.full_name}
        />

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default DoctorDashboard;
