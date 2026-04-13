
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import {
  Shield,
  GraduationCap,
  Plane,
  Briefcase,
  Wrench,
  FileText,
  Users,
  Activity,
  DollarSign,
  Globe
} from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // State for real-time data
  const [dashboardData, setDashboardData] = useState({
    certificatesCount: 0,
    economicLicensesCount: 0,
    expiringCount: 0,
    pendingCount: 0,
    aocCount: 0,
    atoCount: 0,
    amotCount: 0,
    daclCount: 0,
    foccCount: 0,
    acceptanceCount: 0,
    aerodromeCount: 0,
    inspectionCount: 0,
    personnelCount: 0
  });

  const [chartData, setChartData] = useState({
    statusData: [],
    economicLicenseData: [],
    expiryData: []
  });

  const [recentAuditTrail, setRecentAuditTrail] = useState([]);

  // Get current time for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  // Fetch real-time dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch counts from different tables
        const [
          aocResult,
          generalAviationResult,
          foreignAmoResult,
          foreignAirlineDaclResult,
          foccResult,
          aopResult,
          paasResult,
          atlResult,
          pnclResult,
          atolResult,
          fcopResult,
          auditResult
        ] = await Promise.all([
          supabase.from('aoc_certificates').select('*', { count: 'exact' }),
          supabase.from('general_aviation').select('*', { count: 'exact' }),
          supabase.from('foreign_amo').select('*', { count: 'exact' }),
          supabase.from('foreign_airline_dacl').select('*', { count: 'exact' }),
          supabase.from('focc_mcc_records').select('*', { count: 'exact' }),
          supabase.from('aop_licenses').select('*', { count: 'exact' }),
          supabase.from('paas_licenses').select('*', { count: 'exact' }),
          supabase.from('atl_licenses').select('*', { count: 'exact' }),
          supabase.from('pncl_licenses').select('*', { count: 'exact' }),
          supabase.from('atol_licenses').select('*', { count: 'exact' }),
          supabase.from('fcop_licenses').select('*', { count: 'exact' }),
          supabase
            .from('audit_trail')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5)
        ]);

        // Calculate counts
        const economicLicensesTotal = 
          (aopResult.count || 0) + 
          (paasResult.count || 0) + 
          (atlResult.count || 0) + 
          (pnclResult.count || 0) + 
          (atolResult.count || 0) + 
          (fcopResult.count || 0);

        const totalCertificates = 
          (aocResult.count || 0) + 
          (generalAviationResult.count || 0) + 
          economicLicensesTotal;

        setDashboardData({
          certificatesCount: totalCertificates,
          economicLicensesCount: economicLicensesTotal,
          expiringCount: 0, // Will be calculated with date logic
          pendingCount: 0, // Will be calculated with status logic
          aocCount: aocResult.count || 0,
          atoCount: generalAviationResult.count || 0,
          amotCount: foreignAmoResult.count || 0,
          daclCount: foreignAirlineDaclResult.count || 0,
          foccCount: foccResult.count || 0,
          acceptanceCount: 0
        });

        // Set chart data
        setChartData({
          statusData: [
            { name: "AOC", active: aocResult.count || 0, expired: 0, pending: 0 },
            { name: "AOP", active: aopResult.count || 0, expired: 0, pending: 0 },
            { name: "PAAS", active: paasResult.count || 0, expired: 0, pending: 0 },
            { name: "ATL", active: atlResult.count || 0, expired: 0, pending: 0 },
            { name: "ATOL", active: atolResult.count || 0, expired: 0, pending: 0 },
            { name: "FCOP", active: fcopResult.count || 0, expired: 0, pending: 0 },
          ],
          economicLicenseData: [
            { name: "AOP", value: aopResult.count || 0, color: "#0088FE" },
            { name: "PAAS", value: paasResult.count || 0, color: "#00C49F" },
            { name: "ATL", value: atlResult.count || 0, color: "#FFBB28" },
            { name: "PNCL", value: pnclResult.count || 0, color: "#FF8042" },
            { name: "ATOL", value: atolResult.count || 0, color: "#8884d8" },
            { name: "FCOP", value: fcopResult.count || 0, color: "#82ca9d" },
          ],
          expiryData: [
            { name: "This Month", count: 0 },
            { name: "Next Month", count: 0 },
            { name: "In 3 Months", count: 0 },
            { name: "In 6 Months", count: 0 },
            { name: "Beyond 6 Months", count: totalCertificates },
          ]
        });

        setRecentAuditTrail(auditResult.data || []);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();

    // Set up real-time subscriptions
    const channels = [
      supabase.channel('aoc_certificates_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'aoc_certificates' }, () => fetchDashboardData())
        .subscribe(),
      supabase.channel('economic_licenses_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'aop_licenses' }, () => fetchDashboardData())
        .subscribe(),
      supabase.channel('audit_trail_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'audit_trail' }, () => fetchDashboardData())
        .subscribe()
    ];

    return () => {
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, []);

  // Navigation cards data with real counts
  const navigationCards = [
    {
      title: "AOC Management",
      description: "Air Operator Certificates",
      icon: Shield,
      path: "/aoc",
      count: dashboardData.aocCount,
      canAccess: user?.directorate === "DAWS" || user?.role === "Super User" || user?.directorate === "ICT"
    },
    {
      title: "ATO Management", 
      description: "Air Training Organizations",
      icon: GraduationCap,
      path: "/ato",
      count: dashboardData.atoCount,
      canAccess: user?.directorate === "DAAS" || user?.role === "Super User" || user?.directorate === "ICT"
    },
    {
      title: "Aircraft Status",
      description: "Aircraft Registrations & Status",
      icon: Plane,
      path: "/ac-status",
      count: dashboardData.atoCount,
      canAccess: user?.directorate === "DAWS" || user?.role === "Super User" || user?.directorate === "ICT"
    },
    {
      title: "Foreign DACL",
      description: "Designated Aviation Consultant License",
      icon: Briefcase,
      path: "/foreign-airline-dacl",
      count: dashboardData.daclCount,
      canAccess: user?.directorate === "DOLTS" || user?.role === "Super User" || user?.directorate === "ICT"
    },
    {
      title: "Foreign AMO",
      description: "Foreign Aircraft Maintenance Org",
      icon: Wrench,
      path: "/amo/foreign",
      count: dashboardData.amotCount,
      canAccess: user?.directorate === "DAWS" || user?.role === "Super User" || user?.directorate === "ICT"
    },
    {
      title: "Local AMO",
      description: "Local Aircraft Maintenance Org",
      icon: Wrench,
      path: "/amo/local",
      count: 0,
      canAccess: user?.directorate === "DAWS" || user?.role === "Super User" || user?.directorate === "ICT"
    },
    {
      title: "FOCC/MCC",
      description: "Flight Operations Control Center",
      icon: FileText,
      path: "/focc-mcc",
      count: dashboardData.foccCount,
      canAccess: user?.directorate === "DAWS" || user?.role === "Super User" || user?.directorate === "ICT"
    },
    {
      title: "Type Acceptance",
      description: "Type Acceptance Certificates",
      icon: FileText,
      path: "/acceptance-certificate",
      count: dashboardData.acceptanceCount,
      canAccess: user?.directorate === "DAWS" || user?.role === "Super User" || user?.directorate === "ICT"
    },
    {
      title: "Economic Licenses",
      description: "DATR Economic Licensing",
      icon: DollarSign,
      path: "/economic-license",
      count: dashboardData.economicLicensesCount,
      canAccess: user?.directorate === "DATR" || user?.role === "Super User" || user?.directorate === "ICT"
    }
  ];

  const accessibleCards = navigationCards.filter(card => card.canAccess);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {getGreeting()}, {user?.name}!
        </h1>
        <p className="text-muted-foreground">
          Welcome to the NCAA Flight Standards Group Dashboard
        </p>
      </div>

      {/* Quick Access Navigation Cards */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Quick Access</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {accessibleCards.map((card) => (
            <Card 
              key={card.path}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(card.path)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <card.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.count}</div>
                <p className="text-xs text-muted-foreground">{card.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Certificates</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.certificatesCount}</div>
            <p className="text-xs text-muted-foreground">
              All registered certificates
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Economic Licenses</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.economicLicensesCount}</div>
            <p className="text-xs text-muted-foreground">
              DATR Economic Licenses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AOC Certificates</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.aocCount}</div>
            <p className="text-xs text-muted-foreground">
              Air Operator Certificates
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">General Aviation</CardTitle>
            <Plane className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.atoCount}</div>
            <p className="text-xs text-muted-foreground">
              Registered Aircraft
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Audit Trail for Super Users */}
      {user?.role === "Super User" && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Audit Trail</CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate("/global/user-roles")}
            >
              View Full Audit Trail
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAuditTrail.length > 0 ? recentAuditTrail.map((audit) => (
                <div key={audit.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      audit.action === "CREATE" || audit.action === "INSERT" ? "bg-green-500" :
                      audit.action === "UPDATE" || audit.action === "EDIT" ? "bg-blue-500" : "bg-red-500"
                    }`} />
                    <div>
                      <p className="text-sm font-medium">
                        <span className="text-blue-600">{audit.staff_name}</span> {audit.action.toLowerCase()} {audit.module}: {audit.description}
                      </p>
                      <p className="text-xs text-gray-500">{new Date(audit.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Certificate Status Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart
                data={chartData.statusData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="active" stackId="a" fill="#2a9d8f" name="Active" />
                <Bar dataKey="expired" stackId="a" fill="#d62828" name="Expired" />
                <Bar dataKey="pending" stackId="a" fill="#fcbf49" name="Pending" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Economic License Types</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={chartData.economicLicenseData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.economicLicenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Certificate Expiry Timeline</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={chartData.expiryData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#03045e" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
