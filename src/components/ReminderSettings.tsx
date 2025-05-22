
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { MessageSquare, Mail, Phone, Save, Settings } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export const ReminderSettings = () => {
  const [settings, setSettings] = useState({
    sms: {
      enabled: true,
      provider: "twilio",
      defaultTime: "24",
      template: "Hi {patientName}, this is a reminder for your appointment on {appointmentDate} at {appointmentTime} with Dr. {doctorName}. Please confirm by replying YES."
    },
    email: {
      enabled: true,
      defaultTime: "48",
      template: "Dear {patientName},\n\nThis is a friendly reminder about your upcoming appointment:\n\nDate: {appointmentDate}\nTime: {appointmentTime}\nDoctor: Dr. {doctorName}\n\nPlease confirm your attendance or reschedule if needed.\n\nBest regards,\nCareSync Team"
    },
    whatsapp: {
      enabled: false,
      defaultTime: "12",
      template: "Hello {patientName}! 👋\n\nAppointment reminder:\n📅 {appointmentDate}\n🕐 {appointmentTime}\n👨‍⚕️ Dr. {doctorName}\n\nSee you soon!"
    }
  });

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your reminder settings have been updated successfully.",
    });
  };

  const updateTemplate = (channel: keyof typeof settings, template: string) => {
    setSettings(prev => ({
      ...prev,
      [channel]: {
        ...prev[channel],
        template
      }
    }));
  };

  const toggleChannel = (channel: keyof typeof settings, enabled: boolean) => {
    setSettings(prev => ({
      ...prev,
      [channel]: {
        ...prev[channel],
        enabled
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Channel Settings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* SMS Settings */}
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Phone className="h-5 w-5 text-blue-600" />
              <span>SMS Reminders</span>
              <Switch 
                checked={settings.sms.enabled}
                onCheckedChange={(enabled) => toggleChannel('sms', enabled)}
              />
            </CardTitle>
            <CardDescription>Text message notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="sms-time">Default reminder time</Label>
              <Select value={settings.sms.defaultTime}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 hour before</SelectItem>
                  <SelectItem value="2">2 hours before</SelectItem>
                  <SelectItem value="12">12 hours before</SelectItem>
                  <SelectItem value="24">24 hours before</SelectItem>
                  <SelectItem value="48">48 hours before</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="sms-provider">SMS Provider</Label>
              <Select value={settings.sms.provider}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="twilio">Twilio</SelectItem>
                  <SelectItem value="plivo">Plivo</SelectItem>
                  <SelectItem value="messagebird">MessageBird</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
              160 character limit
            </Badge>
          </CardContent>
        </Card>

        {/* Email Settings */}
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-purple-600" />
              <span>Email Reminders</span>
              <Switch 
                checked={settings.email.enabled}
                onCheckedChange={(enabled) => toggleChannel('email', enabled)}
              />
            </CardTitle>
            <CardDescription>Email notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email-time">Default reminder time</Label>
              <Select value={settings.email.defaultTime}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 hour before</SelectItem>
                  <SelectItem value="2">2 hours before</SelectItem>
                  <SelectItem value="12">12 hours before</SelectItem>
                  <SelectItem value="24">24 hours before</SelectItem>
                  <SelectItem value="48">48 hours before</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="email-sender">Sender Name</Label>
              <Input placeholder="CareSync Team" />
            </div>
            <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">
              Rich formatting supported
            </Badge>
          </CardContent>
        </Card>

        {/* WhatsApp Settings */}
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-green-600" />
              <span>WhatsApp Reminders</span>
              <Switch 
                checked={settings.whatsapp.enabled}
                onCheckedChange={(enabled) => toggleChannel('whatsapp', enabled)}
              />
            </CardTitle>
            <CardDescription>WhatsApp Business API</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="whatsapp-time">Default reminder time</Label>
              <Select value={settings.whatsapp.defaultTime}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 hour before</SelectItem>
                  <SelectItem value="2">2 hours before</SelectItem>
                  <SelectItem value="12">12 hours before</SelectItem>
                  <SelectItem value="24">24 hours before</SelectItem>
                  <SelectItem value="48">48 hours before</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="whatsapp-number">Business Number</Label>
              <Input placeholder="+1 (555) 000-0000" />
            </div>
            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
              Emoji support
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Message Templates */}
      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-teal-600" />
            <span>Message Templates</span>
          </CardTitle>
          <CardDescription>
            Customize reminder messages. Use {'{patientName}'}, {'{appointmentDate}'}, {'{appointmentTime}'}, {'{doctorName}'} as placeholders.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* SMS Template */}
          <div className="space-y-2">
            <Label htmlFor="sms-template" className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-blue-600" />
              <span>SMS Template</span>
            </Label>
            <Textarea
              id="sms-template"
              value={settings.sms.template}
              onChange={(e) => updateTemplate('sms', e.target.value)}
              rows={3}
              className="bg-white/80"
              disabled={!settings.sms.enabled}
            />
            <p className="text-xs text-slate-500">
              {settings.sms.template.length}/160 characters
            </p>
          </div>

          {/* Email Template */}
          <div className="space-y-2">
            <Label htmlFor="email-template" className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-purple-600" />
              <span>Email Template</span>
            </Label>
            <Textarea
              id="email-template"
              value={settings.email.template}
              onChange={(e) => updateTemplate('email', e.target.value)}
              rows={6}
              className="bg-white/80"
              disabled={!settings.email.enabled}
            />
          </div>

          {/* WhatsApp Template */}
          <div className="space-y-2">
            <Label htmlFor="whatsapp-template" className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4 text-green-600" />
              <span>WhatsApp Template</span>
            </Label>
            <Textarea
              id="whatsapp-template"
              value={settings.whatsapp.template}
              onChange={(e) => updateTemplate('whatsapp', e.target.value)}
              rows={4}
              className="bg-white/80"
              disabled={!settings.whatsapp.enabled}
            />
          </div>

          <Button 
            onClick={handleSave} 
            className="w-full healthcare-gradient text-white hover:opacity-90 transition-opacity"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
