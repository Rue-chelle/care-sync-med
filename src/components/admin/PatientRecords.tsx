
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { FolderOpen, Search, Eye, Calendar, FileText, Activity, Phone, Mail, MapPin } from "lucide-react";

export const PatientRecords = () => {
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [appointments, setAppointments] = useState<any[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    if (selectedPatient) {
      fetchPatientData(selectedPatient.id);
    }
  }, [selectedPatient]);

  const fetchPatients = async () => {
    try {
      const { data, error } = await supabase
        .from("patients")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPatients(data || []);
    } catch (error) {
      console.error("Error fetching patients:", error);
      toast({
        title: "Error",
        description: "Failed to fetch patients",
        variant: "destructive",
      });
    }
  };

  const fetchPatientData = async (patientId: string) => {
    try {
      // Fetch appointments
      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from("appointments")
        .select(`
          *,
          doctor:doctors(full_name, specialization)
        `)
        .eq("patient_id", patientId)
        .order("appointment_date", { ascending: false });

      if (appointmentsError) throw appointmentsError;
      setAppointments(appointmentsData || []);

      // Fetch prescriptions
      const { data: prescriptionsData, error: prescriptionsError } = await supabase
        .from("prescriptions")
        .select(`
          *,
          doctor:doctors(full_name)
        `)
        .eq("patient_id", patientId)
        .order("created_at", { ascending: false });

      if (prescriptionsError) throw prescriptionsError;
      setPrescriptions(prescriptionsData || []);

      // Fetch medical records
      const { data: recordsData, error: recordsError } = await supabase
        .from("medical_records")
        .select(`
          *,
          doctor:doctors(full_name)
        `)
        .eq("patient_id", patientId)
        .order("created_at", { ascending: false });

      if (recordsError) throw recordsError;
      setMedicalRecords(recordsData || []);

    } catch (error) {
      console.error("Error fetching patient data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch patient data",
        variant: "destructive",
      });
    }
  };

  const openPatientDetails = (patient: any) => {
    setSelectedPatient(patient);
    setIsDialogOpen(true);
  };

  const filteredPatients = patients.filter(patient =>
    patient.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "scheduled":
        return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5" />
                Patient Records
              </CardTitle>
              <CardDescription>
                View and manage comprehensive patient information
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search patients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient Name</TableHead>
                <TableHead>Contact Info</TableHead>
                <TableHead>Date of Birth</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Last Visit</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="font-medium">{patient.full_name}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {patient.phone && (
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3" />
                          {patient.phone}
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        Contact via system
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {patient.date_of_birth 
                      ? new Date(patient.date_of_birth).toLocaleDateString()
                      : "Not provided"
                    }
                  </TableCell>
                  <TableCell>{patient.gender || "Not specified"}</TableCell>
                  <TableCell>
                    {new Date(patient.updated_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openPatientDetails(patient)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredPatients.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No patients found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5" />
              Patient Details: {selectedPatient?.full_name}
            </DialogTitle>
            <DialogDescription>
              Comprehensive patient information and medical history
            </DialogDescription>
          </DialogHeader>

          {selectedPatient && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="appointments">Appointments</TabsTrigger>
                <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
                <TabsTrigger value="records">Medical Records</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2">
                        <strong>Name:</strong> {selectedPatient.full_name}
                      </div>
                      <div className="flex items-center gap-2">
                        <strong>Date of Birth:</strong> {selectedPatient.date_of_birth || "Not provided"}
                      </div>
                      <div className="flex items-center gap-2">
                        <strong>Gender:</strong> {selectedPatient.gender || "Not specified"}
                      </div>
                      {selectedPatient.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <strong>Phone:</strong> {selectedPatient.phone}
                        </div>
                      )}
                      {selectedPatient.address && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <strong>Address:</strong> {selectedPatient.address}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Emergency Contact</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2">
                        <strong>Name:</strong> {selectedPatient.emergency_contact_name || "Not provided"}
                      </div>
                      <div className="flex items-center gap-2">
                        <strong>Phone:</strong> {selectedPatient.emergency_contact_phone || "Not provided"}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-2xl font-bold">{appointments.length}</CardTitle>
                      <CardDescription>Total Appointments</CardDescription>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-2xl font-bold">{prescriptions.length}</CardTitle>
                      <CardDescription>Active Prescriptions</CardDescription>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-2xl font-bold">{medicalRecords.length}</CardTitle>
                      <CardDescription>Medical Records</CardDescription>
                    </CardHeader>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="appointments" className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Doctor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Reason</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell>{new Date(appointment.appointment_date).toLocaleDateString()}</TableCell>
                        <TableCell>{appointment.appointment_time}</TableCell>
                        <TableCell>{appointment.doctor?.full_name}</TableCell>
                        <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                        <TableCell>{appointment.reason || "General consultation"}</TableCell>
                      </TableRow>
                    ))}
                    {appointments.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4">
                          No appointments found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="prescriptions" className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Medication</TableHead>
                      <TableHead>Dosage</TableHead>
                      <TableHead>Frequency</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Prescribed By</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {prescriptions.map((prescription) => (
                      <TableRow key={prescription.id}>
                        <TableCell className="font-medium">{prescription.medication_name}</TableCell>
                        <TableCell>{prescription.dosage}</TableCell>
                        <TableCell>{prescription.frequency}</TableCell>
                        <TableCell>{prescription.duration}</TableCell>
                        <TableCell>{getStatusBadge(prescription.status || "active")}</TableCell>
                        <TableCell>{prescription.doctor?.full_name}</TableCell>
                      </TableRow>
                    ))}
                    {prescriptions.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          No prescriptions found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="records" className="space-y-4">
                {medicalRecords.map((record) => (
                  <Card key={record.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          Medical Record
                        </CardTitle>
                        <Badge variant="outline">
                          {new Date(record.created_at).toLocaleDateString()}
                        </Badge>
                      </div>
                      <CardDescription>
                        By Dr. {record.doctor?.full_name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {record.symptoms && (
                        <div>
                          <strong>Symptoms:</strong>
                          <p className="mt-1 text-sm">{record.symptoms}</p>
                        </div>
                      )}
                      {record.diagnosis && (
                        <div>
                          <strong>Diagnosis:</strong>
                          <p className="mt-1 text-sm">{record.diagnosis}</p>
                        </div>
                      )}
                      {record.treatment_plan && (
                        <div>
                          <strong>Treatment Plan:</strong>
                          <p className="mt-1 text-sm">{record.treatment_plan}</p>
                        </div>
                      )}
                      {record.notes && (
                        <div>
                          <strong>Notes:</strong>
                          <p className="mt-1 text-sm">{record.notes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
                {medicalRecords.length === 0 && (
                  <Card>
                    <CardContent className="text-center py-8">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No medical records found</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
