
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { CreditCard, TrendingUp, AlertTriangle, DollarSign, Edit, Eye, Download, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { exportToPDF } from "@/utils/pdfExport";

export const SubscriptionManagement = () => {
  const [planFilter, setPlanFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedSubscription, setSelectedSubscription] = useState<any>(null);
  const { toast } = useToast();

  const subscriptions = [
    {
      id: "1",
      clinic: "HealthFirst Medical Center",
      plan: "premium",
      status: "active",
      amount: 299,
      currency: "USD",
      nextBilling: "2024-02-20",
      paymentMethod: "Stripe",
      features: ["Advanced Analytics", "Multi-branch Support", "Priority Support"],
      startDate: "2023-02-20",
      invoices: 12
    },
    {
      id: "2",
      clinic: "MediCare Plus",
      plan: "basic",
      status: "trial",
      amount: 99,
      currency: "USD",
      nextBilling: "2024-01-25",
      paymentMethod: "Paystack",
      features: ["Basic Analytics", "Single Branch", "Email Support"],
      startDate: "2024-01-10",
      invoices: 0
    },
    {
      id: "3",
      clinic: "Wellness Clinic",
      plan: "enterprise",
      status: "expired",
      amount: 599,
      currency: "USD",
      nextBilling: "2024-01-15",
      paymentMethod: "Razorpay",
      features: ["Custom Analytics", "Unlimited Branches", "24/7 Support", "Custom Integrations"],
      startDate: "2023-01-15",
      invoices: 24
    },
    {
      id: "4",
      clinic: "City Medical",
      plan: "premium",
      status: "past_due",
      amount: 299,
      currency: "USD",
      nextBilling: "2024-01-18",
      paymentMethod: "Stripe",
      features: ["Advanced Analytics", "Multi-branch Support", "Priority Support"],
      startDate: "2023-06-18",
      invoices: 8
    }
  ];

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case "basic":
        return <Badge variant="outline" className="text-blue-400 border-blue-500/30">Basic</Badge>;
      case "premium":
        return <Badge variant="outline" className="text-purple-400 border-purple-500/30">Premium</Badge>;
      case "enterprise":
        return <Badge variant="outline" className="text-yellow-400 border-yellow-500/30">Enterprise</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500/20 text-green-400">Active</Badge>;
      case "trial":
        return <Badge className="bg-blue-500/20 text-blue-400">Trial</Badge>;
      case "expired":
        return <Badge className="bg-red-500/20 text-red-400">Expired</Badge>;
      case "suspended":
        return <Badge className="bg-yellow-500/20 text-yellow-400">Suspended</Badge>;
      case "past_due":
        return <Badge className="bg-orange-500/20 text-orange-400">Past Due</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesPlan = planFilter === "all" || sub.plan === planFilter;
    const matchesStatus = statusFilter === "all" || sub.status === statusFilter;
    return matchesPlan && matchesStatus;
  });

  const handleRenewSubscription = (subscription: any) => {
    toast({
      title: "Subscription Renewed",
      description: `${subscription.clinic} subscription has been renewed`,
    });
  };

  const handleSuspendSubscription = (subscription: any) => {
    toast({
      title: "Subscription Suspended",
      description: `${subscription.clinic} subscription has been suspended`,
      variant: "destructive"
    });
  };

  const handleExportSubscriptions = () => {
    exportToPDF(filteredSubscriptions, 'subscriptions-report', 'Subscription Management Report');
  };

  const totalRevenue = subscriptions.reduce((sum, sub) => sum + sub.amount, 0);
  const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active').length;
  const trialConversions = Math.round((activeSubscriptions / subscriptions.length) * 100);
  const failedPayments = subscriptions.filter(sub => sub.status === 'past_due' || sub.status === 'expired').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Subscription Management</h2>
          <p className="text-purple-300">Monitor and manage clinic subscriptions and billing</p>
        </div>
        <Button onClick={handleExportSubscriptions} variant="outline" className="border-purple-500/30 text-purple-300">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-300">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-green-400">+23% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-300">Active Subscriptions</CardTitle>
            <CreditCard className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{activeSubscriptions}</div>
            <p className="text-xs text-green-400">+{subscriptions.filter(s => s.status === 'trial').length} trials</p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-300">Trial Conversions</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{trialConversions}%</div>
            <p className="text-xs text-green-400">+5% improvement</p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-300">Failed Payments</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{failedPayments}</div>
            <p className="text-xs text-red-400">Needs attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger className="bg-white/5 border-purple-500/30 text-white">
                <SelectValue placeholder="Filter by plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-white/5 border-purple-500/30 text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="trial">Trial</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="past_due">Past Due</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Subscriptions Table */}
      <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white">All Subscriptions ({filteredSubscriptions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-purple-500/30">
                <TableHead className="text-purple-300">Clinic</TableHead>
                <TableHead className="text-purple-300">Plan</TableHead>
                <TableHead className="text-purple-300">Status</TableHead>
                <TableHead className="text-purple-300">Amount</TableHead>
                <TableHead className="text-purple-300">Next Billing</TableHead>
                <TableHead className="text-purple-300">Payment Method</TableHead>
                <TableHead className="text-purple-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubscriptions.map((subscription) => (
                <TableRow key={subscription.id} className="border-purple-500/20">
                  <TableCell className="text-white font-medium">{subscription.clinic}</TableCell>
                  <TableCell>{getPlanBadge(subscription.plan)}</TableCell>
                  <TableCell>{getStatusBadge(subscription.status)}</TableCell>
                  <TableCell className="text-white">
                    ${subscription.amount}/{subscription.currency}
                  </TableCell>
                  <TableCell className="text-purple-300">{subscription.nextBilling}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-purple-400 border-purple-500/30">
                      {subscription.paymentMethod}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" className="border-purple-500/30 text-purple-300" onClick={() => setSelectedSubscription(subscription)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Subscription Details - {selectedSubscription?.clinic}</DialogTitle>
                          </DialogHeader>
                          {selectedSubscription && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium">Clinic</label>
                                  <p className="text-gray-600">{selectedSubscription.clinic}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Plan</label>
                                  <p className="text-gray-600">{selectedSubscription.plan}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Status</label>
                                  <p className="text-gray-600">{selectedSubscription.status}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Amount</label>
                                  <p className="text-gray-600">${selectedSubscription.amount}/{selectedSubscription.currency}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Start Date</label>
                                  <p className="text-gray-600">{selectedSubscription.startDate}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Next Billing</label>
                                  <p className="text-gray-600">{selectedSubscription.nextBilling}</p>
                                </div>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Features</label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {selectedSubscription.features.map((feature: string, index: number) => (
                                    <Badge key={index} variant="outline">{feature}</Badge>
                                  ))}
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <Card>
                                  <CardContent className="p-4 text-center">
                                    <p className="text-2xl font-bold">{selectedSubscription.invoices}</p>
                                    <p className="text-sm text-gray-600">Total Invoices</p>
                                  </CardContent>
                                </Card>
                                <Card>
                                  <CardContent className="p-4 text-center">
                                    <p className="text-2xl font-bold">${selectedSubscription.amount * selectedSubscription.invoices}</p>
                                    <p className="text-sm text-gray-600">Total Revenue</p>
                                  </CardContent>
                                </Card>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button size="sm" variant="outline" className="border-purple-500/30 text-purple-300">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-green-500/30 text-green-300"
                        onClick={() => handleRenewSubscription(subscription)}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
