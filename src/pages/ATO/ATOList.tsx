import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Edit, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { onRecordChanged } from "@/lib/recordEvents";

interface ATOListProps {
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

const ATOList = ({ searchQuery, onEdit }: ATOListProps) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
      setLoading(true);
      const { data: records } = await supabase.from("ato_licenses").select("*").order("created_at", { ascending: false });
      setData(records || []);
      setLoading(false);
    };
  useEffect(() => { fetch(); const off = onRecordChanged("ato_licenses", fetch); return off; }, []);

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
            <TableHead>Organization Name</TableHead>
            <TableHead>Certificate Number</TableHead>
            <TableHead>Training Type</TableHead>
            <TableHead>Issue Date</TableHead>
            <TableHead>Expiry Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.length > 0 ? (
            filteredData.map((ato) => (
              <TableRow key={ato.id}>
                <TableCell>{ato.organization_name}</TableCell>
                <TableCell>{ato.certificate_number}</TableCell>
                <TableCell>{ato.training_type}</TableCell>
                <TableCell>{ato.issue_date ? new Date(ato.issue_date).toLocaleDateString() : "-"}</TableCell>
                <TableCell>{ato.expiry_date ? new Date(ato.expiry_date).toLocaleDateString() : "-"}</TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(ato.expiry_date) === "red" ? "destructive" : getStatusColor(ato.expiry_date) === "yellow" ? "secondary" : "default"}>
                    {getStatusColor(ato.expiry_date) === "red" ? "Expired" : getStatusColor(ato.expiry_date) === "yellow" ? "Expiring Soon" : "Valid"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon"><FileText className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => onEdit(ato.id)}><Edit className="h-4 w-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow><TableCell colSpan={7} className="text-center py-4">No ATO records found</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ATOList;
