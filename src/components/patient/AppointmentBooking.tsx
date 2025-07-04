
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Clock, User, AlertCircle } from "lucide-react";
import { useUserStore } from "@/stores/userStore";

interface Doctor {
  id: string;
  full_name: string;
  specialization: string;
  consultation_fee: number;
}

export const AppointmentBooking = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [reason, setReason] = useState("");
  const [consultationType, setConsultationType] = useState("in-person");
  const [isLoading, setIsLoading] = useState(false);
  const [isDoctorsLoading, setIsDoctorsLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const { toast } = useToast();
  const { user } = useUserStore();

  useEffect(() => {
    testDatabaseConnection();
    fetchDoctors();
  }, []);

  const testDatabaseConnection = async () => {
    try {
      console.log('Testing database connection...');
      const { data, error } = await supabase.from('patients').select('count').limit(1);
      
      if (error) {
        console.error('Database connection test failed:', error);
        setConnectionStatus('error');
      } else {
        console.log('Database connection successful');
        setConnectionStatus('connected');
      }
    } catch (error) {
      console.error('Database connection error:', error);
      setConnectionStatus('error');
    }
  };

  const fetchDoctors = async () => {
    setIsDoctorsLoading(true);
    try {
      console.log('Fetching doctors from database...');
      const { data, error } = await supabase
        .from('doctors')
        .select('id, full_name, specialization, consultation_fee')
        .order('full_name');

      console.log('Doctors query result:', { data, error });

      if (error) {
        console.error('Error fetching doctors:', error);
        
        // Create realistic mock doctors for demo/testing
        const mockDoctors = [
          {
            id: 'mock-doctor-1',
            full_name: 'Dr. Sarah Wilson',
            specialization: 'General Medicine',
            consultation_fee: 150
          },
          {
            id: 'mock-doctor-2',
            full_name: 'Dr. Michael Chen',
            specialization: 'Cardiology',
            consultation_fee: 200
          },
          {
            id: 'mock-doctor-3',
            full_name: 'Dr. Emily Rodriguez',
            specialization: 'Pediatrics',
            consultation_fee: 175
          },
          {
            id: 'mock-doctor-4',
            full_name: 'Dr. James Thompson',
            specialization: 'Orthopedics',
            consultation_fee: 180
          }
        ];
        
        console.log('Using mock doctors for demo:', mockDoctors);
        setDoctors(mockDoctors);
        
        if (connectionStatus === 'connected') {
          toast({
            title: "Demo Mode",
            description: "No doctors found in database. Using sample data for testing.",
          });
        }
        return;
      }

      console.log('Successfully fetched doctors:', data?.length || 0);
      setDoctors(data || []);
      
      if (!data || data.length === 0) {
        // If no doctors in database, provide mock data
        const mockDoctors = [
          {
            id: 'mock-doctor-1',
            full_name: 'Dr. Sarah Wilson',
            specialization: 'General Medicine',
            consultation_fee: 150
          },
          {
            id: 'mock-doctor-2',
            full_name: 'Dr. Michael Chen',
            specialization: 'Cardiology',
            consultation_fee: 200
          }
        ];
        
        setDoctors(mockDoctors);
        toast({
          title: "Demo Mode",
          description: "No doctors found in database. Using sample data.",
        });
      }
    } catch (error) {
      console.error('Unexpected error fetching doctors:', error);
      toast({
        title: "Connection Error",
        description: "Unable to connect to database. Using demo data.",
        variant: "destructive",
      });
      
      // Fallback to mock data
      setDoctors([
        {
          id: 'mock-doctor-1',
          full_name: 'Dr. Sarah Wilson',
          specialization: 'General Medicine',
          consultation_fee: 150
        }
      ]);
    } finally {
      setIsDoctorsLoading(false);
    }
  };

  const validateForm = () => {
    if (!selectedDoctor) {
      toast({
        title: "Validation Error",
        description: "Please select a doctor.",
        variant: "destructive",
      });
      return false;
    }

    if (!appointmentDate) {
      toast({
        title: "Validation Error", 
        description: "Please select an appointment date.",
        variant: "destructive",
      });
      return false;
    }

    if (!appointmentTime) {
      toast({
        title: "Validation Error",
        description: "Please select an appointment time.",
        variant: "destructive",
      });
      return false;
    }

    if (!reason.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide a reason for your visit.",
        variant: "destructive",
      });
      return false;
    }

    // Check if appointment is in the past
    const appointmentDateTime = new Date(`${appointmentDate}T${appointmentTime}`);
    if (appointmentDateTime <= new Date()) {
      toast({
        title: "Validation Error",
        description: "Please select a future date and time.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      console.log('Starting appointment booking process...');
      console.log('Current user:', user);
      console.log('Connection status:', connectionStatus);

      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to book an appointment.",
          variant: "destructive",
        });
        return;
      }

      // Handle mock users (demo mode)
      if (user.id.startsWith('mock-') || connectionStatus === 'error') {
        console.log('Mock user or connection error detected, simulating appointment booking...');
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const selectedDoctorInfo = doctors.find(d => d.id === selectedDoctor);
        
        toast({
          title: "Appointment Booked Successfully! (Demo Mode)",
          description: `Your appointment with ${selectedDoctorInfo?.full_name || 'the doctor'} has been scheduled for ${appointmentDate} at ${appointmentTime}.`,
        });

        // Reset form
        resetForm();
        return;
      }

      // For real users with database connection, proceed with real operations
      console.log('Real user with database connection, proceeding with database operations...');

      // Get current user's session for verification
      const { data: { user: authUser }, error: userError } = await supabase.auth.getUser();
      if (userError || !authUser) {
        console.error('Auth error:', userError);
        toast({
          title: "Authentication Error",
          description: "Please log in again to book an appointment.",
          variant: "destructive",
        });
        return;
      }

      console.log('Authenticated user verified:', authUser.id);

      // Get or create patient record
      let patientId: string;
      
      console.log('Looking up patient profile...');
      const { data: patientData, error: patientError } = await supabase
        .from('patients')
        .select('id, full_name')
        .eq('user_id', authUser.id)
        .maybeSingle();

      console.log('Patient lookup result:', { patientData, patientError });

      if (patientError && patientError.code !== 'PGRST116') {
        console.error('Patient lookup error:', patientError);
        toast({
          title: "Database Error",
          description: "Failed to access your patient profile. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (!patientData) {
        console.log('No patient profile found, creating one...');
        
        try {
          const { data: newPatient, error: createError } = await supabase
            .from('patients')
            .insert({
              user_id: authUser.id,
              full_name: user.fullName || authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Patient',
            })
            .select('id, full_name')
            .single();

          if (createError) {
            console.error('Failed to create patient profile:', createError);
            toast({
              title: "Setup Error",
              description: "Failed to set up your patient profile. Please contact support.",
              variant: "destructive",
            });
            return;
          }

          console.log('Created new patient profile:', newPatient);
          patientId = newPatient.id;
        } catch (error) {
          console.error('Error creating patient profile:', error);
          toast({
            title: "Setup Error",
            description: "Failed to create your patient profile. Please try again.",
            variant: "destructive",
          });
          return;
        }
      } else {
        patientId = patientData.id;
        console.log('Using existing patient ID:', patientId);
      }

      // Check for appointment conflicts (only for real doctors)
      if (!selectedDoctor.startsWith('mock-')) {
        console.log('Checking for appointment conflicts...');
        const { data: existingAppointments, error: conflictError } = await supabase
          .from('appointments')
          .select('id')
          .eq('doctor_id', selectedDoctor)
          .eq('appointment_date', appointmentDate)
          .eq('appointment_time', appointmentTime)
          .in('status', ['scheduled', 'confirmed']);

        if (conflictError) {
          console.error('Conflict check error:', conflictError);
          // Continue anyway, as this is not critical
        }

        if (existingAppointments && existingAppointments.length > 0) {
          toast({
            title: "Time Slot Unavailable",
            description: "This time slot is already booked. Please choose another time.",
            variant: "destructive",
          });
          return;
        }
      }

      console.log('No conflicts found, creating appointment...');

      // Create the appointment
      const appointmentData = {
        patient_id: patientId,
        doctor_id: selectedDoctor,
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
        reason: reason.trim(),
        consultation_type: consultationType,
        status: 'scheduled',
        notes: null
      };

      console.log('Inserting appointment data:', appointmentData);

      const { data: newAppointment, error: insertError } = await supabase
        .from('appointments')
        .insert(appointmentData)
        .select('*')
        .single();

      if (insertError) {
        console.error('Appointment creation error:', insertError);
        toast({
          title: "Booking Failed",
          description: insertError.message || "Failed to book appointment. Please try again.",
          variant: "destructive",
        });
        return;
      }

      console.log('Appointment created successfully:', newAppointment);

      // Try to create a notification (non-critical)
      try {
        await supabase.from('notifications').insert({
          user_id: authUser.id,
          title: 'Appointment Booked',
          message: `Your appointment has been scheduled for ${appointmentDate} at ${appointmentTime}`,
          type: 'success'
        });
        console.log('User notification created');
      } catch (notifError) {
        console.log('Notification creation failed (non-critical):', notifError);
      }

      const selectedDoctorInfo = doctors.find(d => d.id === selectedDoctor);
      
      toast({
        title: "Appointment Booked Successfully!",
        description: `Your appointment with ${selectedDoctorInfo?.full_name || 'the doctor'} has been scheduled for ${appointmentDate} at ${appointmentTime}.`,
      });

      // Reset form
      resetForm();

    } catch (error) {
      console.error('Unexpected error during booking:', error);
      toast({
        title: "Booking Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedDoctor("");
    setAppointmentDate("");
    setAppointmentTime("");
    setReason("");
    setConsultationType("in-person");
  };

  const today = new Date().toISOString().split('T')[0];
  const currentTime = new Date().toTimeString().slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="mr-2 h-5 w-5 text-blue-600" />
          Book New Appointment
          {connectionStatus === 'error' && (
            <div className="ml-2 flex items-center text-amber-500" role="img" aria-label="Database connection issue - using demo mode">
              <AlertCircle className="h-4 w-4" />
            </div>
          )}
        </CardTitle>
        <CardDescription>
          Schedule an appointment with one of our doctors
          {connectionStatus === 'error' && (
            <span className="block text-amber-600 text-sm mt-1">
              Note: Database connection issue detected. Appointments will be simulated.
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="doctor">Select Doctor *</Label>
            <Select value={selectedDoctor} onValueChange={setSelectedDoctor} required disabled={isDoctorsLoading}>
              <SelectTrigger>
                <SelectValue placeholder={isDoctorsLoading ? "Loading doctors..." : "Choose a doctor"} />
              </SelectTrigger>
              <SelectContent>
                {isDoctorsLoading ? (
                  <SelectItem value="loading" disabled>Loading doctors...</SelectItem>
                ) : doctors.length === 0 ? (
                  <SelectItem value="none" disabled>No doctors available</SelectItem>
                ) : (
                  doctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{doctor.full_name}</span>
                        <span className="text-sm text-gray-500 ml-2">
                          {doctor.specialization} - ${doctor.consultation_fee}
                        </span>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Appointment Date *</Label>
              <Input
                id="date"
                type="date"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                min={today}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Appointment Time *</Label>
              <Input
                id="time"
                type="time"
                value={appointmentTime}
                onChange={(e) => setAppointmentTime(e.target.value)}
                min={appointmentDate === today ? currentTime : undefined}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="consultationType">Consultation Type</Label>
            <Select value={consultationType} onValueChange={setConsultationType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in-person">In-Person</SelectItem>
                <SelectItem value="teleconsultation">Teleconsultation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Visit *</Label>
            <Textarea
              id="reason"
              placeholder="Please describe your symptoms or reason for the visit"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full healthcare-gradient text-white hover:opacity-90 transition-opacity"
            disabled={isLoading || isDoctorsLoading}
          >
            {isLoading ? "Booking Appointment..." : "Book Appointment"}
          </Button>
          
          {!user && (
            <p className="text-sm text-gray-600 text-center">
              Please log in to book an appointment
            </p>
          )}

          {connectionStatus === 'error' && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                <AlertCircle className="inline h-4 w-4 mr-1" />
                Database connectivity issues detected. Appointments will be simulated for testing purposes.
              </p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};
