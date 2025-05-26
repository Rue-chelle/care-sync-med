import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, User, Bell, MessageSquare, FileText, Pill, Plus, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useUserStore } from "@/stores/userStore";
import { AppointmentBooking } from "@/components/patient/AppointmentBooking";
import { AppointmentsList } from "@/components/patient/AppointmentsList";
import { PrescriptionsList } from "@/components/patient/PrescriptionsList";
import { PatientProfile } from "@/components/patient/PatientProfile";

const PatientDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();
  const { user, logout } = useUserStore();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    logout();
    navigate("/auth");
  };

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
                <p className="text-sm text-slate-600">Patient Portal</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
              <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {user?.fullName?.substring(0, 1) || user?.email?.substring(0, 1) || "P"}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Navigation Tabs */}
          <TabsList className="grid w-full grid-cols-5 bg-white/60 backdrop-blur-sm border border-blue-100">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="appointments" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Appointments</span>
            </TabsTrigger>
            <TabsTrigger value="prescriptions" className="flex items-center space-x-2">
              <Pill className="h-4 w-4" />
              <span>Prescriptions</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="book" className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Book</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-slate-800">Welcome, {user?.fullName || "Patient"}</h2>
              <Button 
                className="healthcare-gradient text-white hover:opacity-90 transition-opacity"
                onClick={() => setActiveTab("book")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Book Appointment
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow hover:scale-105 transform duration-200" onClick={() => setActiveTab("appointments")}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-blue-600" />
                    My Appointments
                  </CardTitle>
                  <CardDescription>View and manage your appointments</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="w-full">View All</Button>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-lg transition-shadow hover:scale-105 transform duration-200" onClick={() => setActiveTab("prescriptions")}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Pill className="mr-2 h-5 w-5 text-blue-600" />
                    My Prescriptions
                  </CardTitle>
                  <CardDescription>Access your medication history</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="w-full">View All</Button>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-lg transition-shadow hover:scale-105 transform duration-200" onClick={() => setActiveTab("profile")}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="mr-2 h-5 w-5 text-blue-600" />
                    My Profile
                  </CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="w-full">Manage</Button>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-lg transition-shadow hover:scale-105 transform duration-200" onClick={() => setActiveTab("book")}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Plus className="mr-2 h-5 w-5 text-blue-600" />
                    Book Appointment
                  </CardTitle>
                  <CardDescription>Schedule a new appointment</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="w-full">Book Now</Button>
                </CardContent>
              </Card>
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
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-slate-800">My Appointments</h2>
              <Button 
                className="healthcare-gradient text-white hover:opacity-90 transition-opacity"
                onClick={() => setActiveTab("book")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Book New Appointment
              </Button>
            </div>
            <AppointmentsList />
          </TabsContent>

          {/* Prescriptions Tab */}
          <TabsContent value="prescriptions" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-slate-800">My Prescriptions</h2>
            </div>
            <PrescriptionsList />
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-slate-800">My Profile</h2>
            </div>
            <PatientProfile />
          </TabsContent>

          {/* Book Appointment Tab */}
          <TabsContent value="book" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-slate-800">Book New Appointment</h2>
            </div>
            <AppointmentBooking />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default PatientDashboard;
