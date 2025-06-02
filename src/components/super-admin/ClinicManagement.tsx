
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Download, Building, Users, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { exportDataToPDF } from "@/utils/pdfExport";
import { StatsCard } from "./shared/StatsCard";
import { FilterCard } from "./shared/FilterCard";
import { ClinicTable } from "./clinics/ClinicTable";

export const ClinicManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  // Mock data
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

  const filterOptions = [
    {
      label: "Filter by status",
      value: statusFilter,
      onChange: setStatusFilter,
      options: [
        { value: "all", label: "All Status" },
        { value: "active", label: "Active" },
        { value: "trial", label: "Trial" },
        { value: "suspended", label: "Suspended" },
        { value: "expired", label: "Expired" }
      ]
    }
  ];

  return (
    <div className="space-y-6">
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

      <FilterCard
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search clinics by name, email, or location..."
        filters={filterOptions}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          title="Total Clinics"
          value={clinics.length}
          icon={Building}
        />
        <StatsCard
          title="Active Clinics"
          value={clinics.filter(c => c.status === 'active').length}
          icon={Users}
        />
        <StatsCard
          title="Total Patients"
          value={clinics.reduce((sum, c) => sum + c.patients, 0)}
          icon={Users}
        />
        <StatsCard
          title="Total Appointments"
          value={clinics.reduce((sum, c) => sum + c.appointments, 0)}
          icon={Calendar}
        />
      </div>

      <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white">All Clinics ({filteredClinics.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <ClinicTable
            clinics={filteredClinics}
            onToggleStatus={handleToggleStatus}
          />
        </CardContent>
      </Card>
    </div>
  );
};
