import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CircleEllipsis, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface FOCCMCCListProps {
  searchQuery: string;
  onEdit: (id: string) => void;
}

const FOCCMCCList: React.FC<FOCCMCCListProps> = ({ searchQuery, onEdit }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const { data: records } = await supabase.from("focc_mcc_records").select("*").order("created_at", { ascending: false });
    setData(records || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("focc_mcc_records").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Deleted", description: "FOCC/MCC record deleted." }); fetchData(); }
  };

  const filteredData = data.filter(item =>
    (item.record_number || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.operator_name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  return (
    <div>
      {filteredData.length === 0 ? (
        <div className="text-center py-10"><p className="text-muted-foreground">No FOCC/MCC records found</p></div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Operator Name</TableHead>
                <TableHead>Record Number</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.operator_name}</TableCell>
                  <TableCell>{item.record_number}</TableCell>
                  <TableCell>{item.issue_date}</TableCell>
                  <TableCell>{item.expiry_date}</TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><CircleEllipsis className="h-5 w-5" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(item.id)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(item.id)}>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default FOCCMCCList;
