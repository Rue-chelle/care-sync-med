
import { Dispatch, SetStateAction, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";

type AddStaffUserDialogProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  onAdd: (data: { fullName: string; email: string; role: "doctor" | "admin"; phone: string; department: string }) => void;
};

export const AddStaffUserDialog = ({ open, setOpen, onAdd }: AddStaffUserDialogProps) => {
  const { toast } = useToast();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    role: "doctor" as "doctor" | "admin",
    phone: "",
    department: "",
  });

  function handleSubmit() {
    if (!form.fullName || !form.email) {
      toast({
        title: "Missing required fields",
        description: "Name and email are required.",
        variant: "destructive",
      });
      return;
    }
    onAdd(form);
    setForm({ fullName: "", email: "", role: "doctor", phone: "", department: "" });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Staff User</DialogTitle>
          <DialogDescription>
            Only Doctors and Admins can be created by Admins. Patients should use the public registration.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={form.fullName}
              onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
              placeholder="Enter full name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="Enter email address"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              placeholder="Enter phone number"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={form.role}
              onValueChange={v => setForm(f => ({ ...f, role: v as "doctor" | "admin" }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="doctor">Doctor</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              value={form.department}
              onChange={e => setForm(f => ({ ...f, department: e.target.value }))}
              placeholder="Enter department"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button className="healthcare-gradient text-white" onClick={handleSubmit}>Add Staff User</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
