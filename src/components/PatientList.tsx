
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Plus, Phone, Mail, Calendar, MoreVertical } from "lucide-react";
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

  const patients = [
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
  ];

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
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

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/80"
              />
            </div>
            <Button className="healthcare-gradient text-white hover:opacity-90 transition-opacity">
              <Plus className="h-4 w-4 mr-2" />
              Add Patient
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Patient Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPatients.map((patient) => (
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
                      <DropdownMenuItem>Schedule Appointment</DropdownMenuItem>
                      <DropdownMenuItem>Send Reminder</DropdownMenuItem>
                      <DropdownMenuItem>View History</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Edit Patient</DropdownMenuItem>
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
                <Button size="sm" variant="outline" className="flex-1">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <Phone className="h-4 w-4 mr-2" />
                  Contact
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
