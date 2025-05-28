
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, User, Bell, MessageSquare, FileText, Pill, Plus, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useUserStore } from "@/stores/userStore";
import { AppointmentBooking } from "@/components/patient/AppointmentBooking";
import { AppointmentsList } from "@/components/patient/AppointmentsList";
import { PrescriptionsList } from "@/components/patient/PrescriptionsList";
import { PatientProfile } from "@/components/patient/PatientProfile";
import { MessagingInterface } from "@/components/shared/MessagingInterface";
import { DashboardSidebar } from "@/components/shared/DashboardSidebar";

const PatientDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [unreadMessages, setUnreadMessages] = useState(0);
  const navigate = useNavigate();
  const { user, logout } = useUserStore();

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
    { id: "profile", label: "Profile", icon: FileText },
    { id: "book", label: "Book Appointment", icon: Plus },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-slate-800">Welcome, {user?.fullName || "Patient"}</h2>
              <Button 
                className="bg-gradient-to-r from-blue-600 to-teal-600 text-white hover:opacity-90 transition-opacity"
                onClick={() => setActiveTab("book")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Book Appointment
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "My Appointments", desc: "View and manage your appointments", tab: "appointments", icon: Calendar },
                { title: "My Prescriptions", desc: "Access your medication history", tab: "prescriptions", icon: Pill },
                { title: "My Profile", desc: "Update your personal information", tab: "profile", icon: User },
                { title: "Messages", desc: "Chat with your healthcare team", tab: "messages", icon: MessageSquare },
              ].map((item) => (
                <Card key={item.tab} className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 transform duration-200" onClick={() => setActiveTab(item.tab)}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <item.icon className="mr-2 h-5 w-5 text-blue-600" />
                      {item.title}
                    </CardTitle>
                    <CardDescription>{item.desc}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="ghost" className="w-full">View</Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  <AppointmentsList />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Prescriptions</CardTitle>
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
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-slate-800">My Appointments</h2>
              <Button 
                className="bg-gradient-to-r from-blue-600 to-teal-600 text-white hover:opacity-90 transition-opacity"
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
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-slate-800">My Prescriptions</h2>
            <PrescriptionsList />
          </div>
        );
      case "messages":
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-slate-800">Messages</h2>
            <MessagingInterface userType="patient" targetUserType="doctor" />
          </div>
        );
      case "profile":
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-slate-800">My Profile</h2>
            <PatientProfile />
          </div>
        );
      case "book":
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-slate-800">Book New Appointment</h2>
            <AppointmentBooking />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-30">
        <div className="container mx-auto px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 ml-12 lg:ml-0">
              <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl flex items-center justify-center">
                <div className="h-6 w-6 text-white font-bold">AM</div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                  AloraMed
                </h1>
                <p className="text-sm text-slate-600">Patient Portal</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" className="relative">
                <Bell className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Notifications</span>
                {unreadMessages > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadMessages}
                  </span>
                )}
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Sign Out</span>
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
          userRole="patient"
          userName={user?.fullName}
        />

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6 min-h-screen">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default PatientDashboard;
