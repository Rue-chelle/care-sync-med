
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Pill, User, Calendar } from "lucide-react";
import { format } from "date-fns";

interface Prescription {
  id: string;
  medication_name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  created_at: string;
  doctors: {
    full_name: string;
    specialization: string;
  };
}

export const PrescriptionsList = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: patientData } = await supabase
        .from('patients')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!patientData) return;

      const { data, error } = await supabase
        .from('prescriptions')
        .select(`
          id,
          medication_name,
          dosage,
          frequency,
          duration,
          instructions,
          created_at,
          doctors (
            full_name,
            specialization
          )
        `)
        .eq('patient_id', patientData.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching prescriptions:', error);
        return;
      }

      setPrescriptions(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading prescriptions...</div>;
  }

  return (
    <div className="space-y-4">
{/*       <h3 className="text-lg font-semibold">My Prescriptions</h3> */}
      {prescriptions.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">No prescriptions found.</p>
          </CardContent>
        </Card>
      ) : (
        prescriptions.map((prescription) => (
          <Card key={prescription.id}>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Pill className="h-5 w-5 text-blue-600" />
                    <h4 className="font-semibold text-lg">{prescription.medication_name}</h4>
                  </div>
                  <Badge variant="outline">
                    {format(new Date(prescription.created_at), 'MMM dd, yyyy')}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span>Prescribed by {prescription.doctors.full_name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {prescription.doctors.specialization}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <strong>Dosage:</strong> {prescription.dosage}
                  </div>
                  <div>
                    <strong>Frequency:</strong> {prescription.frequency}
                  </div>
                  <div>
                    <strong>Duration:</strong> {prescription.duration}
                  </div>
                </div>

                {prescription.instructions && (
                  <div className="text-sm">
                    <strong>Instructions:</strong> {prescription.instructions}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};
