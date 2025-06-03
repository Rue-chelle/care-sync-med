
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
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: '1',
      full_name: 'John Doe',
      phone: '+1 (555) 123-4567',
      address: '123 Main Street, Anytown, ST 12345',
      date_of_birth: '1990-01-15',
      gender: 'Male',
      emergency_contact_name: 'Jane Doe',
      emergency_contact_phone: '+1 (555) 987-6543',
    },
    {
      id: '2',
      full_name: 'Alice Smith',
      phone: '+1 (555) 234-5678',
      address: '456 Oak Avenue, Springfield, ST 67890',
      date_of_birth: '1985-05-22',
      gender: 'Female',
      emergency_contact_name: 'Bob Smith',
      emergency_contact_phone: '+1 (555) 876-5432',
    },
    {
      id: '3',
      full_name: 'Michael Johnson',
      phone: '+1 (555) 345-6789',
      address: '789 Pine Road, Riverside, ST 13579',
      date_of_birth: '1978-11-08',
      gender: 'Male',
      emergency_contact_name: 'Sarah Johnson',
      emergency_contact_phone: '+1 (555) 765-4321',
    }
  ]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
    // Using demo data instead of fetching from database
    setIsLoading(false);
  }, []);

  const getDemoRecords = (patientId: string) => {
    const demoRecords: { [key: string]: MedicalRecord[] } = {
      '1': [
        {
          id: '1',
          diagnosis: 'Annual Health Checkup',
          symptoms: 'Routine checkup, no specific symptoms',
          treatment_plan: 'Continue regular exercise and balanced diet. Schedule follow-up in 6 months.',
          notes: 'Patient appears healthy overall. Recommended yearly screening.',
          vital_signs: {
            blood_pressure: '120/80',
            temperature: '98.6°F',
            heart_rate: '72 bpm',
            weight: '175 lbs'
          },
          created_at: '2024-01-15T10:00:00Z',
          appointments: {
            appointment_date: '2024-01-15',
            reason: 'Annual Physical'
          }
        },
        {
          id: '2',
          diagnosis: 'Mild Hypertension',
          symptoms: 'Elevated blood pressure readings',
          treatment_plan: 'Prescribed Lisinopril 10mg daily. Monitor blood pressure weekly.',
          notes: 'Patient advised on dietary changes and stress management.',
          vital_signs: {
            blood_pressure: '140/90',
            temperature: '98.4°F',
            heart_rate: '78 bpm',
            weight: '178 lbs'
          },
          created_at: '2023-08-20T14:30:00Z',
          appointments: {
            appointment_date: '2023-08-20',
            reason: 'Follow-up visit'
          }
        }
      ],
      '2': [
        {
          id: '3',
          diagnosis: 'Seasonal Allergies',
          symptoms: 'Sneezing, runny nose, itchy eyes',
          treatment_plan: 'Use antihistamines as needed. Consider allergy testing if symptoms worsen.',
          notes: 'Symptoms appear to be seasonal. Patient reports improvement with OTC medications.',
          vital_signs: {
            blood_pressure: '115/75',
            temperature: '98.2°F',
            heart_rate: '68 bpm',
            weight: '140 lbs'
          },
          created_at: '2024-03-10T09:15:00Z',
          appointments: {
            appointment_date: '2024-03-10',
            reason: 'Allergy consultation'
          }
        }
      ],
      '3': [
        {
          id: '4',
          diagnosis: 'Lower Back Pain',
          symptoms: 'Chronic lower back pain, stiffness in the morning',
          treatment_plan: 'Physical therapy sessions twice a week. Prescribed muscle relaxants.',
          notes: 'Pain likely due to poor posture and sedentary work. Ergonomic improvements recommended.',
          vital_signs: {
            blood_pressure: '125/82',
            temperature: '98.8°F',
            heart_rate: '75 bpm',
            weight: '195 lbs'
          },
          created_at: '2024-02-28T11:45:00Z',
          appointments: {
            appointment_date: '2024-02-28',
            reason: 'Back pain evaluation'
          }
        }
      ]
    };
    return demoRecords[patientId] || [];
  };

  const fetchMedicalRecords = async (patientId: string) => {
    const records = getDemoRecords(patientId);
    setMedicalRecords(records);
  };

  const addMedicalRecord = async () => {
    if (!selectedPatient) return;

    try {
      const newRecordWithId = {
        ...newRecord,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        appointments: {
          appointment_date: new Date().toISOString().split('T')[0],
          reason: 'New consultation'
        }
      };

      setMedicalRecords(prev => [newRecordWithId, ...prev]);

      toast({
        title: "Success",
        description: "Medical record added successfully (demo mode)",
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
    <div className="space-y-4 lg:space-y-6 max-w-full px-2 sm:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl lg:text-3xl font-bold text-slate-800">Patient Medical Records</h2>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
        {/* Patients List */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg lg:text-xl">My Patients</CardTitle>
              <CardDescription className="text-sm lg:text-base">Select a patient to view their records</CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-4 text-sm lg:text-base"
              />
              <div className="space-y-2 max-h-80 lg:max-h-96 overflow-y-auto">
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
                          <p className="font-medium text-sm lg:text-base">{patient.full_name}</p>
                          <p className="text-xs lg:text-sm text-gray-500">
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
        <div className="xl:col-span-2 space-y-4">
          {selectedPatient ? (
            <>
              {/* Patient Info */}
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <CardTitle className="text-lg lg:text-xl">Patient Information</CardTitle>
                    <Dialog open={isAddingRecord} onOpenChange={setIsAddingRecord}>
                      <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-blue-600 to-teal-600 text-white w-full sm:w-auto">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Record
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
                              className="text-sm lg:text-base"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Symptoms</label>
                            <Textarea
                              value={newRecord.symptoms}
                              onChange={(e) => setNewRecord({...newRecord, symptoms: e.target.value})}
                              placeholder="Describe symptoms"
                              className="text-sm lg:text-base"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Treatment Plan</label>
                            <Textarea
                              value={newRecord.treatment_plan}
                              onChange={(e) => setNewRecord({...newRecord, treatment_plan: e.target.value})}
                              placeholder="Treatment plan"
                              className="text-sm lg:text-base"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Notes</label>
                            <Textarea
                              value={newRecord.notes}
                              onChange={(e) => setNewRecord({...newRecord, notes: e.target.value})}
                              placeholder="Additional notes"
                              className="text-sm lg:text-base"
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium">Blood Pressure</label>
                              <Input
                                value={newRecord.vital_signs.blood_pressure}
                                onChange={(e) => setNewRecord({
                                  ...newRecord, 
                                  vital_signs: {...newRecord.vital_signs, blood_pressure: e.target.value}
                                })}
                                placeholder="120/80"
                                className="text-sm lg:text-base"
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
                                className="text-sm lg:text-base"
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
                                className="text-sm lg:text-base"
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
                                className="text-sm lg:text-base"
                              />
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <Button onClick={addMedicalRecord} className="bg-gradient-to-r from-blue-600 to-teal-600 text-white">
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm lg:text-base">
                    <div><strong>Name:</strong> {selectedPatient.full_name}</div>
                    <div><strong>Phone:</strong> {selectedPatient.phone || 'N/A'}</div>
                    <div><strong>Gender:</strong> {selectedPatient.gender || 'N/A'}</div>
                    <div><strong>DOB:</strong> {selectedPatient.date_of_birth || 'N/A'}</div>
                    <div className="col-span-1 sm:col-span-2"><strong>Address:</strong> {selectedPatient.address || 'N/A'}</div>
                    <div><strong>Emergency Contact:</strong> {selectedPatient.emergency_contact_name || 'N/A'}</div>
                    <div><strong>Emergency Phone:</strong> {selectedPatient.emergency_contact_phone || 'N/A'}</div>
                  </div>
                </CardContent>
              </Card>

              {/* Medical Records */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg lg:text-xl">Medical History</CardTitle>
                  <CardDescription className="text-sm lg:text-base">Previous visits and medical records</CardDescription>
                </CardHeader>
                <CardContent>
                  {medicalRecords.length === 0 ? (
                    <p className="text-center text-gray-500 py-8 text-sm lg:text-base">No medical records found.</p>
                  ) : (
                    <div className="space-y-4">
                      {medicalRecords.map((record) => (
                        <Card key={record.id} className="border-l-4 border-l-blue-500">
                          <CardContent className="p-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                              <Badge variant="outline" className="self-start text-xs">
                                {format(new Date(record.created_at), 'MMM dd, yyyy')}
                              </Badge>
                              <div className="text-xs lg:text-sm text-gray-500">
                                {record.appointments?.reason && `Visit: ${record.appointments.reason}`}
                              </div>
                            </div>
                            
                            {record.diagnosis && (
                              <div className="mb-2">
                                <strong className="text-sm lg:text-base">Diagnosis:</strong> 
                                <span className="text-sm lg:text-base ml-1">{record.diagnosis}</span>
                              </div>
                            )}
                            
                            {record.symptoms && (
                              <div className="mb-2">
                                <strong className="text-sm lg:text-base">Symptoms:</strong> 
                                <span className="text-sm lg:text-base ml-1">{record.symptoms}</span>
                              </div>
                            )}
                            
                            {record.treatment_plan && (
                              <div className="mb-2">
                                <strong className="text-sm lg:text-base">Treatment:</strong> 
                                <span className="text-sm lg:text-base ml-1">{record.treatment_plan}</span>
                              </div>
                            )}
                            
                            {record.notes && (
                              <div className="mb-2">
                                <strong className="text-sm lg:text-base">Notes:</strong> 
                                <span className="text-sm lg:text-base ml-1">{record.notes}</span>
                              </div>
                            )}
                            
                            {record.vital_signs && Object.keys(record.vital_signs).length > 0 && (
                              <div className="mt-3 p-3 bg-gray-50 rounded">
                                <strong className="text-sm lg:text-base">Vital Signs:</strong>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1 text-xs lg:text-sm">
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
              <CardContent className="p-8 lg:p-12 text-center">
                <Eye className="h-8 w-8 lg:h-12 lg:w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-sm lg:text-base">Select a patient to view their medical records</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
