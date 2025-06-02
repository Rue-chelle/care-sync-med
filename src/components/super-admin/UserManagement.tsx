
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, UserX, RotateCcw, Edit, Eye, Download, Users, Shield, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { exportToPDF } from "@/utils/pdfExport";

export const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const { toast } = useToast();

  // Mock data
  const users = [
    {
      id: "1",
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@healthfirst.com",
      role: "doctor",
      clinic: "HealthFirst Medical Center",
      status: "active",
      lastLogin: "2024-01-20 14:30",
      joinDate: "2023-06-15",
      appointments: 450,
      patients: 125
    },
    {
      id: "2",
      name: "John Administrator",
      email: "admin@medicareplus.com",
      role: "admin",
      clinic: "MediCare Plus",
      status: "active",
      lastLogin: "2024-01-20 09:15",
      joinDate: "2023-05-20",
      appointments: 0,
      patients: 0
    },
    {
      id: "3",
      name: "Mary Patient",
      email: "mary.patient@email.com",
      role: "patient",
      clinic: "HealthFirst Medical Center",
      status: "banned",
      lastLogin: "2024-01-18 16:45",
      joinDate: "2023-08-10",
      appointments: 12,
      patients: 0
    },
    {
      id: "4",
      name: "Dr. Michael Chen",
      email: "m.chen@wellnessclinic.com",
      role: "doctor",
      clinic: "Wellness Clinic",
      status: "suspended",
      lastLogin: "2024-01-19 11:20",
      joinDate: "2023-07-01",
      appointments: 320,
      patients: 95
    }
  ];

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-purple-500/20 text-purple-400"><Shield className="h-3 w-3 mr-1" />Admin</Badge>;
      case "doctor":
        return <Badge className="bg-blue-500/20 text-blue-400"><Users className="h-3 w-3 mr-1" />Doctor</Badge>;
      case "patient":
        return <Badge className="bg-green-500/20 text-green-400"><User className="h-3 w-3 mr-1" />Patient</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500/20 text-green-400">Active</Badge>;
      case "banned":
        return <Badge className="bg-red-500/20 text-red-400">Banned</Badge>;
      case "suspended":
        return <Badge className="bg-yellow-500/20 text-yellow-400">Suspended</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.clinic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleBanUser = (user: any) => {
    toast({
      title: "User Banned",
      description: `${user.name} has been banned from the platform`,
      variant: "destructive"
    });
  };

  const handleReactivateUser = (user: any) => {
    toast({
      title: "User Reactivated",
      description: `${user.name} has been reactivated`,
    });
  };

  const handleExportUsers = () => {
    exportToPDF(filteredUsers, 'users-report', 'User Management Report');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">User Management</h2>
          <p className="text-purple-300">Manage all users across the platform</p>
        </div>
        <Button onClick={handleExportUsers} variant="outline" className="border-purple-500/30 text-purple-300">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 h-4 w-4" />
              <Input
                placeholder="Search users by name, email, or clinic..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-purple-500/30 text-white placeholder-purple-300"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="bg-white/5 border-purple-500/30 text-white">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="doctor">Doctor</SelectItem>
                <SelectItem value="patient">Patient</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-white/5 border-purple-500/30 text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="banned">Banned</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
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
                <p className="text-purple-300 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-white">{users.length}</p>
              </div>
              <Users className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm">Active Users</p>
                <p className="text-2xl font-bold text-white">{users.filter(u => u.status === 'active').length}</p>
              </div>
              <Users className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm">Doctors</p>
                <p className="text-2xl font-bold text-white">{users.filter(u => u.role === 'doctor').length}</p>
              </div>
              <Shield className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm">Patients</p>
                <p className="text-2xl font-bold text-white">{users.filter(u => u.role === 'patient').length}</p>
              </div>
              <User className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white">All Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-purple-500/30">
                <TableHead className="text-purple-300">User</TableHead>
                <TableHead className="text-purple-300">Role</TableHead>
                <TableHead className="text-purple-300">Clinic</TableHead>
                <TableHead className="text-purple-300">Status</TableHead>
                <TableHead className="text-purple-300">Last Login</TableHead>
                <TableHead className="text-purple-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className="border-purple-500/20">
                  <TableCell>
                    <div>
                      <div className="font-medium text-white">{user.name}</div>
                      <div className="text-sm text-purple-300">{user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell className="text-purple-300">{user.clinic}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell className="text-purple-300 text-sm">{user.lastLogin}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" className="border-purple-500/30 text-purple-300" onClick={() => setSelectedUser(user)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>User Details - {selectedUser?.name}</DialogTitle>
                          </DialogHeader>
                          {selectedUser && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium">Full Name</label>
                                  <p className="text-gray-600">{selectedUser.name}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Email</label>
                                  <p className="text-gray-600">{selectedUser.email}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Role</label>
                                  <p className="text-gray-600">{selectedUser.role}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Clinic</label>
                                  <p className="text-gray-600">{selectedUser.clinic}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Status</label>
                                  <p className="text-gray-600">{selectedUser.status}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Join Date</label>
                                  <p className="text-gray-600">{selectedUser.joinDate}</p>
                                </div>
                              </div>
                              {selectedUser.role === 'doctor' && (
                                <div className="grid grid-cols-2 gap-4">
                                  <Card>
                                    <CardContent className="p-4 text-center">
                                      <p className="text-2xl font-bold">{selectedUser.appointments}</p>
                                      <p className="text-sm text-gray-600">Total Appointments</p>
                                    </CardContent>
                                  </Card>
                                  <Card>
                                    <CardContent className="p-4 text-center">
                                      <p className="text-2xl font-bold">{selectedUser.patients}</p>
                                      <p className="text-sm text-gray-600">Patients Treated</p>
                                    </CardContent>
                                  </Card>
                                </div>
                              )}
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
                        className="border-red-500/30 text-red-300"
                        onClick={() => handleBanUser(user)}
                      >
                        <UserX className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-green-500/30 text-green-300"
                        onClick={() => handleReactivateUser(user)}
                      >
                        <RotateCcw className="h-4 w-4" />
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
