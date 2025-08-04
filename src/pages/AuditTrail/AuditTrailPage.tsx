import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/DataTable/DataTable";
import { Search, Download, FileSpreadsheet } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AuditRecord {
  id: string;
  staffName: string;
  staffId: string;
  action: string;
  module: string;
  description: string;
  timestamp: string;
  ipAddress: string;
}

const AuditTrailPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [moduleFilter, setModuleFilter] = useState("");

  // Mock data - replace with actual data fetching
  const mockAuditData: AuditRecord[] = [
    {
      id: "1",
      staffName: "John Doe",
      staffId: "EMP001",
      action: "CREATE",
      module: "AOC",
      description: "Created new AOC record for ABC Airlines",
      timestamp: "2024-01-15 14:30:25",
      ipAddress: "192.168.1.100"
    },
    {
      id: "2",
      staffName: "Jane Smith",
      staffId: "EMP002",
      action: "UPDATE",
      module: "ATO",
      description: "Updated ATO record - changed expiry date",
      timestamp: "2024-01-15 16:45:12",
      ipAddress: "192.168.1.101"
    },
    {
      id: "3",
      staffName: "Mike Johnson",
      staffId: "EMP003",
      action: "DELETE",
      module: "Foreign Airline DACL",
      description: "Deleted expired DACL record",
      timestamp: "2024-01-16 09:15:33",
      ipAddress: "192.168.1.102"
    }
  ];

  const filteredData = mockAuditData.filter(item => {
    const matchesSearch = 
      item.staffName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.staffId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesAction = !actionFilter || item.action === actionFilter;
    const matchesModule = !moduleFilter || item.module === moduleFilter;
    
    return matchesSearch && matchesAction && matchesModule;
  });

  const getActionBadge = (action: string) => {
    const actionConfig = {
      CREATE: "bg-green-100 text-green-800",
      UPDATE: "bg-blue-100 text-blue-800",
      DELETE: "bg-red-100 text-red-800",
      VIEW: "bg-gray-100 text-gray-800"
    };
    
    return (
      <Badge className={actionConfig[action as keyof typeof actionConfig] || "bg-gray-100 text-gray-800"}>
        {action}
      </Badge>
    );
  };

  const handleExportExcel = () => {
    // Export to Excel functionality
    console.log("Exporting to Excel...");
  };

  const handleExportPDF = () => {
    // Export to PDF functionality
    console.log("Exporting to PDF...");
  };

  const columns = [
    {
      accessorKey: "staffName",
      header: "Staff Name",
    },
    {
      accessorKey: "staffId",
      header: "Staff ID",
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }: any) => getActionBadge(row.original.action),
    },
    {
      accessorKey: "module",
      header: "Module",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "timestamp",
      header: "Timestamp",
    },
    {
      accessorKey: "ipAddress",
      header: "IP Address",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Audit Trail</h2>
        <div className="flex space-x-2">
          <Button onClick={handleExportExcel} variant="outline">
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
          <Button onClick={handleExportPDF} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Activity Log</CardTitle>
          <div className="flex space-x-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by staff name, ID, or description..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Actions</SelectItem>
                <SelectItem value="CREATE">Create</SelectItem>
                <SelectItem value="UPDATE">Update</SelectItem>
                <SelectItem value="DELETE">Delete</SelectItem>
                <SelectItem value="VIEW">View</SelectItem>
              </SelectContent>
            </Select>

            <Select value={moduleFilter} onValueChange={setModuleFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by Module" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Modules</SelectItem>
                <SelectItem value="AOC">AOC</SelectItem>
                <SelectItem value="ATO">ATO</SelectItem>
                <SelectItem value="Foreign Airline DACL">Foreign Airline DACL</SelectItem>
                <SelectItem value="A/C Status">A/C Status</SelectItem>
                <SelectItem value="AMO">AMO</SelectItem>
                <SelectItem value="FOCC/MCC">FOCC/MCC</SelectItem>
                <SelectItem value="Economic License">Economic License</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={filteredData} />
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditTrailPage;