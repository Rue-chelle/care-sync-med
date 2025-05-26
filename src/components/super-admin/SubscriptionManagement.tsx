
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CreditCard, TrendingUp, AlertTriangle, DollarSign } from "lucide-react";

export const SubscriptionManagement = () => {
  const subscriptions = [
    {
      id: "1",
      clinic: "HealthFirst Medical Center",
      plan: "premium",
      status: "active",
      amount: 299,
      currency: "USD",
      nextBilling: "2024-02-20",
      paymentMethod: "Stripe"
    },
    {
      id: "2",
      clinic: "MediCare Plus",
      plan: "basic",
      status: "trial",
      amount: 99,
      currency: "USD",
      nextBilling: "2024-01-25",
      paymentMethod: "Paystack"
    },
    {
      id: "3",
      clinic: "Wellness Clinic",
      plan: "enterprise",
      status: "expired",
      amount: 599,
      currency: "USD",
      nextBilling: "2024-01-15",
      paymentMethod: "Razorpay"
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
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Subscription Management</h2>
        <p className="text-purple-300">Monitor and manage clinic subscriptions and billing</p>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-300">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">$54,721</div>
            <p className="text-xs text-green-400">+23% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-300">Active Subscriptions</CardTitle>
            <CreditCard className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">187</div>
            <p className="text-xs text-green-400">+12 this month</p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-300">Trial Conversions</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">78%</div>
            <p className="text-xs text-green-400">+5% improvement</p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-300">Failed Payments</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">12</div>
            <p className="text-xs text-red-400">Needs attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Subscriptions Table */}
      <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white">All Subscriptions</CardTitle>
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
              {subscriptions.map((subscription) => (
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
                      <Button size="sm" variant="outline" className="border-purple-500/30 text-purple-300">
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" className="border-green-500/30 text-green-300">
                        Override
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
