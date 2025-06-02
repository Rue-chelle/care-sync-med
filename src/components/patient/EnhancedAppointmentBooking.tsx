
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, User, MapPin, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Doctor {
  id: string;
  full_name: string;
  specialization: string;
  consultation_fee: number;
  years_experience: number;
}

export const EnhancedAppointmentBooking = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [form, setForm] = useState({
    doctorId: "",
    date: "",
    time: "",
    reason: "",
    consultationType: "in-person",
    notes: ""
  });
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (form.doctorId && form.date) {
      fetchAvailableSlots();
    }
  }, [form.doctorId, form.date]);

  const fetchDoctors = async () => {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('id, full_name, specialization, consultation_fee, years_experience')
        .order('full_name');

      if (error) throw error;
      setDoctors(data || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const fetchAvailableSlots = async () => {
    // Generate available time slots (9 AM to 5 PM)
    const slots = [];
    for (let hour = 9; hour < 17; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }

    // TODO: Filter out already booked slots by checking existing appointments
    try {
      const { data: existingAppointments } = await supabase
        .from('appointments')
        .select('appointment_time')
        .eq('doctor_id', form.doctorId)
        .eq('appointment_date', form.date)
        .eq('status', 'scheduled');

      const bookedSlots = existingAppointments?.map(apt => apt.appointment_time) || [];
      const availableSlots = slots.filter(slot => !bookedSlots.includes(slot));
      
      setAvailableSlots(availableSlots);
    } catch (error) {
      console.error('Error fetching available slots:', error);
      setAvailableSlots(slots);
    }
  };

  const handleDoctorSelect = (doctorId: string) => {
    const doctor = doctors.find(d => d.id === doctorId);
    setSelectedDoctor(doctor || null);
    setForm({ ...form, doctorId });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "Please log in to book an appointment",
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
          title: "Error",
          description: "Patient profile not found",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('appointments')
        .insert({
          doctor_id: form.doctorId,
          patient_id: patientData.id,
          appointment_date: form.date,
          appointment_time: form.time,
          reason: form.reason,
          consultation_type: form.consultationType,
          notes: form.notes,
          status: 'scheduled'
        });

      if (error) throw error;

      // Create notification for doctor
      const { error: notifError } = await supabase
        .from('notifications')
        .insert({
          user_id: form.doctorId, // This should be doctor's user_id
          title: 'New Appointment Request',
          message: `New appointment booked for ${form.date} at ${form.time}`,
          type: 'info'
        });

      if (notifError) console.error('Error creating notification:', notifError);

      toast({
        title: "Success",
        description: "Appointment booked successfully!",
      });

      // Reset form
      setForm({
        doctorId: "",
        date: "",
        time: "",
        reason: "",
        consultationType: "in-person",
        notes: ""
      });
      setSelectedDoctor(null);

    } catch (error) {
      console.error('Error booking appointment:', error);
      toast({
        title: "Error",
        description: "Failed to book appointment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-slate-800">Book New Appointment</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Doctor Selection */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Select Doctor</CardTitle>
              <CardDescription>Choose a doctor for your appointment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {doctors.map((doctor) => (
                  <Card 
                    key={doctor.id} 
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      selectedDoctor?.id === doctor.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                    }`}
                    onClick={() => handleDoctorSelect(doctor.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="h-12 w-12 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{doctor.full_name}</h3>
                          <p className="text-gray-600 text-sm">{doctor.specialization}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500" />
                              <span className="text-sm">{doctor.years_experience} years exp.</span>
                            </div>
                            <span className="text-sm font-medium text-green-600">
                              ${doctor.consultation_fee}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {selectedDoctor && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Preferred Date *</Label>
                      <Input
                        type="date"
                        value={form.date}
                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="time">Preferred Time *</Label>
                      <Select value={form.time} onValueChange={(value) => setForm({ ...form, time: value })} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time slot" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableSlots.map((slot) => (
                            <SelectItem key={slot} value={slot}>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                {slot}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="consultationType">Consultation Type</Label>
                    <Select value={form.consultationType} onValueChange={(value) => setForm({ ...form, consultationType: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="in-person">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            In-Person
                          </div>
                        </SelectItem>
                        <SelectItem value="virtual">Virtual</SelectItem>
                        <SelectItem value="phone">Phone</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason for Visit *</Label>
                    <Input
                      value={form.reason}
                      onChange={(e) => setForm({ ...form, reason: e.target.value })}
                      placeholder="e.g., Regular checkup, Consultation, Follow-up"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      placeholder="Any additional information or special requests..."
                      rows={3}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full healthcare-gradient text-white hover:opacity-90 transition-opacity"
                    disabled={isLoading}
                  >
                    {isLoading ? "Booking Appointment..." : "Book Appointment"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Appointment Summary */}
        <div>
          {selectedDoctor && (
            <Card>
              <CardHeader>
                <CardTitle>Appointment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium">Doctor</h4>
                  <p className="text-gray-600">{selectedDoctor.full_name}</p>
                  <p className="text-sm text-gray-500">{selectedDoctor.specialization}</p>
                </div>
                
                {form.date && (
                  <div>
                    <h4 className="font-medium">Date</h4>
                    <p className="text-gray-600">{new Date(form.date).toLocaleDateString()}</p>
                  </div>
                )}
                
                {form.time && (
                  <div>
                    <h4 className="font-medium">Time</h4>
                    <p className="text-gray-600">{form.time}</p>
                  </div>
                )}
                
                <div>
                  <h4 className="font-medium">Consultation Fee</h4>
                  <p className="text-green-600 font-semibold">${selectedDoctor.consultation_fee}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
