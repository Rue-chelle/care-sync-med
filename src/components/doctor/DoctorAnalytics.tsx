
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Calendar, Users, TrendingUp, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface AnalyticsData {
  date: string;
  patients_seen: number;
  appointments_completed: number;
  appointments_cancelled: number;
  appointments_no_show: number;
  total_revenue: number;
}

export const DoctorAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [timeRange, setTimeRange] = useState("7days");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: doctorData } = await supabase
        .from('doctors')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!doctorData) return;

      let dateFilter = new Date();
      switch (timeRange) {
        case "7days":
          dateFilter.setDate(dateFilter.getDate() - 7);
          break;
        case "30days":
          dateFilter.setDate(dateFilter.getDate() - 30);
          break;
        case "90days":
          dateFilter.setDate(dateFilter.getDate() - 90);
          break;
      }

      const { data, error } = await supabase
        .from('doctor_analytics')
        .select('*')
        .eq('doctor_id', doctorData.id)
        .gte('date', dateFilter.toISOString().split('T')[0])
        .order('date', { ascending: true });

      if (error) throw error;
      setAnalyticsData(data || []);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
    return <div>Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-slate-800">Analytics Dashboard</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-blue-600 flex items-center gap-2">
              <Users className="h-6 w-6" />
              {totalStats.patients_seen}
            </CardTitle>
            <CardDescription>Total Patients Seen</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-green-600 flex items-center gap-2">
              <Calendar className="h-6 w-6" />
              {totalStats.appointments_completed}
            </CardTitle>
            <CardDescription>Completed Appointments</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-orange-600 flex items-center gap-2">
              <Clock className="h-6 w-6" />
              {totalStats.appointments_cancelled + totalStats.appointments_no_show}
            </CardTitle>
            <CardDescription>Missed Appointments</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-purple-600 flex items-center gap-2">
              <TrendingUp className="h-6 w-6" />
              ${totalStats.total_revenue.toFixed(2)}
            </CardTitle>
            <CardDescription>Total Revenue</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Daily Patient Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="patients_seen" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Appointment Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
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
          <CardTitle>Recent Daily Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Patients Seen</th>
                  <th className="text-left p-2">Completed</th>
                  <th className="text-left p-2">Cancelled</th>
                  <th className="text-left p-2">No Show</th>
                  <th className="text-left p-2">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.slice(-10).reverse().map((row) => (
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
