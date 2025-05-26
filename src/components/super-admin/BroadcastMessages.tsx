
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Send, MessageSquare } from "lucide-react";

export const BroadcastMessages = () => {
  const [showNewMessage, setShowNewMessage] = useState(false);

  const messages = [
    {
      id: "1",
      title: "System Maintenance Scheduled",
      content: "We will be performing system maintenance on Sunday...",
      targetType: "all_clinics",
      channel: "email",
      sentAt: "2024-01-20 10:00",
      status: "sent"
    },
    {
      id: "2",
      title: "New Feature: AI Prescriptions",
      content: "We're excited to announce our new AI-powered prescription feature...",
      targetType: "specific_clinics",
      channel: "in_app",
      sentAt: "2024-01-19 14:30",
      status: "sent"
    },
    {
      id: "3",
      title: "Payment Reminder",
      content: "Your subscription is due for renewal...",
      targetType: "role_based",
      channel: "whatsapp",
      sentAt: "2024-01-18 09:15",
      status: "draft"
    }
  ];

  const getChannelBadge = (channel: string) => {
    switch (channel) {
      case "email":
        return <Badge className="bg-blue-500/20 text-blue-400">Email</Badge>;
      case "in_app":
        return <Badge className="bg-purple-500/20 text-purple-400">In-App</Badge>;
      case "whatsapp":
        return <Badge className="bg-green-500/20 text-green-400">WhatsApp</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getTargetBadge = (targetType: string) => {
    switch (targetType) {
      case "all_clinics":
        return <Badge className="bg-yellow-500/20 text-yellow-400">All Clinics</Badge>;
      case "specific_clinics":
        return <Badge className="bg-orange-500/20 text-orange-400">Specific Clinics</Badge>;
      case "role_based":
        return <Badge className="bg-cyan-500/20 text-cyan-400">Role-based</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

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

      {/* New Message Form */}
      {showNewMessage && (
        <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white">Create New Broadcast Message</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-purple-300 mb-2 block">Title</label>
                <Input 
                  placeholder="Message title..."
                  className="bg-white/5 border-purple-500/30 text-white placeholder-purple-300"
                />
              </div>
              <div>
                <label className="text-sm text-purple-300 mb-2 block">Channel</label>
                <Select>
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
            </div>
            
            <div>
              <label className="text-sm text-purple-300 mb-2 block">Target Audience</label>
              <Select>
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

            <div>
              <label className="text-sm text-purple-300 mb-2 block">Message Content</label>
              <Textarea 
                placeholder="Type your message here..."
                className="bg-white/5 border-purple-500/30 text-white placeholder-purple-300 min-h-[120px]"
              />
            </div>

            <div className="flex space-x-2">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <Send className="h-4 w-4 mr-2" />
                Send Now
              </Button>
              <Button variant="outline" className="border-purple-500/30 text-purple-300">
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
            Broadcast History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-purple-500/30">
                <TableHead className="text-purple-300">Message</TableHead>
                <TableHead className="text-purple-300">Target</TableHead>
                <TableHead className="text-purple-300">Channel</TableHead>
                <TableHead className="text-purple-300">Sent At</TableHead>
                <TableHead className="text-purple-300">Status</TableHead>
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
                  <TableCell className="text-purple-300 text-sm">{message.sentAt}</TableCell>
                  <TableCell>
                    <Badge className={message.status === 'sent' ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}>
                      {message.status === 'sent' ? 'Sent' : 'Draft'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" className="border-purple-500/30 text-purple-300">
                      View Details
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
