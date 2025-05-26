
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BarChart3, Users, Calendar, TrendingUp, Activity, DollarSign } from "lucide-react";

export const Analytics = () => {
  const [timeRange, setTimeRange] = useState("30d");
  const [appointmentData, setAppointmentData] = useState<any[]>([]);
  const [userGrowth, setUserGrowth] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    totalPatients: 0,
    totalDoctors: 0,
    completionRate: 0,
    revenue: 0,
    growth: 0
  });

  const { toast } = useToast();

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      // Fetch appointments data
      const { data: appointments, error: appointmentsError } = await supabase
        .from("appointments")
        .select("*")
        .gte("created_at", getDateRange());

      if (appointmentsError) throw appointmentsError;

      // Fetch patients count
      const { count: patientsCount, error: patientsError } = await supabase
        .from("patients")
        .select("*", { count: "exact", head: true });

      if (patientsError) throw patientsError;

      // Fetch doctors count
      const { count: doctorsCount, error: doctorsError } = await supabase
        .from("doctors")
        .select("*", { count: "exact", head: true });

      if (doctorsError) throw doctorsError;

      // Process appointment data
      const processedAppointments = processAppointmentData(appointments || []);
      setAppointmentData(processedAppointments);

      // Generate sample user growth data
      const growthData = generateUserGrowthData();
      setUserGrowth(growthData);

      // Generate sample revenue data
      const revenue = generateRevenueData();
      setRevenueData(revenue);

      // Update stats
      const completed = appointments?.filter(a => a.status === 'completed').length || 0;
      const total = appointments?.length || 0;
      
      setStats({
        totalAppointments: total,
        totalPatients: patientsCount || 0,
        totalDoctors: doctorsCount || 0,
        completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
        revenue: 125000,
        growth: 12.5
      });

    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast({
        title: "Error",
        description: "Failed to fetch analytics data",
        variant: "destructive",
      });
    }
  };

  const getDateRange = () => {
    const now = new Date();
    const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
    const past = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    return past.toISOString();
  };

  const processAppointmentData = (appointments: any[]) => {
    const dailyData: { [key: string]: any } = {};
    
    appointments.forEach(apt => {
      const date = new Date(apt.appointment_date).toISOString().split('T')[0];
      if (!dailyData[date]) {
        dailyData[date] = {
          date,
          total: 0,
          completed: 0,
          cancelled: 0,
          scheduled: 0
        };
      }
      dailyData[date].total++;
      dailyData[date][apt.status]++;
    });

    return Object.values(dailyData).sort((a: any, b: any) => a.date.localeCompare(b.date));
  };

  const generateUserGrowthData = () => {
    const data = [];
    const now = new Date();
    for (let i = 30; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      data.push({
        date: date.toISOString().split('T')[0],
        patients: Math.floor(Math.random() * 50) + 100,
        doctors: Math.floor(Math.random() * 5) + 10
      });
    }
    return data;
  };

  const generateRevenueData = () => {
    const data = [];
    const now = new Date();
    for (let i = 30; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      data.push({
        date: date.toISOString().split('T')[0],
        revenue: Math.floor(Math.random() * 5000) + 2000,
        consultations: Math.floor(Math.random() * 30) + 20
      });
    }
    return data;
  };

  const pieData = [
    { name: 'Completed', value: stats.totalAppointments * (stats.completionRate / 100), color: '#22c55e' },
    { name: 'Scheduled', value: stats.totalAppointments * 0.3, color: '#3b82f6' },
    { name: 'Cancelled', value: stats.totalAppointments * 0.15, color: '#ef4444' },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Analytics Dashboard
              </CardTitle>
              <CardDescription>
                Track system performance and user engagement
              </CardDescription>
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold">{stats.totalAppointments}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Total Appointments
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold">{stats.totalPatients}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              Total Patients
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold">{stats.totalDoctors}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <Activity className="h-4 w-4" />
              Total Doctors
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold">{stats.completionRate}%</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              Completion Rate
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold">${stats.revenue.toLocaleString()}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              Total Revenue
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-green-600">+{stats.growth}%</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              Growth Rate
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="appointments" className="w-full">
        <TabsList>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="users">User Growth</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
        </TabsList>

        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <CardTitle>Appointment Trends</CardTitle>
              <CardDescription>Daily appointment statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={appointmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total" fill="#3b82f6" name="Total" />
                  <Bar dataKey="completed" fill="#22c55e" name="Completed" />
                  <Bar dataKey="cancelled" fill="#ef4444" name="Cancelled" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
              <CardDescription>Patient and doctor registration trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="patients" stroke="#3b82f6" name="Patients" />
                  <Line type="monotone" dataKey="doctors" stroke="#22c55e" name="Doctors" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trends</CardTitle>
              <CardDescription>Daily revenue and consultation counts</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#3b82f6" name="Revenue" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution">
          <Card>
            <CardHeader>
              <CardTitle>Appointment Distribution</CardTitle>
              <CardDescription>Breakdown of appointment statuses</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={120}
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
        </TabsContent>
      </Tabs>
    </div>
  );
};
