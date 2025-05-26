
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Edit, Pause, Play, Eye } from "lucide-react";

export const ClinicManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");

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
      appointments: 89
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
      appointments: 34
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
      appointments: 156
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

  const filteredClinics = clinics.filter(clinic =>
    clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    clinic.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    clinic.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Clinic Management</h2>
          <p className="text-purple-300">Manage all registered clinics and their subscriptions</p>
        </div>
        <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Clinic
        </Button>
      </div>

      {/* Search */}
      <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 h-4 w-4" />
            <Input
              placeholder="Search clinics by name, email, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/5 border-purple-500/30 text-white placeholder-purple-300"
            />
          </div>
        </CardContent>
      </Card>

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
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="border-purple-500/30 text-purple-300">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="border-purple-500/30 text-purple-300">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="border-purple-500/30 text-purple-300">
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
