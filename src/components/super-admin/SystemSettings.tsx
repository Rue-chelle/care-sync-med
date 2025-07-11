
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Settings, Mail, Bell, Shield, Database, Globe, Save, ArrowLeft } from "lucide-react";

interface SystemSettingsProps {
  onBack?: () => void;
}

export const SystemSettings = ({ onBack }: SystemSettingsProps) => {
  const [settings, setSettings] = useState({
    siteName: "AloraMed",
    siteEmail: "admin@aloramed.com",
    timezone: "UTC",
    language: "en",
    emailNotifications: true,
    smsNotifications: false,
    maintenanceMode: false,
    registrationEnabled: true,
    maxFileSize: "10",
    sessionTimeout: "30",
    backupFrequency: "daily",
    debugMode: false,
    maxClinics: "1000",
    maxUsersPerClinic: "500",
    defaultSubscription: "basic"
  });

  const { toast } = useToast();

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "System settings have been updated successfully",
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
        <div className="flex items-center space-x-3">
          <Button 
            onClick={onBack} 
            variant="outline" 
            size="sm"
            className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">System Settings</h2>
            <p className="text-sm sm:text-base text-purple-300">Configure platform-wide settings</p>
          </div>
        </div>
        <Button 
          onClick={saveSettings} 
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white w-full sm:w-auto"
          size="sm"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>

      <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
        <CardContent className="p-3 sm:p-6">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 bg-purple-900/30 mb-4 sm:mb-6">
              <TabsTrigger value="general" className="text-xs sm:text-sm text-purple-300 data-[state=active]:bg-purple-600">General</TabsTrigger>
              <TabsTrigger value="notifications" className="text-xs sm:text-sm text-purple-300 data-[state=active]:bg-purple-600">Notifications</TabsTrigger>
              <TabsTrigger value="security" className="text-xs sm:text-sm text-purple-300 data-[state=active]:bg-purple-600">Security</TabsTrigger>
              <TabsTrigger value="system" className="text-xs sm:text-sm text-purple-300 data-[state=active]:bg-purple-600">System</TabsTrigger>
              <TabsTrigger value="limits" className="text-xs sm:text-sm text-purple-300 data-[state=active]:bg-purple-600">Limits</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="siteName" className="text-sm sm:text-base text-purple-300">Platform Name</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => handleSettingChange("siteName", e.target.value)}
                    className="bg-purple-900/30 border-purple-500/30 text-white text-sm sm:text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteEmail" className="text-sm sm:text-base text-purple-300">Admin Email</Label>
                  <Input
                    id="siteEmail"
                    type="email"
                    value={settings.siteEmail}
                    onChange={(e) => handleSettingChange("siteEmail", e.target.value)}
                    className="bg-purple-900/30 border-purple-500/30 text-white text-sm sm:text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone" className="text-sm sm:text-base text-purple-300">Default Timezone</Label>
                  <Select
                    value={settings.timezone}
                    onValueChange={(value) => handleSettingChange("timezone", value)}
                  >
                    <SelectTrigger className="bg-purple-900/30 border-purple-500/30 text-white text-sm sm:text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-purple-900 border-purple-500/30">
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="EST">Eastern Time</SelectItem>
                      <SelectItem value="PST">Pacific Time</SelectItem>
                      <SelectItem value="GMT">Greenwich Mean Time</SelectItem>
                      <SelectItem value="WAT">West Africa Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language" className="text-sm sm:text-base text-purple-300">Default Language</Label>
                  <Select
                    value={settings.language}
                    onValueChange={(value) => handleSettingChange("language", value)}
                  >
                    <SelectTrigger className="bg-purple-900/30 border-purple-500/30 text-white text-sm sm:text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-purple-900 border-purple-500/30">
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
              <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-purple-900/20 rounded-lg space-y-3 sm:space-y-0">
                  <div className="space-y-1">
                    <Label className="text-sm sm:text-base text-white">Email Notifications</Label>
                    <p className="text-xs sm:text-sm text-purple-300">
                      Enable email notifications for system events
                    </p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
                  />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-purple-900/20 rounded-lg space-y-3 sm:space-y-0">
                  <div className="space-y-1">
                    <Label className="text-sm sm:text-base text-white">SMS Notifications</Label>
                    <p className="text-xs sm:text-sm text-purple-300">
                      Enable SMS notifications for critical alerts
                    </p>
                  </div>
                  <Switch
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) => handleSettingChange("smsNotifications", checked)}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="security" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
              <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout" className="text-sm sm:text-base text-purple-300">Session Timeout (minutes)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={settings.sessionTimeout}
                      onChange={(e) => handleSettingChange("sessionTimeout", e.target.value)}
                      className="bg-purple-900/30 border-purple-500/30 text-white text-sm sm:text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxFileSize" className="text-sm sm:text-base text-purple-300">Max File Size (MB)</Label>
                    <Input
                      id="maxFileSize"
                      type="number"
                      value={settings.maxFileSize}
                      onChange={(e) => handleSettingChange("maxFileSize", e.target.value)}
                      className="bg-purple-900/30 border-purple-500/30 text-white text-sm sm:text-base"
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-purple-900/20 rounded-lg space-y-3 sm:space-y-0">
                  <div className="space-y-1">
                    <Label className="text-sm sm:text-base text-white">Registration Enabled</Label>
                    <p className="text-xs sm:text-sm text-purple-300">
                      Allow new clinic registrations
                    </p>
                  </div>
                  <Switch
                    checked={settings.registrationEnabled}
                    onCheckedChange={(checked) => handleSettingChange("registrationEnabled", checked)}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="system" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
              <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-purple-900/20 rounded-lg space-y-3 sm:space-y-0">
                  <div className="space-y-1">
                    <Label className="text-sm sm:text-base text-white">Maintenance Mode</Label>
                    <p className="text-xs sm:text-sm text-purple-300">
                      Put the entire platform in maintenance mode
                    </p>
                  </div>
                  <Switch
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) => handleSettingChange("maintenanceMode", checked)}
                  />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-purple-900/20 rounded-lg space-y-3 sm:space-y-0">
                  <div className="space-y-1">
                    <Label className="text-sm sm:text-base text-white">Debug Mode</Label>
                    <p className="text-xs sm:text-sm text-purple-300">
                      Enable debug logging across the platform
                    </p>
                  </div>
                  <Switch
                    checked={settings.debugMode}
                    onCheckedChange={(checked) => handleSettingChange("debugMode", checked)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="backupFrequency" className="text-sm sm:text-base text-purple-300">Backup Frequency</Label>
                  <Select
                    value={settings.backupFrequency}
                    onValueChange={(value) => handleSettingChange("backupFrequency", value)}
                  >
                    <SelectTrigger className="bg-purple-900/30 border-purple-500/30 text-white text-sm sm:text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-purple-900 border-purple-500/30">
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="limits" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="maxClinics" className="text-sm sm:text-base text-purple-300">Maximum Clinics</Label>
                  <Input
                    id="maxClinics"
                    type="number"
                    value={settings.maxClinics}
                    onChange={(e) => handleSettingChange("maxClinics", e.target.value)}
                    className="bg-purple-900/30 border-purple-500/30 text-white text-sm sm:text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxUsersPerClinic" className="text-sm sm:text-base text-purple-300">Max Users per Clinic</Label>
                  <Input
                    id="maxUsersPerClinic"
                    type="number"
                    value={settings.maxUsersPerClinic}
                    onChange={(e) => handleSettingChange("maxUsersPerClinic", e.target.value)}
                    className="bg-purple-900/30 border-purple-500/30 text-white text-sm sm:text-base"
                  />
                </div>
                <div className="space-y-2 lg:col-span-2">
                  <Label htmlFor="defaultSubscription" className="text-sm sm:text-base text-purple-300">Default Subscription Plan</Label>
                  <Select
                    value={settings.defaultSubscription}
                    onValueChange={(value) => handleSettingChange("defaultSubscription", value)}
                  >
                    <SelectTrigger className="bg-purple-900/30 border-purple-500/30 text-white text-sm sm:text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-purple-900 border-purple-500/30">
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
