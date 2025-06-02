
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Send, MessageSquare, Eye, Edit, Mail, Bell, Users, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const BroadcastMessages = () => {
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    targetType: "",
    channel: "",
    priority: "normal"
  });
  const { toast } = useToast();

  const messages = [
    {
      id: "1",
      title: "System Maintenance Scheduled",
      content: "We will be performing system maintenance on Sunday, January 28th from 2:00 AM to 6:00 AM UTC. During this time, the system may be temporarily unavailable. We apologize for any inconvenience.",
      targetType: "all_clinics",
      channel: "email",
      sentAt: "2024-01-20 10:00",
      status: "sent",
      priority: "high",
      sentBy: "System Administrator",
      recipients: 247,
      readCount: 189
    },
    {
      id: "2",
      title: "New Feature: AI Prescriptions",
      content: "We're excited to announce our new AI-powered prescription feature! This tool will help doctors create more accurate prescriptions and reduce medication errors. Training sessions will be available next week.",
      targetType: "specific_clinics",
      channel: "in_app",
      sentAt: "2024-01-19 14:30",
      status: "sent",
      priority: "normal",
      sentBy: "Product Team",
      recipients: 125,
      readCount: 98
    },
    {
      id: "3",
      title: "Payment Reminder",
      content: "Your subscription is due for renewal in 3 days. Please ensure your payment information is up to date to avoid any service interruption.",
      targetType: "role_based",
      channel: "whatsapp",
      sentAt: "2024-01-18 09:15",
      status: "draft",
      priority: "normal",
      sentBy: "Billing Team",
      recipients: 45,
      readCount: 0
    }
  ];

  const getChannelBadge = (channel: string) => {
    switch (channel) {
      case "email":
        return <Badge className="bg-blue-500/20 text-blue-400"><Mail className="h-3 w-3 mr-1" />Email</Badge>;
      case "in_app":
        return <Badge className="bg-purple-500/20 text-purple-400"><Bell className="h-3 w-3 mr-1" />In-App</Badge>;
      case "whatsapp":
        return <Badge className="bg-green-500/20 text-green-400"><MessageSquare className="h-3 w-3 mr-1" />WhatsApp</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getTargetBadge = (targetType: string) => {
    switch (targetType) {
      case "all_clinics":
        return <Badge className="bg-yellow-500/20 text-yellow-400"><Building className="h-3 w-3 mr-1" />All Clinics</Badge>;
      case "specific_clinics":
        return <Badge className="bg-orange-500/20 text-orange-400"><Building className="h-3 w-3 mr-1" />Specific Clinics</Badge>;
      case "role_based":
        return <Badge className="bg-cyan-500/20 text-cyan-400"><Users className="h-3 w-3 mr-1" />Role-based</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-500/20 text-red-400">High</Badge>;
      case "normal":
        return <Badge className="bg-green-500/20 text-green-400">Normal</Badge>;
      case "low":
        return <Badge className="bg-gray-500/20 text-gray-400">Low</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "sent":
        return <Badge className="bg-green-500/20 text-green-400">Sent</Badge>;
      case "draft":
        return <Badge className="bg-yellow-500/20 text-yellow-400">Draft</Badge>;
      case "scheduled":
        return <Badge className="bg-blue-500/20 text-blue-400">Scheduled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleSendMessage = () => {
    if (!formData.title || !formData.content) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Message Sent",
      description: `Broadcast message "${formData.title}" has been sent successfully`,
    });

    setFormData({
      title: "",
      content: "",
      targetType: "",
      channel: "",
      priority: "normal"
    });
    setShowNewMessage(false);
  };

  const handleSaveDraft = () => {
    toast({
      title: "Draft Saved",
      description: "Your message has been saved as a draft",
    });
  };

  const sentMessages = messages.filter(m => m.status === 'sent').length;
  const draftMessages = messages.filter(m => m.status === 'draft').length;
  const totalRecipients = messages.reduce((sum, m) => sum + m.recipients, 0);
  const totalReads = messages.reduce((sum, m) => sum + m.readCount, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Broadcast Messages</h2>
          <p className="text-purple-300">Send announcements to clinics and users</p>
        </div>
        <Button 
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
          onClick={() => setShowNewMessage(!showNewMessage)}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Broadcast
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm">Sent Messages</p>
                <p className="text-2xl font-bold text-white">{sentMessages}</p>
              </div>
              <Send className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm">Draft Messages</p>
                <p className="text-2xl font-bold text-white">{draftMessages}</p>
              </div>
              <Edit className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm">Total Recipients</p>
                <p className="text-2xl font-bold text-white">{totalRecipients}</p>
              </div>
              <Users className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm">Read Rate</p>
                <p className="text-2xl font-bold text-white">{totalRecipients > 0 ? Math.round((totalReads / totalRecipients) * 100) : 0}%</p>
              </div>
              <Eye className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New Message Form */}
      {showNewMessage && (
        <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white">Create New Broadcast Message</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-purple-300 mb-2 block">Title*</label>
                <Input 
                  placeholder="Message title..."
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="bg-white/5 border-purple-500/30 text-white placeholder-purple-300"
                />
              </div>
              <div>
                <label className="text-sm text-purple-300 mb-2 block">Priority</label>
                <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
                  <SelectTrigger className="bg-white/5 border-purple-500/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-purple-300 mb-2 block">Channel*</label>
                <Select value={formData.channel} onValueChange={(value) => setFormData({...formData, channel: value})}>
                  <SelectTrigger className="bg-white/5 border-purple-500/30 text-white">
                    <SelectValue placeholder="Select channel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="in_app">In-App Notification</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-purple-300 mb-2 block">Target Audience*</label>
                <Select value={formData.targetType} onValueChange={(value) => setFormData({...formData, targetType: value})}>
                  <SelectTrigger className="bg-white/5 border-purple-500/30 text-white">
                    <SelectValue placeholder="Select target audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_clinics">All Clinics</SelectItem>
                    <SelectItem value="specific_clinics">Specific Clinics</SelectItem>
                    <SelectItem value="role_based">Role-based</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm text-purple-300 mb-2 block">Message Content*</label>
              <Textarea 
                placeholder="Type your message here..."
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                className="bg-white/5 border-purple-500/30 text-white placeholder-purple-300 min-h-[120px]"
              />
            </div>

            <div className="flex space-x-2">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white" onClick={handleSendMessage}>
                <Send className="h-4 w-4 mr-2" />
                Send Now
              </Button>
              <Button variant="outline" className="border-purple-500/30 text-purple-300" onClick={handleSaveDraft}>
                Save as Draft
              </Button>
              <Button variant="outline" className="border-purple-500/30 text-purple-300" onClick={() => setShowNewMessage(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Messages History */}
      <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <MessageSquare className="h-5 w-5 mr-2 text-purple-400" />
            Broadcast History ({messages.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-purple-500/30">
                <TableHead className="text-purple-300">Message</TableHead>
                <TableHead className="text-purple-300">Target</TableHead>
                <TableHead className="text-purple-300">Channel</TableHead>
                <TableHead className="text-purple-300">Priority</TableHead>
                <TableHead className="text-purple-300">Status</TableHead>
                <TableHead className="text-purple-300">Sent At</TableHead>
                <TableHead className="text-purple-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.map((message) => (
                <TableRow key={message.id} className="border-purple-500/20">
                  <TableCell>
                    <div>
                      <div className="font-medium text-white">{message.title}</div>
                      <div className="text-sm text-purple-300 truncate max-w-xs">
                        {message.content}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getTargetBadge(message.targetType)}</TableCell>
                  <TableCell>{getChannelBadge(message.channel)}</TableCell>
                  <TableCell>{getPriorityBadge(message.priority)}</TableCell>
                  <TableCell>{getStatusBadge(message.status)}</TableCell>
                  <TableCell className="text-purple-300 text-sm">{message.sentAt}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" className="border-purple-500/30 text-purple-300" onClick={() => setSelectedMessage(message)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Message Details - {selectedMessage?.title}</DialogTitle>
                          </DialogHeader>
                          {selectedMessage && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium">Title</label>
                                  <p className="text-gray-600">{selectedMessage.title}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Sent By</label>
                                  <p className="text-gray-600">{selectedMessage.sentBy}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Channel</label>
                                  <p className="text-gray-600">{selectedMessage.channel}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Target</label>
                                  <p className="text-gray-600">{selectedMessage.targetType}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Recipients</label>
                                  <p className="text-gray-600">{selectedMessage.recipients}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Read Count</label>
                                  <p className="text-gray-600">{selectedMessage.readCount} ({Math.round((selectedMessage.readCount / selectedMessage.recipients) * 100)}%)</p>
                                </div>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Content</label>
                                <p className="text-gray-600 mt-1 p-3 bg-gray-50 rounded">{selectedMessage.content}</p>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button size="sm" variant="outline" className="border-purple-500/30 text-purple-300">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
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
