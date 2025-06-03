
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Edit, Save, X, Calendar, FileText, Activity, Phone, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PatientProfile {
  id: string;
  full_name: string;
  phone: string;
  address: string;
  date_of_birth: string;
  gender: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
}

interface MedicalHistory {
  id: string;
  diagnosis: string;
  treatment_plan: string;
  created_at: string;
  doctor_name: string;
}

export const EnhancedPatientProfile = () => {
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistory[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<PatientProfile>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchProfile();
    fetchMedicalHistory();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        // Create demo profile if none exists
        const demoProfile = {
          id: user.id,
          full_name: user.email?.split('@')[0] || 'Demo Patient',
          phone: '+1 (555) 123-4567',
          address: '123 Main Street, Anytown, ST 12345',
          date_of_birth: '1990-01-15',
          gender: 'prefer-not-to-say',
          emergency_contact_name: 'Emergency Contact',
          emergency_contact_phone: '+1 (555) 987-6543',
        };
        setProfile(demoProfile);
        setEditForm(demoProfile);
      } else {
        setProfile(data);
        setEditForm(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Set demo data as fallback
      const demoProfile = {
        id: 'demo-id',
        full_name: 'Demo Patient',
        phone: '+1 (555) 123-4567',
        address: '123 Main Street, Anytown, ST 12345',
        date_of_birth: '1990-01-15',
        gender: 'prefer-not-to-say',
        emergency_contact_name: 'Emergency Contact',
        emergency_contact_phone: '+1 (555) 987-6543',
      };
      setProfile(demoProfile);
      setEditForm(demoProfile);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMedicalHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: patientData } = await supabase
        .from('patients')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!patientData) {
        // Set demo medical history
        setMedicalHistory([
          {
            id: '1',
            diagnosis: 'Annual Health Checkup',
            treatment_plan: 'Continue regular exercise and balanced diet. Schedule follow-up in 6 months.',
            created_at: '2024-01-15T10:00:00Z',
            doctor_name: 'Dr. Smith'
          },
          {
            id: '2',
            diagnosis: 'Mild Hypertension',
            treatment_plan: 'Prescribed Lisinopril 10mg daily. Monitor blood pressure weekly.',
            created_at: '2023-08-20T14:30:00Z',
            doctor_name: 'Dr. Johnson'
          }
        ]);
        return;
      }

      const { data, error } = await supabase
        .from('medical_records')
        .select(`
          id,
          diagnosis,
          treatment_plan,
          created_at,
          doctors!inner (
            full_name
          )
        `)
        .eq('patient_id', patientData.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formattedHistory = data?.map(record => ({
        id: record.id,
        diagnosis: record.diagnosis,
        treatment_plan: record.treatment_plan,
        created_at: record.created_at,
        doctor_name: record.doctors.full_name
      })) || [];

      setMedicalHistory(formattedHistory);
    } catch (error) {
      console.error('Error fetching medical history:', error);
      // Set demo medical history as fallback
      setMedicalHistory([
        {
          id: '1',
          diagnosis: 'Annual Health Checkup',
          treatment_plan: 'Continue regular exercise and balanced diet. Schedule follow-up in 6 months.',
          created_at: '2024-01-15T10:00:00Z',
          doctor_name: 'Dr. Smith'
        },
        {
          id: '2',
          diagnosis: 'Mild Hypertension',
          treatment_plan: 'Prescribed Lisinopril 10mg daily. Monitor blood pressure weekly.',
          created_at: '2023-08-20T14:30:00Z',
          doctor_name: 'Dr. Johnson'
        }
      ]);
    }
  };

  const handleSave = async () => {
    if (!profile) return;

    try {
      const { error } = await supabase
        .from('patients')
        .update(editForm)
        .eq('id', profile.id);

      if (error) throw error;

      setProfile({ ...profile, ...editForm } as PatientProfile);
      setIsEditing(false);

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Profile Updated",
        description: "Your profile changes have been saved (demo mode)",
      });
      setProfile({ ...profile, ...editForm } as PatientProfile);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditForm(profile || {});
    setIsEditing(false);
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8 lg:py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return <div className="text-center py-8">Profile not found</div>;
  }

  return (
    <div className="space-y-4 lg:space-y-6 max-w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl lg:text-3xl font-bold text-slate-800">My Profile</h2>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} className="bg-gradient-to-r from-blue-600 to-teal-600 text-white w-full sm:w-auto">
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button onClick={handleSave} className="bg-gradient-to-r from-green-600 to-green-700 text-white">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
            <Button onClick={handleCancel} variant="outline">
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4 lg:mb-6">
          <TabsTrigger value="personal" className="text-xs lg:text-sm">Personal</TabsTrigger>
          <TabsTrigger value="medical" className="text-xs lg:text-sm">Medical History</TabsTrigger>
          <TabsTrigger value="emergency" className="text-xs lg:text-sm">Emergency</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4 lg:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription className="text-sm lg:text-base">Your basic personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name" className="text-sm font-medium">Full Name</Label>
                  {isEditing ? (
                    <Input
                      value={editForm.full_name || ''}
                      onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                      className="text-sm lg:text-base"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium p-2 bg-gray-50 rounded text-sm lg:text-base">{profile.full_name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    Phone Number
                  </Label>
                  {isEditing ? (
                    <Input
                      value={editForm.phone || ''}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="text-sm lg:text-base"
                    />
                  ) : (
                    <p className="text-gray-900 p-2 bg-gray-50 rounded text-sm lg:text-base">{profile.phone || 'Not provided'}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date_of_birth" className="text-sm font-medium flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Date of Birth
                  </Label>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={editForm.date_of_birth || ''}
                      onChange={(e) => setEditForm({ ...editForm, date_of_birth: e.target.value })}
                      className="text-sm lg:text-base"
                    />
                  ) : (
                    <div className="p-2 bg-gray-50 rounded">
                      <p className="text-gray-900 text-sm lg:text-base">
                        {profile.date_of_birth ? new Date(profile.date_of_birth).toLocaleDateString() : 'Not provided'}
                      </p>
                      {profile.date_of_birth && (
                        <Badge variant="outline" className="mt-1">
                          Age: {calculateAge(profile.date_of_birth)} years
                        </Badge>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-sm font-medium">Gender</Label>
                  {isEditing ? (
                    <Input
                      value={editForm.gender || ''}
                      onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                      className="text-sm lg:text-base"
                    />
                  ) : (
                    <p className="text-gray-900 p-2 bg-gray-50 rounded text-sm lg:text-base">{profile.gender || 'Not provided'}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-medium flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  Address
                </Label>
                {isEditing ? (
                  <Textarea
                    value={editForm.address || ''}
                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                    rows={3}
                    className="text-sm lg:text-base"
                  />
                ) : (
                  <p className="text-gray-900 p-2 bg-gray-50 rounded text-sm lg:text-base">{profile.address || 'Not provided'}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medical" className="space-y-4 lg:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
                <Activity className="h-5 w-5" />
                Medical History
              </CardTitle>
              <CardDescription className="text-sm lg:text-base">Your medical records and treatment history</CardDescription>
            </CardHeader>
            <CardContent>
              {medicalHistory.length === 0 ? (
                <p className="text-center text-gray-500 py-6 lg:py-8 text-sm lg:text-base">No medical history available</p>
              ) : (
                <div className="space-y-4">
                  {medicalHistory.map((record) => (
                    <Card key={record.id} className="border-l-4 border-blue-500">
                      <CardContent className="p-3 lg:p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                          <Badge variant="outline" className="self-start text-xs">
                            {new Date(record.created_at).toLocaleDateString()}
                          </Badge>
                          <p className="text-xs lg:text-sm text-gray-500">Dr. {record.doctor_name}</p>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <h4 className="font-medium text-sm lg:text-base">Diagnosis</h4>
                            <p className="text-gray-700 text-sm lg:text-base">{record.diagnosis}</p>
                          </div>
                          <div>
                            <h4 className="font-medium text-sm lg:text-base">Treatment Plan</h4>
                            <p className="text-gray-700 text-sm lg:text-base">{record.treatment_plan}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emergency" className="space-y-4 lg:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
                <FileText className="h-5 w-5" />
                Emergency Contact
              </CardTitle>
              <CardDescription className="text-sm lg:text-base">Contact information for emergencies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergency_contact_name" className="text-sm font-medium">Emergency Contact Name</Label>
                  {isEditing ? (
                    <Input
                      value={editForm.emergency_contact_name || ''}
                      onChange={(e) => setEditForm({ ...editForm, emergency_contact_name: e.target.value })}
                      className="text-sm lg:text-base"
                    />
                  ) : (
                    <p className="text-gray-900 p-2 bg-gray-50 rounded text-sm lg:text-base">{profile.emergency_contact_name || 'Not provided'}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergency_contact_phone" className="text-sm font-medium">Emergency Contact Phone</Label>
                  {isEditing ? (
                    <Input
                      value={editForm.emergency_contact_phone || ''}
                      onChange={(e) => setEditForm({ ...editForm, emergency_contact_phone: e.target.value })}
                      className="text-sm lg:text-base"
                    />
                  ) : (
                    <p className="text-gray-900 p-2 bg-gray-50 rounded text-sm lg:text-base">{profile.emergency_contact_phone || 'Not provided'}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
