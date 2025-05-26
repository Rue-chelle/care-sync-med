
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, UserX, RotateCcw, Edit } from "lucide-react";

export const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data
  const users = [
    {
      id: "1",
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@healthfirst.com",
      role: "doctor",
      clinic: "HealthFirst Medical Center",
      status: "active",
      lastLogin: "2024-01-20 14:30"
    },
    {
      id: "2",
      name: "John Administrator",
      email: "admin@medicareplus.com",
      role: "admin",
      clinic: "MediCare Plus",
      status: "active",
      lastLogin: "2024-01-20 09:15"
    },
    {
      id: "3",
      name: "Mary Patient",
      email: "mary.patient@email.com",
      role: "patient",
      clinic: "HealthFirst Medical Center",
      status: "banned",
      lastLogin: "2024-01-18 16:45"
    }
  ];

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-purple-500/20 text-purple-400">Admin</Badge>;
      case "doctor":
        return <Badge className="bg-blue-500/20 text-blue-400">Doctor</Badge>;
      case "patient":
        return <Badge className="bg-green-500/20 text-green-400">Patient</Badge>;
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
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">User Management</h2>
        <p className="text-purple-300">Manage all users across the platform</p>
      </div>

      <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 h-4 w-4" />
            <Input
              placeholder="Search users by name, email, or clinic..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/5 border-purple-500/30 text-white placeholder-purple-300"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white">All Users ({users.length})</CardTitle>
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
                      <Button size="sm" variant="outline" className="border-purple-500/30 text-purple-300">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="border-red-500/30 text-red-300">
                        <UserX className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="border-green-500/30 text-green-300">
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
