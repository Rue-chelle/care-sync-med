
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User, Phone, Calendar, MapPin, Edit, Save, X, Shield, Heart } from "lucide-react";

interface PatientData {
  id: string;
  full_name: string;
  phone: string;
  date_of_birth: string;
  gender: string;
  address: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
}

export const PatientProfile = () => {
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [originalData, setOriginalData] = useState<PatientData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPatientData();
  }, []);

  const fetchPatientData = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching patient data:', error);
        toast({
          title: "Error loading profile",
          description: "Failed to load your profile information.",
          variant: "destructive",
        });
        return;
      }

      setPatientData(data);
      setOriginalData(data);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Something went wrong while loading your profile.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientData) return;

    // Validation
    if (!patientData.full_name.trim()) {
      toast({
        title: "Validation error",
        description: "Full name is required.",
        variant: "destructive",
      });
      return;
    }

    if (patientData.phone && !/^\+?[\d\s\-\(\)]+$/.test(patientData.phone)) {
      toast({
        title: "Validation error",
        description: "Please enter a valid phone number.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('patients')
        .update({
          full_name: patientData.full_name.trim(),
          phone: patientData.phone?.trim() || null,
          date_of_birth: patientData.date_of_birth || null,
          gender: patientData.gender || null,
          address: patientData.address?.trim() || null,
          emergency_contact_name: patientData.emergency_contact_name?.trim() || null,
          emergency_contact_phone: patientData.emergency_contact_phone?.trim() || null,
        })
        .eq('id', patientData.id);

      if (error) {
        toast({
          title: "Update failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setOriginalData(patientData);
      toast({
        title: "Profile updated successfully",
        description: "Your profile information has been saved.",
      });

      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (originalData) {
      setPatientData(originalData);
    }
    setIsEditing(false);
  };

  const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getCompletionPercentage = () => {
    if (!patientData) return 0;
    const fields = [
      patientData.full_name,
      patientData.phone,
      patientData.date_of_birth,
      patientData.gender,
      patientData.address,
      patientData.emergency_contact_name,
      patientData.emergency_contact_phone,
    ];
    const completedFields = fields.filter(field => field && field.trim()).length;
    return Math.round((completedFields / fields.length) * 100);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!patientData) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No profile data found</p>
          <Button onClick={fetchPatientData} className="mt-4">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  const completionPercentage = getCompletionPercentage();
  const age = calculateAge(patientData.date_of_birth);

  return (
    <div className="space-y-6">
      {/* Profile Completion Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-teal-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-blue-900">Profile Completion</h3>
              <p className="text-blue-700">Complete your profile to get the best experience</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-900">{completionPercentage}%</div>
              <div className="w-24 bg-blue-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Profile Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">Personal Information</CardTitle>
                <CardDescription>Manage your personal details and contact information</CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {!isEditing ? (
                <Button 
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleCancel}
                    disabled={isSubmitting}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSubmit} 
                    disabled={isSubmitting}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information Section */}
            <div>
              <h4 className="text-lg font-medium mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Basic Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-medium">
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    value={patientData.full_name}
                    onChange={(e) => setPatientData({...patientData, full_name: e.target.value})}
                    disabled={!isEditing}
                    required
                    className={isEditing ? "border-blue-300 focus:border-blue-500" : "bg-gray-50"}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    <Phone className="h-4 w-4 inline mr-1" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={patientData.phone || ''}
                    onChange={(e) => setPatientData({...patientData, phone: e.target.value})}
                    disabled={!isEditing}
                    className={isEditing ? "border-blue-300 focus:border-blue-500" : "bg-gray-50"}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth" className="text-sm font-medium">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    Date of Birth
                  </Label>
                  <div className="relative">
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={patientData.date_of_birth || ''}
                      onChange={(e) => setPatientData({...patientData, date_of_birth: e.target.value})}
                      disabled={!isEditing}
                      className={isEditing ? "border-blue-300 focus:border-blue-500" : "bg-gray-50"}
                    />
                    {age && (
                      <Badge variant="outline" className="absolute -top-2 -right-2 bg-blue-50 text-blue-700">
                        {age} years old
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-sm font-medium">Gender</Label>
                  <Select 
                    value={patientData.gender || ''} 
                    onValueChange={(value) => setPatientData({...patientData, gender: value})}
                    disabled={!isEditing}
                  >
                    <SelectTrigger className={isEditing ? "border-blue-300 focus:border-blue-500" : "bg-gray-50"}>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <Label htmlFor="address" className="text-sm font-medium">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  Address
                </Label>
                <Textarea
                  id="address"
                  value={patientData.address || ''}
                  onChange={(e) => setPatientData({...patientData, address: e.target.value})}
                  disabled={!isEditing}
                  rows={3}
                  className={isEditing ? "border-blue-300 focus:border-blue-500" : "bg-gray-50"}
                  placeholder="Enter your full address"
                />
              </div>
            </div>

            <Separator />

            {/* Emergency Contact Section */}
            <div>
              <h4 className="text-lg font-medium mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-red-600" />
                Emergency Contact
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="emergencyName" className="text-sm font-medium">Emergency Contact Name</Label>
                  <Input
                    id="emergencyName"
                    value={patientData.emergency_contact_name || ''}
                    onChange={(e) => setPatientData({...patientData, emergency_contact_name: e.target.value})}
                    disabled={!isEditing}
                    className={isEditing ? "border-blue-300 focus:border-blue-500" : "bg-gray-50"}
                    placeholder="Contact person's full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyPhone" className="text-sm font-medium">Emergency Contact Phone</Label>
                  <Input
                    id="emergencyPhone"
                    type="tel"
                    value={patientData.emergency_contact_phone || ''}
                    onChange={(e) => setPatientData({...patientData, emergency_contact_phone: e.target.value})}
                    disabled={!isEditing}
                    className={isEditing ? "border-blue-300 focus:border-blue-500" : "bg-gray-50"}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
            </div>

            {/* Hidden submit button for form submission */}
            {isEditing && (
              <button type="submit" className="hidden" />
            )}
          </form>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 text-center">
            <Heart className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-green-700 font-medium">Profile Health</p>
            <p className="text-2xl font-bold text-green-900">{completionPercentage}%</p>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-blue-700 font-medium">Age</p>
            <p className="text-2xl font-bold text-blue-900">{age || 'N/A'}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4 text-center">
            <Shield className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-sm text-purple-700 font-medium">Emergency Contact</p>
            <p className="text-lg font-bold text-purple-900">
              {patientData.emergency_contact_name ? 'Set' : 'Not Set'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
