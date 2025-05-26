
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, FileText, Filter } from "lucide-react";

export const AuditLogs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAction, setFilterAction] = useState("all");

  const auditLogs = [
    {
      id: "1",
      user: "Dr. Sarah Johnson",
      action: "UPDATE",
      resourceType: "appointment",
      resourceId: "apt_123",
      details: "Updated appointment status to completed",
      clinic: "HealthFirst Medical Center",
      timestamp: "2024-01-20 14:30:25",
      ipAddress: "192.168.1.100"
    },
    {
      id: "2",
      user: "Admin User",
      action: "CREATE",
      resourceType: "user",
      resourceId: "user_456",
      details: "Created new doctor account",
      clinic: "MediCare Plus",
      timestamp: "2024-01-20 09:15:10",
      ipAddress: "10.0.0.50"
    },
    {
      id: "3",
      user: "Mary Patient",
      action: "DELETE",
      resourceType: "prescription",
      resourceId: "presc_789",
      details: "Deleted expired prescription",
      clinic: "Wellness Clinic",
      timestamp: "2024-01-19 16:45:30",
      ipAddress: "172.16.0.25"
    },
    {
      id: "4",
      user: "Super Admin",
      action: "UPDATE",
      resourceType: "clinic",
      resourceId: "clinic_101",
      details: "Suspended clinic due to payment failure",
      clinic: "System",
      timestamp: "2024-01-19 11:20:15",
      ipAddress: "203.0.113.0"
    }
  ];

  const getActionBadge = (action: string) => {
    switch (action) {
      case "CREATE":
        return <Badge className="bg-green-500/20 text-green-400">CREATE</Badge>;
      case "UPDATE":
        return <Badge className="bg-blue-500/20 text-blue-400">UPDATE</Badge>;
      case "DELETE":
        return <Badge className="bg-red-500/20 text-red-400">DELETE</Badge>;
      case "LOGIN":
        return <Badge className="bg-purple-500/20 text-purple-400">LOGIN</Badge>;
      default:
        return <Badge variant="outline">{action}</Badge>;
    }
  };

  const getResourceTypeBadge = (resourceType: string) => {
    switch (resourceType) {
      case "appointment":
        return <Badge variant="outline" className="text-blue-400 border-blue-500/30">Appointment</Badge>;
      case "user":
        return <Badge variant="outline" className="text-green-400 border-green-500/30">User</Badge>;
      case "prescription":
        return <Badge variant="outline" className="text-purple-400 border-purple-500/30">Prescription</Badge>;
      case "clinic":
        return <Badge variant="outline" className="text-yellow-400 border-yellow-500/30">Clinic</Badge>;
      default:
        return <Badge variant="outline">{resourceType}</Badge>;
    }
  };

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.resourceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterAction === "all" || log.action.toLowerCase() === filterAction.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Audit Logs</h2>
        <p className="text-purple-300">Track all system activities and user actions</p>
      </div>

      {/* Filters */}
      <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 h-4 w-4" />
              <Input
                placeholder="Search logs by user, action, or details..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-purple-500/30 text-white placeholder-purple-300"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 h-4 w-4" />
              <Select value={filterAction} onValueChange={setFilterAction}>
                <SelectTrigger className="pl-10 bg-white/5 border-purple-500/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="create">CREATE</SelectItem>
                  <SelectItem value="update">UPDATE</SelectItem>
                  <SelectItem value="delete">DELETE</SelectItem>
                  <SelectItem value="login">LOGIN</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs Table */}
      <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <FileText className="h-5 w-5 mr-2 text-purple-400" />
            System Audit Trail ({filteredLogs.length} entries)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-purple-500/30">
                <TableHead className="text-purple-300">User</TableHead>
                <TableHead className="text-purple-300">Action</TableHead>
                <TableHead className="text-purple-300">Resource</TableHead>
                <TableHead className="text-purple-300">Details</TableHead>
                <TableHead className="text-purple-300">Clinic</TableHead>
                <TableHead className="text-purple-300">Timestamp</TableHead>
                <TableHead className="text-purple-300">IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id} className="border-purple-500/20">
                  <TableCell className="text-white font-medium">{log.user}</TableCell>
                  <TableCell>{getActionBadge(log.action)}</TableCell>
                  <TableCell>
                    <div>
                      {getResourceTypeBadge(log.resourceType)}
                      <div className="text-xs text-purple-400 mt-1">{log.resourceId}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-purple-300 text-sm max-w-xs truncate">
                    {log.details}
                  </TableCell>
                  <TableCell className="text-purple-300">{log.clinic}</TableCell>
                  <TableCell className="text-purple-300 text-sm">{log.timestamp}</TableCell>
                  <TableCell className="text-purple-400 text-sm font-mono">{log.ipAddress}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
