import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, Settings, Calendar, FileText, 
  Bell, BarChart, Package, MessageSquare, 
  Mail, Plus, Building, User
} from "lucide-react";
import { useUserStore } from "@/stores/userStore";
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const { user, logout } = useUserStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // UI state management
  const [currentTab, setCurrentTab] = useState("overview");
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isAddAppointmentDialogOpen, setIsAddAppointmentDialogOpen] = useState(false);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<any>(null);
  
  // Form states
  const [newUserForm, setNewUserForm] = useState({
    fullName: "",
    email: "",
    role: "patient" as "patient" | "doctor" | "admin",
    password: ""
  });

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const handleAddUser = () => {
    toast({
      title: "User Created",
      description: `${newUserForm.fullName} has been added as a ${newUserForm.role}`,
    });
    setIsAddUserDialogOpen(false);
    setNewUserForm({
      fullName: "",
      email: "",
      role: "patient",
      password: ""
    });
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    toast({
      title: "User Deleted",
      description: `${userName} has been removed from the system`,
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="h-10 w-10 healthcare-gradient rounded-xl flex items-center justify-center">
                  <div className="h-6 w-6 text-white">CS</div>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                  CareSync
                </h1>
                <p className="text-sm text-slate-600">Admin Portal</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Sign Out
              </Button>
              <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {user?.fullName?.substring(0, 1) || user?.email?.substring(0, 1) || "A"}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <h2 className="text-3xl font-bold text-slate-800">Admin Dashboard</h2>
          <div className="flex gap-2">
            <Button className="healthcare-gradient text-white hover:opacity-90 transition-opacity">
              <Bell className="h-4 w-4 mr-2" />
              Announcements
            </Button>
            <Button className="healthcare-gradient text-white hover:opacity-90 transition-opacity">
              <Settings className="h-4 w-4 mr-2" />
              System Settings
            </Button>
          </div>
        </div>
        
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 lg:grid-cols-10">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="patients">Patient Records</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="messaging">Messaging</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="branches">Branches</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl font-bold">345</CardTitle>
                  <CardDescription>Total Patients</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-green-600">+12% from last month</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl font-bold">42</CardTitle>
                  <CardDescription>Total Doctors</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-green-600">+3 new this month</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl font-bold">1,287</CardTitle>
                  <CardDescription>Monthly Appointments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-blue-600">98% completed</div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>System Activity</CardTitle>
                  <CardDescription>Recent actions in the system</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex items-center gap-4 pb-4 border-b">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-700" />
                        </div>
                        <div>
                          <p className="font-medium">New patient registered</p>
                          <p className="text-sm text-muted-foreground">{i * 2} hours ago</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Today's Appointments</CardTitle>
                  <CardDescription>Scheduled for today</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Time</TableHead>
                        <TableHead>Patient</TableHead>
                        <TableHead>Doctor</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        { time: "09:00", patient: "Emily Johnson", doctor: "Dr. Smith", status: "Completed" },
                        { time: "10:30", patient: "Michael Brown", doctor: "Dr. Wong", status: "In Progress" },
                        { time: "14:15", patient: "Sarah Lee", doctor: "Dr. Smith", status: "Scheduled" },
                      ].map((appt, i) => (
                        <TableRow key={i}>
                          <TableCell>{appt.time}</TableCell>
                          <TableCell>{appt.patient}</TableCell>
                          <TableCell>{appt.doctor}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              appt.status === "Completed" ? "bg-green-100 text-green-800" :
                              appt.status === "In Progress" ? "bg-blue-100 text-blue-800" :
                              "bg-yellow-100 text-yellow-800"
                            }`}>{appt.status}</span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Users Management Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage all users in the system</CardDescription>
                </div>
                <Button onClick={() => setIsAddUserDialogOpen(true)} className="healthcare-gradient text-white hover:opacity-90 transition-opacity">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New User
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { id: "1", name: "Dr. John Smith", email: "john.smith@caresync.com", role: "doctor", status: "Active" },
                      { id: "2", name: "Sarah Wong", email: "sarah.wong@caresync.com", role: "patient", status: "Active" },
                      { id: "3", name: "Michael Johnson", email: "michael.j@caresync.com", role: "admin", status: "Active" },
                      { id: "4", name: "Jennifer Lee", email: "jennifer.lee@caresync.com", role: "doctor", status: "Inactive" },
                      { id: "5", name: "David Brown", email: "david.brown@caresync.com", role: "patient", status: "Active" },
                    ].map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.role === "doctor" ? "bg-blue-100 text-blue-800" :
                            user.role === "admin" ? "bg-purple-100 text-purple-800" :
                            "bg-green-100 text-green-800"
                          }`}>{user.role}</span>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}>{user.status}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" onClick={() => setSelectedUserForEdit(user)}>Edit</Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteUser(user.id, user.name)}>Delete</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Add User Dialog */}
            <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                  <DialogDescription>
                    Create a new user account in the system.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right" htmlFor="fullName">Name</Label>
                    <Input
                      id="fullName"
                      className="col-span-3"
                      value={newUserForm.fullName}
                      onChange={(e) => setNewUserForm({...newUserForm, fullName: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right" htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      className="col-span-3"
                      value={newUserForm.email}
                      onChange={(e) => setNewUserForm({...newUserForm, email: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right" htmlFor="role">Role</Label>
                    <Select 
                      value={newUserForm.role} 
                      onValueChange={(value: "patient" | "doctor" | "admin") => setNewUserForm({...newUserForm, role: value})}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="patient">Patient</SelectItem>
                        <SelectItem value="doctor">Doctor</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right" htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      className="col-span-3"
                      value={newUserForm.password}
                      onChange={(e) => setNewUserForm({...newUserForm, password: e.target.value})}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>Cancel</Button>
                  <Button className="healthcare-gradient text-white" onClick={handleAddUser}>Add User</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>
          
          {/* Appointments Tab */}
          <TabsContent value="appointments">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Appointment Oversight</CardTitle>
                  <CardDescription>View and manage all scheduled appointments</CardDescription>
                </div>
                <Button onClick={() => setIsAddAppointmentDialogOpen(true)} className="healthcare-gradient text-white hover:opacity-90 transition-opacity">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Appointment
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex justify-end mb-4 space-x-2">
                  <Button variant="outline">
                    Filter
                  </Button>
                  <Button variant="outline">
                    Export
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Doctor</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { id: "1", date: "2025-05-24", time: "09:00", patient: "Sarah Wong", doctor: "Dr. John Smith", type: "Check-up", status: "Scheduled" },
                      { id: "2", date: "2025-05-24", time: "10:30", patient: "David Brown", doctor: "Dr. Jennifer Lee", type: "Follow-up", status: "Confirmed" },
                      { id: "3", date: "2025-05-24", time: "14:15", patient: "Emily Parker", doctor: "Dr. John Smith", type: "Consultation", status: "Completed" },
                      { id: "4", date: "2025-05-25", time: "11:00", patient: "Michael Johnson", doctor: "Dr. Jennifer Lee", type: "Check-up", status: "Cancelled" },
                      { id: "5", date: "2025-05-25", time: "15:45", patient: "Robert Wilson", doctor: "Dr. John Smith", type: "Follow-up", status: "Scheduled" },
                    ].map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell>{appointment.date}</TableCell>
                        <TableCell>{appointment.time}</TableCell>
                        <TableCell>{appointment.patient}</TableCell>
                        <TableCell>{appointment.doctor}</TableCell>
                        <TableCell>{appointment.type}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            appointment.status === "Scheduled" ? "bg-yellow-100 text-yellow-800" :
                            appointment.status === "Confirmed" ? "bg-blue-100 text-blue-800" :
                            appointment.status === "Completed" ? "bg-green-100 text-green-800" :
                            "bg-red-100 text-red-800"
                          }`}>{appointment.status}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">Edit</Button>
                            <Button size="sm" variant="destructive">Cancel</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Other tabs would be implemented similarly */}
          <TabsContent value="prescriptions">
            <Card>
              <CardHeader>
                <CardTitle>Prescription Monitoring</CardTitle>
                <CardDescription>Monitor prescriptions issued across the system</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-12 text-muted-foreground">Prescription monitoring interface would be implemented here</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="billing">
            <Card>
              <CardHeader>
                <CardTitle>Billing & Payment Tracking</CardTitle>
                <CardDescription>Track financial activity and generate reports</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-12 text-muted-foreground">Billing and payment tracking interface would be implemented here</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="patients">
            <Card>
              <CardHeader>
                <CardTitle>Patient Records</CardTitle>
                <CardDescription>Access and manage patient profiles and medical history</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-12 text-muted-foreground">Patient records interface would be implemented here</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="inventory">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Management</CardTitle>
                <CardDescription>Track medications, vaccines, and supplies</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-12 text-muted-foreground">Inventory management interface would be implemented here</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="messaging">
            <Card>
              <CardHeader>
                <CardTitle>Messaging & Notifications</CardTitle>
                <CardDescription>Communicate with patients and staff</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-12 text-muted-foreground">Messaging and notifications interface would be implemented here</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics & Reporting</CardTitle>
                <CardDescription>Generate insights and reports from system data</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-12 text-muted-foreground">Analytics and reporting interface would be implemented here</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="branches">
            <Card>
              <CardHeader>
                <CardTitle>Multi-Branch Support</CardTitle>
                <CardDescription>Manage multiple clinics and locations</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-12 text-muted-foreground">Multi-branch management interface would be implemented here</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
