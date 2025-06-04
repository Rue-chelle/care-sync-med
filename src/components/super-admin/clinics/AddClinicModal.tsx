
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface AddClinicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (clinic: any) => void;
}

export const AddClinicModal = ({ isOpen, onClose, onSave }: AddClinicModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    subscription: "basic",
    adminName: "",
    adminEmail: "",
    adminPhone: ""
  });

  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.adminName || !formData.adminEmail) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const newClinic = {
      id: String(Date.now()),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      location: formData.location,
      subscription: formData.subscription,
      status: "trial",
      doctors: 0,
      patients: 0,
      appointments: 0,
      createdAt: new Date().toISOString().split('T')[0],
      lastActive: "Just created",
      adminDetails: {
        name: formData.adminName,
        email: formData.adminEmail,
        phone: formData.adminPhone
      }
    };

    onSave(newClinic);
    
    toast({
      title: "Clinic Added",
      description: `${formData.name} has been successfully registered`,
    });

    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      location: "",
      subscription: "basic",
      adminName: "",
      adminEmail: "",
      adminPhone: ""
    });

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Clinic</DialogTitle>
          <DialogDescription>
            Register a new clinic on the platform
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-gray-700">Clinic Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clinicName">Clinic Name *</Label>
                <Input
                  id="clinicName"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter clinic name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clinicEmail">Clinic Email *</Label>
                <Input
                  id="clinicEmail"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="clinic@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clinicPhone">Phone Number</Label>
                <Input
                  id="clinicPhone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+234 123 456 7890"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clinicLocation">Location</Label>
                <Input
                  id="clinicLocation"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder="City, Country"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subscription">Subscription Plan</Label>
                <Select
                  value={formData.subscription}
                  onValueChange={(value) => handleInputChange("subscription", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-4 border-t pt-4">
            <h4 className="font-medium text-sm text-gray-700">Admin User Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="adminName">Admin Full Name *</Label>
                <Input
                  id="adminName"
                  value={formData.adminName}
                  onChange={(e) => handleInputChange("adminName", e.target.value)}
                  placeholder="Enter admin name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adminEmail">Admin Email *</Label>
                <Input
                  id="adminEmail"
                  type="email"
                  value={formData.adminEmail}
                  onChange={(e) => handleInputChange("adminEmail", e.target.value)}
                  placeholder="admin@clinic.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adminPhone">Admin Phone</Label>
                <Input
                  id="adminPhone"
                  value={formData.adminPhone}
                  onChange={(e) => handleInputChange("adminPhone", e.target.value)}
                  placeholder="+234 123 456 7890"
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            Add Clinic
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
