
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

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    const { data, error } = await supabase
      .from('doctors')
      .select('id, full_name, specialization, consultation_fee')
      .order('full_name');

    if (error) {
      console.error('Error fetching doctors:', error);
      return;
    }

    setDoctors(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Get current user's patient record
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to book an appointment.",
          variant: "destructive",
        });
        return;
      }

      const { data: patientData } = await supabase
        .from('patients')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!patientData) {
        toast({
          title: "Patient profile not found",
          description: "Please complete your profile first.",
          variant: "destructive",
        });
        return;
      }

      // Check for conflicts
      const { data: existingAppointment } = await supabase
        .from('appointments')
        .select('id')
        .eq('doctor_id', selectedDoctor)
        .eq('appointment_date', appointmentDate)
        .eq('appointment_time', appointmentTime)
        .single();

      if (existingAppointment) {
        toast({
          title: "Time slot unavailable",
          description: "This time slot is already booked. Please choose another time.",
          variant: "destructive",
        });
        return;
      }

      // Create appointment
      const { error } = await supabase
        .from('appointments')
        .insert({
          patient_id: patientData.id,
          doctor_id: selectedDoctor,
          appointment_date: appointmentDate,
          appointment_time: appointmentTime,
          reason,
          consultation_type: consultationType,
        });

      if (error) {
        toast({
          title: "Booking failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Appointment booked successfully",
        description: "You will receive a confirmation notification.",
      });

      // Reset form
      setSelectedDoctor("");
      setAppointmentDate("");
      setAppointmentTime("");
      setReason("");
      setConsultationType("in-person");

    } catch (error) {
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
                {doctors.map((doctor) => (
                  <SelectItem key={doctor.id} value={doctor.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{doctor.full_name}</span>
                      <span className="text-sm text-gray-500 ml-2">
                        {doctor.specialization} - ${doctor.consultation_fee}
                      </span>
                    </div>
                  </SelectItem>
                ))}
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
            disabled={isLoading}
          >
            {isLoading ? "Booking..." : "Book Appointment"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
