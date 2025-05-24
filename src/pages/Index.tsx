
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Bell, MessageSquare, Phone, Mail, Plus, Activity, Clock, UserCheck, ArrowRight } from "lucide-react";
import { PatientList } from "@/components/PatientList";
import { AppointmentScheduler } from "@/components/AppointmentScheduler";
import { ReminderSettings } from "@/components/ReminderSettings";
import { UpcomingReminders } from "@/components/UpcomingReminders";
import { DashboardStats } from "@/components/DashboardStats";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="h-10 w-10 healthcare-gradient rounded-xl flex items-center justify-center">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-emerald-500 rounded-full flex items-center justify-center">
                  <div className="h-2 w-2 bg-white rounded-full"></div>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                  CareSync
                </h1>
                <p className="text-sm text-slate-600">Healthcare Reminder System</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link to="/patient/auth">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Patient Portal
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button variant="outline" size="sm" className="relative">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
                <Badge className="ml-2 bg-red-500 text-white">3</Badge>
              </Button>
              <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full"></div>
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
              <Activity className="h-4 w-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="patients" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Patients</span>
            </TabsTrigger>
            <TabsTrigger value="appointments" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Appointments</span>
            </TabsTrigger>
            <TabsTrigger value="reminders" className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <span>Reminders</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-slate-800">Dashboard Overview</h2>
              <div className="flex gap-2">
                <Link to="/patient/auth">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Patient Portal
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Button className="healthcare-gradient text-white hover:opacity-90 transition-opacity">
                  <Plus className="h-4 w-4 mr-2" />
                  Quick Schedule
                </Button>
              </div>
            </div>
            
            <DashboardStats />
            <UpcomingReminders />
          </TabsContent>

          {/* Patients Tab */}
          <TabsContent value="patients" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-slate-800">Patient Management</h2>
              <Button className="healthcare-gradient text-white hover:opacity-90 transition-opacity">
                <Plus className="h-4 w-4 mr-2" />
                Add Patient
              </Button>
            </div>
            <PatientList />
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-slate-800">Appointment Scheduler</h2>
              <Button className="healthcare-gradient text-white hover:opacity-90 transition-opacity">
                <Calendar className="h-4 w-4 mr-2" />
                New Appointment
              </Button>
            </div>
            <AppointmentScheduler />
          </TabsContent>

          {/* Reminders Tab */}
          <TabsContent value="reminders" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-slate-800">Reminder Management</h2>
            </div>
            <UpcomingReminders detailed />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-slate-800">Reminder Settings</h2>
            </div>
            <ReminderSettings />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
