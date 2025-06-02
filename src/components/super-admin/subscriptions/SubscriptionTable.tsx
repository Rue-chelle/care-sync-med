
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Edit, RefreshCw } from "lucide-react";
import { useState } from "react";

interface Subscription {
  id: string;
  clinic: string;
  plan: string;
  status: string;
  amount: number;
  currency: string;
  nextBilling: string;
  paymentMethod: string;
  features: string[];
  startDate: string;
  invoices: number;
}

interface SubscriptionTableProps {
  subscriptions: Subscription[];
  onRenewSubscription: (subscription: Subscription) => void;
}

export const SubscriptionTable = ({ subscriptions, onRenewSubscription }: SubscriptionTableProps) => {
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);

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

  return (
    <>
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
                    onClick={() => onRenewSubscription(subscription)}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};
