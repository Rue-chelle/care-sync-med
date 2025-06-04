
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Edit, UserX, RotateCcw, Shield, Users, User } from "lucide-react";
import { useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  clinic: string;
  status: string;
  lastLogin: string;
  joinDate: string;
  appointments: number;
  patients: number;
}

interface UserTableProps {
  users: User[];
  onBanUser: (user: User) => void;
  onReactivateUser: (user: User) => void;
  onEditUser: (user: User) => void;
}

export const UserTable = ({ users, onBanUser, onReactivateUser, onEditUser }: UserTableProps) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

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

  return (
    <>
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
          {users.map((user) => (
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
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-purple-500/30 text-purple-300"
                    onClick={() => onEditUser(user)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-red-500/30 text-red-300"
                    onClick={() => onBanUser(user)}
                  >
                    <UserX className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-green-500/30 text-green-300"
                    onClick={() => onReactivateUser(user)}
                  >
                    <RotateCcw className="h-4 w-4" />
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
