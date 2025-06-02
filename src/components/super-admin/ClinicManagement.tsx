import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Plus, Edit, Pause, Play, Eye, Download, Building, Users, Calendar, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { exportDataToPDF } from "@/utils/pdfExport";

export const ClinicManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedClinic, setSelectedClinic] = useState<any>(null);
  const { toast } = useToast();

  // Mock data - in real app, this would come from your database
  const clinics = [
    {
      id: "1",
      name: "HealthFirst Medical Center",
      email: "admin@healthfirst.com",
      phone: "+234 123 456 7890",
      location: "Lagos, Nigeria",
      subscription: "premium",
      status: "active",
      doctors: 15,
      patients: 1250,
      appointments: 89,
      createdAt: "2024-01-15",
      lastActive: "2024-01-20 14:30"
    },
    {
      id: "2",
      name: "MediCare Plus",
      email: "contact@medicareplus.com",
      phone: "+234 987 654 3210",
      location: "Abuja, Nigeria",
      subscription: "basic",
      status: "trial",
      doctors: 8,
      patients: 560,
      appointments: 34,
      createdAt: "2024-01-10",
      lastActive: "2024-01-20 09:15"
    },
    {
      id: "3",
      name: "Wellness Clinic",
      email: "info@wellnessclinic.com",
      phone: "+234 555 123 4567",
      location: "Port Harcourt, Nigeria",
      subscription: "enterprise",
      status: "suspended",
      doctors: 25,
      patients: 2100,
      appointments: 156,
      createdAt: "2023-12-01",
      lastActive: "2024-01-18 16:45"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Active</Badge>;
      case "trial":
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Trial</Badge>;
      case "suspended":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Suspended</Badge>;
      case "expired":
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">Expired</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getSubscriptionBadge = (plan: string) => {
    switch (plan) {
      case "basic":
        return <Badge variant="outline" className="text-blue-400 border-blue-500/30">Basic</Badge>;
      case "premium":
        return <Badge variant="outline" className="text-purple-400 border-purple-500/30">Premium</Badge>;
      case "enterprise":
        return <Badge variant="outline" className="text-gold-400 border-yellow-500/30">Enterprise</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const filteredClinics = clinics.filter(clinic => {
    const matchesSearch = clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         clinic.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         clinic.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || clinic.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleToggleStatus = (clinic: any) => {
    const newStatus = clinic.status === "active" ? "suspended" : "active";
    toast({
      title: "Status Updated",
      description: `${clinic.name} has been ${newStatus}`,
    });
  };

  const handleExportClinics = () => {
    exportDataToPDF(filteredClinics, 'clinics-report', 'Clinics Management Report');
  };

  const handleViewClinic = (clinic: any) => {
    setSelectedClinic(clinic);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Clinic Management</h2>
          <p className="text-purple-300">Manage all registered clinics and their subscriptions</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExportClinics} variant="outline" className="border-purple-500/30 text-purple-300">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Clinic
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 h-4 w-4" />
              <Input
                placeholder="Search clinics by name, email, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-purple-500/30 text-white placeholder-purple-300"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-white/5 border-purple-500/30 text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="trial">Trial</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm">Total Clinics</p>
                <p className="text-2xl font-bold text-white">{clinics.length}</p>
              </div>
              <Building className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm">Active Clinics</p>
                <p className="text-2xl font-bold text-white">{clinics.filter(c => c.status === 'active').length}</p>
              </div>
              <Users className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm">Total Patients</p>
                <p className="text-2xl font-bold text-white">{clinics.reduce((sum, c) => sum + c.patients, 0)}</p>
              </div>
              <Users className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm">Total Appointments</p>
                <p className="text-2xl font-bold text-white">{clinics.reduce((sum, c) => sum + c.appointments, 0)}</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clinics Table */}
      <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white">All Clinics ({filteredClinics.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-purple-500/30">
                <TableHead className="text-purple-300">Clinic Details</TableHead>
                <TableHead className="text-purple-300">Subscription</TableHead>
                <TableHead className="text-purple-300">Status</TableHead>
                <TableHead className="text-purple-300">Users</TableHead>
                <TableHead className="text-purple-300">Last Active</TableHead>
                <TableHead className="text-purple-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClinics.map((clinic) => (
                <TableRow key={clinic.id} className="border-purple-500/20">
                  <TableCell>
                    <div>
                      <div className="font-medium text-white">{clinic.name}</div>
                      <div className="text-sm text-purple-300">{clinic.email}</div>
                      <div className="text-sm text-purple-300">{clinic.phone}</div>
                      <div className="text-sm text-purple-400">{clinic.location}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getSubscriptionBadge(clinic.subscription)}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(clinic.status)}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-white">
                      <div>{clinic.doctors} doctors</div>
                      <div>{clinic.patients} patients</div>
                      <div>{clinic.appointments} appointments</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-purple-300">{clinic.lastActive}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" className="border-purple-500/30 text-purple-300" onClick={() => handleViewClinic(clinic)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Clinic Details - {selectedClinic?.name}</DialogTitle>
                          </DialogHeader>
                          {selectedClinic && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium">Clinic Name</label>
                                  <p className="text-gray-600">{selectedClinic.name}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Email</label>
                                  <p className="text-gray-600">{selectedClinic.email}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Phone</label>
                                  <p className="text-gray-600">{selectedClinic.phone}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Location</label>
                                  <p className="text-gray-600">{selectedClinic.location}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Subscription</label>
                                  <p className="text-gray-600">{selectedClinic.subscription}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Status</label>
                                  <p className="text-gray-600">{selectedClinic.status}</p>
                                </div>
                              </div>
                              <div className="grid grid-cols-3 gap-4">
                                <Card>
                                  <CardContent className="p-4 text-center">
                                    <Users className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                                    <p className="text-2xl font-bold">{selectedClinic.doctors}</p>
                                    <p className="text-sm text-gray-600">Doctors</p>
                                  </CardContent>
                                </Card>
                                <Card>
                                  <CardContent className="p-4 text-center">
                                    <Users className="h-8 w-8 mx-auto mb-2 text-green-500" />
                                    <p className="text-2xl font-bold">{selectedClinic.patients}</p>
                                    <p className="text-sm text-gray-600">Patients</p>
                                  </CardContent>
                                </Card>
                                <Card>
                                  <CardContent className="p-4 text-center">
                                    <Calendar className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                                    <p className="text-2xl font-bold">{selectedClinic.appointments}</p>
                                    <p className="text-sm text-gray-600">Appointments</p>
                                  </CardContent>
                                </Card>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button size="sm" variant="outline" className="border-purple-500/30 text-purple-300">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-purple-500/30 text-purple-300"
                        onClick={() => handleToggleStatus(clinic)}
                      >
                        {clinic.status === "active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
