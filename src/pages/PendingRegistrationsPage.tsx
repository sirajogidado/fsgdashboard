
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Check, X, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";

interface PendingRegistration {
  id: string;
  email: string;
  full_name: string;
  phone_number?: string;
  requested_directorate: string;
  requested_role: string;
  status: string;
  created_at: string;
}

const PendingRegistrationsPage = () => {
  const [registrations, setRegistrations] = useState<PendingRegistration[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedRegistration, setSelectedRegistration] = useState<PendingRegistration | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const { data, error } = await supabase
        .from('pending_registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRegistrations(data || []);
    } catch (error) {
      console.error('Error fetching registrations:', error);
      toast({
        title: "Error",
        description: "Failed to fetch pending registrations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const approveRegistration = async (registration: PendingRegistration) => {
    if (!user) return;
    
    setProcessingId(registration.id);
    
    try {
      // First create the user account in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: registration.email,
        email_confirm: true,
        user_metadata: {
          full_name: registration.full_name,
          phone: registration.phone_number,
          directorate: registration.requested_directorate,
          role: registration.requested_role
        }
      });

      if (authError) throw authError;

      // Update the pending registration status
      const { error: updateError } = await supabase
        .from('pending_registrations')
        .update({
          status: 'approved',
          approved_by: user.id,
          approved_at: new Date().toISOString()
        })
        .eq('id', registration.id);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: `Registration for ${registration.full_name} has been approved`,
      });

      // Refresh the list
      fetchRegistrations();
    } catch (error) {
      console.error('Error approving registration:', error);
      toast({
        title: "Error",
        description: "Failed to approve registration",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const rejectRegistration = async () => {
    if (!selectedRegistration || !user || !rejectionReason.trim()) return;
    
    setProcessingId(selectedRegistration.id);
    
    try {
      const { error } = await supabase
        .from('pending_registrations')
        .update({
          status: 'rejected',
          approved_by: user.id,
          approved_at: new Date().toISOString(),
          rejection_reason: rejectionReason
        })
        .eq('id', selectedRegistration.id);

      if (error) throw error;

      toast({
        title: "Registration Rejected",
        description: `Registration for ${selectedRegistration.full_name} has been rejected`,
      });

      setSelectedRegistration(null);
      setRejectionReason("");
      fetchRegistrations();
    } catch (error) {
      console.error('Error rejecting registration:', error);
      toast({
        title: "Error",
        description: "Failed to reject registration",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const filteredRegistrations = registrations.filter(reg =>
    reg.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    reg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    reg.requested_directorate.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'approved':
        return <Badge variant="default">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pending Registrations</h1>
          <p className="text-muted-foreground">
            Review and approve user registration requests
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search registrations..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredRegistrations.map((registration) => (
          <Card key={registration.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium text-lg">{registration.full_name}</h3>
                    {getStatusBadge(registration.status)}
                  </div>
                  <p className="text-sm text-gray-600">{registration.email}</p>
                  {registration.phone_number && (
                    <p className="text-sm text-gray-600">{registration.phone_number}</p>
                  )}
                  <div className="flex gap-4 text-sm">
                    <span><strong>Directorate:</strong> {registration.requested_directorate}</span>
                    <span><strong>Role:</strong> {registration.requested_role}</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Submitted: {new Date(registration.created_at).toLocaleDateString()}
                  </p>
                </div>
                
                {registration.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => approveRegistration(registration)}
                      disabled={processingId === registration.id}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setSelectedRegistration(registration)}
                          disabled={processingId === registration.id}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Reject Registration</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <p>Are you sure you want to reject the registration for {selectedRegistration?.full_name}?</p>
                          <div className="space-y-2">
                            <Label htmlFor="rejection-reason">Reason for rejection *</Label>
                            <Textarea
                              id="rejection-reason"
                              placeholder="Please provide a reason for rejection..."
                              value={rejectionReason}
                              onChange={(e) => setRejectionReason(e.target.value)}
                            />
                          </div>
                          <div className="flex gap-2 justify-end">
                            <Button variant="outline" onClick={() => {
                              setSelectedRegistration(null);
                              setRejectionReason("");
                            }}>
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={rejectRegistration}
                              disabled={!rejectionReason.trim() || processingId === selectedRegistration?.id}
                            >
                              Reject Registration
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredRegistrations.length === 0 && (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">No pending registrations found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PendingRegistrationsPage;
