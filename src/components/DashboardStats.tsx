
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, Bell, UserCheck, Clock, TrendingUp } from "lucide-react";

export const DashboardStats = () => {
  const stats = [
    {
      title: "Total Patients",
      value: "1,247",
      change: "+12%",
      changeType: "increase",
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Today's Appointments",
      value: "24",
      change: "+3",
      changeType: "increase",
      icon: Calendar,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Pending Reminders",
      value: "156",
      change: "-8%",
      changeType: "decrease",
      icon: Bell,
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      title: "Follow-ups Due",
      value: "43",
      change: "+5",
      changeType: "increase",
      icon: UserCheck,
      color: "from-teal-500 to-teal-600",
      bgColor: "bg-teal-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="card-hover bg-white/60 backdrop-blur-sm border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              {stat.title}
            </CardTitle>
            <div className={`h-10 w-10 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
              <stat.icon className={`h-5 w-5 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
              <Badge 
                variant={stat.changeType === "increase" ? "default" : "secondary"}
                className={
                  stat.changeType === "increase" 
                    ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" 
                    : "bg-slate-100 text-slate-600 hover:bg-slate-100"
                }
              >
                <TrendingUp className="h-3 w-3 mr-1" />
                {stat.change}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {stat.changeType === "increase" ? "↗" : "↘"} from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
