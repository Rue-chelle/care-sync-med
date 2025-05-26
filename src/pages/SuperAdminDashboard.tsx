
import { useState } from "react";
import { SuperAdminLayout } from "@/components/layout/SuperAdminLayout";
import { SuperAdminOverview } from "@/components/super-admin/SuperAdminOverview";
import { ClinicManagement } from "@/components/super-admin/ClinicManagement";
import { UserManagement } from "@/components/super-admin/UserManagement";
import { SystemAnalytics } from "@/components/super-admin/SystemAnalytics";
import { FeatureFlags } from "@/components/super-admin/FeatureFlags";
import { SupportTickets } from "@/components/super-admin/SupportTickets";
import { BroadcastMessages } from "@/components/super-admin/BroadcastMessages";
import { AuditLogs } from "@/components/super-admin/AuditLogs";
import { SubscriptionManagement } from "@/components/super-admin/SubscriptionManagement";

const SuperAdminDashboard = () => {
  const [currentTab, setCurrentTab] = useState("overview");

  const renderContent = () => {
    switch (currentTab) {
      case "overview":
        return <SuperAdminOverview />;
      case "clinics":
        return <ClinicManagement />;
      case "users":
        return <UserManagement />;
      case "analytics":
        return <SystemAnalytics />;
      case "subscriptions":
        return <SubscriptionManagement />;
      case "features":
        return <FeatureFlags />;
      case "tickets":
        return <SupportTickets />;
      case "broadcasts":
        return <BroadcastMessages />;
      case "audit":
        return <AuditLogs />;
      default:
        return <SuperAdminOverview />;
    }
  };

  return (
    <SuperAdminLayout currentTab={currentTab} setCurrentTab={setCurrentTab}>
      {renderContent()}
    </SuperAdminLayout>
  );
};

export default SuperAdminDashboard;
