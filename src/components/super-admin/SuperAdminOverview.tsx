
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, Users, CreditCard, AlertTriangle, TrendingUp, Calendar, Download, Eye, Settings } from "lucide-react";
import { exportDataToPDF } from "@/utils/pdfExport";

export const SuperAdminOverview = () => {
  const statsData = [
    { label: "Total Clinics", value: "247", change: "+12%", period: "from last month" },
    { label: "Active Users", value: "12,847", change: "+8%", period: "from last week" },
    { label: "Revenue", value: "$54,721", change: "+23%", period: "from last month" },
    { label: "Support Tickets", value: "18", change: "", period: "5 urgent, 13 normal" }
  ];

  const recentActivity = [
    { type: "success", message: "New clinic registered: MediCare Plus", time: "2 minutes ago" },
    { type: "warning", message: "Support ticket created by HealthFirst Clinic", time: "15 minutes ago" },
    { type: "info", message: "Feature flag updated: prescription_ai", time: "1 hour ago" },
    { type: "error", message: "Payment failed for Wellness Center", time: "3 hours ago" }
  ];

  const handleExportReport = () => {
    exportDataToPDF(statsData, 'super-admin-overview', 'Super Admin Overview Report');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Super Admin Overview</h2>
          <p className="text-purple-300 mt-2">Platform-wide metrics and system health</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button 
            onClick={handleExportReport} 
            className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto"
            size="sm"
          >
            <Download className="h-4 w-4 mr-2" />
            <span className="hidden xs:inline">Export Report</span>
            <span className="xs:hidden">Export</span>
          </Button>
          <Button 
            variant="outline" 
            className="border-purple-500/30 text-purple-300 w-full sm:w-auto"
            size="sm"
          >
            <Settings className="h-4 w-4 mr-2" />
            <span className="hidden xs:inline">Quick Settings</span>
            <span className="xs:hidden">Settings</span>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20 hover:bg-white/20 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-300">Total Clinics</CardTitle>
            <Building className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">247</div>
            <p className="text-xs text-green-400">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20 hover:bg-white/20 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-300">Active Users</CardTitle>
            <Users className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">12,847</div>
            <p className="text-xs text-green-400">+8% from last week</p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20 hover:bg-white/20 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-300">Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">$54,721</div>
            <p className="text-xs text-green-400">+23% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20 hover:bg-white/20 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-300">Support Tickets</CardTitle>
            <AlertTriangle className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">18</div>
            <p className="text-xs text-purple-300">5 urgent, 13 normal</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-purple-400" />
              System Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-purple-300">Server Uptime</span>
                <span className="text-green-400">99.98%</span>
              </div>
              <div className="w-full bg-purple-900/50 rounded-full h-2">
                <div className="bg-green-400 h-2 rounded-full" style={{ width: '99.98%' }}></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-purple-300">Database Performance</span>
                <span className="text-green-400">95.2%</span>
              </div>
              <div className="w-full bg-purple-900/50 rounded-full h-2">
                <div className="bg-green-400 h-2 rounded-full" style={{ width: '95.2%' }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-purple-300">API Response Time</span>
                <span className="text-yellow-400">125ms avg</span>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full border-purple-500/30 text-purple-300 mt-4"
              size="sm"
            >
              <Eye className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">View Detailed Analytics</span>
              <span className="sm:hidden">View Analytics</span>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-purple-400" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'success' ? 'bg-green-400' :
                    activity.type === 'warning' ? 'bg-yellow-400' :
                    activity.type === 'error' ? 'bg-red-400' : 'bg-blue-400'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm text-white">{activity.message}</p>
                    <p className="text-xs text-purple-300">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <Button 
              variant="outline" 
              className="w-full border-purple-500/30 text-purple-300 mt-4"
              size="sm"
            >
              <Eye className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">View All Activity</span>
              <span className="sm:hidden">View All</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
