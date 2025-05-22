
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Clock, User, Phone, Mail, MessageSquare, Send } from "lucide-react";

interface UpcomingRemindersProps {
  detailed?: boolean;
}

export const UpcomingReminders = ({ detailed = false }: UpcomingRemindersProps) => {
  const reminders = [
    {
      id: 1,
      patient: "Sarah Johnson",
      type: "Appointment Reminder",
      scheduledFor: "2024-01-20 08:00 AM",
      appointmentDate: "2024-01-22 09:00 AM",
      method: "SMS",
      status: "Pending",
      message: "Reminder: You have an appointment tomorrow at 9:00 AM with Dr. Smith.",
    },
    {
      id: 2,
      patient: "Michael Chen",
      type: "Follow-up Reminder",
      scheduledFor: "2024-01-20 10:00 AM",
      appointmentDate: "2024-01-25 10:30 AM",
      method: "Email",
      status: "Sent",
      message: "Follow-up appointment reminder for your diabetes checkup.",
    },
    {
      id: 3,
      patient: "Emily Rodriguez",
      type: "Medication Reminder",
      scheduledFor: "2024-01-20 02:00 PM",
      appointmentDate: null,
      method: "WhatsApp",
      status: "Pending",
      message: "Don't forget to take your medication as prescribed.",
    },
    {
      id: 4,
      patient: "David Thompson",
      type: "Appointment Reminder",
      scheduledFor: "2024-01-21 08:00 AM",
      appointmentDate: "2024-01-23 02:00 PM",
      method: "SMS",
      status: "Scheduled",
      message: "Reminder: Physical therapy session scheduled for Jan 23 at 2:00 PM.",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Sent":
        return "bg-emerald-100 text-emerald-700 hover:bg-emerald-100";
      case "Pending":
        return "bg-amber-100 text-amber-700 hover:bg-amber-100";
      case "Scheduled":
        return "bg-blue-100 text-blue-700 hover:bg-blue-100";
      case "Failed":
        return "bg-red-100 text-red-700 hover:bg-red-100";
      default:
        return "bg-slate-100 text-slate-600 hover:bg-slate-100";
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "SMS":
        return <Phone className="h-4 w-4" />;
      case "Email":
        return <Mail className="h-4 w-4" />;
      case "WhatsApp":
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case "SMS":
        return "bg-blue-100 text-blue-700";
      case "Email":
        return "bg-purple-100 text-purple-700";
      case "WhatsApp":
        return "bg-green-100 text-green-700";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  if (!detailed) {
    return (
      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-teal-600" />
              <span>Upcoming Reminders</span>
            </div>
            <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
              {reminders.filter(r => r.status === "Pending").length} pending
            </Badge>
          </CardTitle>
          <CardDescription>Next 24 hours</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {reminders.slice(0, 3).map((reminder) => (
              <div
                key={reminder.id}
                className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-slate-200"
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getMethodColor(reminder.method)}`}>
                    {getMethodIcon(reminder.method)}
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{reminder.patient}</p>
                    <p className="text-sm text-slate-600">{reminder.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={getStatusColor(reminder.status)}>
                    {reminder.status}
                  </Badge>
                  <p className="text-xs text-slate-500 mt-1">
                    {new Date(reminder.scheduledFor).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-amber-100 rounded-lg flex items-center justify-center">
                <Clock className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">
                  {reminders.filter(r => r.status === "Pending").length}
                </p>
                <p className="text-sm text-slate-600">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Send className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">
                  {reminders.filter(r => r.status === "Sent").length}
                </p>
                <p className="text-sm text-slate-600">Sent Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Bell className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">
                  {reminders.filter(r => r.status === "Scheduled").length}
                </p>
                <p className="text-sm text-slate-600">Scheduled</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-sm">
        <CardHeader>
          <CardTitle>All Reminders</CardTitle>
          <CardDescription>Manage and track all patient reminders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reminders.map((reminder) => (
              <div
                key={reminder.id}
                className="border border-slate-200 rounded-lg p-4 bg-white/50 card-hover"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`p-2 rounded-lg ${getMethodColor(reminder.method)}`}>
                        {getMethodIcon(reminder.method)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800">{reminder.patient}</h4>
                        <p className="text-sm text-slate-600">{reminder.type}</p>
                      </div>
                      <Badge className={getStatusColor(reminder.status)}>
                        {reminder.status}
                      </Badge>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-lg mb-3">
                      <p className="text-sm text-slate-700">{reminder.message}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-slate-500 font-medium">Scheduled For</p>
                        <p className="text-slate-700">
                          {new Date(reminder.scheduledFor).toLocaleString()}
                        </p>
                      </div>
                      {reminder.appointmentDate && (
                        <div>
                          <p className="text-slate-500 font-medium">Appointment Date</p>
                          <p className="text-slate-700">
                            {new Date(reminder.appointmentDate).toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-2 ml-4">
                    {reminder.status === "Pending" && (
                      <Button size="sm" className="healthcare-gradient text-white hover:opacity-90">
                        Send Now
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
