import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Edit, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { onRecordChanged } from "@/lib/recordEvents";

interface AOCListProps {
  searchQuery: string;
  onEdit: (id: string) => void;
}

const getStatusColor = (expiryDate: string | null) => {
  if (!expiryDate) return "green";
  const today = new Date();
  const validity = new Date(expiryDate);
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(today.getDate() + 30);
  if (validity < today) return "red";
  if (validity < thirtyDaysFromNow) return "yellow";
  return "green";
};

const AOCList = ({ searchQuery, onEdit }: AOCListProps) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
      setLoading(true);
      const { data: records } = await supabase.from("aoc_certificates").select("*").order("created_at", { ascending: false });
      setData(records || []);
      setLoading(false);
    };
  useEffect(() => { fetch(); const off = onRecordChanged("aoc_certificates", fetch); return off; }, []);

  const filteredData = data.filter((item) =>
    Object.values(item).some((value) =>
      value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Operator Name</TableHead>
            <TableHead>Certificate Number</TableHead>
            <TableHead>Issue Date</TableHead>
            <TableHead>Expiry Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.length > 0 ? (
            filteredData.map((aoc) => (
              <TableRow key={aoc.id}>
                <TableCell>{aoc.operator_name}</TableCell>
                <TableCell>{aoc.certificate_number}</TableCell>
                <TableCell>{aoc.issue_date ? new Date(aoc.issue_date).toLocaleDateString() : "-"}</TableCell>
                <TableCell>{aoc.expiry_date ? new Date(aoc.expiry_date).toLocaleDateString() : "-"}</TableCell>
                <TableCell>
                  <Badge className={`${getStatusColor(aoc.expiry_date) === "red" ? "bg-red-500" : getStatusColor(aoc.expiry_date) === "yellow" ? "bg-yellow-500" : "bg-green-500"} text-white`}>
                    {getStatusColor(aoc.expiry_date) === "red" ? "Expired" : getStatusColor(aoc.expiry_date) === "yellow" ? "Expiring Soon" : "Valid"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon"><FileText className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => onEdit(aoc.id)}><Edit className="h-4 w-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow><TableCell colSpan={6} className="text-center py-4">No AOC records found</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AOCList;
