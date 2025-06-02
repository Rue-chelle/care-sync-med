
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, TrendingUp, AlertTriangle, DollarSign, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { exportDataToPDF } from "@/utils/pdfExport";
import { StatsCard } from "./shared/StatsCard";
import { FilterCard } from "./shared/FilterCard";
import { SubscriptionTable } from "./subscriptions/SubscriptionTable";

export const SubscriptionManagement = () => {
  const [planFilter, setPlanFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
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

  const handleExportSubscriptions = () => {
    exportDataToPDF(filteredSubscriptions, 'subscriptions-report', 'Subscription Management Report');
  };

  const totalRevenue = subscriptions.reduce((sum, sub) => sum + sub.amount, 0);
  const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active').length;
  const trialConversions = Math.round((activeSubscriptions / subscriptions.length) * 100);
  const failedPayments = subscriptions.filter(sub => sub.status === 'past_due' || sub.status === 'expired').length;

  const filterOptions = [
    {
      label: "Filter by plan",
      value: planFilter,
      onChange: setPlanFilter,
      options: [
        { value: "all", label: "All Plans" },
        { value: "basic", label: "Basic" },
        { value: "premium", label: "Premium" },
        { value: "enterprise", label: "Enterprise" }
      ]
    },
    {
      label: "Filter by status",
      value: statusFilter,
      onChange: setStatusFilter,
      options: [
        { value: "all", label: "All Status" },
        { value: "active", label: "Active" },
        { value: "trial", label: "Trial" },
        { value: "expired", label: "Expired" },
        { value: "past_due", label: "Past Due" }
      ]
    }
  ];

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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          title="Monthly Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          change="+23% from last month"
          changeType="positive"
        />
        <StatsCard
          title="Active Subscriptions"
          value={activeSubscriptions}
          icon={CreditCard}
          change={`+${subscriptions.filter(s => s.status === 'trial').length} trials`}
          changeType="positive"
        />
        <StatsCard
          title="Trial Conversions"
          value={`${trialConversions}%`}
          icon={TrendingUp}
          change="+5% improvement"
          changeType="positive"
        />
        <StatsCard
          title="Failed Payments"
          value={failedPayments}
          icon={AlertTriangle}
          description="Needs attention"
        />
      </div>

      <FilterCard
        searchTerm=""
        onSearchChange={() => {}}
        filters={filterOptions}
      />

      <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white">All Subscriptions ({filteredSubscriptions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <SubscriptionTable
            subscriptions={filteredSubscriptions}
            onRenewSubscription={handleRenewSubscription}
          />
        </CardContent>
      </Card>
    </div>
  );
};
