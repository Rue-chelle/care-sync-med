
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  description?: string;
}

export const StatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  changeType = "neutral", 
  description 
}: StatsCardProps) => {
  const getChangeColor = () => {
    switch (changeType) {
      case "positive": return "text-green-400";
      case "negative": return "text-red-400";
      default: return "text-purple-300";
    }
  };

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20 hover:bg-white/20 transition-all">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-purple-300">{title}</CardTitle>
        <Icon className="h-4 w-4 text-purple-400" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white">{value}</div>
        {change && (
          <p className={`text-xs ${getChangeColor()}`}>
            {change}
          </p>
        )}
        {description && (
          <p className="text-xs text-purple-300">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};
