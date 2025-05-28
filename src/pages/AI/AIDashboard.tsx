
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, MessageSquare, FileText, BarChart3, Zap, Users } from "lucide-react";
import { Link } from "react-router-dom";

const AIDashboard = () => {
  const aiFeatures = [
    {
      title: "AI Chat Assistant",
      description: "Get instant answers and assistance with aviation compliance and regulations.",
      icon: MessageSquare,
      href: "/ai/chat",
      color: "bg-blue-500",
    },
    {
      title: "Document Analysis",
      description: "AI-powered analysis of aviation documents and certificates.",
      icon: FileText,
      href: "/ai/document-analysis",
      color: "bg-green-500",
    },
    {
      title: "Predictive Analytics",
      description: "Forecast trends and patterns in aviation compliance data.",
      icon: BarChart3,
      href: "/ai/analytics",
      color: "bg-purple-500",
    },
    {
      title: "Smart Reports",
      description: "Generate intelligent reports with AI insights and recommendations.",
      icon: Zap,
      href: "/ai/reports",
      color: "bg-orange-500",
    },
  ];

  const stats = [
    {
      title: "Documents Analyzed",
      value: "1,247",
      change: "+12%",
      icon: FileText,
    },
    {
      title: "AI Conversations",
      value: "856",
      change: "+8%",
      icon: MessageSquare,
    },
    {
      title: "Reports Generated",
      value: "342",
      change: "+23%",
      icon: BarChart3,
    },
    {
      title: "Active Users",
      value: "127",
      change: "+5%",
      icon: Users,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Brain className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Dashboard</h1>
          <p className="text-muted-foreground">
            Intelligent tools for aviation compliance and management
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stat.change}</span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Features Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {aiFeatures.map((feature, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${feature.color}`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {feature.description}
              </p>
              <Button asChild className="w-full">
                <Link to={feature.href}>
                  Get Started
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent AI Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <MessageSquare className="h-5 w-5 text-blue-500" />
              <div className="flex-1">
                <p className="font-medium">AI Chat Session</p>
                <p className="text-sm text-muted-foreground">User asked about AOC renewal requirements - 2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <FileText className="h-5 w-5 text-green-500" />
              <div className="flex-1">
                <p className="font-medium">Document Analysis Complete</p>
                <p className="text-sm text-muted-foreground">Certificate expiry analysis for Air Peace - 4 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <BarChart3 className="h-5 w-5 text-purple-500" />
              <div className="flex-1">
                <p className="font-medium">Predictive Report Generated</p>
                <p className="text-sm text-muted-foreground">Q1 compliance forecast - 6 hours ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIDashboard;
