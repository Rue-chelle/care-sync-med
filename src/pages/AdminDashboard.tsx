
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { UserManagement } from "@/components/admin/UserManagement";
import { Prescriptions } from "@/components/admin/Prescriptions";
import { Billing } from "@/components/admin/Billing";
import { AdminMessaging } from "@/components/admin/Messaging";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AdminDashboard = () => {
  const [currentTab, setCurrentTab] = useState("overview");

  // Overview content component
  const OverviewContent = () => (
    <div className="space-y-6">
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
    </div>
  );

  // Placeholder components for other functionalities
  const PlaceholderComponent = ({ title }: { title: string }) => (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>This section is under development</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-center py-12 text-muted-foreground">
          {title} interface will be implemented here
        </p>
      </CardContent>
    </Card>
  );

  // Render appropriate content based on selected tab
  const renderTabContent = () => {
    switch (currentTab) {
      case "overview":
        return <OverviewContent />;
      case "users":
        return <UserManagement />;
      case "prescriptions":
        return <Prescriptions />;
      case "billing":
        return <Billing />;
      case "messaging":
        return <AdminMessaging />;
      case "patients":
        return <PlaceholderComponent title="Patient Records" />;
      case "inventory":
        return <PlaceholderComponent title="Inventory Management" />;
      case "analytics":
        return <PlaceholderComponent title="Analytics & Reporting" />;
      case "branches":
        return <PlaceholderComponent title="Branch Management" />;
      case "settings":
        return <PlaceholderComponent title="System Settings" />;
      default:
        return <OverviewContent />;
    }
  };

  return (
    <AdminLayout currentTab={currentTab} setCurrentTab={setCurrentTab}>
      {renderTabContent()}
    </AdminLayout>
  );
};

export default AdminDashboard;
