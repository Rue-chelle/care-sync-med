
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, User, Bell, MessageSquare, FileText, Pill, Plus, LogOut, Menu } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useUserStore } from "@/stores/userStore";
import { EnhancedAppointmentBooking } from "@/components/patient/EnhancedAppointmentBooking";
import { AppointmentsList } from "@/components/patient/AppointmentsList";
import { PrescriptionsList } from "@/components/patient/PrescriptionsList";
import { EnhancedPatientProfile } from "@/components/patient/EnhancedPatientProfile";
import { MessagingInterface } from "@/components/shared/MessagingInterface";
import { DashboardSidebar } from "@/components/shared/DashboardSidebar";
import { NotificationPanel } from "@/components/shared/NotificationPanel";
import { useIsMobile } from "@/hooks/use-mobile";

const PatientDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useUserStore();
  const isMobile = useIsMobile();

  useEffect(() => {
    fetchUnreadMessages();
  }, []);

  const fetchUnreadMessages = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      const { data } = await supabase
        .from('messages')
        .select('id')
        .eq('recipient_id', authUser.id)
        .is('read_at', null);

      setUnreadMessages(data?.length || 0);
    } catch (error) {
      console.error('Error fetching unread messages:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    logout();
    navigate("/auth");
  };

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: User },
    { id: "appointments", label: "Appointments", icon: Calendar },
    { id: "prescriptions", label: "Prescriptions", icon: Pill },
    { id: "messages", label: "Messages", icon: MessageSquare, badge: unreadMessages },
    { id: "profile", label: "My Profile", icon: FileText },
    { id: "book", label: "Book Appointment", icon: Plus },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-4 lg:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-2xl lg:text-3xl font-bold text-slate-800">
                Welcome, {user?.fullName || "Patient"}
              </h2>
              <Button 
                className="bg-gradient-to-r from-blue-600 to-teal-600 text-white hover:opacity-90 transition-opacity w-full sm:w-auto"
                onClick={() => setActiveTab("book")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Book Appointment
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
              {[
                { title: "My Appointments", desc: "View and manage your appointments", tab: "appointments", icon: Calendar },
                { title: "My Prescriptions", desc: "Access your medication history", tab: "prescriptions", icon: Pill },
                { title: "My Profile", desc: "Update your personal information", tab: "profile", icon: User },
                { title: "Messages", desc: "Chat with your healthcare team", tab: "messages", icon: MessageSquare },
              ].map((item) => (
                <Card key={item.tab} className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 transform duration-200" onClick={() => setActiveTab(item.tab)}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-sm lg:text-base">
                      <item.icon className="mr-2 h-4 w-4 lg:h-5 lg:w-5 text-blue-600" />
                      {item.title}
                    </CardTitle>
                    <CardDescription className="text-xs lg:text-sm">{item.desc}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button variant="ghost" className="w-full text-xs lg:text-sm">View</Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg lg:text-xl">Recent Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  <AppointmentsList />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg lg:text-xl">Recent Prescriptions</CardTitle>
                </CardHeader>
                <CardContent>
                  <PrescriptionsList />
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case "appointments":
        return (
          <div className="space-y-4 lg:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-2xl lg:text-3xl font-bold text-slate-800">My Appointments</h2>
              <Button 
                className="bg-gradient-to-r from-blue-600 to-teal-600 text-white hover:opacity-90 transition-opacity w-full sm:w-auto"
                onClick={() => setActiveTab("book")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Book New Appointment
              </Button>
            </div>
            <AppointmentsList />
          </div>
        );
      case "prescriptions":
        return (
          <div className="space-y-4 lg:space-y-6">
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-800">My Prescriptions</h2>
            <PrescriptionsList />
          </div>
        );
      case "messages":
        return (
          <div className="space-y-4 lg:space-y-6">
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-800">Messages</h2>
            <MessagingInterface userType="patient" targetUserType="doctor" />
          </div>
        );
      case "profile":
        return (
          <div className="space-y-4 lg:space-y-6">
            <EnhancedPatientProfile />
          </div>
        );
      case "book":
        return (
          <div className="space-y-4 lg:space-y-6">
            <EnhancedAppointmentBooking />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-40">
        <div className="container mx-auto px-3 lg:px-6 py-3 lg:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 lg:space-x-3">
              {isMobile && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              )}
              <div className="h-8 w-8 lg:h-10 lg:w-10 bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl flex items-center justify-center">
                <div className="h-4 w-4 lg:h-6 lg:w-6 text-white font-bold text-xs lg:text-base">AM</div>
              </div>
              <div>
                <h1 className="text-lg lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                  AloraMed
                </h1>
                <p className="text-xs lg:text-sm text-slate-600">Patient Portal</p>
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
                {unreadMessages > 0 && (
                  <span className="absolute -top-1 -right-1 lg:-top-2 lg:-right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 lg:h-5 lg:w-5 flex items-center justify-center">
                    {unreadMessages}
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
                <span className="hidden lg:inline">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Mobile Sidebar Overlay */}
        {isMobile && sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`${isMobile ? 'fixed' : 'relative'} ${isMobile && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'} transition-transform duration-300 z-40`}>
          <DashboardSidebar
            items={sidebarItems}
            activeTab={activeTab}
            onTabChange={(tab) => {
              setActiveTab(tab);
              if (isMobile) setSidebarOpen(false);
            }}
            userRole="patient"
            userName={user?.fullName}
          />
        </div>

        {/* Main Content */}
        <main className={`flex-1 p-3 lg:p-6 min-h-screen ${isMobile ? 'w-full' : ''}`}>
          {renderContent()}
        </main>
      </div>

      {/* Notification Panel */}
      <NotificationPanel
        isOpen={notificationOpen}
        onClose={() => setNotificationOpen(false)}
      />
    </div>
  );
};

export default PatientDashboard;
