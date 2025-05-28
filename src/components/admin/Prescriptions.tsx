
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Download, Eye, AlertTriangle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PrescriptionDetailsModal } from "./PrescriptionDetailsModal";
import { exportToPDF } from "@/utils/pdfExport";

export const Prescriptions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPrescription, setSelectedPrescription] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const prescriptions = [
    {
      id: "RX001",
      patient: "Sarah Wong",
      doctor: "Dr. John Smith",
      medication: "Amoxicillin 500mg",
      dosage: "3 times daily",
      duration: "7 days",
      date: "2025-05-23",
      status: "Active",
      flagged: false
    },
    {
      id: "RX002",
      patient: "David Brown",
      doctor: "Dr. Jennifer Lee",
      medication: "Ibuprofen 400mg",
      dosage: "As needed",
      duration: "14 days",
      date: "2025-05-22",
      status: "Completed",
      flagged: false
    },
    {
      id: "RX003",
      patient: "Emily Parker",
      doctor: "Dr. John Smith",
      medication: "Codeine 30mg",
      dosage: "Every 6 hours",
      duration: "5 days",
      date: "2025-05-21",
      status: "Active",
      flagged: true
    },
    {
      id: "RX004",
      patient: "Michael Johnson",
      doctor: "Dr. Jennifer Lee",
      medication: "Metformin 500mg",
      dosage: "2 times daily",
      duration: "30 days",
      date: "2025-05-20",
      status: "Active",
      flagged: false
    },
  ];

  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch = 
      prescription.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.medication.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || prescription.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active": return "bg-green-100 text-green-800";
      case "completed": return "bg-blue-100 text-blue-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleViewPrescription = (prescription: any) => {
    setSelectedPrescription(prescription);
    setIsModalOpen(true);
  };

  const handleExportReport = () => {
    exportToPDF("Prescription Monitoring Report", filteredPrescriptions, "prescription_report");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Prescription Monitoring</h3>
          <p className="text-sm text-gray-600">Monitor all prescriptions and flagged medications</p>
        </div>
        <Button className="healthcare-gradient text-white" onClick={handleExportReport}>
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Prescriptions</p>
                <p className="text-2xl font-bold text-gray-900">1,247</p>
              </div>
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Search className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">892</p>
              </div>
              <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                <Eye className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Flagged</p>
                <p className="text-2xl font-bold text-red-600">23</p>
              </div>
              <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-blue-600">156</p>
              </div>
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Filter className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by patient, medication, or prescription ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Prescriptions Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Prescription ID</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Medication</TableHead>
                <TableHead>Dosage & Duration</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPrescriptions.map((prescription) => (
                <TableRow key={prescription.id} className={prescription.flagged ? "bg-red-50" : ""}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{prescription.id}</span>
                      {prescription.flagged && (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{prescription.patient}</TableCell>
                  <TableCell>{prescription.doctor}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{prescription.medication}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{prescription.dosage}</div>
                      <div className="text-gray-500">{prescription.duration}</div>
                    </div>
                  </TableCell>
                  <TableCell>{prescription.date}</TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeColor(prescription.status)}>
                      {prescription.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewPrescription(prescription)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <PrescriptionDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        prescription={selectedPrescription}
      />
    </div>
  );
};
