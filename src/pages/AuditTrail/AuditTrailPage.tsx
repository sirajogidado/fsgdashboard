import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/DataTable/DataTable";
import { Search, Download, FileSpreadsheet, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

const AuditTrailPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [moduleFilter, setModuleFilter] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const { data: records } = await supabase.from("audit_trail").select("*").order("created_at", { ascending: false });
      setData(records || []);
      setLoading(false);
    };
    fetch();
  }, []);

  const filteredData = data.filter(item => {
    const matchesSearch =
      (item.user_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.details || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction = !actionFilter || item.action === actionFilter;
    const matchesModule = !moduleFilter || item.module === moduleFilter;
    return matchesSearch && matchesAction && matchesModule;
  });

  const getActionBadge = (action: string) => {
    const actionConfig: Record<string, string> = {
      CREATE: "bg-green-100 text-green-800", UPDATE: "bg-blue-100 text-blue-800",
      DELETE: "bg-red-100 text-red-800", VIEW: "bg-gray-100 text-gray-800",
    };
    return <Badge className={actionConfig[action] || "bg-gray-100 text-gray-800"}>{action}</Badge>;
  };

  const columns = [
    { accessorKey: "user_name", header: "Staff Name" },
    { accessorKey: "action", header: "Action", cell: ({ row }: any) => getActionBadge(row.original.action) },
    { accessorKey: "module", header: "Module" },
    { accessorKey: "details", header: "Description" },
    { accessorKey: "created_at", header: "Timestamp", cell: ({ row }: any) => new Date(row.original.created_at).toLocaleString() },
    { accessorKey: "ip_address", header: "IP Address" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Audit Trail</h2>
        <div className="flex space-x-2">
          <Button variant="outline"><FileSpreadsheet className="h-4 w-4 mr-2" />Export Excel</Button>
          <Button variant="outline"><Download className="h-4 w-4 mr-2" />Export PDF</Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>System Activity Log</CardTitle>
          <div className="flex space-x-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-8" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-[150px]"><SelectValue placeholder="Filter by Action" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Actions</SelectItem>
                <SelectItem value="CREATE">Create</SelectItem>
                <SelectItem value="UPDATE">Update</SelectItem>
                <SelectItem value="DELETE">Delete</SelectItem>
              </SelectContent>
            </Select>
            <Select value={moduleFilter} onValueChange={setModuleFilter}>
              <SelectTrigger className="w-[150px]"><SelectValue placeholder="Filter by Module" /></SelectTrigger>
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
          {loading ? <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin" /></div> : <DataTable columns={columns} data={filteredData} />}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditTrailPage;
