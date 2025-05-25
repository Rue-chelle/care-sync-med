
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Patient {
  id: string;
  full_name: string;
  date_of_birth: string;
  phone: string;
}

interface Prescription {
  id: string;
  medication_name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  status: string;
  prescription_date: string;
  patients: {
    full_name: string;
  };
}

export const PrescriptionTool = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    medication_name: "",
    dosage: "",
    frequency: "",
    duration: "",
    instructions: "",
    refills_remaining: 0
  });

  useEffect(() => {
    fetchPatients();
    fetchPrescriptions();
  }, []);

  const fetchPatients = async () => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('id, full_name, date_of_birth, phone')
        .order('full_name');

      if (error) throw error;
      setPatients(data || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const fetchPrescriptions = async () => {
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
        .from('prescriptions')
        .select(`
          id,
          medication_name,
          dosage,
          frequency,
          duration,
          instructions,
          status,
          prescription_date,
          patients (full_name)
        `)
        .eq('doctor_id', doctorData.id)
        .order('prescription_date', { ascending: false });

      if (error) throw error;
      setPrescriptions(data || []);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) {
      toast({
        title: "Error",
        description: "Please select a patient",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
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
        .from('prescriptions')
        .insert({
          doctor_id: doctorData.id,
          patient_id: selectedPatient,
          ...formData,
          prescription_date: new Date().toISOString().split('T')[0],
          status: 'active'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Prescription created successfully",
      });

      setFormData({
        medication_name: "",
        dosage: "",
        frequency: "",
        duration: "",
        instructions: "",
        refills_remaining: 0
      });
      setSelectedPatient("");
      setShowForm(false);
      fetchPrescriptions();
    } catch (error) {
      console.error('Error creating prescription:', error);
      toast({
        title: "Error",
        description: "Failed to create prescription",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPrescriptions = prescriptions.filter(prescription =>
    prescription.patients.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.medication_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-slate-800">E-Prescriptions</h2>
        <Button 
          className="healthcare-gradient text-white"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Prescription
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Prescription</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="patient">Patient</Label>
                  <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="medication_name">Medication Name</Label>
                  <Input
                    id="medication_name"
                    value={formData.medication_name}
                    onChange={(e) => setFormData({...formData, medication_name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="dosage">Dosage</Label>
                  <Input
                    id="dosage"
                    value={formData.dosage}
                    onChange={(e) => setFormData({...formData, dosage: e.target.value})}
                    placeholder="e.g., 500mg"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="frequency">Frequency</Label>
                  <Input
                    id="frequency"
                    value={formData.frequency}
                    onChange={(e) => setFormData({...formData, frequency: e.target.value})}
                    placeholder="e.g., Twice daily"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    placeholder="e.g., 7 days"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="refills">Refills Remaining</Label>
                  <Input
                    id="refills"
                    type="number"
                    value={formData.refills_remaining}
                    onChange={(e) => setFormData({...formData, refills_remaining: parseInt(e.target.value)})}
                    min="0"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="instructions">Instructions</Label>
                <Textarea
                  id="instructions"
                  value={formData.instructions}
                  onChange={(e) => setFormData({...formData, instructions: e.target.value})}
                  placeholder="Special instructions for the patient..."
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Prescription"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Search Prescriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search by patient name or medication..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredPrescriptions.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No prescriptions found</p>
            </CardContent>
          </Card>
        ) : (
          filteredPrescriptions.map((prescription) => (
            <Card key={prescription.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{prescription.medication_name}</h3>
                    <p className="text-gray-600">{prescription.patients.full_name}</p>
                    <div className="mt-2 space-y-1 text-sm">
                      <p><strong>Dosage:</strong> {prescription.dosage}</p>
                      <p><strong>Frequency:</strong> {prescription.frequency}</p>
                      <p><strong>Duration:</strong> {prescription.duration}</p>
                      {prescription.instructions && (
                        <p><strong>Instructions:</strong> {prescription.instructions}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={prescription.status === 'active' ? 'default' : 'secondary'}>
                      {prescription.status}
                    </Badge>
                    <p className="text-sm text-gray-500 mt-1">
                      {prescription.prescription_date}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
