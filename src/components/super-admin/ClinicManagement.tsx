
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Download, Building, Users, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { exportDataToPDF } from "@/utils/pdfExport";
import { StatsCard } from "./shared/StatsCard";
import { FilterCard } from "./shared/FilterCard";
import { ClinicTable } from "./clinics/ClinicTable";
import { AddClinicModal } from "./clinics/AddClinicModal";

export const ClinicManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddClinicModalOpen, setIsAddClinicModalOpen] = useState(false);
  const { toast } = useToast();

  // Mock data
  const [clinics, setClinics] = useState([
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
  ]);

  const filteredClinics = clinics.filter(clinic => {
    const matchesSearch = clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         clinic.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         clinic.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || clinic.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleToggleStatus = (clinic: any) => {
    const newStatus = clinic.status === "active" ? "suspended" : "active";
    setClinics(prevClinics => 
      prevClinics.map(c => 
        c.id === clinic.id ? { ...c, status: newStatus } : c
      )
    );
    toast({
      title: "Status Updated",
      description: `${clinic.name} has been ${newStatus}`,
    });
  };

  const handleEditClinic = (clinic: any) => {
    toast({
      title: "Edit Clinic",
      description: `Opening edit form for ${clinic.name}`,
    });
    // Here you would open an edit modal or navigate to edit page
  };

  const handleAddClinic = (newClinic: any) => {
    setClinics(prevClinics => [...prevClinics, newClinic]);
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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Clinic Management</h2>
          <p className="text-purple-300">Manage all registered clinics and their subscriptions</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button 
            onClick={handleExportClinics} 
            variant="outline" 
            className="border-purple-500/30 text-purple-300 w-full sm:w-auto"
            size="sm"
          >
            <Download className="h-4 w-4 mr-2" />
            <span className="hidden xs:inline">Export Report</span>
            <span className="xs:hidden">Export</span>
          </Button>
          <Button 
            onClick={() => setIsAddClinicModalOpen(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white w-full sm:w-auto" 
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden xs:inline">Add Clinic</span>
            <span className="xs:hidden">Add</span>
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
            onEditClinic={handleEditClinic}
          />
        </CardContent>
      </Card>

      <AddClinicModal
        isOpen={isAddClinicModalOpen}
        onClose={() => setIsAddClinicModalOpen(false)}
        onSave={handleAddClinic}
      />
    </div>
  );
};
