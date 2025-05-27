
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Activity, User, FileText } from "lucide-react";

const AuditTrailPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("all");

  const mockAuditLogs = [
    {
      id: '1',
      action: 'Create',
      resource: 'Certificate',
      user: 'John Doe',
      timestamp: '2024-12-27 10:30:00',
      details: 'Created AOC certificate AOC-001-2024',
      ip: '192.168.1.100'
    },
    {
      id: '2',
      action: 'Update',
      resource: 'User',
      user: 'Admin User',
      timestamp: '2024-12-27 09:15:00',
      details: 'Updated user role for jane.smith@ncaa.gov.ng',
      ip: '192.168.1.101'
    },
    {
      id: '3',
      action: 'Delete',
      resource: 'Document',
      user: 'System',
      timestamp: '2024-12-27 08:45:00',
      details: 'Deleted expired document DOC-001-2023',
      ip: '127.0.0.1'
    }
  ];

  const getActionColor = (action: string) => {
    switch (action) {
      case 'Create': return 'bg-green-100 text-green-800';
      case 'Update': return 'bg-blue-100 text-blue-800';
      case 'Delete': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getResourceIcon = (resource: string) => {
    switch (resource) {
      case 'Certificate': return <FileText className="w-4 h-4" />;
      case 'User': return <User className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const filteredLogs = mockAuditLogs.filter(log => {
    const matchesSearch = log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = actionFilter === "all" || log.action.toLowerCase() === actionFilter;
    return matchesSearch && matchesAction;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Audit Trail</h1>
        <p className="text-muted-foreground">
          Track all system activities and user actions for compliance monitoring
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity Filters</CardTitle>
          <div className="flex gap-4">
            <div className="flex items-center space-x-2 flex-1">
              <Search className="w-4 h-4" />
              <Input
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="create">Create</SelectItem>
                <SelectItem value="update">Update</SelectItem>
                <SelectItem value="delete">Delete</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLogs.map((log) => (
              <div key={log.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    {getResourceIcon(log.resource)}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge className={getActionColor(log.action)}>
                          {log.action}
                        </Badge>
                        <span className="font-medium">{log.resource}</span>
                      </div>
                      <p className="text-sm text-gray-600">{log.details}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>User: {log.user}</span>
                        <span>IP: {log.ip}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{log.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
          
          {filteredLogs.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No audit logs found matching your criteria
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditTrailPage;
