import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CircleEllipsis, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { onRecordChanged } from "@/lib/recordEvents";
import { toast } from "@/components/ui/use-toast";

export interface LocalAMOListProps {
  searchQuery: string;
  onEdit: (id: string) => void;
}

const LocalAMOList: React.FC<LocalAMOListProps> = ({ searchQuery, onEdit }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const { data: records, error } = await supabase.from("amo_licenses").select("*").order("created_at", { ascending: false });
    if (error) console.error(error); else setData(records || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); const off = onRecordChanged("amo_licenses", fetchData); return off; }, []);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("amo_licenses").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Deleted", description: "Local AMO record deleted." }); fetchData(); }
  };

  const filteredData = data.filter(item =>
    (item.holder_criteria || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.approval_number || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.maintenance_location || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  return (
    <div>
      {filteredData.length === 0 ? (
        <div className="text-center py-10"><p className="text-muted-foreground">No local AMO records found</p></div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Holder Criteria</TableHead>
                <TableHead>AMO Approval No.</TableHead>
                <TableHead>Maintenance Location</TableHead>
                <TableHead>Expire Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.holder_criteria}</TableCell>
                  <TableCell>{item.approval_number}</TableCell>
                  <TableCell>{item.maintenance_location}</TableCell>
                  <TableCell>{item.expiry_date}</TableCell>
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

export default LocalAMOList;
