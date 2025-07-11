
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Calendar, Users, TrendingUp, Clock } from "lucide-react";

interface AnalyticsData {
  date: string;
  patients_seen: number;
  appointments_completed: number;
  appointments_cancelled: number;
  appointments_no_show: number;
  total_revenue: number;
}

export const DoctorAnalytics = () => {
  const [timeRange, setTimeRange] = useState("7days");
  const [isLoading, setIsLoading] = useState(false);

  // Demo analytics data
  const analyticsData: AnalyticsData[] = [
    { date: "2024-01-15", patients_seen: 12, appointments_completed: 12, appointments_cancelled: 2, appointments_no_show: 1, total_revenue: 1200 },
    { date: "2024-01-16", patients_seen: 15, appointments_completed: 14, appointments_cancelled: 1, appointments_no_show: 0, total_revenue: 1400 },
    { date: "2024-01-17", patients_seen: 8, appointments_completed: 8, appointments_cancelled: 3, appointments_no_show: 2, total_revenue: 800 },
    { date: "2024-01-18", patients_seen: 18, appointments_completed: 16, appointments_cancelled: 1, appointments_no_show: 1, total_revenue: 1600 },
    { date: "2024-01-19", patients_seen: 14, appointments_completed: 13, appointments_cancelled: 2, appointments_no_show: 1, total_revenue: 1300 },
    { date: "2024-01-20", patients_seen: 10, appointments_completed: 9, appointments_cancelled: 1, appointments_no_show: 0, total_revenue: 900 },
    { date: "2024-01-21", patients_seen: 16, appointments_completed: 15, appointments_cancelled: 1, appointments_no_show: 1, total_revenue: 1500 }
  ];

  const totalStats = analyticsData.reduce(
    (acc, curr) => ({
      patients_seen: acc.patients_seen + curr.patients_seen,
      appointments_completed: acc.appointments_completed + curr.appointments_completed,
      appointments_cancelled: acc.appointments_cancelled + curr.appointments_cancelled,
      appointments_no_show: acc.appointments_no_show + curr.appointments_no_show,
      total_revenue: acc.total_revenue + curr.total_revenue,
    }),
    {
      patients_seen: 0,
      appointments_completed: 0,
      appointments_cancelled: 0,
      appointments_no_show: 0,
      total_revenue: 0,
    }
  );

  const pieData = [
    { name: 'Completed', value: totalStats.appointments_completed, color: '#10b981' },
    { name: 'Cancelled', value: totalStats.appointments_cancelled, color: '#ef4444' },
    { name: 'No Show', value: totalStats.appointments_no_show, color: '#6b7280' },
  ];

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading analytics...</div>;
  }

  return (
    <div className="space-y-4 lg:space-y-6 max-w-full px-2 sm:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl lg:text-3xl font-bold text-slate-800">Analytics Dashboard</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-full sm:w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">7 Days</SelectItem>
            <SelectItem value="30days">30 Days</SelectItem>
            <SelectItem value="90days">90 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg lg:text-2xl font-bold text-blue-600 flex items-center gap-2">
              <Users className="h-5 w-5 lg:h-6 lg:w-6" />
              {totalStats.patients_seen}
            </CardTitle>
            <CardDescription className="text-sm lg:text-base">Total Patients Seen</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg lg:text-2xl font-bold text-green-600 flex items-center gap-2">
              <Calendar className="h-5 w-5 lg:h-6 lg:w-6" />
              {totalStats.appointments_completed}
            </CardTitle>
            <CardDescription className="text-sm lg:text-base">Completed Appointments</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg lg:text-2xl font-bold text-orange-600 flex items-center gap-2">
              <Clock className="h-5 w-5 lg:h-6 lg:w-6" />
              {totalStats.appointments_cancelled + totalStats.appointments_no_show}
            </CardTitle>
            <CardDescription className="text-sm lg:text-base">Missed Appointments</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg lg:text-2xl font-bold text-purple-600 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 lg:h-6 lg:w-6" />
              ${totalStats.total_revenue.toFixed(2)}
            </CardTitle>
            <CardDescription className="text-sm lg:text-base">Total Revenue</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base lg:text-lg">Daily Patient Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="patients_seen" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base lg:text-lg">Appointment Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base lg:text-lg">Recent Daily Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Patients</th>
                  <th className="text-left p-2">Completed</th>
                  <th className="text-left p-2">Cancelled</th>
                  <th className="text-left p-2">No Show</th>
                  <th className="text-left p-2">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.slice(-7).reverse().map((row) => (
                  <tr key={row.date} className="border-b">
                    <td className="p-2">{row.date}</td>
                    <td className="p-2">{row.patients_seen}</td>
                    <td className="p-2">{row.appointments_completed}</td>
                    <td className="p-2">{row.appointments_cancelled}</td>
                    <td className="p-2">{row.appointments_no_show}</td>
                    <td className="p-2">${row.total_revenue.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
