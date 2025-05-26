
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Users, Calendar, MessageSquare, AlertTriangle } from "lucide-react";

export const SystemAnalytics = () => {
  // Mock data for charts
  const userGrowthData = [
    { month: 'Jan', users: 1200 },
    { month: 'Feb', users: 1890 },
    { month: 'Mar', users: 2800 },
    { month: 'Apr', users: 3908 },
    { month: 'May', users: 4800 },
    { month: 'Jun', users: 5900 },
  ];

  const appointmentData = [
    { day: 'Mon', appointments: 245 },
    { day: 'Tue', appointments: 312 },
    { day: 'Wed', appointments: 189 },
    { day: 'Thu', appointments: 278 },
    { day: 'Fri', appointments: 356 },
    { day: 'Sat', appointments: 198 },
    { day: 'Sun', appointments: 167 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">System Analytics</h2>
        <p className="text-purple-300">Platform-wide metrics and insights</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-300">Weekly Active Users</CardTitle>
            <Users className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">8,429</div>
            <p className="text-xs text-green-400">+12.5% from last week</p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-300">Monthly Active Users</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">23,847</div>
            <p className="text-xs text-green-400">+8.3% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-300">Total Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">156,789</div>
            <p className="text-xs text-green-400">+18.2% this month</p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-300">Messages Sent</CardTitle>
            <MessageSquare className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">45,231</div>
            <p className="text-xs text-green-400">+5.7% this week</p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-300">System Errors</CardTitle>
            <AlertTriangle className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">23</div>
            <p className="text-xs text-red-400">+2 from yesterday</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white">User Growth Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#8B5CF6" opacity={0.3} />
                <XAxis dataKey="month" stroke="#C4B5FD" />
                <YAxis stroke="#C4B5FD" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(139, 92, 246, 0.1)', 
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: '8px',
                    color: '#FFFFFF'
                  }} 
                />
                <Line type="monotone" dataKey="users" stroke="#8B5CF6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white">Daily Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={appointmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#8B5CF6" opacity={0.3} />
                <XAxis dataKey="day" stroke="#C4B5FD" />
                <YAxis stroke="#C4B5FD" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(139, 92, 246, 0.1)', 
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: '8px',
                    color: '#FFFFFF'
                  }} 
                />
                <Bar dataKey="appointments" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white">System Health Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <div className="w-full bg-purple-900/50 rounded-full h-2">
                <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
