
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/DataTable/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface PendingRegistration {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  requested_directorate: string;
  requested_role: string;
  status: string;
  created_at: string;
  rejection_reason?: string;
}

const PendingRegistrations = () => {
  const [registrations, setRegistrations] = useState<PendingRegistration[]>([]);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedRegistration, setSelectedRegistration] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRegistrations();

    // Set up real-time subscription
    const channel = supabase
      .channel('pending-registrations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pending_registrations'
        },
        () => {
          fetchRegistrations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchRegistrations = async () => {
    try {
      const { data, error } = await supabase
        .from('pending_registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching registrations:', error);
        return;
      }

      setRegistrations(data || []);
    } catch (error) {
      console.error('Error fetching registrations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const { error } = await supabase.rpc('approve_pending_registration' as any, {
        registration_id: id
      });

      if (error) {
        console.error('Error approving registration:', error);
        toast({
          title: "Error",
          description: "Failed to approve registration.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Registration Approved",
        description: "User account created and can now login with default password 'password'.",
      });
    } catch (error) {
      console.error('Error approving registration:', error);
    }
  };

  const handleReject = async (id: string) => {
    if (!rejectionReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for rejection.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('pending_registrations')
        .update({ 
          status: 'rejected',
          rejection_reason: rejectionReason
        })
        .eq('id', id);

      if (error) {
        console.error('Error rejecting registration:', error);
        toast({
          title: "Error",
          description: "Failed to reject registration.",
          variant: "destructive",
        });
        return;
      }

      setRejectionReason("");
      setSelectedRegistration(null);
      
      toast({
        title: "Registration Rejected",
        description: "User has been notified of the rejection.",
      });
    } catch (error) {
      console.error('Error rejecting registration:', error);
    }
  };

  const columns: ColumnDef<PendingRegistration>[] = [
    {
      accessorKey: "full_name",
      header: "Full Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phone_number",
      header: "Phone Number",
    },
    {
      accessorKey: "requested_directorate",
      header: "Directorate",
      cell: ({ row }) => (
        <Badge variant="outline" className="bg-gray-100">
          {row.original.requested_directorate}
        </Badge>
      ),
    },
    {
      accessorKey: "requested_role",
      header: "Requested Role",
      cell: ({ row }) => (
        <Badge variant="outline" className="bg-blue-100 text-blue-800">
          {row.original.requested_role}
        </Badge>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge
            className={
              status === "pending"
                ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                : status === "approved"
                ? "bg-green-100 text-green-800 border-green-300"
                : "bg-red-100 text-red-800 border-red-300"
            }
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "Applied On",
      cell: ({ row }) => {
        return new Date(row.original.created_at).toLocaleDateString();
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const registration = row.original;
        
        if (registration.status !== "pending") {
          return (
            <span className="text-sm text-gray-500">
              {registration.status === "approved" ? "Approved" : "Rejected"}
            </span>
          );
        }

        return (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => handleApprove(registration.id)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Approve
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 border-red-600 hover:bg-red-50"
                  onClick={() => setSelectedRegistration(registration.id)}
                >
                  Reject
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reject Registration</DialogTitle>
                  <DialogDescription>
                    Please provide a reason for rejecting this registration.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="reason">Rejection Reason</Label>
                    <Textarea
                      id="reason"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Enter reason for rejection..."
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setRejectionReason("");
                      setSelectedRegistration(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => selectedRegistration && handleReject(selectedRegistration)}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Reject Registration
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        );
      },
    },
  ];

  const pendingCount = registrations.filter(reg => reg.status === "pending").length;

  if (isLoading) {
    return <div className="flex items-center justify-center p-4">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Pending User Registrations</h3>
          <p className="text-sm text-gray-600">
            {pendingCount} registration{pendingCount !== 1 ? 's' : ''} awaiting approval
          </p>
        </div>
        {pendingCount > 0 && (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
            {pendingCount} Pending
          </Badge>
        )}
      </div>
      
      <DataTable columns={columns} data={registrations} searchKey="full_name" />
    </div>
  );
};

export default PendingRegistrations;
