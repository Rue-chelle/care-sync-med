
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Clock, User } from "lucide-react";
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
  const { toast } = useToast();
  const { user } = useUserStore();

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      console.log('Fetching doctors from database...');
      const { data, error } = await supabase
        .from('doctors')
        .select('id, full_name, specialization, consultation_fee')
        .order('full_name');

      console.log('Doctors query result:', { data, error });

      if (error) {
        console.error('Error fetching doctors:', error);
        // Create mock doctors if database query fails
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
          }
        ];
        
        console.log('Using mock doctors:', mockDoctors);
        setDoctors(mockDoctors);
        
        toast({
          title: "Notice",
          description: "Using sample doctors for demo purposes.",
        });
        return;
      }

      console.log('Successfully fetched doctors:', data?.length || 0);
      setDoctors(data || []);
      
      if (!data || data.length === 0) {
        toast({
          title: "No doctors available",
          description: "Please contact support to add doctors to the system.",
        });
      }
    } catch (error) {
      console.error('Unexpected error fetching doctors:', error);
      toast({
        title: "Error",
        description: "Failed to load doctors. Please refresh the page.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Starting appointment booking process...');
      console.log('Current user:', user);

      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to book an appointment.",
          variant: "destructive",
        });
        return;
      }

      // For mock users (demo mode), simulate successful booking
      if (user.id.startsWith('mock-')) {
        console.log('Mock user detected, simulating appointment booking...');
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        toast({
          title: "Appointment booked successfully (Demo Mode)",
          description: `Your appointment with ${doctors.find(d => d.id === selectedDoctor)?.full_name || 'the doctor'} has been scheduled for ${appointmentDate} at ${appointmentTime}.`,
        });

        // Reset form
        setSelectedDoctor("");
        setAppointmentDate("");
        setAppointmentTime("");
        setReason("");
        setConsultationType("in-person");
        return;
      }

      // For real users, proceed with database operations
      console.log('Real user detected, proceeding with database operations...');

      // Get current user's session
      const { data: { user: authUser }, error: userError } = await supabase.auth.getUser();
      if (userError || !authUser) {
        console.error('Auth error:', userError);
        toast({
          title: "Authentication required",
          description: "Please log in to book an appointment.",
          variant: "destructive",
        });
        return;
      }

      console.log('Authenticated user:', authUser.id);

      // Get patient record
      const { data: patientData, error: patientError } = await supabase
        .from('patients')
        .select('id')
        .eq('user_id', authUser.id)
        .maybeSingle();

      console.log('Patient lookup result:', { patientData, patientError });

      if (patientError) {
        console.error('Patient lookup error:', patientError);
        toast({
          title: "Database Error",
          description: "Failed to find your patient profile. Please contact support.",
          variant: "destructive",
        });
        return;
      }

      if (!patientData) {
        console.log('No patient profile found, creating one...');
        
        // Create patient profile if it doesn't exist
        const { data: newPatient, error: createError } = await supabase
          .from('patients')
          .insert({
            user_id: authUser.id,
            full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Patient',
          })
          .select('id')
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
        patientData.id = newPatient.id;
      }

      console.log('Using patient ID:', patientData.id);

      // Check for appointment conflicts (only for real doctors)
      if (!selectedDoctor.startsWith('mock-')) {
        const { data: existingAppointments, error: conflictError } = await supabase
          .from('appointments')
          .select('id')
          .eq('doctor_id', selectedDoctor)
          .eq('appointment_date', appointmentDate)
          .eq('appointment_time', appointmentTime)
          .eq('status', 'scheduled');

        if (conflictError) {
          console.error('Conflict check error:', conflictError);
        }

        if (existingAppointments && existingAppointments.length > 0) {
          toast({
            title: "Time slot unavailable",
            description: "This time slot is already booked. Please choose another time.",
            variant: "destructive",
          });
          return;
        }
      }

      console.log('No conflicts found, creating appointment...');

      // Create the appointment
      const appointmentData = {
        patient_id: patientData.id,
        doctor_id: selectedDoctor,
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
        reason: reason || null,
        consultation_type: consultationType,
        status: 'scheduled',
        notes: null
      };

      console.log('Appointment data:', appointmentData);

      const { data: newAppointment, error: insertError } = await supabase
        .from('appointments')
        .insert(appointmentData)
        .select()
        .single();

      if (insertError) {
        console.error('Appointment creation error:', insertError);
        toast({
          title: "Booking failed",
          description: insertError.message || "Failed to book appointment. Please try again.",
          variant: "destructive",
        });
        return;
      }

      console.log('Appointment created successfully:', newAppointment);

      // Try to create a notification for the doctor (non-critical)
      try {
        if (!selectedDoctor.startsWith('mock-')) {
          const { data: doctorData } = await supabase
            .from('doctors')
            .select('user_id, full_name')
            .eq('id', selectedDoctor)
            .maybeSingle();

          if (doctorData?.user_id) {
            await supabase
              .from('notifications')
              .insert({
                user_id: doctorData.user_id,
                title: 'New Appointment Request',
                message: `New appointment booked for ${appointmentDate} at ${appointmentTime}`,
                type: 'info'
              });
            
            console.log('Doctor notification created');
          }
        }
      } catch (notifError) {
        console.log('Notification creation failed (non-critical):', notifError);
      }

      toast({
        title: "Appointment booked successfully",
        description: `Your appointment has been scheduled for ${appointmentDate} at ${appointmentTime}.`,
      });

      // Reset form
      setSelectedDoctor("");
      setAppointmentDate("");
      setAppointmentTime("");
      setReason("");
      setConsultationType("in-person");

    } catch (error) {
      console.error('Unexpected error during booking:', error);
      toast({
        title: "Booking failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="mr-2 h-5 w-5 text-blue-600" />
          Book New Appointment
        </CardTitle>
        <CardDescription>Schedule an appointment with one of our doctors</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="doctor">Select Doctor</Label>
            <Select value={selectedDoctor} onValueChange={setSelectedDoctor} required>
              <SelectTrigger>
                <SelectValue placeholder="Choose a doctor" />
              </SelectTrigger>
              <SelectContent>
                {doctors.length === 0 ? (
                  <SelectItem value="none" disabled>Loading doctors...</SelectItem>
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
              <Label htmlFor="date">Appointment Date</Label>
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
              <Label htmlFor="time">Appointment Time</Label>
              <Input
                id="time"
                type="time"
                value={appointmentTime}
                onChange={(e) => setAppointmentTime(e.target.value)}
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
            <Label htmlFor="reason">Reason for Visit</Label>
            <Textarea
              id="reason"
              placeholder="Briefly describe your symptoms or reason for the visit"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full healthcare-gradient text-white hover:opacity-90 transition-opacity"
            disabled={isLoading || doctors.length === 0}
          >
            {isLoading ? "Booking..." : "Book Appointment"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
