
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, Edit, Trash2, MoreHorizontal, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditUserModal } from "./EditUserModal";

// Simple utility to generate a random temp password (min 12 chars, not for prod use)
function generateTempPassword() {
  return (
    Math.random().toString(36).slice(-8) +
    Math.random().toString(36).slice(-4)
  );
}

export const UserManagement = () => {
  const { toast } = useToast();
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isTempPasswordDialogOpen, setIsTempPasswordDialogOpen] = useState(false);
  const [tempPassUser, setTempPassUser] = useState<{email: string, password: string, name: string, role: string}|null>(null);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  
  const [newUserForm, setNewUserForm] = useState({
    fullName: "",
    email: "",
    role: "doctor" as "doctor" | "admin",
    phone: "",
    department: ""
  });

  const [users, setUsers] = useState([
    { id: "1", name: "Dr. John Smith", email: "john.smith@caresync.com", role: "doctor", status: "Active", department: "Cardiology", phone: "+1234567890", lastLogin: "2 hours ago" },
    { id: "2", name: "Sarah Wong", email: "sarah.wong@caresync.com", role: "patient", status: "Active", department: "-", phone: "+1234567891", lastLogin: "1 day ago" },
    { id: "3", name: "Michael Johnson", email: "michael.j@caresync.com", role: "admin", status: "Active", department: "Administration", phone: "+1234567892", lastLogin: "30 minutes ago" },
    { id: "4", name: "Dr. Jennifer Lee", email: "jennifer.lee@caresync.com", role: "doctor", status: "Inactive", department: "Pediatrics", phone: "+1234567893", lastLogin: "3 days ago" },
    { id: "5", name: "David Brown", email: "david.brown@caresync.com", role: "patient", status: "Active", department: "-", phone: "+1234567894", lastLogin: "5 hours ago" },
  ]);

  const handleAddUser = () => {
    // Only allow staff roles (doctor or admin)
    const tempPassword = generateTempPassword();
    const newUser = {
      id: String(users.length + 1),
      name: newUserForm.fullName,
      email: newUserForm.email,
      role: newUserForm.role,
      status: "Active",
      department: newUserForm.department || "-",
      phone: newUserForm.phone,
      lastLogin: "Invite sent",
      tempPassword, // for demo
    };

    setUsers([...users, newUser]);

    // Show a dialog to admin with the temporary password (PROD: email/send out with secure invite)
    setTempPassUser({email: newUserForm.email, password: tempPassword, name: newUserForm.fullName, role: newUserForm.role});
    setIsTempPasswordDialogOpen(true);

    setIsAddUserDialogOpen(false);
    setNewUserForm({
      fullName: "",
      email: "",
      role: "doctor",
      phone: "",
      department: ""
    });
  };

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setIsEditUserModalOpen(true);
  };

  const handleSaveUser = (updatedUser: any) => {
    setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
    setSelectedUser(null);
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    setUsers(users.filter(user => user.id !== userId));
    toast({
      title: "User Deleted",
      description: `${userName} has been removed from the system`,
      variant: "destructive",
    });
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "doctor": return "bg-blue-100 text-blue-800";
      case "admin": return "bg-purple-100 text-purple-800";
      case "patient": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
          <p className="text-sm text-gray-600">Manage all users in the system. <span className="font-semibold text-[#2c6a97]">Only staff (doctor/admin) can be created here.</span></p>
        </div>
        <Button onClick={() => setIsAddUserDialogOpen(true)} className="healthcare-gradient text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Staff User
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="doctor">Doctors</SelectItem>
                <SelectItem value="patient">Patients</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                      <div className="text-sm text-gray-500">{user.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRoleBadgeColor(user.role)}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600">{user.department}</TableCell>
                  <TableCell>
                    <Badge className={user.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600">{user.lastLogin}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditUser(user)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDeleteUser(user.id, user.name)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Staff User Dialog */}
      <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Staff User</DialogTitle>
            <DialogDescription>
              Only Doctors and Admins can be created by Admins. Patients should use the public registration.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={newUserForm.fullName}
                onChange={(e) => setNewUserForm({...newUserForm, fullName: e.target.value})}
                placeholder="Enter full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newUserForm.email}
                onChange={(e) => setNewUserForm({...newUserForm, email: e.target.value})}
                placeholder="Enter email address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={newUserForm.phone}
                onChange={(e) => setNewUserForm({...newUserForm, phone: e.target.value})}
                placeholder="Enter phone number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select 
                value={newUserForm.role} 
                onValueChange={(value: "doctor" | "admin") => setNewUserForm({...newUserForm, role: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="doctor">Doctor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={newUserForm.department}
                onChange={(e) => setNewUserForm({...newUserForm, department: e.target.value})}
                placeholder="Enter department"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>Cancel</Button>
            <Button className="healthcare-gradient text-white" onClick={handleAddUser}>Add Staff User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Temp Password Popup for Admin */}
      <Dialog open={isTempPasswordDialogOpen} onOpenChange={setIsTempPasswordDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              Staff User Created
            </DialogTitle>
            <DialogDescription>
              Please copy and send the credentials to the staff member securely.
            </DialogDescription>
          </DialogHeader>
          {tempPassUser ? (
            <div className="space-y-4 py-4">
              <div className="flex items-center space-x-4">
                <Mail className="text-blue-500" />
                <div>
                  <div className="font-medium text-gray-900">Email: {tempPassUser.email}</div>
                  <div className="text-gray-600">Name: {tempPassUser.name}</div>
                  <div className="text-gray-600">Role: {tempPassUser.role}</div>
                </div>
              </div>
              <div>
                <Label>Temporary Password</Label>
                <div className="px-4 py-2 bg-gray-100 text-lg font-mono rounded-lg">{tempPassUser.password}</div>
                <div className="text-xs text-gray-500 mt-2">They should log in and change their password immediately.</div>
              </div>
            </div>
          ) : null}
          <DialogFooter>
            <Button className="healthcare-gradient" onClick={() => setIsTempPasswordDialogOpen(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <EditUserModal
        isOpen={isEditUserModalOpen}
        onClose={() => setIsEditUserModalOpen(false)}
        onSave={handleSaveUser}
        user={selectedUser}
      />
    </div>
  );
};
