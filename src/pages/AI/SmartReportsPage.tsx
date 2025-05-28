
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Download, Eye, Plus } from "lucide-react";

const SmartReportsPage = () => {
  const reports = [
    {
      title: "Monthly Compliance Summary",
      description: "AI-generated overview of compliance status and trends",
      lastGenerated: "2 hours ago",
      status: "Ready",
    },
    {
      title: "Certificate Expiry Forecast",
      description: "Predictive report on upcoming certificate expirations",
      lastGenerated: "1 day ago",
      status: "Ready",
    },
    {
      title: "Risk Assessment Report",
      description: "AI analysis of compliance risks and recommendations",
      lastGenerated: "3 days ago",
      status: "Ready",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Zap className="h-8 w-8 text-orange-600" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Smart Reports</h1>
          <p className="text-muted-foreground">
            AI-generated reports with intelligent insights and recommendations
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Available Reports</h2>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Generate New Report
        </Button>
      </div>

      <div className="grid gap-6">
        {reports.map((report, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{report.title}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Last generated: {report.lastGenerated}</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                  {report.status}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Report Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Compliance Dashboard</h3>
              <p className="text-sm text-gray-600 mb-3">
                Comprehensive overview of all compliance metrics and KPIs
              </p>
              <Button variant="outline" size="sm">Generate</Button>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Audit Preparation</h3>
              <p className="text-sm text-gray-600 mb-3">
                Detailed report for regulatory audit preparation
              </p>
              <Button variant="outline" size="sm">Generate</Button>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Performance Analytics</h3>
              <p className="text-sm text-gray-600 mb-3">
                Analysis of operational performance and trends
              </p>
              <Button variant="outline" size="sm">Generate</Button>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Custom Report</h3>
              <p className="text-sm text-gray-600 mb-3">
                Create a custom report with specific parameters
              </p>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartReportsPage;
