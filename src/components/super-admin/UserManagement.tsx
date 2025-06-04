
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Shield, User, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { exportDataToPDF } from "@/utils/pdfExport";
import { StatsCard } from "./shared/StatsCard";
import { FilterCard } from "./shared/FilterCard";
import { UserTable } from "./users/UserTable";

export const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
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

  const handleEditUser = (user: any) => {
    toast({
      title: "Edit User",
      description: `Opening edit form for ${user.name}`,
    });
    // Here you would open an edit modal or navigate to edit page
  };

  const handleExportUsers = () => {
    exportDataToPDF(filteredUsers, 'users-report', 'User Management Report');
  };

  const filterOptions = [
    {
      label: "Filter by role",
      value: roleFilter,
      onChange: setRoleFilter,
      options: [
        { value: "all", label: "All Roles" },
        { value: "admin", label: "Admin" },
        { value: "doctor", label: "Doctor" },
        { value: "patient", label: "Patient" }
      ]
    },
    {
      label: "Filter by status",
      value: statusFilter,
      onChange: setStatusFilter,
      options: [
        { value: "all", label: "All Status" },
        { value: "active", label: "Active" },
        { value: "banned", label: "Banned" },
        { value: "suspended", label: "Suspended" }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">User Management</h2>
          <p className="text-purple-300">Manage all users across the platform</p>
        </div>
        <Button 
          onClick={handleExportUsers} 
          variant="outline" 
          className="border-purple-500/30 text-purple-300 w-full sm:w-auto"
          size="sm"
        >
          <Download className="h-4 w-4 mr-2" />
          <span className="hidden xs:inline">Export Report</span>
          <span className="xs:hidden">Export</span>
        </Button>
      </div>

      <FilterCard
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search users by name, email, or clinic..."
        filters={filterOptions}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          title="Total Users"
          value={users.length}
          icon={Users}
        />
        <StatsCard
          title="Active Users"
          value={users.filter(u => u.status === 'active').length}
          icon={Users}
        />
        <StatsCard
          title="Doctors"
          value={users.filter(u => u.role === 'doctor').length}
          icon={Shield}
        />
        <StatsCard
          title="Patients"
          value={users.filter(u => u.role === 'patient').length}
          icon={User}
        />
      </div>

      <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white">All Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <UserTable
            users={filteredUsers}
            onBanUser={handleBanUser}
            onReactivateUser={handleReactivateUser}
            onEditUser={handleEditUser}
          />
        </CardContent>
      </Card>
    </div>
  );
};
