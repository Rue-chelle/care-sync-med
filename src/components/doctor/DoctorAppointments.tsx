
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, User, Phone, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Appointment {
  id: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  reason: string;
  consultation_type: string;
  notes: string;
  patients: {
    full_name: string;
    phone: string;
    address: string;
    date_of_birth: string;
  };
}

export const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [appointments, statusFilter, dateFilter, searchFilter]);

  const fetchAppointments = async () => {
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
        .from('appointments')
        .select(`
          id,
          appointment_date,
          appointment_time,
          status,
          reason,
          consultation_type,
          notes,
          patients (
            full_name,
            phone,
            address,
            date_of_birth
          )
        `)
        .eq('doctor_id', doctorData.id)
        .order('appointment_date', { ascending: true })
        .order('appointment_time', { ascending: true });

      if (error) {
        console.error('Error fetching appointments:', error);
        toast({
          title: "Error",
          description: "Failed to fetch appointments",
          variant: "destructive",
        });
        return;
      }

      setAppointments(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAppointments = () => {
    let filtered = appointments;

    if (statusFilter !== "all") {
      filtered = filtered.filter(apt => apt.status === statusFilter);
    }

    if (dateFilter) {
      filtered = filtered.filter(apt => apt.appointment_date === dateFilter);
    }

    if (searchFilter) {
      filtered = filtered.filter(apt => 
        apt.patients.full_name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        apt.reason?.toLowerCase().includes(searchFilter.toLowerCase())
      );
    }

    setFilteredAppointments(filtered);
  };

  const updateAppointmentStatus = async (appointmentId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', appointmentId);

      if (error) {
        console.error('Error updating appointment:', error);
        toast({
          title: "Error",
          description: "Failed to update appointment status",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: `Appointment marked as ${newStatus}`,
      });

      fetchAppointments();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'no_show': return 'bg-gray-100 text-gray-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (isLoading) {
    return <div>Loading appointments...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-slate-800">Appointment Management</h2>
        <Button className="healthcare-gradient text-white">
          <Calendar className="h-4 w-4 mr-2" />
          Schedule New
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="no_show">No Show</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              placeholder="Filter by date"
            />

            <Input
              placeholder="Search by patient name or reason"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
            />

            <Button 
              variant="outline" 
              onClick={() => {
                setStatusFilter("all");
                setDateFilter("");
                setSearchFilter("");
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-gray-500">No appointments found matching your criteria.</p>
            </CardContent>
          </Card>
        ) : (
          filteredAppointments.map((appointment) => (
            <Card key={appointment.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-blue-600" />
                        <h3 className="font-semibold text-lg">{appointment.patients.full_name}</h3>
                      </div>
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>{format(new Date(appointment.appointment_date), 'MMM dd, yyyy')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>{appointment.appointment_time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span>{appointment.patients.phone || 'No phone'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>{appointment.consultation_type || 'In-person'}</span>
                      </div>
                    </div>

                    {appointment.reason && (
                      <div>
                        <strong>Reason:</strong> {appointment.reason}
                      </div>
                    )}

                    {appointment.notes && (
                      <div>
                        <strong>Notes:</strong> {appointment.notes}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    {appointment.status === 'scheduled' && (
                      <>
                        <Button 
                          size="sm" 
                          className="healthcare-gradient text-white"
                          onClick={() => updateAppointmentStatus(appointment.id, 'in_progress')}
                        >
                          Start
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                        >
                          Complete
                        </Button>
                      </>
                    )}
                    
                    {appointment.status === 'in_progress' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                      >
                        Complete
                      </Button>
                    )}

                    {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                      <>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                        >
                          Cancel
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateAppointmentStatus(appointment.id, 'no_show')}
                        >
                          No Show
                        </Button>
                      </>
                    )}
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
