
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
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
  Activity
} from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock data for charts
  const statusData = [
    { name: "AOC", active: 12, expired: 3, pending: 2 },
    { name: "ATO", active: 8, expired: 2, pending: 4 },
    { name: "AMO", active: 15, expired: 5, pending: 1 },
    { name: "DACL", active: 10, expired: 2, pending: 3 },
    { name: "A/C", active: 24, expired: 7, pending: 5 },
  ];

  const certTypeData = [
    { name: "Commercial", value: 15, color: "#0088FE" },
    { name: "Private", value: 8, color: "#00C49F" },
    { name: "Cargo", value: 6, color: "#FFBB28" },
    { name: "Training", value: 4, color: "#FF8042" },
  ];

  const expiryTimelineData = [
    { name: "This Month", count: 5 },
    { name: "Next Month", count: 8 },
    { name: "In 3 Months", count: 12 },
    { name: "In 6 Months", count: 18 },
    { name: "Beyond 6 Months", count: 45 },
  ];

  // Mock recent audit trail data for Super Users
  const recentAuditTrail = [
    { id: "1", userName: "DAWS User", action: "Added", entity: "AOC", entityName: "Air Peace", timestamp: "2024-01-15 14:30:00" },
    { id: "2", userName: "Admin User", action: "Edited", entity: "Aircraft Type", entityName: "Boeing 737", timestamp: "2024-01-15 13:45:00" },
    { id: "3", userName: "DAAS User", action: "Added", entity: "ATO", entityName: "Flight Academy", timestamp: "2024-01-15 12:20:00" },
  ];

  // Navigation cards data
  const navigationCards = [
    {
      title: "AOC Management",
      description: "Air Operator Certificates",
      icon: Shield,
      path: "/aoc",
      count: 17,
      canAccess: user?.directorate === "DAWS" || user?.role === "Super User" || user?.directorate === "ICT"
    },
    {
      title: "ATO Management", 
      description: "Air Training Organizations",
      icon: GraduationCap,
      path: "/ato",
      count: 14,
      canAccess: user?.directorate === "DAAS" || user?.role === "Super User" || user?.directorate === "ICT"
    },
    {
      title: "Aircraft Status",
      description: "Aircraft Registrations & Status",
      icon: Plane,
      path: "/ac-status",
      count: 36,
      canAccess: user?.directorate === "DAWS" || user?.role === "Super User" || user?.directorate === "ICT"
    },
    {
      title: "Foreign DACL",
      description: "Designated Aviation Consultant License",
      icon: Briefcase,
      path: "/foreign-airline-dacl",
      count: 15,
      canAccess: user?.directorate === "DOLTS" || user?.role === "Super User" || user?.directorate === "ICT"
    },
    {
      title: "Foreign AMO",
      description: "Foreign Aircraft Maintenance Org",
      icon: Wrench,
      path: "/amo/foreign",
      count: 8,
      canAccess: user?.directorate === "DAWS" || user?.role === "Super User" || user?.directorate === "ICT"
    },
    {
      title: "Local AMO",
      description: "Local Aircraft Maintenance Org",
      icon: Wrench,
      path: "/amo/local",
      count: 12,
      canAccess: user?.directorate === "DAWS" || user?.role === "Super User" || user?.directorate === "ICT"
    },
    {
      title: "FOCC/MCC",
      description: "Flight Operations Control Center",
      icon: FileText,
      path: "/focc-mcc",
      count: 6,
      canAccess: user?.directorate === "DAWS" || user?.role === "Super User" || user?.directorate === "ICT"
    },
    {
      title: "Type Acceptance",
      description: "Type Acceptance Certificates",
      icon: FileText,
      path: "/acceptance-certificate",
      count: 24,
      canAccess: user?.directorate === "DAWS" || user?.role === "Super User" || user?.directorate === "ICT"
    }
  ];

  const accessibleCards = navigationCards.filter(card => card.canAccess);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
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
            <div className="text-2xl font-bold">132</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+5</span> since last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Operations</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+3</span> since last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Renewals</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-amber-500">Requires attention</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring This Month</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-500">Urgent</span>
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
              {recentAuditTrail.map((audit) => (
                <div key={audit.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      audit.action === "Added" ? "bg-green-500" :
                      audit.action === "Edited" ? "bg-blue-500" : "bg-red-500"
                    }`} />
                    <div>
                      <p className="text-sm font-medium">
                        <span className="text-blue-600">{audit.userName}</span> {audit.action.toLowerCase()} {audit.entity}: {audit.entityName}
                      </p>
                      <p className="text-xs text-gray-500">{audit.timestamp}</p>
                    </div>
                  </div>
                </div>
              ))}
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
                data={statusData}
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
            <CardTitle>Certificate Types</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={certTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {certTypeData.map((entry, index) => (
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
                data={expiryTimelineData}
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
