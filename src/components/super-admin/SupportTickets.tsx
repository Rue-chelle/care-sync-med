
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Clock, AlertTriangle, Search, Eye, Edit, Check, User, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const SupportTickets = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [response, setResponse] = useState("");
  const { toast } = useToast();

  const tickets = [
    {
      id: "1",
      title: "Unable to access patient records",
      clinic: "HealthFirst Medical Center",
      priority: "high",
      status: "open",
      createdBy: "Dr. Sarah Johnson",
      createdAt: "2024-01-20 14:30",
      description: "Getting 500 error when trying to access patient records section. This is affecting multiple doctors in our clinic.",
      category: "technical",
      assignedTo: "Tech Support Team",
      responses: [
        { user: "Support Agent", message: "We're investigating this issue. It seems to be related to recent server updates.", timestamp: "2024-01-20 15:00" }
      ]
    },
    {
      id: "2", 
      title: "Payment gateway integration issue",
      clinic: "MediCare Plus",
      priority: "urgent",
      status: "in_progress",
      createdBy: "Admin User",
      createdAt: "2024-01-20 09:15",
      description: "Payments are failing for all subscription renewals. Our clinic is unable to process any payments through the system.",
      category: "billing",
      assignedTo: "Billing Team",
      responses: [
        { user: "Billing Specialist", message: "We've identified the issue with the payment gateway configuration. Working on a fix.", timestamp: "2024-01-20 10:30" },
        { user: "Tech Lead", message: "Payment gateway API credentials have been updated. Please test and confirm.", timestamp: "2024-01-20 12:15" }
      ]
    },
    {
      id: "3",
      title: "Appointment booking not working",
      clinic: "Wellness Clinic",
      priority: "medium",
      status: "resolved",
      createdBy: "Reception Staff",
      createdAt: "2024-01-19 16:45",
      description: "Patients unable to book appointments through the portal. The calendar widget is not responding to clicks.",
      category: "feature",
      assignedTo: "Frontend Team",
      responses: [
        { user: "Developer", message: "Issue was caused by a JavaScript conflict. We've deployed a fix.", timestamp: "2024-01-19 18:20" },
        { user: "Reception Staff", message: "Confirmed fixed. Patients can now book appointments successfully.", timestamp: "2024-01-19 19:00" }
      ]
    },
    {
      id: "4",
      title: "Feature request: Multi-language support",
      clinic: "Global Health Center",
      priority: "low",
      status: "open",
      createdBy: "Clinic Administrator",
      createdAt: "2024-01-18 11:20",
      description: "Our clinic serves patients who speak different languages. We need support for Spanish and French translations.",
      category: "feature_request",
      assignedTo: "Product Team",
      responses: []
    }
  ];

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <Badge className="bg-red-500/20 text-red-400"><AlertTriangle className="h-3 w-3 mr-1" />Urgent</Badge>;
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
        return <Badge className="bg-purple-500/20 text-purple-400"><Clock className="h-3 w-3 mr-1" />In Progress</Badge>;
      case "resolved":
        return <Badge className="bg-green-500/20 text-green-400"><Check className="h-3 w-3 mr-1" />Resolved</Badge>;
      case "closed":
        return <Badge className="bg-gray-500/20 text-gray-400">Closed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "technical":
        return <Badge variant="outline" className="text-red-400 border-red-500/30">Technical</Badge>;
      case "billing":
        return <Badge variant="outline" className="text-green-400 border-green-500/30">Billing</Badge>;
      case "feature":
        return <Badge variant="outline" className="text-blue-400 border-blue-500/30">Feature</Badge>;
      case "feature_request":
        return <Badge variant="outline" className="text-purple-400 border-purple-500/30">Feature Request</Badge>;
      default:
        return <Badge variant="outline">General</Badge>;
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.clinic.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.createdBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter;
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const handleResolveTicket = (ticket: any) => {
    toast({
      title: "Ticket Resolved",
      description: `Ticket "${ticket.title}" has been marked as resolved`,
    });
  };

  const handleAssignTicket = (ticket: any) => {
    toast({
      title: "Ticket Assigned",
      description: `Ticket "${ticket.title}" has been assigned to support team`,
    });
  };

  const handleSendResponse = (ticket: any) => {
    if (!response.trim()) return;
    
    toast({
      title: "Response Sent",
      description: `Response sent to ${ticket.clinic}`,
    });
    setResponse("");
  };

  const openTickets = tickets.filter(t => t.status === 'open').length;
  const inProgressTickets = tickets.filter(t => t.status === 'in_progress').length;
  const urgentTickets = tickets.filter(t => t.priority === 'urgent').length;
  const avgResponseTime = "2.4h";

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
            <div className="text-2xl font-bold text-white">{openTickets}</div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-300">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{inProgressTickets}</div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-300">Urgent</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{urgentTickets}</div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-300">Avg Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{avgResponseTime}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 h-4 w-4" />
              <Input
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-purple-500/30 text-white placeholder-purple-300"
              />
            </div>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="bg-white/5 border-purple-500/30 text-white">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-white/5 border-purple-500/30 text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tickets Table */}
      <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white">All Support Tickets ({filteredTickets.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-purple-500/30">
                <TableHead className="text-purple-300">Ticket</TableHead>
                <TableHead className="text-purple-300">Clinic</TableHead>
                <TableHead className="text-purple-300">Priority</TableHead>
                <TableHead className="text-purple-300">Status</TableHead>
                <TableHead className="text-purple-300">Category</TableHead>
                <TableHead className="text-purple-300">Created</TableHead>
                <TableHead className="text-purple-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.map((ticket) => (
                <TableRow key={ticket.id} className="border-purple-500/20">
                  <TableCell>
                    <div>
                      <div className="font-medium text-white">{ticket.title}</div>
                      <div className="text-sm text-purple-300 truncate max-w-xs">
                        {ticket.description}
                      </div>
                      <div className="text-xs text-purple-400 flex items-center mt-1">
                        <User className="h-3 w-3 mr-1" />
                        {ticket.createdBy}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-purple-300">
                      <Building className="h-4 w-4 mr-2" />
                      {ticket.clinic}
                    </div>
                  </TableCell>
                  <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                  <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                  <TableCell>{getCategoryBadge(ticket.category)}</TableCell>
                  <TableCell className="text-purple-300 text-sm">{ticket.createdAt}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" className="border-purple-500/30 text-purple-300" onClick={() => setSelectedTicket(ticket)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="flex items-center justify-between">
                              <span>Ticket #{selectedTicket?.id} - {selectedTicket?.title}</span>
                              <div className="flex gap-2">
                                {selectedTicket?.priority && getPriorityBadge(selectedTicket.priority)}
                                {selectedTicket?.status && getStatusBadge(selectedTicket.status)}
                              </div>
                            </DialogTitle>
                          </DialogHeader>
                          {selectedTicket && (
                            <div className="space-y-6">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium">Clinic</label>
                                  <p className="text-gray-600">{selectedTicket.clinic}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Created By</label>
                                  <p className="text-gray-600">{selectedTicket.createdBy}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Created At</label>
                                  <p className="text-gray-600">{selectedTicket.createdAt}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Assigned To</label>
                                  <p className="text-gray-600">{selectedTicket.assignedTo}</p>
                                </div>
                              </div>
                              
                              <div>
                                <label className="text-sm font-medium">Description</label>
                                <p className="text-gray-600 mt-1 p-3 bg-gray-50 rounded">{selectedTicket.description}</p>
                              </div>

                              <div>
                                <label className="text-sm font-medium">Responses ({selectedTicket.responses.length})</label>
                                <div className="mt-2 space-y-3 max-h-60 overflow-y-auto">
                                  {selectedTicket.responses.map((resp: any, index: number) => (
                                    <div key={index} className="p-3 bg-gray-50 rounded border-l-4 border-blue-500">
                                      <div className="flex justify-between items-start mb-2">
                                        <span className="font-medium text-sm">{resp.user}</span>
                                        <span className="text-xs text-gray-500">{resp.timestamp}</span>
                                      </div>
                                      <p className="text-gray-600 text-sm">{resp.message}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <label className="text-sm font-medium">Add Response</label>
                                <Textarea
                                  placeholder="Type your response here..."
                                  value={response}
                                  onChange={(e) => setResponse(e.target.value)}
                                  className="mt-2"
                                />
                                <div className="flex gap-2 mt-3">
                                  <Button onClick={() => handleSendResponse(selectedTicket)} disabled={!response.trim()}>
                                    Send Response
                                  </Button>
                                  <Button variant="outline" onClick={() => handleAssignTicket(selectedTicket)}>
                                    Assign to Team
                                  </Button>
                                  {selectedTicket.status !== 'resolved' && (
                                    <Button variant="outline" onClick={() => handleResolveTicket(selectedTicket)}>
                                      Mark Resolved
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-green-500/30 text-green-300"
                        onClick={() => handleResolveTicket(ticket)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
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
