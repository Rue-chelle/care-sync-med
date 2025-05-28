
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FileText, DollarSign, Calendar, User, CreditCard } from "lucide-react";

interface InvoiceDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: {
    id: string;
    patient: string;
    doctor: string;
    service: string;
    amount: number;
    date: string;
    status: string;
    paymentMethod: string;
  } | null;
}

export const InvoiceDetailsModal = ({ isOpen, onClose, invoice }: InvoiceDetailsModalProps) => {
  if (!invoice) return null;

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "overdue": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Invoice Details - {invoice.id}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Invoice Header */}
          <div className="bg-gradient-to-r from-blue-50 to-teal-50 p-6 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">AloraMed Healthcare</h3>
                <p className="text-sm text-gray-600">Invoice #{invoice.id}</p>
                <p className="text-sm text-gray-600">Date: {invoice.date}</p>
              </div>
              <Badge className={getStatusBadgeColor(invoice.status)}>
                {invoice.status}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Bill To */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Bill To:</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span>{invoice.patient}</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Service Provider:</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span>{invoice.doctor}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Service Details */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Service Details:</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{invoice.service}</p>
                  <p className="text-sm text-gray-600">Provided by {invoice.doctor}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">${invoice.amount.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Payment Information */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Payment Information:</h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-gray-500" />
                <span>Payment Method:</span>
              </div>
              <span className="font-medium">{invoice.paymentMethod || 'Not specified'}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-500" />
                <span>Total Amount:</span>
              </div>
              <span className="text-xl font-bold text-gray-900">${invoice.amount.toFixed(2)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button className="healthcare-gradient text-white flex-1">
              Print Invoice
            </Button>
            <Button variant="outline" className="flex-1">
              Send Email
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
