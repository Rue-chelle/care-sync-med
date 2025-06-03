
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Eye, Download, DollarSign, CreditCard, FileText, TrendingUp } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Billing = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Demo billing data
  const invoices = [
    {
      id: "INV-001",
      patient: "John Smith",
      doctor: "Dr. Sarah Johnson",
      date: "2024-01-20",
      amount: 150.00,
      status: "paid",
      services: [
        { description: "General Consultation", amount: 100.00 },
        { description: "Blood Pressure Check", amount: 25.00 },
        { description: "Lab Work", amount: 25.00 }
      ],
      paymentMethod: "Credit Card",
      insuranceClaim: "BC-12345",
      notes: "Regular checkup with blood work"
    },
    {
      id: "INV-002",
      patient: "Emily Johnson",
      doctor: "Dr. Lisa Wang",
      date: "2024-01-18",
      amount: 200.00,
      status: "pending",
      services: [
        { description: "Specialist Consultation", amount: 150.00 },
        { description: "Pulmonary Function Test", amount: 50.00 }
      ],
      paymentMethod: "Insurance",
      insuranceClaim: "AET-67890",
      notes: "Asthma specialist consultation"
    },
    {
      id: "INV-003",
      patient: "Michael Brown",
      doctor: "Dr. James Wilson",
      date: "2024-01-15",
      amount: 300.00,
      status: "overdue",
      services: [
        { description: "Cardiac Consultation", amount: 200.00 },
        { description: "ECG", amount: 75.00 },
        { description: "Stress Test", amount: 25.00 }
      ],
      paymentMethod: "Medicare",
      insuranceClaim: "MED-54321",
      notes: "Cardiac evaluation and testing"
    },
    {
      id: "INV-004",
      patient: "Sarah Davis",
      doctor: "Dr. Maria Rodriguez",
      date: "2024-01-22",
      amount: 175.00,
      status: "paid",
      services: [
        { description: "Prenatal Consultation", amount: 125.00 },
        { description: "Ultrasound", amount: 50.00 }
      ],
      paymentMethod: "Credit Card",
      insuranceClaim: "UHC-98765",
      notes: "20-week prenatal checkup"
    }
  ];

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "paid": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "overdue": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const totalRevenue = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0);
  const pendingRevenue = invoices.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + inv.amount, 0);
  const overdueRevenue = invoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.amount, 0);

  const InvoiceDetailsModal = ({ invoice }) => (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-xl lg:text-2xl">Invoice Details - {invoice.id}</DialogTitle>
        <DialogDescription>Complete invoice information and payment details</DialogDescription>
      </DialogHeader>
      
      <div className="space-y-6 mt-4">
        {/* Invoice Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-semibold text-sm">Patient Information</h4>
            <p className="text-sm">{invoice.patient}</p>
            <p className="text-xs text-gray-600">Treated by: {invoice.doctor}</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm">Invoice Information</h4>
            <p className="text-sm">Date: {invoice.date}</p>
            <p className="text-sm">Payment Method: {invoice.paymentMethod}</p>
            <p className="text-xs text-gray-600">Insurance Claim: {invoice.insuranceClaim}</p>
          </div>
        </div>

        {/* Services */}
        <div>
          <h4 className="font-semibold mb-3">Services Rendered</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoice.services.map((service, index) => (
                <TableRow key={index}>
                  <TableCell>{service.description}</TableCell>
                  <TableCell className="text-right">${service.amount.toFixed(2)}</TableCell>
                </TableRow>
              ))}
              <TableRow className="font-semibold border-t-2">
                <TableCell>Total</TableCell>
                <TableCell className="text-right">${invoice.amount.toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div>
            <h4 className="font-semibold mb-2">Notes</h4>
            <p className="text-sm text-gray-700 p-3 bg-gray-50 rounded">{invoice.notes}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
          <Button className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button variant="outline" className="flex-1">
            <CreditCard className="h-4 w-4 mr-2" />
            Process Payment
          </Button>
        </div>
      </div>
    </DialogContent>
  );

  return (
    <div className="space-y-4 lg:space-y-6 max-w-full px-2 sm:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h3 className="text-lg lg:text-xl font-semibold text-gray-900">Billing & Invoices</h3>
          <p className="text-sm lg:text-base text-gray-600">Manage patient billing and payment processing</p>
        </div>
        <Button className="w-full sm:w-auto">
          <FileText className="h-4 w-4 mr-2" />
          New Invoice
        </Button>
      </div>

      {/* Revenue Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg lg:text-2xl font-bold text-green-600 flex items-center gap-2">
              <DollarSign className="h-5 w-5 lg:h-6 lg:w-6" />
              ${totalRevenue.toFixed(2)}
            </CardTitle>
            <CardDescription className="text-sm lg:text-base">Total Revenue</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg lg:text-2xl font-bold text-yellow-600 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 lg:h-6 lg:w-6" />
              ${pendingRevenue.toFixed(2)}
            </CardTitle>
            <CardDescription className="text-sm lg:text-base">Pending Payments</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg lg:text-2xl font-bold text-red-600 flex items-center gap-2">
              <CreditCard className="h-5 w-5 lg:h-6 lg:w-6" />
              ${overdueRevenue.toFixed(2)}
            </CardTitle>
            <CardDescription className="text-sm lg:text-base">Overdue Payments</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg lg:text-2xl font-bold text-blue-600">
              {invoices.length}
            </CardTitle>
            <CardDescription className="text-sm lg:text-base">Total Invoices</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by patient, doctor, or invoice ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Invoices</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs lg:text-sm">Invoice ID</TableHead>
                  <TableHead className="text-xs lg:text-sm">Patient</TableHead>
                  <TableHead className="text-xs lg:text-sm">Doctor</TableHead>
                  <TableHead className="text-xs lg:text-sm">Date</TableHead>
                  <TableHead className="text-xs lg:text-sm">Amount</TableHead>
                  <TableHead className="text-xs lg:text-sm">Status</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium text-xs lg:text-sm">{invoice.id}</TableCell>
                    <TableCell className="text-xs lg:text-sm">{invoice.patient}</TableCell>
                    <TableCell className="text-xs lg:text-sm">{invoice.doctor}</TableCell>
                    <TableCell className="text-xs lg:text-sm">{invoice.date}</TableCell>
                    <TableCell className="font-semibold text-xs lg:text-sm">${invoice.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(invoice.status)}>
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <InvoiceDetailsModal invoice={invoice} />
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
