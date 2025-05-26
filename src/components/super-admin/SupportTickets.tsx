
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MessageSquare, Clock, AlertTriangle } from "lucide-react";

export const SupportTickets = () => {
  const tickets = [
    {
      id: "1",
      title: "Unable to access patient records",
      clinic: "HealthFirst Medical Center",
      priority: "high",
      status: "open",
      createdBy: "Dr. Sarah Johnson",
      createdAt: "2024-01-20 14:30",
      description: "Getting 500 error when trying to access patient records section..."
    },
    {
      id: "2", 
      title: "Payment gateway integration issue",
      clinic: "MediCare Plus",
      priority: "urgent",
      status: "in_progress",
      createdBy: "Admin User",
      createdAt: "2024-01-20 09:15",
      description: "Payments are failing for all subscription renewals..."
    },
    {
      id: "3",
      title: "Appointment booking not working",
      clinic: "Wellness Clinic",
      priority: "medium",
      status: "resolved",
      createdBy: "Reception Staff",
      createdAt: "2024-01-19 16:45",
      description: "Patients unable to book appointments through the portal..."
    }
  ];

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <Badge className="bg-red-500/20 text-red-400">Urgent</Badge>;
      case "high":
        return <Badge className="bg-orange-500/20 text-orange-400">High</Badge>;
      case "medium":
        return <Badge className="bg-yellow-500/20 text-yellow-400">Medium</Badge>;
      case "low":
        return <Badge className="bg-green-500/20 text-green-400">Low</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge className="bg-blue-500/20 text-blue-400">Open</Badge>;
      case "in_progress":
        return <Badge className="bg-purple-500/20 text-purple-400">In Progress</Badge>;
      case "resolved":
        return <Badge className="bg-green-500/20 text-green-400">Resolved</Badge>;
      case "closed":
        return <Badge className="bg-gray-500/20 text-gray-400">Closed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Support Tickets</h2>
        <p className="text-purple-300">Manage support requests from clinics</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-300">Open Tickets</CardTitle>
            <MessageSquare className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">18</div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-300">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">7</div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-300">Urgent</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">3</div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-300">Avg Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">2.4h</div>
          </CardContent>
        </Card>
      </div>

      {/* Tickets Table */}
      <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white">All Support Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-purple-500/30">
                <TableHead className="text-purple-300">Ticket</TableHead>
                <TableHead className="text-purple-300">Clinic</TableHead>
                <TableHead className="text-purple-300">Priority</TableHead>
                <TableHead className="text-purple-300">Status</TableHead>
                <TableHead className="text-purple-300">Created</TableHead>
                <TableHead className="text-purple-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow key={ticket.id} className="border-purple-500/20">
                  <TableCell>
                    <div>
                      <div className="font-medium text-white">{ticket.title}</div>
                      <div className="text-sm text-purple-300 truncate max-w-xs">
                        {ticket.description}
                      </div>
                      <div className="text-xs text-purple-400">by {ticket.createdBy}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-purple-300">{ticket.clinic}</TableCell>
                  <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                  <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                  <TableCell className="text-purple-300 text-sm">{ticket.createdAt}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="border-purple-500/30 text-purple-300">
                        View
                      </Button>
                      <Button size="sm" variant="outline" className="border-green-500/30 text-green-300">
                        Resolve
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
