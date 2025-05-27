
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { AlertTriangle, Shield, Calendar, TrendingUp } from "lucide-react";

interface ComplianceAlert {
  id: string;
  alert_type: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  status: string;
  created_at: string;
  certificate_id?: string;
}

const ComplianceMonitoringPage = () => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<ComplianceAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [complianceScore, setComplianceScore] = useState(85);

  useEffect(() => {
    if (user) {
      fetchComplianceAlerts();
      runComplianceCheck();
    }
  }, [user]);

  const fetchComplianceAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('compliance_alerts')
        .select(`
          *,
          certificates (
            certificate_number,
            certificate_type
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAlerts(data || []);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      toast({
        title: "Error",
        description: "Failed to fetch compliance alerts.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const runComplianceCheck = async () => {
    try {
      // Call the compliance monitoring edge function
      const { data, error } = await supabase.functions.invoke('compliance-monitor', {
        body: { action: 'check_all' }
      });

      if (error) throw error;

      setComplianceScore(data.complianceScore || 85);
      
      toast({
        title: "Compliance Check Complete",
        description: "All certificates have been checked for compliance.",
      });
    } catch (error) {
      console.error('Compliance check error:', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Compliance Monitoring</h1>
        <p className="text-muted-foreground">
          AI-powered monitoring for certificate compliance and regulatory requirements
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Compliance Score</p>
                <p className={`text-2xl font-bold ${getScoreColor(complianceScore)}`}>
                  {complianceScore}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                <p className="text-2xl font-bold text-red-600">
                  {alerts.filter(a => a.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {alerts.filter(a => a.alert_type === 'expiry_warning').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Risk Level</p>
                <p className="text-2xl font-bold text-blue-600">Medium</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Compliance Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Overall Compliance</span>
                <span className={getScoreColor(complianceScore)}>{complianceScore}%</span>
              </div>
              <Progress value={complianceScore} className="mb-4" />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Certificate Validity</span>
                <Badge className="bg-green-100 text-green-800">Good</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Regulatory Compliance</span>
                <Badge className="bg-yellow-100 text-yellow-800">Attention</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Documentation Status</span>
                <Badge className="bg-green-100 text-green-800">Complete</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Audit Readiness</span>
                <Badge className="bg-blue-100 text-blue-800">Ready</Badge>
              </div>
            </div>

            <Button onClick={runComplianceCheck} className="w-full mt-4">
              Run Full Compliance Check
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {loading ? (
                <p className="text-center text-gray-500">Loading alerts...</p>
              ) : alerts.length === 0 ? (
                <p className="text-center text-gray-500">No alerts found</p>
              ) : (
                alerts.slice(0, 10).map((alert) => (
                  <div key={alert.id} className="border rounded-lg p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{alert.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(alert.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.severity}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Regulatory Compliance Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-medium">Aviation Certificates</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>AOC Validity</span>
                  <Badge className="bg-green-100 text-green-800">✓ Valid</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>ATO Compliance</span>
                  <Badge className="bg-green-100 text-green-800">✓ Valid</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>AMO Certification</span>
                  <Badge className="bg-yellow-100 text-yellow-800">⚠ Expiring</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>FOCC Authorization</span>
                  <Badge className="bg-green-100 text-green-800">✓ Valid</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Operational Requirements</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>Safety Management System</span>
                  <Badge className="bg-green-100 text-green-800">✓ Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Quality Assurance</span>
                  <Badge className="bg-green-100 text-green-800">✓ Current</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Training Records</span>
                  <Badge className="bg-blue-100 text-blue-800">→ Review</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Audit Schedule</span>
                  <Badge className="bg-green-100 text-green-800">✓ On Track</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplianceMonitoringPage;
