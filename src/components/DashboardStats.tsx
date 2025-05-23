
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, Bell, UserCheck, Clock, TrendingUp, TrendingDown } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";

export const DashboardStats = () => {
  const [stats, setStats] = useState([
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
  ]);

  useEffect(() => {
    // This would normally fetch real stats from an API
    const fetchStats = async () => {
      try {
        // Simulate API call with timeout
        await new Promise(resolve => setTimeout(resolve, 1000));
        // In a real app, we would update stats based on API response
        console.log("Stats data fetched");
        // No changes for demo purposes
      } catch (error) {
        console.error("Error fetching stats:", error);
        toast({
          title: "Error fetching dashboard data",
          description: "Could not load the latest statistics. Please try again later.",
          variant: "destructive"
        });
      }
    };

    fetchStats();
  }, []);

  const handleRefreshStats = () => {
    toast({
      title: "Refreshing statistics",
      description: "Dashboard data is being updated..."
    });
    
    // Simulate refresh with updated numbers
    setTimeout(() => {
      // Create a copy of stats and make small random changes to demonstrate reactivity
      const updatedStats = stats.map(stat => {
        const randomChange = Math.floor(Math.random() * 10) - 5; // Random number between -5 and 5
        const newValue = parseInt(stat.value.replace(/,/g, '')) + randomChange;
        const formattedValue = newValue.toLocaleString();
        
        const changeValue = randomChange > 0 ? `+${randomChange}` : `${randomChange}`;
        const changeType = randomChange >= 0 ? "increase" : "decrease";
        
        return {
          ...stat,
          value: formattedValue,
          change: changeValue,
          changeType
        };
      });
      
      setStats(updatedStats);
      
      toast({
        title: "Statistics updated",
        description: "Dashboard has been refreshed with latest data."
      });
    }, 1500);
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button 
          onClick={handleRefreshStats}
          className="text-sm text-primary font-medium flex items-center hover:underline"
        >
          <Clock className="h-4 w-4 mr-1" /> Refresh Stats
        </button>
      </div>
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
                  {stat.changeType === "increase" ? 
                    <TrendingUp className="h-3 w-3 mr-1" /> : 
                    <TrendingDown className="h-3 w-3 mr-1" />
                  }
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
    </div>
  );
};
