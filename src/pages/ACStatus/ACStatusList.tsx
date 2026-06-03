import React, { useState, useEffect } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CircleEllipsis, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { onRecordChanged } from "@/lib/recordEvents";
import { toast } from "@/components/ui/use-toast";

export interface ACStatusListProps {
  searchQuery: string;
  onEdit: (id: string) => void;
}

const ACStatusList: React.FC<ACStatusListProps> = ({ searchQuery, onEdit }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const { data: records, error } = await supabase.from("aircraft_status").select("*").order("created_at", { ascending: false });
    if (error) { console.error(error); } else { setData(records || []); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); const off = onRecordChanged("aircraft_status", fetchData); return off; }, []);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("aircraft_status").delete().eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
    else { toast({ title: "Deleted", description: "Aircraft status record deleted." }); fetchData(); }
  };

  const filteredData = data.filter(item =>
    (item.aoc_holder || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.registration_mark || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.aircraft_type || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCofAStatus = (dateString: string | null) => {
    if (!dateString) return { status: "Unknown", color: "text-muted-foreground" };
    const today = new Date();
    const cofaDate = new Date(dateString);
    const daysDiff = Math.floor((cofaDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff < 0) return { status: "Expired", color: "text-destructive" };
    if (daysDiff < 30) return { status: "Expiring Soon", color: "text-yellow-500" };
    return { status: "Active", color: "text-green-500" };
  };

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  return (
    <div>
      {filteredData.length === 0 ? (
        <div className="text-center py-10"><p className="text-muted-foreground">No aircraft status records found</p></div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>AOC Holder</TableHead>
                <TableHead>Registration Mark</TableHead>
                <TableHead>Aircraft Type</TableHead>
                <TableHead>Serial Number</TableHead>
                <TableHead>C of A Status</TableHead>
                <TableHead>Registered Owner</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => {
                const cofaStatus = getCofAStatus(item.cofa_expiry);
                return (
                  <TableRow key={item.id}>
                    <TableCell>{item.aoc_holder}</TableCell>
                    <TableCell>{item.registration_mark}</TableCell>
                    <TableCell>{item.aircraft_type}</TableCell>
                    <TableCell>{item.serial_number}</TableCell>
                    <TableCell className={cofaStatus.color}>{cofaStatus.status} {item.cofa_expiry ? `(${item.cofa_expiry})` : ""}</TableCell>
                    <TableCell>{item.registered_owner}</TableCell>
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
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ACStatusList;
