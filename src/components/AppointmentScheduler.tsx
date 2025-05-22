
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, Phone, Mail, Plus } from "lucide-react";

export const AppointmentScheduler = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const appointments = [
    {
      id: 1,
      time: "09:00 AM",
      duration: "30 min",
      patient: "Sarah Johnson",
      type: "Consultation",
      status: "Confirmed",
      reminders: ["SMS", "Email"],
    },
    {
      id: 2,
      time: "10:30 AM",
      duration: "45 min",
      patient: "Michael Chen",
      type: "Follow-up",
      status: "Pending",
      reminders: ["SMS"],
    },
    {
      id: 3,
      time: "02:00 PM",
      duration: "60 min",
      patient: "Emily Rodriguez",
      type: "Physical Therapy",
      status: "Confirmed",
      reminders: ["SMS", "WhatsApp"],
    },
    {
      id: 4,
      time: "03:30 PM",
      duration: "30 min",
      patient: "David Thompson",
      type: "Checkup",
      status: "Confirmed",
      reminders: ["Email"],
    },
  ];

  const timeSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-emerald-100 text-emerald-700 hover:bg-emerald-100";
      case "Pending":
        return "bg-amber-100 text-amber-700 hover:bg-amber-100";
      case "Cancelled":
        return "bg-red-100 text-red-700 hover:bg-red-100";
      default:
        return "bg-slate-100 text-slate-600 hover:bg-slate-100";
    }
  };

  const getReminderColor = (reminder: string) => {
    switch (reminder) {
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

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Calendar Side */}
      <div className="xl:col-span-1">
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-teal-600" />
              <span>Schedule</span>
            </CardTitle>
            <CardDescription>Select a date to view appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Mini Calendar would go here - simplified for this demo */}
              <div className="bg-gradient-to-r from-blue-50 to-teal-50 p-4 rounded-lg">
                <h3 className="font-semibold text-slate-800 mb-2">Today - January 20, 2024</h3>
                <p className="text-sm text-slate-600">4 appointments scheduled</p>
              </div>

              {/* Available Time Slots */}
              <div>
                <h4 className="font-medium text-slate-700 mb-3">Available Slots</h4>
                <div className="grid grid-cols-2 gap-2">
                  {timeSlots.slice(0, 6).map((slot, index) => (
                    <Button 
                      key={index} 
                      variant="outline" 
                      size="sm"
                      className="text-xs bg-white/80 hover:bg-teal-50"
                    >
                      {slot}
                    </Button>
                  ))}
                </div>
                <Button className="w-full mt-3 healthcare-gradient text-white hover:opacity-90">
                  <Plus className="h-4 w-4 mr-2" />
                  New Appointment
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Appointments List */}
      <div className="xl:col-span-2">
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-teal-600" />
                <span>Today's Appointments</span>
              </div>
              <Badge className="bg-teal-100 text-teal-700 hover:bg-teal-100">
                {appointments.length} scheduled
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="border border-slate-200 rounded-lg p-4 bg-white/50 card-hover"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-slate-500" />
                          <span className="font-semibold text-slate-800">
                            {appointment.time}
                          </span>
                          <span className="text-sm text-slate-500">
                            ({appointment.duration})
                          </span>
                        </div>
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-2 mb-2">
                        <User className="h-4 w-4 text-slate-500" />
                        <span className="font-medium text-slate-700">
                          {appointment.patient}
                        </span>
                        <span className="text-sm text-slate-500">
                          • {appointment.type}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-slate-500">Reminders:</span>
                        <div className="flex space-x-1">
                          {appointment.reminders.map((reminder, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className={`text-xs ${getReminderColor(reminder)}`}
                            >
                              {reminder}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
