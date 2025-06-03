
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Bell, MessageSquare, FileText, BarChart3, Settings, LogOut, Upload, Menu, X } from "lucide-react";
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
import { DoctorNotifications } from "@/components/doctor/DoctorNotifications";
import { EnhancedScheduleModal } from "@/components/doctor/EnhancedScheduleModal";
import { NotificationPanel } from "@/components/shared/NotificationPanel";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [todayStats, setTodayStats] = useState({
    totalAppointments: 8,
    completedAppointments: 5,
    pendingAppointments: 3,
    unreadMessages: 2
  });
  const { toast } = useToast();
  const { logout, user } = useUserStore();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    fetchDoctorProfile();
    fetchTodayStats();
  }, []);

  const fetchDoctorProfile = async () => {
    try {
      setDoctorProfile({
        id: 'demo-doctor-id',
        full_name: 'Dr. Sarah Johnson',
        specialization: 'Cardiology',
        email: 'sarah.johnson@aloramedapp.com',
        phone: '+1 (555) 123-4567',
        bio: 'Experienced cardiologist with over 10 years of practice.',
        license_number: 'MD123456',
        years_experience: 12
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchTodayStats = async () => {
    // Using demo data for now
    setTodayStats({
      totalAppointments: 8,
      completedAppointments: 5,
      pendingAppointments: 3,
      unreadMessages: 2
    });
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
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "files", label: "File Upload", icon: Upload },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "availability", label: "Availability", icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-4 lg:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-xl lg:text-3xl font-bold text-slate-800">Dashboard Overview</h2>
              <Button
                className="bg-gradient-to-r from-blue-600 to-teal-600 text-white w-full sm:w-auto"
                onClick={() => setShowScheduleModal(true)}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Schedule New Appointment
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl lg:text-2xl font-bold text-blue-600">
                    {todayStats.totalAppointments}
                  </CardTitle>
                  <CardDescription className="text-sm lg:text-base">Today's Appointments</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl lg:text-2xl font-bold text-green-600">
                    {todayStats.completedAppointments}
                  </CardTitle>
                  <CardDescription className="text-sm lg:text-base">Completed</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl lg:text-2xl font-bold text-orange-600">
                    {todayStats.pendingAppointments}
                  </CardTitle>
                  <CardDescription className="text-sm lg:text-base">Pending</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl lg:text-2xl font-bold text-red-600">
                    {todayStats.unreadMessages}
                  </CardTitle>
                  <CardDescription className="text-sm lg:text-base">Unread Messages</CardDescription>
                </CardHeader>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg lg:text-xl">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
      case "notifications":
        return <DoctorNotifications />;
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
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 lg:px-6 py-3 lg:py-4">
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
                  AloraMed Doctor
                </h1>
                <p className="text-xs lg:text-sm text-slate-600">
                  Welcome, Dr. {doctorProfile?.full_name || 'Doctor'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 lg:space-x-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="relative p-2 lg:px-3 lg:py-2"
                onClick={() => setNotificationOpen(true)}
              >
                <Bell className="h-4 w-4 mr-0 lg:mr-2" />
                <span className="hidden lg:inline">Notifications</span>
                {todayStats.unreadMessages > 0 && (
                  <span className="absolute -top-1 -right-1 lg:-top-2 lg:-right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 lg:h-5 lg:w-5 flex items-center justify-center">
                    {todayStats.unreadMessages}
                  </span>
                )}
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
              const isActive = activeTab === item.id;
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
                    setActiveTab(item.id);
                    if (isMobile) setSidebarOpen(false);
                  }}
                >
                  <Icon className={`h-5 w-5 ${isMobile ? 'mr-3' : 'mr-0 md:mr-3'}`} />
                  <span className={`${isMobile ? 'block' : 'hidden md:block'}`}>
                    {item.label}
                  </span>
                  {item.badge && item.badge > 0 && (
                    <span className={`ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ${isMobile ? 'block' : 'hidden md:block'}`}>
                      {item.badge}
                    </span>
                  )}
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

      {/* Schedule Modal */}
      <EnhancedScheduleModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        onSchedule={() => {
          if (activeTab === "appointments") {
            window.location.reload();
          }
        }}
      />

      {/* Notification Panel */}
      <NotificationPanel
        isOpen={notificationOpen}
        onClose={() => setNotificationOpen(false)}
      />
    </div>
  );
};

export default DoctorDashboard;
