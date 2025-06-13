
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/DataTable/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "@/components/ui/use-toast";
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
  fullName: string;
  email: string;
  phoneNumber: string;
  directorate: string;
  role: string;
  status: string;
  createdAt: string;
  rejectionReason?: string;
}

const PendingRegistrations = () => {
  const [registrations, setRegistrations] = useState<PendingRegistration[]>([]);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedRegistration, setSelectedRegistration] = useState<string | null>(null);

  useEffect(() => {
    // Load pending registrations from localStorage
    const stored = localStorage.getItem("pending_registrations");
    if (stored) {
      setRegistrations(JSON.parse(stored));
    }
  }, []);

  const updateRegistrations = (updated: PendingRegistration[]) => {
    setRegistrations(updated);
    localStorage.setItem("pending_registrations", JSON.stringify(updated));
  };

  const handleApprove = (id: string) => {
    const updated = registrations.map(reg => 
      reg.id === id 
        ? { ...reg, status: "approved", approvedAt: new Date().toISOString() }
        : reg
    );
    updateRegistrations(updated);
    
    toast({
      title: "Registration Approved",
      description: "User has been approved and can now login.",
    });
  };

  const handleReject = (id: string) => {
    if (!rejectionReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for rejection.",
        variant: "destructive",
      });
      return;
    }

    const updated = registrations.map(reg => 
      reg.id === id 
        ? { ...reg, status: "rejected", rejectionReason, rejectedAt: new Date().toISOString() }
        : reg
    );
    updateRegistrations(updated);
    
    setRejectionReason("");
    setSelectedRegistration(null);
    
    toast({
      title: "Registration Rejected",
      description: "User has been notified of the rejection.",
    });
  };

  const columns: ColumnDef<PendingRegistration>[] = [
    {
      accessorKey: "fullName",
      header: "Full Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phoneNumber",
      header: "Phone Number",
    },
    {
      accessorKey: "directorate",
      header: "Directorate",
      cell: ({ row }) => (
        <Badge variant="outline" className="bg-gray-100">
          {row.original.directorate}
        </Badge>
      ),
    },
    {
      accessorKey: "role",
      header: "Requested Role",
      cell: ({ row }) => (
        <Badge variant="outline" className="bg-blue-100 text-blue-800">
          {row.original.role}
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
      accessorKey: "createdAt",
      header: "Applied On",
      cell: ({ row }) => {
        return new Date(row.original.createdAt).toLocaleDateString();
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
      
      <DataTable columns={columns} data={registrations} searchKey="fullName" />
    </div>
  );
};

export default PendingRegistrations;
