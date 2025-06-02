
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Edit, Pause, Play, Users, Calendar } from "lucide-react";
import { useState } from "react";

interface Clinic {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  subscription: string;
  status: string;
  doctors: number;
  patients: number;
  appointments: number;
  createdAt: string;
  lastActive: string;
}

interface ClinicTableProps {
  clinics: Clinic[];
  onToggleStatus: (clinic: Clinic) => void;
}

export const ClinicTable = ({ clinics, onToggleStatus }: ClinicTableProps) => {
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);

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

  return (
    <>
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
          {clinics.map((clinic) => (
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
                      <Button size="sm" variant="outline" className="border-purple-500/30 text-purple-300" onClick={() => setSelectedClinic(clinic)}>
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
                    onClick={() => onToggleStatus(clinic)}
                  >
                    {clinic.status === "active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};
