
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Clock, Save, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AvailabilitySlot {
  id?: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

const DAYS_OF_WEEK = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

export const AvailabilitySettings = () => {
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
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

      const { data, error } = await supabase
        .from('doctor_availability')
        .select('*')
        .eq('doctor_id', doctorData.id)
        .order('day_of_week');

      if (error) throw error;

      // Initialize availability for all days if none exist
      if (!data || data.length === 0) {
        const defaultAvailability = DAYS_OF_WEEK.map(day => ({
          day_of_week: day.value,
          start_time: "09:00",
          end_time: "17:00",
          is_available: day.value >= 1 && day.value <= 5, // Monday to Friday
        }));
        setAvailability(defaultAvailability);
      } else {
        setAvailability(data);
      }
    } catch (error) {
      console.error('Error fetching availability:', error);
      toast({
        title: "Error",
        description: "Failed to fetch availability settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateAvailability = (dayOfWeek: number, field: keyof AvailabilitySlot, value: any) => {
    setAvailability(prev => 
      prev.map(slot => 
        slot.day_of_week === dayOfWeek 
          ? { ...slot, [field]: value }
          : slot
      )
    );
  };

  const saveAvailability = async () => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: doctorData } = await supabase
        .from('doctors')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!doctorData) return;

      // Delete existing availability
      await supabase
        .from('doctor_availability')
        .delete()
        .eq('doctor_id', doctorData.id);

      // Insert new availability
      const availabilityToInsert = availability.map(slot => ({
        doctor_id: doctorData.id,
        day_of_week: slot.day_of_week,
        start_time: slot.start_time,
        end_time: slot.end_time,
        is_available: slot.is_available,
      }));

      const { error } = await supabase
        .from('doctor_availability')
        .insert(availabilityToInsert);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Availability settings saved successfully",
      });

      fetchAvailability(); // Refresh to get IDs
    } catch (error) {
      console.error('Error saving availability:', error);
      toast({
        title: "Error",
        description: "Failed to save availability settings",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div>Loading availability settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-slate-800">Availability Settings</h2>
        <Button 
          className="healthcare-gradient text-white"
          onClick={saveAvailability}
          disabled={isSaving}
        >
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Weekly Schedule
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {DAYS_OF_WEEK.map((day) => {
            const dayAvailability = availability.find(slot => slot.day_of_week === day.value) || {
              day_of_week: day.value,
              start_time: "09:00",
              end_time: "17:00",
              is_available: false,
            };

            return (
              <div key={day.value} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-24">
                    <Label className="font-medium">{day.label}</Label>
                  </div>
                  <Switch
                    checked={dayAvailability.is_available}
                    onCheckedChange={(checked) => 
                      updateAvailability(day.value, 'is_available', checked)
                    }
                  />
                </div>

                {dayAvailability.is_available && (
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <Label htmlFor={`start-${day.value}`} className="text-sm">From:</Label>
                      <Input
                        id={`start-${day.value}`}
                        type="time"
                        value={dayAvailability.start_time}
                        onChange={(e) => 
                          updateAvailability(day.value, 'start_time', e.target.value)
                        }
                        className="w-32"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor={`end-${day.value}`} className="text-sm">To:</Label>
                      <Input
                        id={`end-${day.value}`}
                        type="time"
                        value={dayAvailability.end_time}
                        onChange={(e) => 
                          updateAvailability(day.value, 'end_time', e.target.value)
                        }
                        className="w-32"
                      />
                    </div>
                  </div>
                )}

                {!dayAvailability.is_available && (
                  <div className="text-gray-500 italic">
                    Not available
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline"
              onClick={() => {
                const weekdayAvailability = availability.map(slot => ({
                  ...slot,
                  is_available: slot.day_of_week >= 1 && slot.day_of_week <= 5,
                  start_time: "09:00",
                  end_time: "17:00",
                }));
                setAvailability(weekdayAvailability);
              }}
            >
              Set Weekdays Only
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                const allDaysAvailability = availability.map(slot => ({
                  ...slot,
                  is_available: true,
                  start_time: "09:00",
                  end_time: "17:00",
                }));
                setAvailability(allDaysAvailability);
              }}
            >
              Set All Days Available
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                const noAvailability = availability.map(slot => ({
                  ...slot,
                  is_available: false,
                }));
                setAvailability(noAvailability);
              }}
            >
              Clear All Availability
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
