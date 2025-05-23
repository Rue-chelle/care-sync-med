
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Plus, Phone, Mail, Calendar, MoreVertical, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";
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
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const PatientList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      phone: "+1 (555) 123-4567",
      lastVisit: "2024-01-15",
      nextAppointment: "2024-01-22",
      status: "Active",
      avatar: "/placeholder.svg",
      condition: "Hypertension",
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "m.chen@email.com",
      phone: "+1 (555) 234-5678",
      lastVisit: "2024-01-10",
      nextAppointment: "2024-01-25",
      status: "Follow-up Due",
      avatar: "/placeholder.svg",
      condition: "Diabetes",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      email: "emily.r@email.com",
      phone: "+1 (555) 345-6789",
      lastVisit: "2024-01-08",
      nextAppointment: null,
      status: "Inactive",
      avatar: "/placeholder.svg",
      condition: "Annual Checkup",
    },
    {
      id: 4,
      name: "David Thompson",
      email: "david.t@email.com",
      phone: "+1 (555) 456-7890",
      lastVisit: "2024-01-12",
      nextAppointment: "2024-01-20",
      status: "Active",
      avatar: "/placeholder.svg",
      condition: "Physical Therapy",
    },
  ]);
  
  const [newPatient, setNewPatient] = useState({
    name: "",
    email: "",
    phone: "",
    condition: ""
  });
  
  const [editPatient, setEditPatient] = useState(null);

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-emerald-100 text-emerald-700 hover:bg-emerald-100";
      case "Follow-up Due":
        return "bg-amber-100 text-amber-700 hover:bg-amber-100";
      case "Inactive":
        return "bg-slate-100 text-slate-600 hover:bg-slate-100";
      default:
        return "bg-slate-100 text-slate-600 hover:bg-slate-100";
    }
  };
  
  const handleAddPatient = () => {
    if (!newPatient.name || !newPatient.email) {
      toast({
        title: "Missing Information",
        description: "Please provide at least name and email for the patient.",
        variant: "destructive"
      });
      return;
    }
    
    const newId = Math.max(...patients.map(p => p.id)) + 1;
    const today = new Date().toISOString().split('T')[0];
    
    const patientToAdd = {
      id: newId,
      name: newPatient.name,
      email: newPatient.email,
      phone: newPatient.phone || "Not provided",
      lastVisit: today,
      nextAppointment: null,
      status: "Active",
      avatar: "/placeholder.svg",
      condition: newPatient.condition || "New Patient"
    };
    
    setPatients([...patients, patientToAdd]);
    
    setNewPatient({
      name: "",
      email: "",
      phone: "",
      condition: ""
    });
    
    toast({
      title: "Patient Added",
      description: `${patientToAdd.name} has been added successfully.`
    });
  };
  
  const handleUpdatePatient = (id) => {
    if (!editPatient) return;
    
    const updatedPatients = patients.map(patient => 
      patient.id === id ? { ...patient, ...editPatient } : patient
    );
    
    setPatients(updatedPatients);
    setEditPatient(null);
    
    toast({
      title: "Patient Updated",
      description: "Patient information has been updated successfully."
    });
  };
  
  const handleDeletePatient = (id) => {
    const patientToDelete = patients.find(p => p.id === id);
    const updatedPatients = patients.filter(patient => patient.id !== id);
    setPatients(updatedPatients);
    
    toast({
      title: "Patient Removed",
      description: `${patientToDelete.name} has been removed from your patient list.`
    });
  };
  
  const handleSendReminder = (patient) => {
    toast({
      title: "Reminder Sent",
      description: `A reminder has been sent to ${patient.name} via email and SMS.`
    });
  };
  
  const handleSchedule = (patient) => {
    toast({
      title: "Schedule Appointment",
      description: "Redirecting to appointment scheduler...",
    });
    // In a real app, this would navigate to the appointment scheduler
    // with the patient pre-selected
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search patients by name, email, or condition..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/80"
              />
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button className="healthcare-gradient text-white hover:opacity-90 transition-opacity">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Patient
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Patient</DialogTitle>
                  <DialogDescription>
                    Enter the patient's details. You can add more information later.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={newPatient.name}
                      onChange={(e) => setNewPatient({...newPatient, name: e.target.value})}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={newPatient.email}
                      onChange={(e) => setNewPatient({...newPatient, email: e.target.value})}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phone" className="text-right">
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      value={newPatient.phone}
                      onChange={(e) => setNewPatient({...newPatient, phone: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="condition" className="text-right">
                      Condition
                    </Label>
                    <Input
                      id="condition"
                      value={newPatient.condition}
                      onChange={(e) => setNewPatient({...newPatient, condition: e.target.value})}
                      className="col-span-3"
                      placeholder="e.g., Diabetes, Hypertension"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button type="submit" onClick={handleAddPatient}>Add Patient</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* Patient Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPatients.length > 0 ? (
          filteredPatients.map((patient) => (
            <Card key={patient.id} className="card-hover bg-white/60 backdrop-blur-sm border-0 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={patient.avatar} />
                      <AvatarFallback className="healthcare-gradient text-white">
                        {patient.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg font-semibold text-slate-800">
                        {patient.name}
                      </CardTitle>
                      <CardDescription className="text-slate-600">
                        {patient.condition}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(patient.status)}>
                      {patient.status}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <Dialog>
                          <DialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              Edit Patient
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Edit Patient</DialogTitle>
                              <DialogDescription>
                                Update the patient's information
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-name" className="text-right">
                                  Name
                                </Label>
                                <Input
                                  id="edit-name"
                                  defaultValue={patient.name}
                                  onChange={(e) => setEditPatient({...editPatient, name: e.target.value})}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-email" className="text-right">
                                  Email
                                </Label>
                                <Input
                                  id="edit-email"
                                  type="email"
                                  defaultValue={patient.email}
                                  onChange={(e) => setEditPatient({...editPatient, email: e.target.value})}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-phone" className="text-right">
                                  Phone
                                </Label>
                                <Input
                                  id="edit-phone"
                                  defaultValue={patient.phone}
                                  onChange={(e) => setEditPatient({...editPatient, phone: e.target.value})}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-condition" className="text-right">
                                  Condition
                                </Label>
                                <Input
                                  id="edit-condition"
                                  defaultValue={patient.condition}
                                  onChange={(e) => setEditPatient({...editPatient, condition: e.target.value})}
                                  className="col-span-3"
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                              </DialogClose>
                              <DialogClose asChild>
                                <Button type="submit" onClick={() => handleUpdatePatient(patient.id)}>
                                  <Save className="h-4 w-4 mr-2" />
                                  Save Changes
                                </Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <DropdownMenuItem onClick={() => handleSchedule(patient)}>
                          Schedule Appointment
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSendReminder(patient)}>
                          Send Reminder
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDeletePatient(patient.id)}
                        >
                          Remove Patient
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2 text-slate-600">
                    <Mail className="h-4 w-4" />
                    <span>{patient.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-600">
                    <Phone className="h-4 w-4" />
                    <span>{patient.phone}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-500 font-medium">Last Visit</p>
                    <p className="text-slate-700">{new Date(patient.lastVisit).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 font-medium">Next Appointment</p>
                    <p className="text-slate-700">
                      {patient.nextAppointment 
                        ? new Date(patient.nextAppointment).toLocaleDateString()
                        : "Not scheduled"
                      }
                    </p>
                  </div>
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => handleSchedule(patient)}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      if (patient.phone) {
                        window.location.href = `tel:${patient.phone}`;
                      } else {
                        toast({
                          title: "No Phone Number",
                          description: "This patient doesn't have a phone number registered.",
                          variant: "destructive"
                        });
                      }
                    }}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Contact
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-lg text-slate-500">No patients found matching "{searchTerm}"</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setSearchTerm("")}
            >
              Clear Search
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
