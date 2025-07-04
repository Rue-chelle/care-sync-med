
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings, TestTube, Activity, Database, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const DeveloperTools = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  const tools = [
    {
      title: "Testing Center",
      description: "Comprehensive testing and validation suite",
      icon: TestTube,
      route: "/testing",
      status: "Active"
    },
    {
      title: "Production Status",
      description: "Check system readiness for real users",
      icon: Activity,
      route: "/production-status",
      status: "Ready"
    },
    {
      title: "Database Health",
      description: "Monitor database connectivity and performance",
      icon: Database,
      route: "/testing",
      status: "Monitoring"
    }
  ];

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {isVisible && (
        <Card className="mb-4 w-80 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Developer Tools
            </CardTitle>
            <CardDescription>Testing and monitoring utilities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tools.map((tool) => (
                <div
                  key={tool.route}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(tool.route)}
                >
                  <div className="flex items-center gap-3">
                    <tool.icon className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="font-medium text-sm">{tool.title}</p>
                      <p className="text-xs text-gray-600">{tool.description}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {tool.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      <Button
        onClick={() => setIsVisible(!isVisible)}
        size="sm"
        className="rounded-full shadow-lg"
        variant={isVisible ? "secondary" : "default"}
      >
        <Settings className="h-4 w-4" />
      </Button>
    </div>
  );
};
