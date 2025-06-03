
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Eye, Edit, FileText, Calendar, User } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const PatientRecords = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Demo patient data
  const patients = [
    {
      id: "1",
      name: "John Smith",
      age: 45,
      gender: "Male",
      phone: "+1 (555) 123-4567",
      email: "john.smith@email.com",
      lastVisit: "2024-01-20",
      status: "active",
      conditions: ["Hypertension", "Diabetes"],
      allergies: ["Penicillin"],
      medications: ["Metformin", "Lisinopril"],
      emergencyContact: "Jane Smith - +1 (555) 123-4568",
      address: "123 Main St, New York, NY 10001",
      insurance: "Blue Cross Blue Shield",
      visitHistory: [
        { date: "2024-01-20", doctor: "Dr. Sarah Johnson", reason: "Regular checkup", diagnosis: "Stable condition" },
        { date: "2024-01-05", doctor: "Dr. Michael Chen", reason: "Blood pressure monitoring", diagnosis: "Hypertension under control" },
        { date: "2023-12-15", doctor: "Dr. Sarah Johnson", reason: "Diabetes management", diagnosis: "Good glucose control" }
      ]
    },
    {
      id: "2",
      name: "Emily Johnson",
      age: 32,
      gender: "Female",
      phone: "+1 (555) 234-5678",
      email: "emily.johnson@email.com",
      lastVisit: "2024-01-18",
      status: "active",
      conditions: ["Asthma"],
      allergies: ["Shellfish", "Pollen"],
      medications: ["Albuterol Inhaler"],
      emergencyContact: "Robert Johnson - +1 (555) 234-5679",
      address: "456 Oak Ave, Los Angeles, CA 90210",
      insurance: "Aetna Health",
      visitHistory: [
        { date: "2024-01-18", doctor: "Dr. Lisa Wang", reason: "Asthma follow-up", diagnosis: "Well controlled asthma" },
        { date: "2024-01-03", doctor: "Dr. Lisa Wang", reason: "Respiratory symptoms", diagnosis: "Mild asthma exacerbation" }
      ]
    },
    {
      id: "3",
      name: "Michael Brown",
      age: 58,
      gender: "Male",
      phone: "+1 (555) 345-6789",
      email: "michael.brown@email.com",
      lastVisit: "2024-01-15",
      status: "inactive",
      conditions: ["Heart Disease", "High Cholesterol"],
      allergies: ["None known"],
      medications: ["Atorvastatin", "Aspirin"],
      emergencyContact: "Susan Brown - +1 (555) 345-6790",
      address: "789 Pine St, Chicago, IL 60601",
      insurance: "Medicare",
      visitHistory: [
        { date: "2024-01-15", doctor: "Dr. James Wilson", reason: "Cardiac consultation", diagnosis: "Stable coronary artery disease" },
        { date: "2023-12-20", doctor: "Dr. James Wilson", reason: "Cholesterol management", diagnosis: "Improving lipid profile" }
      ]
    },
    {
      id: "4",
      name: "Sarah Davis",
      age: 28,
      gender: "Female",
      phone: "+1 (555) 456-7890",
      email: "sarah.davis@email.com",
      lastVisit: "2024-01-22",
      status: "active",
      conditions: ["Pregnancy - 2nd trimester"],
      allergies: ["Latex"],
      medications: ["Prenatal vitamins", "Folic acid"],
      emergencyContact: "David Davis - +1 (555) 456-7891",
      address: "321 Elm St, Miami, FL 33101",
      insurance: "United Healthcare",
      visitHistory: [
        { date: "2024-01-22", doctor: "Dr. Maria Rodriguez", reason: "Prenatal checkup", diagnosis: "Normal pregnancy progression" },
        { date: "2024-01-08", doctor: "Dr. Maria Rodriguez", reason: "20-week ultrasound", diagnosis: "Healthy fetal development" }
      ]
    }
  ];

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.phone.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || patient.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "inactive": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const PatientDetailsModal = ({ patient }) => (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-xl lg:text-2xl">Patient Details - {patient.name}</DialogTitle>
        <DialogDescription>Complete patient information and medical history</DialogDescription>
      </DialogHeader>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Age:</span> {patient.age}
              </div>
              <div>
                <span className="font-medium">Gender:</span> {patient.gender}
              </div>
              <div className="col-span-2">
                <span className="font-medium">Phone:</span> {patient.phone}
              </div>
              <div className="col-span-2">
                <span className="font-medium">Email:</span> {patient.email}
              </div>
              <div className="col-span-2">
                <span className="font-medium">Address:</span> {patient.address}
              </div>
              <div className="col-span-2">
                <span className="font-medium">Insurance:</span> {patient.insurance}
              </div>
              <div className="col-span-2">
                <span className="font-medium">Emergency Contact:</span> {patient.emergencyContact}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Medical Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5" />
              Medical Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <span className="font-medium text-sm">Conditions:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {patient.conditions.map((condition, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {condition}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <span className="font-medium text-sm">Allergies:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {patient.allergies.map((allergy, index) => (
                  <Badge key={index} variant="destructive" className="text-xs">
                    {allergy}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <span className="font-medium text-sm">Current Medications:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {patient.medications.map((medication, index) => (
                  <Badge key={index} className="bg-blue-100 text-blue-800 text-xs">
                    {medication}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visit History */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5" />
            Visit History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs lg:text-sm">Date</TableHead>
                  <TableHead className="text-xs lg:text-sm">Doctor</TableHead>
                  <TableHead className="text-xs lg:text-sm">Reason</TableHead>
                  <TableHead className="text-xs lg:text-sm">Diagnosis</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patient.visitHistory.map((visit, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-xs lg:text-sm">{visit.date}</TableCell>
                    <TableCell className="text-xs lg:text-sm">{visit.doctor}</TableCell>
                    <TableCell className="text-xs lg:text-sm">{visit.reason}</TableCell>
                    <TableCell className="text-xs lg:text-sm">{visit.diagnosis}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </DialogContent>
  );

  return (
    <div className="space-y-4 lg:space-y-6 max-w-full px-2 sm:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h3 className="text-lg lg:text-xl font-semibold text-gray-900">Patient Records</h3>
          <p className="text-sm lg:text-base text-gray-600">Manage patient information and medical history</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search patients by name, email, or phone..."
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
                <SelectItem value="all">All Patients</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Patient Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs lg:text-sm">Patient</TableHead>
                  <TableHead className="text-xs lg:text-sm">Contact</TableHead>
                  <TableHead className="text-xs lg:text-sm">Last Visit</TableHead>
                  <TableHead className="text-xs lg:text-sm">Status</TableHead>
                  <TableHead className="text-xs lg:text-sm">Conditions</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium text-sm lg:text-base text-gray-900">{patient.name}</div>
                        <div className="text-xs lg:text-sm text-gray-500">{patient.age} years, {patient.gender}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs lg:text-sm">
                        <div>{patient.phone}</div>
                        <div className="text-gray-500">{patient.email}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs lg:text-sm text-gray-600">{patient.lastVisit}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(patient.status)}>
                        {patient.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {patient.conditions.slice(0, 2).map((condition, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {condition}
                          </Badge>
                        ))}
                        {patient.conditions.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{patient.conditions.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <PatientDetailsModal patient={patient} />
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
