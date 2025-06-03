
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Calendar, Clock, User, Pill, FileText, Printer, Edit, X } from "lucide-react";
import { generatePrescriptionPDF } from "@/utils/pdfExport";

interface PrescriptionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (id: string) => void;
  prescription: {
    id: string;
    patient: string;
    doctor: string;
    medication: string;
    dosage: string;
    duration: string;
    date: string;
    status: string;
    flagged: boolean;
  } | null;
}

export const PrescriptionDetailsModal = ({ isOpen, onClose, onEdit, prescription }: PrescriptionDetailsModalProps) => {
  if (!prescription) return null;

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active": return "bg-green-100 text-green-800";
      case "completed": return "bg-blue-100 text-blue-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handlePrint = () => {
    if (!prescription) return;
    generatePrescriptionPDF(prescription);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Prescription Details - {prescription.id}
              {prescription.flagged && (
                <AlertTriangle className="h-5 w-5 text-red-500" />
              )}
            </DialogTitle>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onClose}
              className="h-6 w-6 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Status Badge */}
          <div className="flex justify-between items-center">
            <Badge className={getStatusBadgeColor(prescription.status)}>
              {prescription.status}
            </Badge>
            {prescription.flagged && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-1 rounded-lg">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">Flagged for Review</span>
              </div>
            )}
          </div>

          <Separator />

          {/* Patient & Doctor Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                Patient
              </div>
              <p className="font-medium">{prescription.patient}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                Prescribing Doctor
              </div>
              <p className="font-medium">{prescription.doctor}</p>
            </div>
          </div>

          <Separator />

          {/* Medication Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Pill className="h-4 w-4" />
              Medication Information
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div>
                <p className="text-sm text-gray-600">Medication</p>
                <p className="font-medium text-lg">{prescription.medication}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Dosage</p>
                  <p className="font-medium">{prescription.dosage}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="font-medium">{prescription.duration}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Date Information */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              Prescription Date
            </div>
            <p className="font-medium">{prescription.date}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              className="healthcare-gradient text-white flex-1"
              onClick={handlePrint}
            >
              <Printer className="h-4 w-4 mr-2" />
              Print Prescription
            </Button>
            <Button 
              variant="outline" 
              className="flex-1" 
              onClick={() => onEdit(prescription.id)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Prescription
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
