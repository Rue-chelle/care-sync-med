
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Flag } from "lucide-react";

export const FeatureFlags = () => {
  const [features, setFeatures] = useState([
    {
      id: "1",
      name: "advanced_analytics",
      description: "Enable advanced analytics dashboard for clinics",
      isEnabled: true,
      clinicSpecific: false,
      affectedClinics: 0
    },
    {
      id: "2",
      name: "two_factor_auth",
      description: "Enable two-factor authentication for all users",
      isEnabled: false,
      clinicSpecific: false,
      affectedClinics: 0
    },
    {
      id: "3",
      name: "whatsapp_integration",
      description: "Enable WhatsApp messaging capabilities",
      isEnabled: false,
      clinicSpecific: true,
      affectedClinics: 12
    },
    {
      id: "4",
      name: "prescription_ai",
      description: "AI-powered prescription suggestions",
      isEnabled: true,
      clinicSpecific: true,
      affectedClinics: 8
    }
  ]);

  const toggleFeature = (id: string) => {
    setFeatures(features.map(feature => 
      feature.id === id 
        ? { ...feature, isEnabled: !feature.isEnabled }
        : feature
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Feature Flags</h2>
          <p className="text-purple-300">Control feature rollouts and A/B testing</p>
        </div>
        <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Feature Flag
        </Button>
      </div>

      <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Flag className="h-5 w-5 mr-2 text-purple-400" />
            Feature Flags ({features.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-purple-500/30">
                <TableHead className="text-purple-300">Feature</TableHead>
                <TableHead className="text-purple-300">Type</TableHead>
                <TableHead className="text-purple-300">Status</TableHead>
                <TableHead className="text-purple-300">Affected Clinics</TableHead>
                <TableHead className="text-purple-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {features.map((feature) => (
                <TableRow key={feature.id} className="border-purple-500/20">
                  <TableCell>
                    <div>
                      <div className="font-medium text-white">{feature.name}</div>
                      <div className="text-sm text-purple-300">{feature.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={feature.clinicSpecific ? "text-yellow-400 border-yellow-500/30" : "text-blue-400 border-blue-500/30"}>
                      {feature.clinicSpecific ? "Clinic-specific" : "Global"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={feature.isEnabled}
                        onCheckedChange={() => toggleFeature(feature.id)}
                      />
                      <Badge className={feature.isEnabled ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
                        {feature.isEnabled ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-purple-300">
                    {feature.clinicSpecific ? `${feature.affectedClinics} clinics` : "All clinics"}
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" className="border-purple-500/30 text-purple-300">
                      Configure
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
