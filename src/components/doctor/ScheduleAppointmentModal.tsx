import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, User } from "lucide-react";

export const ScheduleAppointmentModal = ({
  onClose,
  onSchedule,
}: {
  onClose: () => void;
  onSchedule: (form: {
    patientName: string;
    date: string;
    time: string;
    reason: string;
  }) => void;
}) => {
  const [form, setForm] = useState({
    patientName: "",
    date: "",
    time: "",
    reason: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSchedule(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            <span className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Schedule Appointment
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm mb-1">Patient Name</label>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" />
                <Input
                  name="patientName"
                  value={form.patientName}
                  onChange={handleChange}
                  required
                  placeholder="Enter patient name"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm mb-1">Date</label>
              <Input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Time</label>
              <Input
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Reason</label>
              <Input
                name="reason"
                value={form.reason}
                onChange={handleChange}
                placeholder="Reason for appointment"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="healthcare-gradient text-white">
                Schedule
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};