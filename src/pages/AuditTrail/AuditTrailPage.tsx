
import React, { useState } from "react";
import { useAudit } from "@/context/AuditContext";
import { AuditEntry } from "@/types/audit";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

const AuditTrailPage = () => {
  const { getAuditLog } = useAudit();
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [sectionFilter, setSectionFilter] = useState<string>("all");

  // Get audit logs
  const auditEntries: AuditEntry[] = getAuditLog();
  
  // Sort by timestamp (most recent first)
  const sortedEntries = [...auditEntries].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  // Filter entries based on search query and filters
  const filteredEntries = sortedEntries.filter(entry => {
    const matchesSearch = 
      entry.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.userDirectorate.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesAction = actionFilter === "all" || entry.action === actionFilter;
    const matchesSection = sectionFilter === "all" || entry.section === sectionFilter;
    
    return matchesSearch && matchesAction && matchesSection;
  });

  // Get unique sections for filter
  const uniqueSections = Array.from(new Set(auditEntries.map(entry => entry.section)));
  
  const getActionBadgeColor = (action: string) => {
    switch(action) {
      case "create": return "bg-green-500";
      case "update": return "bg-blue-500";
      case "delete": return "bg-red-500";
      case "view": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Audit Trail</h2>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full sm:w-auto flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search audit trail..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by Action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="create">Create</SelectItem>
              <SelectItem value="update">Update</SelectItem>
              <SelectItem value="delete">Delete</SelectItem>
              <SelectItem value="view">View</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sectionFilter} onValueChange={setSectionFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Section" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sections</SelectItem>
              {uniqueSections.map(section => (
                <SelectItem key={section} value={section}>
                  {section.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Audit Log Entries</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredEntries.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No audit entries found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Section</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="whitespace-nowrap">
                        {format(new Date(entry.timestamp), "MMM d, yyyy HH:mm:ss")}
                      </TableCell>
                      <TableCell>
                        <div>{entry.userName}</div>
                        <div className="text-xs text-gray-500">{entry.userDirectorate} ({entry.userRole})</div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getActionBadgeColor(entry.action)}>
                          {entry.action.charAt(0).toUpperCase() + entry.action.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="capitalize">
                        {entry.section.split('-').join(' ')}
                      </TableCell>
                      <TableCell>{entry.itemName}</TableCell>
                      <TableCell className="max-w-[300px] truncate">{entry.details}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditTrailPage;
