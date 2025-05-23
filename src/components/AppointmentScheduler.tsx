
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Clock, User, Phone, Mail, Plus, X, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";

export const AppointmentScheduler = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState([
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
  ]);

  const [timeSlots, setTimeSlots] = useState([
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"
  ]);

  const [availableSlots, setAvailableSlots] = useState([...timeSlots]);
  const [patients] = useState([
    { id: 1, name: "Sarah Johnson" },
    { id: 2, name: "Michael Chen" },
    { id: 3, name: "Emily Rodriguez" },
    { id: 4, name: "David Thompson" },
    { id: 5, name: "Robert Wilson" },
    { id: 6, name: "Jennifer Brown" },
  ]);
  
  const [newAppointment, setNewAppointment] = useState({
    date: new Date(),
    time: "",
    duration: "30 min",
    patientId: "",
    type: "Checkup",
    reminders: ["SMS", "Email"]
  });
  
  useEffect(() => {
    // Update available time slots when date or appointments change
    const bookedSlots = appointments
      .filter(apt => {
        const aptDate = new Date(selectedDate);
        aptDate.setHours(0, 0, 0, 0);
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        return aptDate.getTime() === currentDate.getTime();
      })
      .map(apt => apt.time);
      
    const available = timeSlots.filter(slot => !bookedSlots.includes(slot));
    setAvailableSlots(available);
  }, [selectedDate, appointments, timeSlots]);

  const getStatusColor = (status) => {
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

  const getReminderColor = (reminder) => {
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
  
  const handleCreateAppointment = () => {
    if (!newAppointment.time || !newAppointment.patientId) {
      toast({
        title: "Missing Information",
        description: "Please select both a time and a patient for the appointment.",
        variant: "destructive"
      });
      return;
    }
    
    const selectedPatient = patients.find(p => p.id.toString() === newAppointment.patientId);
    if (!selectedPatient) {
      toast({
        title: "Invalid Patient",
        description: "Please select a valid patient.",
        variant: "destructive"
      });
      return;
    }
    
    const newId = Math.max(...appointments.map(a => a.id)) + 1;
    
    const createdAppointment = {
      id: newId,
      time: newAppointment.time,
      duration: newAppointment.duration,
      patient: selectedPatient.name,
      type: newAppointment.type,
      status: "Confirmed",
      reminders: newAppointment.reminders
    };
    
    setAppointments([...appointments, createdAppointment]);
    
    setNewAppointment({
      date: new Date(),
      time: "",
      duration: "30 min",
      patientId: "",
      type: "Checkup",
      reminders: ["SMS", "Email"]
    });
    
    // Update available slots
    setAvailableSlots(availableSlots.filter(slot => slot !== createdAppointment.time));
    
    toast({
      title: "Appointment Scheduled",
      description: `${selectedPatient.name} has been scheduled for ${newAppointment.time}.`,
    });
  };
  
  const handleDeleteAppointment = (id) => {
    const appointment = appointments.find(a => a.id === id);
    if (appointment) {
      setAppointments(appointments.filter(a => a.id !== id));
      setAvailableSlots([...availableSlots, appointment.time].sort());
      
      toast({
        title: "Appointment Cancelled",
        description: `The appointment with ${appointment.patient} has been cancelled.`,
      });
    }
  };
  
  const handleChangeStatus = (id, newStatus) => {
    const updatedAppointments = appointments.map(apt => 
      apt.id === id ? { ...apt, status: newStatus } : apt
    );
    
    setAppointments(updatedAppointments);
    
    const appointment = appointments.find(a => a.id === id);
    
    toast({
      title: `Status Updated: ${newStatus}`,
      description: `The appointment with ${appointment.patient} is now ${newStatus.toLowerCase()}.`,
    });
  };
  
  const toggleReminder = (reminder) => {
    setNewAppointment(prev => {
      if (prev.reminders.includes(reminder)) {
        return { ...prev, reminders: prev.reminders.filter(r => r !== reminder) };
      } else {
        return { ...prev, reminders: [...prev.reminders, reminder] };
      }
    });
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Calendar Side */}
      <div className="xl:col-span-1">
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5 text-teal-600" />
              <span>Schedule</span>
            </CardTitle>
            <CardDescription>Select a date to view appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Calendar Component */}
              <div className="p-4 rounded-lg flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => setSelectedDate(date || new Date())}
                  className="rounded-md border p-3 pointer-events-auto"
                  initialFocus
                />
              </div>

              {/* Selected Date Display */}
              <div className="bg-gradient-to-r from-blue-50 to-teal-50 p-4 rounded-lg">
                <h3 className="font-semibold text-slate-800 mb-2">
                  {format(selectedDate, "MMMM d, yyyy")}
                </h3>
                <p className="text-sm text-slate-600">
                  {appointments.filter(apt => {
                    const aptDate = new Date(selectedDate);
                    aptDate.setHours(0, 0, 0, 0);
                    const currentDate = new Date();
                    currentDate.setHours(0, 0, 0, 0);
                    return aptDate.getTime() === currentDate.getTime();
                  }).length} appointments scheduled
                </p>
              </div>

              {/* Available Time Slots */}
              <div>
                <h4 className="font-medium text-slate-700 mb-3">Available Slots</h4>
                <div className="grid grid-cols-2 gap-2">
                  {availableSlots.length > 0 ? (
                    availableSlots.slice(0, 6).map((slot, index) => (
                      <Button 
                        key={index} 
                        variant="outline" 
                        size="sm"
                        className="text-xs bg-white/80 hover:bg-teal-50"
                        onClick={() => {
                          // Open dialog to create appointment at this time
                          setNewAppointment(prev => ({ ...prev, time: slot }));
                          document.getElementById("create-appointment-trigger")?.click();
                        }}
                      >
                        {slot}
                      </Button>
                    ))
                  ) : (
                    <p className="col-span-2 text-sm text-slate-500">No available slots for this day.</p>
                  )}
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      id="create-appointment-trigger"
                      className="w-full mt-3 healthcare-gradient text-white hover:opacity-90"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      New Appointment
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Schedule New Appointment</DialogTitle>
                      <DialogDescription>
                        Create a new appointment and send reminders to the patient.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="appointment-date" className="text-right">
                          Date
                        </Label>
                        <div className="col-span-3">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {format(newAppointment.date, "PPP")}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={newAppointment.date}
                                onSelect={(date) => setNewAppointment({...newAppointment, date: date || new Date()})}
                                initialFocus
                                className="p-3 pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="appointment-time" className="text-right">
                          Time
                        </Label>
                        <Select 
                          value={newAppointment.time} 
                          onValueChange={(time) => setNewAppointment({...newAppointment, time})}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select time slot" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {timeSlots.map((slot) => (
                                <SelectItem
                                  key={slot}
                                  value={slot}
                                  disabled={!availableSlots.includes(slot)}
                                >
                                  {slot}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="appointment-duration" className="text-right">
                          Duration
                        </Label>
                        <Select 
                          value={newAppointment.duration} 
                          onValueChange={(duration) => setNewAppointment({...newAppointment, duration})}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15 min">15 minutes</SelectItem>
                            <SelectItem value="30 min">30 minutes</SelectItem>
                            <SelectItem value="45 min">45 minutes</SelectItem>
                            <SelectItem value="60 min">60 minutes</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="appointment-patient" className="text-right">
                          Patient
                        </Label>
                        <Select 
                          value={newAppointment.patientId.toString()} 
                          onValueChange={(patientId) => setNewAppointment({...newAppointment, patientId})}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select patient" />
                          </SelectTrigger>
                          <SelectContent>
                            {patients.map((patient) => (
                              <SelectItem key={patient.id} value={patient.id.toString()}>
                                {patient.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="appointment-type" className="text-right">
                          Type
                        </Label>
                        <Select 
                          value={newAppointment.type} 
                          onValueChange={(type) => setNewAppointment({...newAppointment, type})}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select appointment type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Checkup">Checkup</SelectItem>
                            <SelectItem value="Follow-up">Follow-up</SelectItem>
                            <SelectItem value="Consultation">Consultation</SelectItem>
                            <SelectItem value="Physical Therapy">Physical Therapy</SelectItem>
                            <SelectItem value="Vaccination">Vaccination</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">
                          Reminders
                        </Label>
                        <div className="col-span-3 flex gap-2">
                          <Badge 
                            variant="outline" 
                            className={`cursor-pointer ${newAppointment.reminders.includes("SMS") ? 
                              "bg-blue-100 text-blue-700" : ""}`}
                            onClick={() => toggleReminder("SMS")}
                          >
                            {newAppointment.reminders.includes("SMS") ? 
                              <Check className="h-3 w-3 mr-1" /> : null}
                            SMS
                          </Badge>
                          <Badge 
                            variant="outline" 
                            className={`cursor-pointer ${newAppointment.reminders.includes("Email") ? 
                              "bg-purple-100 text-purple-700" : ""}`}
                            onClick={() => toggleReminder("Email")}
                          >
                            {newAppointment.reminders.includes("Email") ? 
                              <Check className="h-3 w-3 mr-1" /> : null}
                            Email
                          </Badge>
                          <Badge 
                            variant="outline" 
                            className={`cursor-pointer ${newAppointment.reminders.includes("WhatsApp") ? 
                              "bg-green-100 text-green-700" : ""}`}
                            onClick={() => toggleReminder("WhatsApp")}
                          >
                            {newAppointment.reminders.includes("WhatsApp") ? 
                              <Check className="h-3 w-3 mr-1" /> : null}
                            WhatsApp
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button onClick={handleCreateAppointment}>
                          <Plus className="h-4 w-4 mr-2" />
                          Create Appointment
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
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
                <span>
                  {format(selectedDate, "MMMM d, yyyy") === format(new Date(), "MMMM d, yyyy")
                    ? "Today's Appointments"
                    : `Appointments for ${format(selectedDate, "MMMM d, yyyy")}`}
                </span>
              </div>
              <Badge className="bg-teal-100 text-teal-700 hover:bg-teal-100">
                {appointments.filter(apt => {
                  const aptDate = new Date(selectedDate);
                  aptDate.setHours(0, 0, 0, 0);
                  const currentDate = new Date();
                  currentDate.setHours(0, 0, 0, 0);
                  return aptDate.getTime() === currentDate.getTime();
                }).length} scheduled
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {appointments.filter(apt => {
                const aptDate = new Date(selectedDate);
                aptDate.setHours(0, 0, 0, 0);
                const currentDate = new Date();
                currentDate.setHours(0, 0, 0, 0);
                return aptDate.getTime() === currentDate.getTime();
              }).length > 0 ? (
                appointments.filter(apt => {
                  const aptDate = new Date(selectedDate);
                  aptDate.setHours(0, 0, 0, 0);
                  const currentDate = new Date();
                  currentDate.setHours(0, 0, 0, 0);
                  return aptDate.getTime() === currentDate.getTime();
                }).map((appointment) => (
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
                          <div className="flex items-center space-x-2">
                            <Badge className={getStatusColor(appointment.status)}>
                              {appointment.status}
                            </Badge>
                            <div className="flex space-x-1">
                              {appointment.status !== "Confirmed" && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 px-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                                  onClick={() => handleChangeStatus(appointment.id, "Confirmed")}
                                >
                                  <Check className="h-3 w-3 mr-1" />
                                  Confirm
                                </Button>
                              )}
                              {appointment.status !== "Cancelled" && (
                                <Button
                                  size="sm"
                                  variant="ghost" 
                                  className="h-6 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => handleChangeStatus(appointment.id, "Cancelled")}
                                >
                                  <X className="h-3 w-3 mr-1" />
                                  Cancel
                                </Button>
                              )}
                            </div>
                          </div>
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
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => {
                            toast({
                              title: "Contacting Patient",
                              description: "Initiating call with patient...",
                            });
                          }}
                        >
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            toast({
                              title: "Sending Email",
                              description: "Opening email client...",
                            });
                          }}
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteAppointment(appointment.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <Calendar className="h-10 w-10 text-slate-400 mb-3" />
                  <p className="text-lg font-medium text-slate-700">No appointments scheduled</p>
                  <p className="text-sm text-slate-500 mb-4">
                    {format(selectedDate, "MMMM d, yyyy") === format(new Date(), "MMMM d, yyyy") 
                      ? "You don't have any appointments scheduled for today." 
                      : `No appointments for ${format(selectedDate, "MMMM d, yyyy")}`}
                  </p>
                  <Button
                    onClick={() => document.getElementById("create-appointment-trigger")?.click()}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule New Appointment
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
