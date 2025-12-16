import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, AlertTriangle, CheckCircle, Clock, Users, FileCheck } from "lucide-react";
import { format, addDays, isBefore } from "date-fns";

const DAASDashboard = () => {
  const { data: aerodromes = [] } = useQuery({
    queryKey: ["aerodrome-certifications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("aerodrome_certifications")
        .select("*")
        .order("expiry_date", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const { data: inspections = [] } = useQuery({
    queryKey: ["safety-inspections"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("safety_inspections")
        .select("*, aerodrome_certifications(aerodrome_name)")
        .order("scheduled_date", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const { data: personnel = [] } = useQuery({
    queryKey: ["aerodrome-personnel"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("aerodrome_personnel")
        .select("*");
      if (error) throw error;
      return data;
    },
  });

  const today = new Date();
  const thirtyDaysFromNow = addDays(today, 30);

  const activeAerodromes = aerodromes.filter((a) => a.status === "active").length;
  const expiringCertifications = aerodromes.filter(
    (a) => isBefore(new Date(a.expiry_date), thirtyDaysFromNow) && isBefore(today, new Date(a.expiry_date))
  );
  const expiredCertifications = aerodromes.filter(
    (a) => isBefore(new Date(a.expiry_date), today)
  );

  const upcomingInspections = inspections.filter(
    (i) => i.status === "scheduled" && isBefore(new Date(i.scheduled_date), thirtyDaysFromNow)
  );
  const completedInspections = inspections.filter((i) => i.status === "completed").length;
  const pendingCompliance = inspections.filter((i) => i.compliance_status === "non-compliant").length;

  const activePersonnel = personnel.filter((p) => p.status === "active").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">DAAS Dashboard</h1>
        <p className="text-muted-foreground">Overview of aerodrome certifications, inspections, and personnel</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Aerodromes</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{aerodromes.length}</div>
            <p className="text-xs text-muted-foreground">{activeAerodromes} active certifications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{expiringCertifications.length}</div>
            <p className="text-xs text-muted-foreground">Within 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Inspections</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{upcomingInspections.length}</div>
            <p className="text-xs text-muted-foreground">{completedInspections} completed this period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Personnel</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activePersonnel}</div>
            <p className="text-xs text-muted-foreground">Across all aerodromes</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      {(expiredCertifications.length > 0 || pendingCompliance > 0) && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
          <CardHeader>
            <CardTitle className="text-red-700 dark:text-red-400 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Attention Required
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {expiredCertifications.length > 0 && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {expiredCertifications.length} certification(s) have expired
              </p>
            )}
            {pendingCompliance > 0 && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {pendingCompliance} inspection(s) with non-compliant status
              </p>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Expiring Certifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="h-5 w-5" />
              Expiring Certifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            {expiringCertifications.length === 0 ? (
              <p className="text-sm text-muted-foreground">No certifications expiring in the next 30 days</p>
            ) : (
              <div className="space-y-3">
                {expiringCertifications.slice(0, 5).map((cert) => (
                  <div key={cert.id} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">{cert.aerodrome_name}</p>
                      <p className="text-xs text-muted-foreground">{cert.certificate_number}</p>
                    </div>
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                      {format(new Date(cert.expiry_date), "MMM dd, yyyy")}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Inspections */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Upcoming Inspections
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingInspections.length === 0 ? (
              <p className="text-sm text-muted-foreground">No inspections scheduled in the next 30 days</p>
            ) : (
              <div className="space-y-3">
                {upcomingInspections.slice(0, 5).map((inspection: any) => (
                  <div key={inspection.id} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">{inspection.aerodrome_certifications?.aerodrome_name || "N/A"}</p>
                      <p className="text-xs text-muted-foreground">{inspection.inspection_type}</p>
                    </div>
                    <Badge variant="outline" className="bg-blue-100 text-blue-800">
                      {format(new Date(inspection.scheduled_date), "MMM dd, yyyy")}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DAASDashboard;
