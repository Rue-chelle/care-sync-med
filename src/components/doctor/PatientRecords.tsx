
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { User, Calendar, FileText, Plus, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Patient {
  id: string;
  full_name: string;
  phone: string;
  address: string;
  date_of_birth: string;
  gender: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
}

interface MedicalRecord {
  id: string;
  diagnosis: string;
  symptoms: string;
  treatment_plan: string;
  notes: string;
  vital_signs: any;
  created_at: string;
  appointments: {
    appointment_date: string;
    reason: string;
  };
}

export const PatientRecords = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingRecord, setIsAddingRecord] = useState(false);
  const [newRecord, setNewRecord] = useState({
    diagnosis: "",
    symptoms: "",
    treatment_plan: "",
    notes: "",
    vital_signs: {
      blood_pressure: "",
      temperature: "",
      heart_rate: "",
      weight: ""
    }
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: doctorData } = await supabase
        .from('doctors')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!doctorData) return;

      // Get patients who have appointments with this doctor
      const { data: appointmentPatients } = await supabase
        .from('appointments')
        .select(`
          patients (
            id,
            full_name,
            phone,
            address,
            date_of_birth,
            gender,
            emergency_contact_name,
            emergency_contact_phone
          )
        `)
        .eq('doctor_id', doctorData.id);

      if (appointmentPatients) {
        const uniquePatients = Array.from(
          new Map(appointmentPatients.map(ap => [ap.patients.id, ap.patients])).values()
        );
        setPatients(uniquePatients);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMedicalRecords = async (patientId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: doctorData } = await supabase
        .from('doctors')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!doctorData) return;

      const { data, error } = await supabase
        .from('medical_records')
        .select(`
          id,
          diagnosis,
          symptoms,
          treatment_plan,
          notes,
          vital_signs,
          created_at,
          appointments (
            appointment_date,
            reason
          )
        `)
        .eq('patient_id', patientId)
        .eq('doctor_id', doctorData.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching medical records:', error);
        return;
      }

      setMedicalRecords(data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const addMedicalRecord = async () => {
    if (!selectedPatient) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: doctorData } = await supabase
        .from('doctors')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!doctorData) return;

      const { error } = await supabase
        .from('medical_records')
        .insert({
          patient_id: selectedPatient.id,
          doctor_id: doctorData.id,
          diagnosis: newRecord.diagnosis,
          symptoms: newRecord.symptoms,
          treatment_plan: newRecord.treatment_plan,
          notes: newRecord.notes,
          vital_signs: newRecord.vital_signs
        });

      if (error) {
        console.error('Error adding medical record:', error);
        toast({
          title: "Error",
          description: "Failed to add medical record",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Medical record added successfully",
      });

      setIsAddingRecord(false);
      setNewRecord({
        diagnosis: "",
        symptoms: "",
        treatment_plan: "",
        notes: "",
        vital_signs: {
          blood_pressure: "",
          temperature: "",
          heart_rate: "",
          weight: ""
        }
      });
      fetchMedicalRecords(selectedPatient.id);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <div>Loading patients...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-slate-800">Patient Medical Records</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patients List */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Patients</CardTitle>
              <CardDescription>Select a patient to view their records</CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-4"
              />
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredPatients.map((patient) => (
                  <Card
                    key={patient.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedPatient?.id === patient.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => {
                      setSelectedPatient(patient);
                      fetchMedicalRecords(patient.id);
                    }}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-blue-600" />
                        <div>
                          <p className="font-medium">{patient.full_name}</p>
                          <p className="text-sm text-gray-500">
                            {patient.date_of_birth && format(new Date(patient.date_of_birth), 'MMM dd, yyyy')}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Patient Details & Records */}
        <div className="lg:col-span-2 space-y-4">
          {selectedPatient ? (
            <>
              {/* Patient Info */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Patient Information</CardTitle>
                    <Dialog open={isAddingRecord} onOpenChange={setIsAddingRecord}>
                      <DialogTrigger asChild>
                        <Button className="healthcare-gradient text-white">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Record
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Add Medical Record</DialogTitle>
                          <DialogDescription>
                            Add a new medical record for {selectedPatient.full_name}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium">Diagnosis</label>
                            <Input
                              value={newRecord.diagnosis}
                              onChange={(e) => setNewRecord({...newRecord, diagnosis: e.target.value})}
                              placeholder="Enter diagnosis"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Symptoms</label>
                            <Textarea
                              value={newRecord.symptoms}
                              onChange={(e) => setNewRecord({...newRecord, symptoms: e.target.value})}
                              placeholder="Describe symptoms"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Treatment Plan</label>
                            <Textarea
                              value={newRecord.treatment_plan}
                              onChange={(e) => setNewRecord({...newRecord, treatment_plan: e.target.value})}
                              placeholder="Treatment plan"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Notes</label>
                            <Textarea
                              value={newRecord.notes}
                              onChange={(e) => setNewRecord({...newRecord, notes: e.target.value})}
                              placeholder="Additional notes"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium">Blood Pressure</label>
                              <Input
                                value={newRecord.vital_signs.blood_pressure}
                                onChange={(e) => setNewRecord({
                                  ...newRecord, 
                                  vital_signs: {...newRecord.vital_signs, blood_pressure: e.target.value}
                                })}
                                placeholder="120/80"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Temperature</label>
                              <Input
                                value={newRecord.vital_signs.temperature}
                                onChange={(e) => setNewRecord({
                                  ...newRecord, 
                                  vital_signs: {...newRecord.vital_signs, temperature: e.target.value}
                                })}
                                placeholder="98.6°F"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Heart Rate</label>
                              <Input
                                value={newRecord.vital_signs.heart_rate}
                                onChange={(e) => setNewRecord({
                                  ...newRecord, 
                                  vital_signs: {...newRecord.vital_signs, heart_rate: e.target.value}
                                })}
                                placeholder="72 bpm"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Weight</label>
                              <Input
                                value={newRecord.vital_signs.weight}
                                onChange={(e) => setNewRecord({
                                  ...newRecord, 
                                  vital_signs: {...newRecord.vital_signs, weight: e.target.value}
                                })}
                                placeholder="150 lbs"
                              />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={addMedicalRecord} className="healthcare-gradient text-white">
                              Save Record
                            </Button>
                            <Button variant="outline" onClick={() => setIsAddingRecord(false)}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><strong>Name:</strong> {selectedPatient.full_name}</div>
                    <div><strong>Phone:</strong> {selectedPatient.phone || 'N/A'}</div>
                    <div><strong>Gender:</strong> {selectedPatient.gender || 'N/A'}</div>
                    <div><strong>DOB:</strong> {selectedPatient.date_of_birth || 'N/A'}</div>
                    <div className="col-span-2"><strong>Address:</strong> {selectedPatient.address || 'N/A'}</div>
                    <div><strong>Emergency Contact:</strong> {selectedPatient.emergency_contact_name || 'N/A'}</div>
                    <div><strong>Emergency Phone:</strong> {selectedPatient.emergency_contact_phone || 'N/A'}</div>
                  </div>
                </CardContent>
              </Card>

              {/* Medical Records */}
              <Card>
                <CardHeader>
                  <CardTitle>Medical History</CardTitle>
                  <CardDescription>Previous visits and medical records</CardDescription>
                </CardHeader>
                <CardContent>
                  {medicalRecords.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No medical records found.</p>
                  ) : (
                    <div className="space-y-4">
                      {medicalRecords.map((record) => (
                        <Card key={record.id} className="border-l-4 border-l-blue-500">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <Badge variant="outline">
                                {format(new Date(record.created_at), 'MMM dd, yyyy')}
                              </Badge>
                              <div className="text-sm text-gray-500">
                                {record.appointments?.reason && `Visit: ${record.appointments.reason}`}
                              </div>
                            </div>
                            
                            {record.diagnosis && (
                              <div className="mb-2">
                                <strong>Diagnosis:</strong> {record.diagnosis}
                              </div>
                            )}
                            
                            {record.symptoms && (
                              <div className="mb-2">
                                <strong>Symptoms:</strong> {record.symptoms}
                              </div>
                            )}
                            
                            {record.treatment_plan && (
                              <div className="mb-2">
                                <strong>Treatment:</strong> {record.treatment_plan}
                              </div>
                            )}
                            
                            {record.notes && (
                              <div className="mb-2">
                                <strong>Notes:</strong> {record.notes}
                              </div>
                            )}
                            
                            {record.vital_signs && Object.keys(record.vital_signs).length > 0 && (
                              <div className="mt-3 p-3 bg-gray-50 rounded">
                                <strong>Vital Signs:</strong>
                                <div className="grid grid-cols-2 gap-2 mt-1 text-sm">
                                  {record.vital_signs.blood_pressure && (
                                    <div>BP: {record.vital_signs.blood_pressure}</div>
                                  )}
                                  {record.vital_signs.temperature && (
                                    <div>Temp: {record.vital_signs.temperature}</div>
                                  )}
                                  {record.vital_signs.heart_rate && (
                                    <div>HR: {record.vital_signs.heart_rate}</div>
                                  )}
                                  {record.vital_signs.weight && (
                                    <div>Weight: {record.vital_signs.weight}</div>
                                  )}
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Select a patient to view their medical records</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
