import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DataTable } from "@/components/DataTable/DataTable";
import { Edit, Trash2, Building } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DirectorateTableProps {
  searchQuery: string;
  onEdit: (id: string) => void;
  refreshTrigger: number;
}

interface Directorate {
  id: string;
  name: string;
  code: string;
  description: string | null;
  created_at: string;
}

const DirectorateTable = ({ searchQuery, onEdit, refreshTrigger }: DirectorateTableProps) => {
  const [directorates, setDirectorates] = useState<Directorate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDirectorates();
  }, [refreshTrigger]);

  const fetchDirectorates = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("directorates")
        .select("*")
        .order("name");

      if (error) throw error;
      setDirectorates(data || []);
    } catch (error) {
      console.error("Error fetching directorates:", error);
      toast({
        title: "Error",
        description: "Failed to fetch directorates",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("directorates")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Directorate deleted successfully",
      });
      
      fetchDirectorates();
    } catch (error: any) {
      console.error("Error deleting directorate:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete directorate",
        variant: "destructive",
      });
    }
  };

  const filteredDirectorates = directorates.filter(directorate =>
    directorate.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      accessorKey: "name",
      header: "Directorate Name",
    },
    {
      accessorKey: "created_at",
      header: "Created",
      cell: ({ row }: any) => {
        return new Date(row.getValue("created_at")).toLocaleDateString();
      },
    },
    {
      accessorKey: "updated_at",
      header: "Last Updated",
      cell: ({ row }: any) => {
        return new Date(row.getValue("updated_at")).toLocaleDateString();
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => {
        const directorate = row.original;
        return (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(directorate.id)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the
                    directorate "{directorate.directorate_name}".
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDelete(directorate.id)}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );
      },
    },
  ];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Directorates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Directorates ({filteredDirectorates.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={filteredDirectorates} />
      </CardContent>
    </Card>
  );
};

export default DirectorateTable;