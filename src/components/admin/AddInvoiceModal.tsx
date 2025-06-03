
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface AddInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (invoice: any) => void;
}

export const AddInvoiceModal = ({ isOpen, onClose, onAdd }: AddInvoiceModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    patient: "",
    doctor: "",
    service: "",
    amount: "",
    paymentMethod: "",
    notes: ""
  });

  const handleSubmit = () => {
    if (!formData.patient || !formData.doctor || !formData.service || !formData.amount) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const newInvoice = {
      id: `INV-${String(Date.now()).slice(-3)}`,
      patient: formData.patient,
      doctor: formData.doctor,
      service: formData.service,
      amount: parseFloat(formData.amount),
      date: new Date().toISOString().split('T')[0],
      status: "pending",
      paymentMethod: formData.paymentMethod || "Not specified",
      notes: formData.notes
    };

    onAdd(newInvoice);
    
    toast({
      title: "Invoice Created",
      description: `Invoice ${newInvoice.id} has been created successfully`,
    });

    // Reset form
    setFormData({
      patient: "",
      doctor: "",
      service: "",
      amount: "",
      paymentMethod: "",
      notes: ""
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Invoice</DialogTitle>
          <DialogDescription>
            Add a new invoice to the billing system
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="patient">Patient Name *</Label>
            <Input
              id="patient"
              value={formData.patient}
              onChange={(e) => setFormData({...formData, patient: e.target.value})}
              placeholder="Enter patient name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="doctor">Doctor *</Label>
            <Input
              id="doctor"
              value={formData.doctor}
              onChange={(e) => setFormData({...formData, doctor: e.target.value})}
              placeholder="Enter doctor name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="service">Service *</Label>
            <Input
              id="service"
              value={formData.service}
              onChange={(e) => setFormData({...formData, service: e.target.value})}
              placeholder="Enter service description"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Amount *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              placeholder="0.00"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Payment Method</Label>
            <Select value={formData.paymentMethod} onValueChange={(value) => setFormData({...formData, paymentMethod: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Credit Card">Credit Card</SelectItem>
                <SelectItem value="Insurance">Insurance</SelectItem>
                <SelectItem value="Medicare">Medicare</SelectItem>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="Check">Check</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Additional notes (optional)"
              rows={3}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} className="healthcare-gradient text-white">
            Create Invoice
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
